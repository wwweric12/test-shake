import { api } from '@/services/api';
import { ReissueResponse } from '@/types/auth';

export const authApi = {
  logout: () => api.post('/user/logout', {}),
  reissue: () => api.post<ReissueResponse>('/user/reissue', {}),
};
