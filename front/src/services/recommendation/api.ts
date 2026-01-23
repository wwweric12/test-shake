import { api } from '@/services/api';
import {
  ActionRequest,
  ActionResponse,
  CandidateResponse,
  ResetPreferencesResponse,
} from '@/types/recommendation';

export const recommendationApi = {
  getCandidates: (limit: number = 20) =>
    api.get<CandidateResponse>(`/recommendation/candidates?limit=${limit}`),
  resetPreferences: () =>
    api.post<ResetPreferencesResponse>('/recommendation/preferences/reset', {}),
  action: (data: ActionRequest) => api.post<ActionResponse>('/recommendation/actions', data),
};
