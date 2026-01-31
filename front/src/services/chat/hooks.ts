import { QUERY_KEYS } from '@/constants/queryKeys';
import { chatApi } from '@/services/chat/api';
import { CreateChatRoomRequest, ReportChatRequest } from '@/types/chat';
import { getErrorMessage } from '@/utils/error';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * 채팅방 목록 조회 Hook
 */
export const useChatRooms = () => {
  return useQuery({
    queryKey: QUERY_KEYS.CHAT.ROOMS(),
    queryFn: chatApi.getChatRooms,
    staleTime: 30 * 1000, // 30초
    retry: (failureCount, error) => {
      // 403/401 에러는 재시도하지 않음 (인증 실패)
      const errorMessage = getErrorMessage(error, '');
      if (errorMessage.includes('[403]') || errorMessage.includes('[401]')) {
        return false;
      }
      return failureCount < 2; // 다른 에러는 최대 2번 재시도
    },
  });
};

/**
 * 채팅방 입장 Hook (초기 메시지 로드)
 * 백엔드: GET /chat/messages/{chatRoomId}/enter
 */
export const useEnterChatRoom = (chatRoomId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.CHAT.MESSAGES(chatRoomId),
    queryFn: () => chatApi.enterChatRoom(chatRoomId),
    enabled: !!chatRoomId && enabled,
    staleTime: 0, // 항상 최신 데이터 조회
    retry: (failureCount, error) => {
      // 403/401 에러는 재시도하지 않음
      const errorMessage = getErrorMessage(error, '');
      if (errorMessage.includes('[403]') || errorMessage.includes('[401]')) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

/**
 * 채팅 메시지 페이징 조회 Hook
 * 백엔드: GET /chat/messages/{chatRoomId}?cursor=...&size=50
 */
export const useChatMessages = (
  chatRoomId: number,
  cursor?: string,
  size: number = 50,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.CHAT.MESSAGES_WITH_CURSOR(chatRoomId, cursor),
    queryFn: () => chatApi.getChatMessages(chatRoomId, cursor, size),
    enabled: !!chatRoomId && enabled,
    staleTime: 0,
    retry: false, // 메시지 조회는 재시도하지 않음
  });
};

/**
 * 채팅방 생성 Mutation Hook
 */
export const useCreateChatRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateChatRoomRequest) => chatApi.createChatRoom(data),
    onSuccess: () => {
      // 채팅방 목록 갱신
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT.ROOMS() });
    },
  });
};

/**
 * 채팅방 나가기 Mutation Hook
 */
export const useExitChatRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chatRoomId: number) => chatApi.exitChatRoom(chatRoomId),
    onSuccess: (_, chatRoomId) => {
      // 채팅방 목록 갱신
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT.ROOMS() });
      // 해당 채팅방 메시지 캐시 삭제
      queryClient.removeQueries({ queryKey: QUERY_KEYS.CHAT.MESSAGES(chatRoomId) });
    },
  });
};

/**
 * 채팅방 신고 Mutation Hook
 */
export const useReportChatRoomMutation = () => {
  return useMutation({
    mutationFn: ({ chatRoomId, data }: { chatRoomId: number; data: ReportChatRequest }) =>
      chatApi.reportChatRoom(chatRoomId, data),
  });
};
