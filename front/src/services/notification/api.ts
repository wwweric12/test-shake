import { api } from '@/services/api';
import {
  AcceptNotificationRequest,
  AcceptNotificationResponse,
  NotificationResponse,
} from '@/types/notification';

export const notificationApi = {
  getNotifications: () => api.get<NotificationResponse>('/notifications'),
  acceptNotification: (notificationId: number, data: AcceptNotificationRequest) =>
    api.post<AcceptNotificationResponse>(`/notifications/${notificationId}`, data),

  //TODO: 아직 수정 중
  //   getTargetProfile: () => api.get<TargetProfileResponse>('/notifications/target-user-profile'),
};
