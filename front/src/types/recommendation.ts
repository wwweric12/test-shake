import { UserCard } from '@/types/user';

export interface CandidateResponse {
  statusCode: number;
  message: string;
  data: {
    exposureId: number;
    cards: UserCard[];
  };
}

export type ActionType = 'LIKE';

export interface ActionRequest {
  exposureId: number;
  targetUserId: number;
  actionType: ActionType;
}

export interface ActionResponse {
  statusCode: number;
  message: string;
  data: object;
}

export interface ResetPreferencesResponse {
  statusCode: number;
  message: string;
  data: object;
}
