import { QUERY_KEYS } from '@/constants/queryKeys';
import { recommendationApi } from '@/services/recommendation/api';
import { ActionRequest } from '@/types/recommendation';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useCandidates = (limit?: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.RECOMMENDATION.CANDIDATES(limit),
    queryFn: () => recommendationApi.getCandidates(limit),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false, // 탭 전환 시 재요청 방지 (스와이프 경험 유지)
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ActionRequest) => recommendationApi.action(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HOME.SUMMARY() });
    },
  });
};

export const useSubmitSurveyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recommendationApi.submitSurvey,
    onSuccess: () => {
      // 설문 완료 후 상태가 AFTER_SURVEY로 변하므로 캐시 무효화 및 새 카드 요청
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RECOMMENDATION.CANDIDATES() });
    },
  });
};
