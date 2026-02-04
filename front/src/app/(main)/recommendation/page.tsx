import { QUERY_KEYS } from '@/constants/queryKeys';
import { recommendationApi } from '@/services/recommendation/api';

import RecommendationClient from './RecommendationClient';

import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

export default async function RecommendationPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.RECOMMENDATION.CANDIDATES(6),
    queryFn: () => recommendationApi.getCandidates(6),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RecommendationClient />
    </HydrationBoundary>
  );
}
