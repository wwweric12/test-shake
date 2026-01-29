import { RecommendationCard } from '@/types/user';

export interface CandidateResponse {
  statusCode: number;
  message: string;
  data: {
    exposureId: number;
    remainingCardCnt: number;
    quotaDate: string;
    cards: RecommendationCard[];
  };
}

export type ActionType = 'LIKE' | 'PASS';

export interface ActionRequest {
  exposureId: number;
  userId: number;
  actionType: ActionType;
}

export interface ActionResponse {
  statusCode: number;
  message: string;
}

export interface ResetPreferencesResponse {
  statusCode: number;
  message: string;
}
