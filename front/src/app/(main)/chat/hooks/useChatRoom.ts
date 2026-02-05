import { useCallback, useEffect, useState } from 'react';

import { MESSAGE_PAGE_SIZE } from '@/constants/message';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { chatApi } from '@/services/chat/api';
import { ChatMessageWithProfile, PartnerInfo } from '@/types/chat';
import { convertApiMessageToProfile } from '@/utils/chatMessageConverter';

import { useWebSocketChat } from './useWebSocketChat';

import { useQueryClient } from '@tanstack/react-query';

interface UseChatRoomParams {
  roomId: number;
  partnerInfo?: PartnerInfo;
  enabled?: boolean;
}

export function useChatRoom({ roomId, partnerInfo, enabled = true }: UseChatRoomParams) {
  const queryClient = useQueryClient();
  const [additionalMessages, setAdditionalMessages] = useState<ChatMessageWithProfile[]>([]);

  const {
    messages: wsMessages,
    sendMessage,
    isConnected,
    connectionStatus,
    isLoading,
    error,
    currentUserId,
    messageError,
    messageErrorType,
    clearMessageError,
    partnerLeft,
  } = useWebSocketChat({
    chatRoomId: roomId,
    partnerInfo,
    enabled,
  });

  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey: QUERY_KEYS.CHAT.MESSAGES(roomId) });
    };
  }, [queryClient, roomId]);

  const loadPreviousMessages = useCallback(
    async (cursor?: string) => {
      if (!currentUserId) {
        return { messages: [], hasNext: false };
      }

      try {
        const response = await chatApi.getChatMessages(roomId, cursor, MESSAGE_PAGE_SIZE);

        if (!response.data?.content?.content) {
          return { messages: [], hasNext: false };
        }

        const loadedMessages: ChatMessageWithProfile[] = response.data.content.content.map((msg) =>
          convertApiMessageToProfile(msg, currentUserId, partnerInfo),
        );

        setAdditionalMessages((prev) => {
          const existingIds = new Set([...prev.map((m) => m.id), ...wsMessages.map((m) => m.id)]);
          const newMessages = loadedMessages.filter((m) => !existingIds.has(m.id));
          return [...newMessages, ...prev];
        });

        return {
          messages: loadedMessages,
          hasNext: response.data.content.hasNext,
        };
      } catch (error) {
        console.error('이전 메시지 로드 실패:', error);
        return { messages: [], hasNext: false };
      }
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
    currentUserId,
    messageError,
    messageErrorType,
    clearMessageError,
    partnerLeft,
  };
}
