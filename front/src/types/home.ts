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
}

export interface NotificationUsers {
  profileImageUrl: string[];
  dsti: string[];
}

//Response

export type HomeSummaryResponse = ApiResponse<HomeSummaryData>;
