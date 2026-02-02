import { api } from '@/services/api';
import {
  ChatRoomListResponse,
  CreateChatRoomRequest,
  CreateChatRoomResponse,
  EnterChatRoomResponse,
  ExitChatRoomResponse,
  GetMessagesResponse,
  ReportChatRequest,
  ReportChatResponse,
} from '@/types/chat';

export const chatApi = {
  // GET /chat/rooms - 내 채팅방 목록 조회
  getChatRooms: () => api.get<ChatRoomListResponse>('/chat/rooms'),

  // POST /chat/rooms - 채팅방 생성
  createChatRoom: (data: CreateChatRoomRequest) =>
    api.post<CreateChatRoomResponse>('/chat/rooms', data),

  // GET /chat/messages/{chatRoomId}/enter - 채팅방 입장
  enterChatRoom: (chatRoomId: number) =>
    api.get<EnterChatRoomResponse>(`/chat/messages/${chatRoomId}/enter`),

  // // GET /chat/messages/{chatRoomId} - 채팅 메시지 페이징 조회
  getChatMessages: (chatRoomId: number, cursor?: string, size: number = 50) => {
    const params = new URLSearchParams();

    if (cursor) {
      params.append('cursor', cursor);
    }

    params.append('size', size.toString());

    const queryString = params.toString();
    return api.get<GetMessagesResponse>(`/chat/messages/${chatRoomId}?${queryString}`);
  },

  // DELETE /chat/rooms/{chatRoomId}/exit - 채팅방 나가기
  exitChatRoom: (chatRoomId: number) =>
    api.delete<ExitChatRoomResponse>(`/chat/rooms/${chatRoomId}/exit`),

  // POST /chat/rooms/{chatRoomId}/report - 채팅방 신고
  reportChatRoom: (chatRoomId: number, data: ReportChatRequest) =>
    api.post<ReportChatResponse>(`/chat/rooms/${chatRoomId}/report`, data),
};
