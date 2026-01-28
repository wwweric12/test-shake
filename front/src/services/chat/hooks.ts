import { QUERY_KEYS } from '@/constants/queryKeys';
import { chatApi } from '@/services/chat/api';
import { ReportChatRequest } from '@/types/chat';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useChatRooms = () => {
  return useQuery({
    queryKey: QUERY_KEYS.CHAT.ROOMS(),
    queryFn: chatApi.getChatRooms,
  });
};

export const useChatMessages = (roomId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.CHAT.MESSAGES(roomId),
    queryFn: () => chatApi.getChatMessages(roomId),
    enabled: !!roomId && enabled,
  });
};

export const useExitChatRoomMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roomId: number) => chatApi.exitChatRoom(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT.ROOMS() });
    },
  });
};

export const useReportChatRoomMutation = () => {
  return useMutation({
    mutationFn: ({ roomId, data }: { roomId: number; data: ReportChatRequest }) =>
      chatApi.reportChatRoom(roomId, data),
  });
};
