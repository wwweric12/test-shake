import { useCallback, useEffect, useMemo, useState } from 'react';

import { QUERY_KEYS } from '@/constants/queryKeys';
import { useWebSocket } from '@/providers/WebSocketProvider';
import { useEnterChatRoom } from '@/services/chat/hooks';
import { webSocketService } from '@/services/socket/WebSocketService';
import { ChatMessageWithProfile, PartnerInfo, ReceivedMessageData } from '@/types/chat';
import { WebSocketError } from '@/types/webSocket';
import {
  convertApiMessageToProfile,
  convertWsMessageToProfile,
} from '@/utils/chatMessageConverter';

import { useQueryClient } from '@tanstack/react-query';

interface UseWebSocketChatParams {
  chatRoomId: number;
  partnerInfo?: PartnerInfo;
  enabled?: boolean;
}

export function useWebSocketChat({
  chatRoomId,
  partnerInfo,
  enabled = true,
}: UseWebSocketChatParams) {
  const queryClient = useQueryClient();
  const { isConnected, connectionStatus } = useWebSocket();
  const [realtimeMessages, setRealtimeMessages] = useState<ChatMessageWithProfile[]>([]);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [messageErrorType, setMessageErrorType] = useState<WebSocketError['type'] | null>(null);
  const [partnerLeft, setPartnerLeft] = useState(false);

  const { data: enterData, isLoading, error } = useEnterChatRoom(chatRoomId, enabled);
  const currentUserId = enterData?.data?.userId;

  const handleMessageReceived = useCallback(
    (received: ReceivedMessageData) => {
      const msg = convertWsMessageToProfile(received);
      if (!msg.id) return;
      setRealtimeMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT.MESSAGES(received.chatRoomId) });
    },
    [queryClient],
  );

  const initialMessages = useMemo(() => {
    const content = enterData?.data?.content?.content;
    if (!content || !currentUserId) return [];
    return content.map((m) => convertApiMessageToProfile(m, currentUserId, partnerInfo));
  }, [enterData, currentUserId, partnerInfo]);

  const messages = useMemo(() => {
    const ids = new Set(initialMessages.map((m) => m.id));
    return [...initialMessages, ...realtimeMessages.filter((m) => !ids.has(m.id))].sort(
      (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime(),
    );
  }, [initialMessages, realtimeMessages]);

  // 🔥 WebSocket 에러 구독
  useEffect(() => {
    if (!isConnected) return;

    const subscription = webSocketService.subscribeError((err) => {
      if (err.type === 'PARTNER_LEFT') {
        setPartnerLeft(true);
        // PARTNER_LEFT 타입 에러는 메시지는 저장하지만 배너로 표시 안 함
        setMessageError(err.message);
        setMessageErrorType(err.type);
      } else {
        // 다른 에러는 배너로 표시
        setMessageError(err.message);
        setMessageErrorType(err.type);
      }
    });

    return () => subscription.unsubscribe();
  }, [isConnected]);

  useEffect(() => {
    if (!enabled || !chatRoomId || !isConnected) return;

    webSocketService.enterChatRoom(chatRoomId);

    if (!webSocketService.isSubscribedToChatRoom(chatRoomId)) {
      webSocketService.subscribeChatRoom(chatRoomId, handleMessageReceived);
    }

    return () => {
      if (webSocketService.isConnected()) {
        webSocketService.leaveChatRoom(chatRoomId);
      }
    };
  }, [chatRoomId, enabled, isConnected, handleMessageReceived]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim()) return;

      if (partnerLeft) {
        setMessageError('상대방이 채팅방을 나가 메시지를 보낼 수 없습니다.');
        return;
      }

      if (!isConnected) {
        setMessageError('연결이 끊어져 메시지를 전송할 수 없습니다.');
        return;
      }

      try {
        webSocketService.sendMessage(chatRoomId, content);
        setMessageError(null);
      } catch {
        setMessageError('메시지 전송에 실패했습니다.');
      }
    },
    [chatRoomId, isConnected, partnerLeft],
  );

  return {
    messages,
    sendMessage,
    connectionStatus,
    isConnected,
    isLoading,
    error: error as Error | null,
    currentUserId,
    messageError,
    messageErrorType,
    clearMessageError: () => setMessageError(null),
    partnerLeft,
  };
}
