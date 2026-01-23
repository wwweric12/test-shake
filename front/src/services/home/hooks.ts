import { QUERY_KEYS } from '@/constants/queryKeys';
import { homeApi } from '@/services/home/api';

import { useQuery } from '@tanstack/react-query';

export const useHomeSummary = () => {
  return useQuery({
    queryKey: QUERY_KEYS.HOME.SUMMARY(),
    queryFn: homeApi.getSummary,
  });
};
