import { QUERY_KEYS } from '@/constants/queryKeys';
import { userApi } from '@/services/user/api';
import getQueryClient from '@/utils/getQueryClient';

import OtherUserProfileContent from './OtherUserProfileContent';

import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export default async function OtherUserProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const queryClient = getQueryClient();

  const resolvedParams = await params;
  const userId = Number(resolvedParams.userId);

  await queryClient.prefetchQuery({
    queryKey: [...QUERY_KEYS.USER.INFO(), userId],
    queryFn: () => userApi.getOtherUserInfo(userId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OtherUserProfileContent userId={userId} />
    </HydrationBoundary>
  );
}
