'use client';

import Header from '@/components/common/Header';
import { useHomeSummary } from '@/services/home/hooks';

import MatchingCard from './components/MatchingCard';
import ProfileCard from './components/ProfileCard';

export default function HomeContent() {
  const { data: summaryData } = useHomeSummary();

  return (
    <>
      <Header />
      <main className="bg-custom-white flex min-h-[calc(100vh-60px)] flex-col px-5 pt-6 pb-24">
        <div>
          <div className="title1 text-custom-realblack mb-4">
            안녕하세요,
            <span className="text-custom-deeppurple"> {summaryData.nickname}</span> 님!
          </div>
        </div>
        <ProfileCard dsti={summaryData.dsti} profileImageUrl={summaryData.profileImageUrl} />

        <div className="flex flex-1 flex-col">
          <MatchingCard
            remainingSwipes={summaryData.remainingSwipes}
            dailyLimit={summaryData.dailyLimit}
          />
        </div>
      </main>
    </>
  );
}
