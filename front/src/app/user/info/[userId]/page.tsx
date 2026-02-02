'use client';

import { useParams, useRouter } from 'next/navigation';

import SwipingCard from '@/app/recommendation/components/SwipingCard';
import { ProfileErrorState } from '@/app/user/info/components/ProfileErrorState';
import { ProfileHeader } from '@/app/user/info/components/ProfileHeader';
import { ProfileLoadingState } from '@/app/user/info/components/ProfileLoadingState';
import { useOtherUserProfile } from '@/services/user/hooks';

export default function OtherUserProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = Number(params.userId);

  const handleBack = () => router.back();

  const { data, isLoading, isError } = useOtherUserProfile(userId);

  if (isLoading) return <ProfileLoadingState />;

  if (isError || !data) {
    return <ProfileErrorState message="유저 정보를 찾을 수 없습니다." onBack={handleBack} />;
  }

  const userInfo = data.data;

  return (
    <div className="bg-custom-white flex h-dvh flex-col overflow-hidden">
      <ProfileHeader nickname={userInfo.nickname} onBack={handleBack} />

      <main className="flex-1 overflow-hidden px-5 pb-8">
        <div className="relative mx-auto h-full w-full max-w-[400px]">
          <SwipingCard card={userInfo} />
        </div>
      </main>
    </div>
  );
}
