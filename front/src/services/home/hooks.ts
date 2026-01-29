import { QUERY_KEYS } from '@/constants/queryKeys';
import { homeApi } from '@/services/home/api';

import { useSuspenseQuery } from '@tanstack/react-query';

export const useHomeSummary = () => {
  return useSuspenseQuery({
    queryKey: QUERY_KEYS.HOME.SUMMARY(),
    queryFn: homeApi.getSummary,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    select: (res) => res.data,
  });
};
