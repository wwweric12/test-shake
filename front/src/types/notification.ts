import { ApiEmptyResponse, ApiResponse } from '@/types/common';

export interface NotificationData {
  targetUserId: number;
  targetNickname: string;
  targetImageUrl: string | null;
  dsti: string;
}

export interface NotificationListResponse {
  content: NotificationData[];
  size: number;
  hasNext: boolean;
}

export interface NotificationMainData {
  unreadCount: number;
  notificationResponse: NotificationListResponse;
}

//Request

export interface NotificationActionRequest {
  targetUserId: number;
  is_accepted: boolean;
}

export interface AcceptNotificationRequest extends NotificationActionRequest {
  is_accepted: true;
}

export interface RejectNotificationRequest extends NotificationActionRequest {
  is_accepted: false;
}

//Response

export type NotificationResponse = ApiResponse<NotificationMainData>;

export type AcceptNotificationResponse = ApiResponse<{
  chatRoomId: number;
}>;

// 알림 업데이트 데이터 타입
export interface NotificationUpdateData {
  targetUserId: number;
  targetNickname: string;
  targetImageUrl: string;
  dsti: string;
  unreadCount: number;
}

export type NotificationUpdateResponse = ApiResponse<NotificationUpdateData>;
export type RejectNotificationResponse = ApiEmptyResponse;
