import { api } from '@/services/api';
import {
  ChatMessagesResponse,
  ChatRoomsResponse,
  ExitResponse,
  ReportChatRequest,
  ReportResponse,
  SendMessageRequest,
  SendMessageResponse,
} from '@/types/chat';

export const chatApi = {
  getChatRooms: () => api.get<ChatRoomsResponse>('/chat/rooms'),

  getChatMessages: (roomId: number) =>
    api.get<ChatMessagesResponse>(`/chat/rooms/${roomId}/messages`),

  sendMessage: (roomId: number, data: SendMessageRequest) =>
    api.post<SendMessageResponse>(`/chat/rooms/${roomId}/messages`, data),

  exitChatRoom: (roomId: number) => api.post<ExitResponse>(`/chat/rooms/${roomId}/exit`, {}),

  reportChatRoom: (roomId: number, data: ReportChatRequest) =>
    api.post<ReportResponse>(`/chat/rooms/${roomId}/report`, data),
};
