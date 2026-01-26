import { http, HttpResponse } from 'msw';

import { BASE_URL } from '@/constants/api';
import { ChatMessagesResponse, ChatRoomsResponse } from '@/types/chat';

export const chatHandlers = [
  // Chat Rooms
  http.get(`${BASE_URL}/chat/rooms`, () => {
    const response: ChatRoomsResponse = {
      statusCode: 200,
      message: 'OK',
      data: [
        {
          chatRoomId: 101,
          otherUserNickname: '대화상대1',
          otherUserProfileImageUrl: 'https://picsum.photos/301',
          lastMessage: '안녕하세요!',
          lastMessageAt: '2026-01-23T10:00:00',
          unreadCount: 2,
        },
      ],
    };
    return HttpResponse.json(response);
  }),

  // Chat Messages
  http.get(`${BASE_URL}/chat/rooms/:id/messages`, () => {
    const response: ChatMessagesResponse = {
      statusCode: 200,
      message: 'OK',
      data: [
        {
          content: 12345, // Assuming this is correct per api.md albeit weird
          sendTime: '2026-01-23T10:00:00 (nickname)',
          otherUserProfileImageUrl: 'https://picsum.photos/301',
          lastMessage: '반갑습니다.',
          lastMessageAt: '2026-01-23T10:00:00',
          unreadCount: 0,
        },
      ],
    };
    return HttpResponse.json(response);
  }),

  // Exit
  http.post(`${BASE_URL}/chat/rooms/:id/exit`, () => {
    return new HttpResponse(null, { status: 200 });
  }),

  // Report
  http.post(`${BASE_URL}/chat/rooms/:id/report`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
];
