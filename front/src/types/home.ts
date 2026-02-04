import { ApiResponse } from '@/types/common';

export interface HomeSummaryData {
  nickname: string;
  profileImageUrl: string;
  dsti: string;
  totalUnreadMessages: number;
  totalLikeCount: number;
  others: {
    profileImageUrl: string[];
    dsti: string[];
  };
  remainingSwipes: number;
  dailyLimit: number;
}

export interface NotificationUsers {
  profileImageUrl: string[];
  dsti: string[];
}

//Response

// 홈 요약 데이터 업데이트 타입
export interface HomeBadgeCountData {
  totalUnreadMessages: number;
  totalLikeCount: number;
}

export type HomeBadgeCountResponse = ApiResponse<HomeBadgeCountData>;
export type HomeSummaryResponse = ApiResponse<HomeSummaryData>;
