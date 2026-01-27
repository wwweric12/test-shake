import { Suspense } from 'react';

import { QUERY_KEYS } from '@/constants/queryKeys';
import { homeApi } from '@/services/home/api';
import getQueryClient from '@/utils/getQueryClient';

import HomeSkeleton from './components/HomeSkeleton';
import HomeContent from './HomeContent';

import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export default async function HomePage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.HOME.SUMMARY(),
    queryFn: homeApi.getSummary,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<HomeSkeleton />}>
        <HomeContent />
      </Suspense>
    </HydrationBoundary>
  );
}
