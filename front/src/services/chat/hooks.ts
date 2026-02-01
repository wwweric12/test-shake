import { QUERY_KEYS } from '@/constants/queryKeys';
import { chatApi } from '@/services/chat/api';
import { CreateChatRoomRequest, ReportChatRequest } from '@/types/chat';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// GET /chat/rooms - 내 채팅방 목록 조회
export const useChatRooms = () => {
  return useQuery({
    queryKey: QUERY_KEYS.CHAT.ROOMS(),
    queryFn: chatApi.getChatRooms,
    staleTime: 30 * 1000,
  });
};

// GET /chat/messages/{chatRoomId}/enter - 채팅방 입장
export const useEnterChatRoom = (chatRoomId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.CHAT.MESSAGES(chatRoomId),
    queryFn: () => chatApi.enterChatRoom(chatRoomId),
    enabled: !!chatRoomId && enabled,
    staleTime: 0,
  });
};

// POST /chat/rooms - 채팅방 생성
export const useCreateChatRoomMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateChatRoomRequest) => chatApi.createChatRoom(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT.ROOMS() });
    },
  });
};

// DELETE /chat/rooms/{chatRoomId}/exit - 채팅방 나가기
export const useExitChatRoomMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (chatRoomId: number) => chatApi.exitChatRoom(chatRoomId),
    onSuccess: (_, chatRoomId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT.ROOMS() });
      queryClient.removeQueries({ queryKey: QUERY_KEYS.CHAT.MESSAGES(chatRoomId) });
    },
  });
};

// POST /chat/rooms/{chatRoomId}/report - 채팅방 신고
export const useReportChatRoomMutation = () => {
  return useMutation({
    mutationFn: ({ chatRoomId, data }: { chatRoomId: number; data: ReportChatRequest }) =>
      chatApi.reportChatRoom(chatRoomId, data),
  });
};
