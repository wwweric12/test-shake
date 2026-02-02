import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { WS_URL } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useEnterChatRoom } from '@/services/chat/hooks';
import { webSocketService } from '@/services/chat/websocket';
import { ChatMessageWithProfile, ReceivedMessageData } from '@/types/chat';
import { PartnerInfo } from '@/types/chat';
import { ConnectionStatus } from '@/types/webSocket';
import {
  convertApiMessageToProfile,
  convertWsMessageToProfile,
} from '@/utils/chatMessageConverter';

import { useQueryClient } from '@tanstack/react-query';

interface UseWebSocketChatParams {
  chatRoomId: number;
  currentUserId: number;
  partnerInfo?: PartnerInfo;
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
  // 실시간으로 수신된 메시지 저장
  const [realtimeMessages, setRealtimeMessages] = useState<ChatMessageWithProfile[]>([]);
  // WebSocket 연결 상태 관리
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    enabled ? 'CONNECTING' : 'DISCONNECTED',
  );
  // WebSocket 에러 상태 저장
  const [error, setError] = useState<Error | null>(null);
  // 중복 연결 방지 플래그
  const isConnectingRef = useRef(false);

  // 채팅방 입장 시 초기 메시지 로드
  const { data: enterData, isLoading, error: enterError } = useEnterChatRoom(chatRoomId, enabled);

  // WebSocket 수신 메시지를 UI용 메시지로 변환
  const handleMessageReceived = useCallback(
    (receivedData: ReceivedMessageData) => {
      const newMsg = convertWsMessageToProfile(receivedData);

      if (!newMsg.id) return;

      // 중복 메시지 필터링 후 상태 업데이트
      setRealtimeMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });

      // 채팅방 목록 캐시 갱신
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT.ROOMS() });
    },
    [queryClient],
  );

  // REST API로 받은 초기 메시지를 UI용 형태로 변환 (currentUserId로 계산)
  const initialMessages = useMemo(() => {
    const contentData = enterData?.data?.content?.content;
    if (!contentData) return [];

    return contentData.map((msg) => convertApiMessageToProfile(msg, currentUserId, partnerInfo));
  }, [enterData?.data?.content?.content, currentUserId, partnerInfo]);

  // 초기 메시지와 실시간 메시지 병합 후 시간순 정렬
  const messages = useMemo(() => {
    const initialIds = new Set(initialMessages.map((m) => m.id));
    const newRealtimeMessages = realtimeMessages.filter((m) => !initialIds.has(m.id));

    const combined = [...initialMessages, ...newRealtimeMessages];
    return combined.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
  }, [initialMessages, realtimeMessages]);

  // WebSocket 연결 설정
  useEffect(() => {
    if (!enabled || isConnectingRef.current) return;
    isConnectingRef.current = true;

    // 연결 상태 변화 이벤트 리스너 등록
    webSocketService.setEventListeners({
      onConnect: () => {
        setConnectionStatus('CONNECTED');
        setError(null);
      },
      onDisconnect: () => setConnectionStatus('DISCONNECTED'),
      onError: (err) => {
        setConnectionStatus('ERROR');
        setError(err);
      },
    });

    // WebSocket 연결 시작
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

  // 채팅방 구독 설정
  useEffect(() => {
    if (!enabled || !chatRoomId) return;

    // 메시지 수신 핸들러 등록
    webSocketService.messageHandlers.set(chatRoomId, handleMessageReceived);

    // 이미 연결되어 있으면 즉시 구독
    if (webSocketService.isConnected() && !webSocketService.isSubscribed(chatRoomId)) {
      webSocketService.subscribe(chatRoomId, handleMessageReceived);
    }

    return () => {
      // 컴포넌트 언마운트 시 구독 해제
      webSocketService.unsubscribe(chatRoomId);
    };
  }, [chatRoomId, handleMessageReceived, enabled]);

  // 메시지 전송 함수
  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim()) return;
      webSocketService.sendMessage(chatRoomId, content);
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
