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
      data: {
        content: [
          {
            chatRoomId: 101,
            partnerId: 1001,
            partnerName: '대화상대1',
            partnerProfileImage: 'https://picsum.photos/301',
            lastMessage: '안녕하세요!',
            lastMessageTime: '2026-01-23T10:00:00',
            unreadCount: 2,
            canSendMessage: true,
          },
          {
            chatRoomId: 102,
            partnerId: 1002,
            partnerName: '대화상대2',
            partnerProfileImage: 'https://picsum.photos/302',
            lastMessage: '오늘 점심!',
            lastMessageTime: '2026-01-23T09:30:00',
            unreadCount: 5,
            canSendMessage: true,
          },
        ],
        size: 2,
        hasNext: false,
      },
    };
    return HttpResponse.json(response);
  }),

  // Chat Messages
  http.get(`${BASE_URL}/chat/rooms/:id/messages`, ({ params }) => {
    const roomId = Number(params.id);

    const response: ChatMessagesResponse = {
      statusCode: 200,
      message: 'OK',
      data: {
        content: [
          {
            id: 'msg-1',
            chatRoomId: roomId,
            senderId: 1001,
            content: '안녕하세요!',
            sentAt: '2026-01-23T09:00:00',
            isRead: true,
          },
          {
            id: 'msg-2',
            chatRoomId: roomId,
            senderId: 9999, // 본인 ID
            content: '반갑습니다.',
            sentAt: '2026-01-23T09:01:00',
            isRead: true,
          },
          {
            id: 'msg-3',
            chatRoomId: roomId,
            senderId: 1001,
            content: '오늘 날씨 좋네요!',
            sentAt: '2026-01-23T09:02:00',
            isRead: false,
          },
        ],
        size: 3,
        hasNext: false,
      },
    };
    return HttpResponse.json(response);
  }),

  // Send Message
  http.post(`${BASE_URL}/chat/rooms/:id/messages`, async () => {
    return HttpResponse.json({
      statusCode: 200,
      message: 'OK',
      data: {
        messageId: 999,
        chatRoomId: 1,
        senderId: 'mock-user-id',
        senderNickname: '싸피테스트',
        senderProfileUrl: 'https://picsum.photos/200',
        content: 'Mock Message',
        sendTime: new Date().toISOString(),
        isMine: true,
      },
    });
  }),

  // Exit
  http.post(`${BASE_URL}/chat/rooms/:id/exit`, () => {
    return HttpResponse.json({
      statusCode: 200,
      message: 'OK',
      data: null,
    });
  }),

  // Report
  http.post(`${BASE_URL}/chat/rooms/:id/report`, () => {
    return HttpResponse.json({
      statusCode: 200,
      message: 'OK',
      data: null,
    });
  }),
];
