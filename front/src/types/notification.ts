import { ApiEmptyResponse, ApiResponse } from '@/types/common';

export interface NotificationData {
  targetUserId: number;
  targetNickname: string;
  targetImageUrl: string;
}

export interface NotificationsData {
  totalCount: number;
  notifications: NotificationData[];
}

//Request

export interface AcceptNotificationRequest {
  targetUserId: number;
  is_accepted: true;
}

export interface RejectNotificationRequest {
  targetUserId: number;
  is_accepted: false;
}

//Response

export type NotificationResponse = ApiResponse<NotificationData[]>;

export type AcceptNotificationResponse = ApiResponse<{
  chatRoomId: number;
}>;

export type RejectNotificationResponse = ApiEmptyResponse;

// TODO: 수정 중
// export interface TargetProfileResponse {}
