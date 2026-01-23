import { authApi } from '@/services/auth/api';
import { removeAccessToken, setAccessToken } from '@/utils/token';

import { useMutation } from '@tanstack/react-query';

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      removeAccessToken();
      window.location.href = '/login';
    },
  });
};

export const useReissueMutation = () => {
  return useMutation({
    mutationFn: () => authApi.reissue(),
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
    },
  });
};
