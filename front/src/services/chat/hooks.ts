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
    mutationFn: (data: ReportChatRequest) => chatApi.reportChatRoom(data),
  });
};

// 신규: GET /chat/messages/unread-count - 전체 안 읽은 메시지 수 조회
export const useUnreadCount = () => {
  return useQuery({
    queryKey: QUERY_KEYS.CHAT.UNREAD_COUNT(),
    // queryFn: chatApi.getUnreadCount,
    queryFn: async () => {
      const response = await chatApi.getUnreadCount();
      return response.data; // 👈 여기서 숫자만 추출
    },
    staleTime: 10 * 1000, // 10초
    refetchInterval: 30 * 1000, // 30초마다 자동 갱신
    // gcTime: 1000 * 60 * 5,
    // refetchOnWindowFocus: false,
  });
};
