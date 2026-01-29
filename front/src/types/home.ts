export interface HomeSummaryResponse {
  nickname: string;
  dsti: string;
  profileImageUrl: string;
  totalUnreadMessages: number;
  totalLikeCount: number;
  others: NotificationUsers;
  remainingSwipes: number;
}

export interface NotificationUsers {
  profileImageUrl: string[];
  dsti: string[];
}
