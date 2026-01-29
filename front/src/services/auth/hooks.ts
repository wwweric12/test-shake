import { authApi } from '@/services/auth/api';

import { useMutation } from '@tanstack/react-query';

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {},
  });
};

export const useReissueMutation = () => {
  return useMutation({
    mutationFn: () => authApi.reissue(),
    onSuccess: () => {},
  });
};
