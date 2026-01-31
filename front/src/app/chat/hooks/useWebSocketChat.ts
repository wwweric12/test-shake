/* eslint-disable no-console */
// /**
//  * WebSocket 연결 및 메시지 관리를 위한 React Hook
//  *
//  * 주요 기능:
//  * - WebSocket 자동 연결/해제
//  * - 채팅방 구독 관리
//  * - 메시지 송수신
//  * - React Query와 상태 동기화
//  */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { WS_URL } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useEnterChatRoom } from '@/services/chat/hooks';
import { webSocketService } from '@/services/chat/websocket';
import { ChatMessageWithProfile } from '@/types/chat';
import { ConnectionStatus, ReceivedChatMessage } from '@/types/webSocket';

import { useQueryClient } from '@tanstack/react-query';
interface UseWebSocketChatParams {
  chatRoomId: number;
  currentUserId: number; // 현재 로그인한 사용자 ID
  partnerInfo?: {
    partnerId: number;
    partnerName: string;
    partnerProfileImage: string | null;
  };
  enabled?: boolean;
}

interface UseWebSocketChatReturn {
  messages: ChatMessageWithProfile[];
  sendMessage: (content: string) => void;
  connectionStatus: ConnectionStatus;
  isConnected: boolean;
  isLoading: boolean;
  error: Error | null;
}

export function useWebSocketChat({
  chatRoomId,
  currentUserId,
  partnerInfo,
  enabled = true,
}: UseWebSocketChatParams): UseWebSocketChatReturn {
  const queryClient = useQueryClient();
  const [realtimeMessages, setRealtimeMessages] = useState<ChatMessageWithProfile[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    enabled ? 'CONNECTING' : 'DISCONNECTED',
  );
  const [error, setError] = useState<Error | null>(null);

  const isConnectingRef = useRef(false);

  const { data: enterData, isLoading, error: enterError } = useEnterChatRoom(chatRoomId, enabled);

  /**
   * WebSocket 메시지를 UI용 메시지로 변환
   * isMine 처리:
   * - 백엔드에서 isMine 제공 시: 그대로 사용
   * - 백엔드에서 isMine 없을 시: senderId === currentUserId로 판별
   */
  const convertToMessageWithProfile = useCallback(
    (received: ReceivedChatMessage): ChatMessageWithProfile => {
      // 백엔드에서 isMine을 제공하면 사용, 없으면 직접 계산
      const isMine = received.senderId === currentUserId;

      return {
        id: received.messageId,
        chatRoomId: received.chatRoomId,
        senderId: received.senderId,
        content: received.content,
        sentAt: received.sentAt,
        isRead: received.isRead,
        isMine,
        // 내 메시지가 아닌 경우에만 상대방 정보 추가
        senderName: isMine ? undefined : received.senderName,
        senderProfileImageUrl: isMine ? undefined : received.senderProfileImageUrl,
      };
    },
    [currentUserId],
  );

  /**
   * REST API로 받은 초기 메시지 변환
   * 백엔드 response: { id, chatRoomId, senderId, content, sentAt, isRead }
   */
  const initialMessages = useMemo(() => {
    if (!enterData?.data?.message?.content) return [];

    return enterData.data.message.content.map((msg) => {
      // 🔥 백엔드에서 isMine을 제공하지 않으므로 직접 계산
      const isMine = msg.senderId === currentUserId;

      return {
        ...msg,
        isMine,
        // REST API는 프로필 정보가 없으므로 partnerInfo에서 가져옴
        senderName: isMine ? undefined : partnerInfo?.partnerName,
        senderProfileImageUrl: isMine ? undefined : partnerInfo?.partnerProfileImage || undefined,
      } as ChatMessageWithProfile;
    });
  }, [enterData, currentUserId, partnerInfo]);

  /**
   * 전체 메시지 병합 및 시간순 정렬
   */
  const messages = useMemo(() => {
    const initialIds = new Set(initialMessages.map((m) => m.id));
    const newRealtimeMessages = realtimeMessages.filter((m) => !initialIds.has(m.id));

    // 시간순 정렬 (오래된 것부터)
    const combined = [...initialMessages, ...newRealtimeMessages];
    return combined.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
  }, [initialMessages, realtimeMessages]);

  /**
   * WebSocket으로 새 메시지 수신 시 처리
   */
  const handleMessageReceived = useCallback(
    (received: ReceivedChatMessage) => {
      const newMsg = convertToMessageWithProfile(received);

      setRealtimeMessages((prev) => {
        // 중복 방지
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });

      // 채팅방 목록 갱신 (마지막 메시지, 읽지 않은 개수 등)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT.ROOMS() });
    },
    [convertToMessageWithProfile, queryClient],
  );

  /**
   * WebSocket 연결 설정
   */
  useEffect(() => {
    if (!enabled || isConnectingRef.current) return;
    isConnectingRef.current = true;

    webSocketService.setEventListeners({
      onConnect: () => {
        console.log('[WebSocket] 연결 성공');
        setConnectionStatus('CONNECTED');
        setError(null);
      },
      onDisconnect: () => {
        console.log('[WebSocket] 연결 해제');
        setConnectionStatus('DISCONNECTED');
      },
      onError: (err) => {
        console.error('[WebSocket] 에러:', err);
        setConnectionStatus('ERROR');
        setError(err);
      },
    });

    if (!webSocketService.isConnected()) {
      webSocketService.connect({
        url: WS_URL,
        reconnectDelay: 3000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        debug: process.env.NODE_ENV === 'development',
      });
    }

    return () => {
      isConnectingRef.current = false;
    };
  }, [enabled]);

  /**
   * 채팅방 구독
   */
  useEffect(() => {
    if (!enabled || !chatRoomId) return;

    // 메시지 핸들러 등록
    webSocketService.messageHandlers.set(chatRoomId, handleMessageReceived);

    // 연결되어 있으면 바로 구독
    if (webSocketService.isConnected() && !webSocketService.isSubscribed(chatRoomId)) {
      console.log(`[WebSocket] 채팅방 ${chatRoomId} 구독`);
      webSocketService.subscribe(chatRoomId, handleMessageReceived);
    }

    return () => {
      console.log(`[WebSocket] 채팅방 ${chatRoomId} 구독 해제`);
      webSocketService.unsubscribe(chatRoomId);
    };
  }, [chatRoomId, handleMessageReceived, enabled]);

  /**
   * 메시지 전송
   */
  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim()) return;
      try {
        webSocketService.sendMessage(chatRoomId, content);
      } catch (err) {
        console.error('[WebSocket] 메시지 전송 실패:', err);
        setError(err instanceof Error ? err : new Error('메시지 전송 실패'));
      }
    },
    [chatRoomId],
  );

  return {
    messages,
    sendMessage,
    connectionStatus,
    isConnected: webSocketService.isConnected(),
    isLoading,
    error: error || (enterError as Error | null),
  };
}
