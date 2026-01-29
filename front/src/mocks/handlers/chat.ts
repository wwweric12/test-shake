// src/mocks/handlers/chat.ts
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
        {
          chatRoomId: 102,
          otherUserNickname: '대화상대2',
          otherUserProfileImageUrl: 'https://picsum.photos/302',
          lastMessage: '오늘 점심!',
          lastMessageAt: '2026-01-23T09:30:00',
          unreadCount: 0,
        },
      ],
    };
    return HttpResponse.json(response);
  }),

  // Chat Messages
  http.get(`${BASE_URL}/chat/rooms/:id/messages`, ({ params }) => {
    const roomId = Number(params.id);

    const response: ChatMessagesResponse = {
      statusCode: 200,
      message: 'OK',
      data: [
        {
          messageId: 1,
          chatRoomId: roomId,
          senderId: 'user-001',
          senderNickname: '대화상대1',
          content: '안녕하세요!',
          sendTime: '2026-01-23T09:00:00',
          senderProfileUrl: 'https://picsum.photos/301',
          isRead: true,
          isMine: false,
        },
        {
          messageId: 2,
          chatRoomId: roomId,
          senderId: 'mock-user-1',
          senderNickname: '나',
          content: '반갑습니다.',
          sendTime: '2026-01-23T09:01:00',
          senderProfileUrl: 'https://picsum.photos/302',
          isRead: true,
          isMine: true,
        },
        {
          messageId: 3,
          chatRoomId: roomId,
          senderId: 'user-001',
          senderNickname: '대화상대1',
          content: '오늘 날씨 좋네요!',
          sendTime: '2026-01-23T09:02:00',
          senderProfileUrl: 'https://picsum.photos/301',
          isRead: false,
          isMine: false,
        },
      ],
    };
    return HttpResponse.json(response);
  }),

  // Send Message
  http.post(`${BASE_URL}/chat/rooms/:id/messages`, async () => {
    return new HttpResponse(null, { status: 200 });
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
