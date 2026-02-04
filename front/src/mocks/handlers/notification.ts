import { http, HttpResponse } from 'msw';

import { BASE_URL } from '@/constants/api';
import { NotificationResponse } from '@/types/notification';

export const notificationHandlers = [
  // List Notifications
  http.get(`${BASE_URL}/notifications`, () => {
    const mockNotifications: NotificationResponse = {
      statusCode: 200,
      message: 'OK',
      data: {
        unreadCount: 80,
        notificationResponse: {
          content: [
            {
              targetUserId: 1,
              targetNickname: '매칭상대1',
              targetImageUrl: 'https://picsum.photos/201',
              dsti: 'PDAR',
            },
            {
              targetUserId: 2,
              targetNickname: '매칭상대2',
              targetImageUrl: 'https://picsum.photos/202',
              dsti: 'EBWU',
            },
          ],
          size: 3,
          hasNext: false,
        },
      },
    };
    return HttpResponse.json(mockNotifications);
  }),
];
