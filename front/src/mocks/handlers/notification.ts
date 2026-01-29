import { http, HttpResponse } from 'msw';

import { BASE_URL } from '@/constants/api';
import { AcceptNotificationResponse, NotificationResponse } from '@/types/notification';

export const notificationHandlers = [
  // List Notifications
  http.get(`${BASE_URL}/notifications`, () => {
    const mockNotifications: NotificationResponse = {
      statusCode: 200,
      message: 'OK',
      data: [
        {
          notificationId: 1,
          targetNickname: '매칭상대1',
          targetImageUrl: 'https://picsum.photos/201',
        },
        {
          notificationId: 2,
          targetNickname: '매칭상대2',
          targetImageUrl: 'https://picsum.photos/202',
        },
      ],
    };
    return HttpResponse.json(mockNotifications);
  }),

  // Accept Notification (Create Chat)
  http.post(`${BASE_URL}/notifications/:id`, () => {
    const response: AcceptNotificationResponse = {
      statusCode: 200,
      message: 'OK',
      data: {
        chatRoomId: 101,
      },
    };
    return HttpResponse.json(response);
  }),

  // Target Profile (Placeholder)
  http.get(`${BASE_URL}/notifications/target-user-profile`, () => {
    return HttpResponse.json({
      statusCode: 200,
      message: 'OK',
      data: 'mock-profile-data',
    });
  }),
];
