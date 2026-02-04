import { api } from '@/services/api';
import {
  AcceptNotificationRequest,
  AcceptNotificationResponse,
  NotificationResponse,
  RejectNotificationRequest,
  RejectNotificationResponse,
} from '@/types/notification';

export const notificationApi = {
  getNotifications: (page: number, size: number) => 
    api.get<NotificationResponse>(`/notifications?page=${page}&size=${size}`),
  
  acceptNotification: (data: AcceptNotificationRequest) =>
    api.post<AcceptNotificationResponse>(`/notifications/accept`, data),

  rejectNotification: (data: RejectNotificationRequest) =>
    api.post<RejectNotificationResponse>(`/notifications/reject`, data),
};