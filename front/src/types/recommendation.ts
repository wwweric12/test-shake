import { ApiEmptyResponse, ApiResponse } from '@/types/common';

import { UserInfo } from './user';

export type ActionType = 'LIKE' | 'PASS';

export interface CandidateData {
  exposureId: number;
  dailyLimit: number;
  remainingSwipes: number;
  cards: UserInfo[];
}

//Request
export interface ActionRequest {
  exposureId: number;
  userId: number;
  actionType: ActionType;
}

//Response
export type CandidateResponse = ApiResponse<CandidateData>;

export type ActionResponse = ApiEmptyResponse;

export type ResetPreferencesResponse = ApiEmptyResponse;
