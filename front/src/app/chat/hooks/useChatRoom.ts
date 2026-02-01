import { useCallback, useState } from 'react';

import { MESSAGE_PAGE_SIZE } from '@/constants/message';
import { chatApi } from '@/services/chat/api';
import { ChatMessageWithProfile } from '@/types/chat';

import { useWebSocketChat } from './useWebSocketChat';

interface UseChatRoomParams {
  roomId: number;
  currentUserId: number;
  partnerInfo?: {
    partnerId: number;
    partnerName: string;
    partnerProfileImage: string | null;
  };
  enabled?: boolean;
}

export function useChatRoom({
  roomId,
  currentUserId,
  partnerInfo,
  enabled = true,
}: UseChatRoomParams) {
  const [additionalMessages, setAdditionalMessages] = useState<ChatMessageWithProfile[]>([]);

  const {
    messages: wsMessages,
    sendMessage,
    isConnected,
    connectionStatus,
    isLoading,
    error,
  } = useWebSocketChat({
    chatRoomId: roomId,
    currentUserId,
    partnerInfo,
    enabled,
  });

  const loadPreviousMessages = useCallback(
    async (cursor?: string) => {
      const response = await chatApi.getChatMessages(roomId, cursor, MESSAGE_PAGE_SIZE);

      if (!response.data?.content?.content) {
        return { messages: [], hasNext: false };
      }

      const loadedMessages: ChatMessageWithProfile[] = response.data.content.content.map((msg) => {
        const isMine = msg.senderId === currentUserId;

        return {
          ...msg,
          isMine,
          senderName: isMine ? undefined : partnerInfo?.partnerName,
          senderProfileImageUrl: isMine ? undefined : partnerInfo?.partnerProfileImage || undefined,
        };
      });

      setAdditionalMessages((prev) => {
        const existingIds = new Set([...prev.map((m) => m.id), ...wsMessages.map((m) => m.id)]);
        const newMessages = loadedMessages.filter((m) => !existingIds.has(m.id));
        return [...newMessages, ...prev];
      });

      return {
        messages: loadedMessages,
        hasNext: response.data.content.hasNext,
      };
    },
    [roomId, currentUserId, partnerInfo, wsMessages],
  );

  const allMessages = [...additionalMessages, ...wsMessages];

  return {
    messages: allMessages,
    sendMessage,
    isLoading,
    isConnected,
    connectionStatus,
    error,
    loadPreviousMessages,
  };
}
