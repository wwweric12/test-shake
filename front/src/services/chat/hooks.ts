/* eslint-disable no-console */
import { QUERY_KEYS } from '@/constants/queryKeys';
import { WSChatRoom, WSMessage } from '@/features/chat/types';
import { MOCK_MESSAGES, MOCK_ROOMS } from '@/mocks/chatData';
// import { chatApi } from '@/services/chat/api';
import { ReportChatRequest } from '@/types/chat';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// API 호출 시뮬레이션용 지연
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// export const useChatRooms = () => {
//   return useQuery({
//     queryKey: QUERY_KEYS.CHAT.ROOMS(),
//     queryFn: chatApi.getChatRooms,
//   });
// };

// export const useChatMessages = (roomId: number, enabled: boolean = true) => {
//   return useQuery({
//     queryKey: QUERY_KEYS.CHAT.MESSAGES(roomId),
//     queryFn: () => chatApi.getChatMessages(roomId),
//     enabled: !!roomId && enabled,
//   });
// };

// export const useExitChatRoomMutation = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (roomId: number) => chatApi.exitChatRoom(roomId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT.ROOMS() });
//     },
//   });
// };

// export const useReportChatRoomMutation = () => {
//   return useMutation({
//     mutationFn: ({ roomId, data }: { roomId: number; data: ReportChatRequest }) =>
//       chatApi.reportChatRoom(roomId, data),
//   });
// };

// ============================================
// 채팅방 관련 훅
// ============================================

/**
 * 채팅방 목록 조회
 *
 * TODO: 백엔드 준비 시
 * 1. chatApi.getChatRooms() 호출로 변경
 * 2. response.data.map(apiRoomToWSRoom) 변환
 */
export const useChatRooms = () => {
  return useQuery<WSChatRoom[]>({
    queryKey: QUERY_KEYS.CHAT.ROOMS(),
    queryFn: async (): Promise<WSChatRoom[]> => {
      await delay(300);
      console.log('📋 Mock: Fetching chat rooms');

      // 🔧 백엔드 연동 시 여기만 수정:
      // const response = await chatApi.getChatRooms();
      // return response.data.map(apiRoomToWSRoom);

      return [...MOCK_ROOMS];
    },
  });
};

/**
 * 채팅방 메시지 조회 (이전 메시지)
 *
 * TODO: 백엔드 준비 시
 * 1. chatApi.getChatMessages(roomId) 호출로 변경
 * 2. response.data.map(apiMessageToWSMessage) 변환
 */
export const useChatMessages = (roomId: number | string, enabled: boolean = true) => {
  return useQuery<WSMessage[]>({
    queryKey: QUERY_KEYS.CHAT.MESSAGES(Number(roomId)),
    queryFn: async (): Promise<WSMessage[]> => {
      await delay(300);
      console.log(`📨 Mock: Fetching messages for room ${roomId}`);

      // 🔧 백엔드 연동 시 여기만 수정:
      // const response = await chatApi.getChatMessages(Number(roomId));
      // const currentUserId = 'current-user'; // TODO: 실제 사용자 ID
      // return response.data.map(msg =>
      //   apiMessageToWSMessage(msg, String(roomId), currentUserId)
      // );

      return MOCK_MESSAGES[String(roomId)] || [];
    },
    enabled: !!roomId && enabled,
    staleTime: 0, // 항상 최신 데이터 가져오기
  });
};

/**
 * 채팅방 나가기
 *
 * TODO: 백엔드 준비 시
 * chatApi.exitChatRoom(roomId) 호출로 변경
 */
export const useExitChatRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roomId: number) => {
      await delay(300);
      console.log('🚪 Mock: Exit room', roomId);

      // 🔧 백엔드 연동 시 여기만 수정:
      // return chatApi.exitChatRoom(roomId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT.ROOMS() });
    },
  });
};

/**
 * 채팅방 신고
 *
 * TODO: 백엔드 준비 시
 * chatApi.reportChatRoom(roomId, data) 호출로 변경
 */
export const useReportChatRoomMutation = () => {
  return useMutation({
    mutationFn: async ({ roomId, data }: { roomId: number; data: ReportChatRequest }) => {
      await delay(300);
      console.log('🚨 Mock: Report room', { roomId, data });

      // 🔧 백엔드 연동 시 여기만 수정:
      // return chatApi.reportChatRoom(roomId, data);
    },
  });
};
