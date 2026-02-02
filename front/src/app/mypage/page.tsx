import { QUERY_KEYS } from '@/constants/queryKeys';
import { userApi } from '@/services/user/api';
import getQueryClient from '@/utils/getQueryClient';

import MyPageContent from './MyPageContent';

import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export default async function MyPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.USER.INFO(),
    queryFn: userApi.getUserInfo,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyPageContent />
    </HydrationBoundary>
  );
}
