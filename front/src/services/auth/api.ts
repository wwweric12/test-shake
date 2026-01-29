import { api } from '@/services/api';
import { LogoutResponse, ReissueResponse } from '@/types/auth';

export const authApi = {
  logout: () => api.post<LogoutResponse>('/user/logout', {}),
  reissue: () => api.post<ReissueResponse>('/user/reissue', {}),
};
