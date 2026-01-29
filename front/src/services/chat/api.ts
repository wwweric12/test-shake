// import { api } from '@/services/api';
// import {
//   ChatMessagesResponse,
//   ChatRoomsResponse,
//   ExitResponse,
//   ReportChatRequest,
//   ReportResponse,
//   SendMessageRequest,
//   SendMessageResponse,
// } from '@/types/chat';

// export const chatApi = {
//   getChatRooms: () => api.get<ChatRoomsResponse>('/chat/rooms'),

//   getChatMessages: (roomId: number) =>
//     api.get<ChatMessagesResponse>(`/chat/rooms/${roomId}/messages`),

//   sendMessage: (roomId: number, data: SendMessageRequest) =>
//     api.post<SendMessageResponse>(`/chat/rooms/${roomId}/messages`, data),

//   exitChatRoom: (roomId: number) => api.post<ExitResponse>(`/chat/rooms/${roomId}/exit`, {}),

//   reportChatRoom: (roomId: number, data: ReportChatRequest) =>
//     api.post<ReportResponse>(`/chat/rooms/${roomId}/report`, data),
// };
import { api } from '@/services/api';
import {
  ChatMessagesResponse,
  ChatRoomEnterResponse,
  ChatRoomsResponse,
  CreateChatRoomRequest,
  CreateChatRoomResponse,
  ExitResponse,
  ReportChatRequest,
  ReportResponse,
} from '@/types/chat';

/**
 * 채팅 관련 REST API
 * WebSocket은 services/chat/websocket.ts에서 별도 관리
 */
export const chatApi = {
  /**
   * 내 채팅방 목록 조회
   * GET /chat/rooms
   */
  getChatRooms: () => api.get<ChatRoomsResponse>('/chat/rooms'),

  /**
   * 채팅방 생성
   * POST /chat/rooms
   */
  createChatRoom: (data: CreateChatRoomRequest) =>
    api.post<CreateChatRoomResponse>('/chat/rooms', data),

  /**
   * 채팅방 입장 (초기 메시지 로드)
   * GET /chat/messages/{chatRoomId}/enter
   */
  enterChatRoom: (chatRoomId: number) =>
    api.get<ChatRoomEnterResponse>(`/chat/messages/${chatRoomId}/enter`),

  /**
   * 채팅 메시지 페이징 조회
   * GET /chat/messages/{chatRoomId}
   * @param chatRoomId 채팅방 ID
   * @param cursor 커서 (ISO 8601 형식, 예: 2026-01-29T21:10:30)
   * @param size 조회 개수 (기본값: 50)
   */
  getChatMessages: (chatRoomId: number, cursor?: string, size: number = 50) => {
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    params.append('size', size.toString());

    const queryString = params.toString();
    return api.get<ChatMessagesResponse>(
      `/chat/messages/${chatRoomId}${queryString ? `?${queryString}` : ''}`,
    );
  },

  /**
   * 채팅방 나가기
   * DELETE /chat/rooms/{chatRoomId}/exit
   */
  exitChatRoom: (chatRoomId: number) => api.delete<ExitResponse>(`/chat/rooms/${chatRoomId}/exit`),

  /**
   * 채팅방 신고
   * POST /chat/rooms/{chatRoomId}/report
   */
  reportChatRoom: (chatRoomId: number, data: ReportChatRequest) =>
    api.post<ReportResponse>(`/chat/rooms/${chatRoomId}/report`, data),
};
