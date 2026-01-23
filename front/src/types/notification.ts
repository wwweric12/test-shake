export interface NotificationData {
  notificationId: number;
  targetNickname: string;
  targetImageUrl: string;
}

export interface NotificationResponse {
  statusCode: string;
  message: string;
  data: NotificationData[];
}

export interface AcceptNotificationRequest {
  targetUserId: number;
  is_accepted: boolean;
}

export interface AcceptNotificationResponse {
  statusCode: string;
  message: string;
  data: {
    chatRoomId: number;
  };
}

// TODO: 수정 중
// export interface TargetProfileResponse {}
