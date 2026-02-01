import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { WS_URL } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useEnterChatRoom } from '@/services/chat/hooks';
import { webSocketService } from '@/services/chat/websocket';
import { ChatMessageWithProfile, ReceivedMessage } from '@/types/chat';
import { ConnectionStatus } from '@/types/webSocket';

import { useQueryClient } from '@tanstack/react-query';

interface UseWebSocketChatParams {
  chatRoomId: number;
  currentUserId: number;
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

  const convertToMessageWithProfile = useCallback(
    (received: ReceivedMessage): ChatMessageWithProfile => {
      const isMine = received.senderId === currentUserId;

      return {
        id: received.messageId,
        chatRoomId: received.chatRoomId,
        senderId: received.senderId,
        content: received.content,
        sentAt: received.sentAt,
        isRead: received.isRead,
        isMine,
        senderName: isMine ? undefined : received.senderName,
        senderProfileImageUrl: isMine ? undefined : received.senderProfileImageUrl,
      };
    },
    [currentUserId],
  );

  const initialMessages = useMemo(() => {
    const contentData = enterData?.data?.content?.content;
    if (!contentData) return [];

    return contentData.map((msg) => {
      const isMine = msg.senderId === currentUserId;

      return {
        ...msg,
        isMine,
        senderName: isMine ? undefined : partnerInfo?.partnerName,
        senderProfileImageUrl: isMine ? undefined : partnerInfo?.partnerProfileImage || undefined,
      } as ChatMessageWithProfile;
    });
  }, [
    enterData?.data?.content?.content,
    currentUserId,
    partnerInfo?.partnerName,
    partnerInfo?.partnerProfileImage,
  ]);

  const messages = useMemo(() => {
    const initialIds = new Set(initialMessages.map((m) => m.id));
    const newRealtimeMessages = realtimeMessages.filter((m) => !initialIds.has(m.id));

    const combined = [...initialMessages, ...newRealtimeMessages];
    return combined.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
  }, [initialMessages, realtimeMessages]);

  const handleMessageReceived = useCallback(
    (received: ReceivedMessage) => {
      const newMsg = convertToMessageWithProfile(received);
      if (!newMsg.id) return;

      setRealtimeMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT.ROOMS() });
    },
    [convertToMessageWithProfile, queryClient],
  );

  useEffect(() => {
    if (!enabled || isConnectingRef.current) return;
    isConnectingRef.current = true;

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

  useEffect(() => {
    if (!enabled || !chatRoomId) return;

    webSocketService.messageHandlers.set(chatRoomId, handleMessageReceived);

    if (webSocketService.isConnected() && !webSocketService.isSubscribed(chatRoomId)) {
      webSocketService.subscribe(chatRoomId, handleMessageReceived);
    }

    return () => {
      webSocketService.unsubscribe(chatRoomId);
    };
  }, [chatRoomId, handleMessageReceived, enabled]);

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
