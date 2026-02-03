'use client';

import { useHomeSummary } from '@/services/home/hooks';

import MatchingCard from './components/MatchingCard';
import NotificationCard from './components/NotificationCard';
import ProfileCard from './components/ProfileCard';

export default function HomeContent() {
  const { data: summaryData } = useHomeSummary();

  return (
    <main className="bg-custom-white px-5 pt-6 pb-32">
      <div>
        <div className="title1 text-custom-realblack mb-5">
          안녕하세요,
          <span className="text-custom-deeppurple"> {summaryData.nickname}</span> 님!
        </div>
      </div>
      <ProfileCard dsti={summaryData.dsti} profileImageUrl={summaryData.profileImageUrl} />
      <div className="space-y-4">
        <NotificationCard
          count={summaryData.totalLikeCount}
          recentImages={summaryData.others.profileImageUrl}
          dsti={summaryData.others.dsti}
        />
        <MatchingCard
          remainingSwipes={summaryData.remainingSwipes}
          dailyLimit={summaryData.dailyLimit}
        />
      </div>
    </main>
  );
}
