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
  // 무한 스크롤로 추가 로드된 이전 메시지 저장
  const [additionalMessages, setAdditionalMessages] = useState<ChatMessageWithProfile[]>([]);

  // WebSocket 실시간 채팅 기능
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

  // 이전 메시지 페이징 로드 (무한 스크롤)
  const loadPreviousMessages = useCallback(
    async (cursor?: string) => {
      // API 호출로 이전 메시지 가져오기
      const response = await chatApi.getChatMessages(roomId, cursor, MESSAGE_PAGE_SIZE);

      if (!response.data?.content?.content) {
        return { messages: [], hasNext: false };
      }

      // API 응답을 UI용 메시지로 변환
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

  // 이전 메시지 + 실시간 메시지 병합
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
