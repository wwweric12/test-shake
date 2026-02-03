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
    currentUserId,
  } = useWebSocketChat({
    chatRoomId: roomId,
    partnerInfo,
    enabled,
  });

  // 채팅방 입장 시 읽음 처리 (채팅방 목록 캐시 갱신)
  useEffect(() => {
    if (enabled && roomId && currentUserId) {
      // 채팅방 목록 캐시 무효화 → 읽지 않은 메시지 수 업데이트
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT.ROOMS() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT.UNREAD_COUNT() });
    }
  }, [roomId, currentUserId, enabled, queryClient]);

  // 채팅방 나갈 때도 캐시 갱신
  useEffect(() => {
    return () => {
      // 언마운트 시 채팅방 목록 갱신
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT.ROOMS() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT.UNREAD_COUNT() });
    };
  }, [queryClient]);

  // 이전 메시지 페이징 로드 (무한 스크롤)
  const loadPreviousMessages = useCallback(
    async (cursor?: string) => {
      // ✅ currentUserId가 없으면 빈 배열 반환
      if (!currentUserId) {
        return { messages: [], hasNext: false };
      }
      // API 호출로 이전 메시지 가져오기
      const response = await chatApi.getChatMessages(roomId, cursor, MESSAGE_PAGE_SIZE);

      if (!response.data?.content?.content) {
        return { messages: [], hasNext: false };
      }

      // API 응답을 UI용 메시지로 변환
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
    currentUserId,
  };
}
