import { api } from '@/services/api';
import {
  AcceptNotificationRequest,
  AcceptNotificationResponse,
  NotificationResponse,
  RejectNotificationRequest,
  RejectNotificationResponse,
} from '@/types/notification';

export const notificationApi = {
  getNotifications: () => api.get<NotificationResponse>('/notifications'),
  acceptNotification: (
    notificationId: number,
    data: AcceptNotificationRequest | RejectNotificationRequest,
  ) =>
    api.post<AcceptNotificationResponse | RejectNotificationResponse>(
      `/notifications/${notificationId}`,
      data,
    ),
};
