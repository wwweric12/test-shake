import { ApiEmptyResponse, ApiResponse } from '@/types/common';

import { UserInfo } from './user';

export type ActionType = 'LIKE' | 'PASS';

export type ExtraSurveyStatus = 'BEFORE_SURVEY' | 'AFTER_SURVEY';

export interface CandidateData {
  exposureId: number;
  dailyLimit: number;
  remainingSwipes: number;
  cards: UserInfo[];
}

export interface ActionData {
  extraSurveyStatus: ExtraSurveyStatus;
}

//Request
export interface ActionRequest {
  exposureId: number;
  userId: number;
  actionType: ActionType;
}

//Response
export type CandidateResponse = ApiResponse<CandidateData>;

export type ActionResponse = ApiResponse<ActionData>;

export type ResetPreferencesResponse = ApiEmptyResponse;
