export interface HomeSummaryResponse {
  nickname: string;
  dsti: string;
  profileImageUrl: string;
  totalUnreadMessages: number;
  totalLikeCount: number;
  recentLikeImages: string[];
  remainingSwipes: number;
}
