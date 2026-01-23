import { QUERY_KEYS } from '@/constants/queryKeys';
import { recommendationApi } from '@/services/recommendation/api';
import { ActionRequest } from '@/types/recommendation';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useCandidates = (limit?: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.RECOMMENDATION.CANDIDATES(limit),
    queryFn: () => recommendationApi.getCandidates(limit),
  });
};

export const useResetPreferencesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recommendationApi.resetPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RECOMMENDATION.CANDIDATES() });
    },
  });
};

export const useActionMutation = () => {
  return useMutation({
    mutationFn: (data: ActionRequest) => recommendationApi.action(data),
    onSuccess: () => {
      // Logic for invalidation if needed
    },
  });
};
