import { api } from '@/services/api';
import { HomeSummaryResponse } from '@/types/home';

export const homeApi = {
  getSummary: () => api.get<HomeSummaryResponse>('/home/summary'),
};
