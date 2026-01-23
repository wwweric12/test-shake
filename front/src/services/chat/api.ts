import { api } from '@/services/api';
import { ChatMessagesResponse, ChatRoomsResponse, ReportChatRequest } from '@/types/chat';

export const chatApi = {
  getChatRooms: () => api.get<ChatRoomsResponse>('/chat/rooms'),
  getChatMessages: (roomId: number) =>
    api.get<ChatMessagesResponse>(`/chat/rooms/${roomId}/messages`),
  exitChatRoom: (roomId: number) => api.post(`/chat/rooms/${roomId}/exit`, {}),
  reportChatRoom: (roomId: number, data: ReportChatRequest) =>
    api.post(`/chat/rooms/${roomId}/report`, data),
};
