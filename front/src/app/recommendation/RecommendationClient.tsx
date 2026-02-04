'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import NotificationCard from '@/app/home/components/NotificationCard';
import SwipeDeck from '@/app/recommendation/components/SwipeDeck';
import backIcon from '@/assets/icon/back.svg';
import resetIcon from '@/assets/icon/restart_alt.svg';
import { Button } from '@/components/ui/Button';
import { useRecommendationController } from '@/hooks/useRecommendationController';
import { useHomeSummary } from '@/services/home/hooks';

import { ResetDialog } from './components/ResetDialog';
import { SurveyDialog } from './components/SurveyDialog';

export default function RecommendationClient() {
  const { data: summaryData } = useHomeSummary();
  const router = useRouter();
  const {
    cards,
    isLoading,
    isError,
    showResetDialog,
    setShowResetDialog,
    handleSwipe,
    confirmReset,
    handleReset,
    refetch,
    showSurveyDialog,
    setShowSurveyDialog,
    handleSurveySubmit,
    isSurveyRefetching,
    wasSatisfied,
    isSurveyTarget,
  } = useRecommendationController();

  const handleBack = () => {
    router.back();
  };

  // 로딩 문구 결정 로직
  const getLoadingMessage = () => {
    if (isSurveyRefetching) {
      return wasSatisfied
        ? '취향에 맞는 동료를\n더 찾아보고 있어요...'
        : '의견을 반영한\n새로운 상대를 찾고 있습니다...';
    }
    return '매칭 상대를 찾고 있습니다...';
  };

  return (
    <div className="from-custom-lightpurple to-custom-blue relative flex h-screen w-full flex-col overflow-hidden bg-linear-to-b">
      {/* Header */}
      <header className="z-50 flex items-center justify-between bg-transparent px-4 py-3">
        <button onClick={handleBack} className="body2 -ml-2 p-2 text-black">
          <Image src={backIcon} alt="Back" />
        </button>
        <h1 className="text-custom-deepnavy">동료 매칭</h1>
        <button onClick={handleReset} className="flex flex-col items-center text-black">
          <Image src={resetIcon} alt="Back" width={24} height={24} />
          <span className="footer2 whitespace-nowrap">초기화</span>
        </button>
      </header>

      {/* Main Content */}
      <main
        className={`relative flex h-full w-full flex-1 flex-col overflow-auto py-4 ${showSurveyDialog ? 'pointer-events-none opacity-40 blur-sm grayscale-[20%]' : ''}`}
      >
        {/* Loading State */}
        {(isLoading || isSurveyRefetching) && cards.length === 0 && (
          <div className="animate-in fade-in flex flex-1 flex-col items-center justify-center gap-4 duration-700">
            <div className="border-custom-purple h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" />
            <p className="text-custom-deepgray body2 text-center leading-relaxed font-medium whitespace-pre-wrap">
              {getLoadingMessage()}
            </p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-custom-deepgray flex flex-1 flex-col items-center justify-center gap-4">
            <p>오류가 발생했습니다.</p>
            <Button onClick={() => refetch()} variant="outline">
              다시 시도
            </Button>
          </div>
        )}

        {/* Empty State / No More Cards */}
        {!isLoading && !isError && cards.length === 0 && !showSurveyDialog && !isSurveyTarget && (
          <div className="animate-in fade-in slide-in-from-bottom-4 -mt-14 flex h-full flex-col items-center justify-center px-6 text-center duration-700">
            <h2 className="text-custom-deepnavy title3 mb-8 whitespace-pre-wrap">
              오늘의 매칭 기회를 모두 소진했습니다.{'\n'}
              나를 좋아하는 동료를 확인해보세요!
            </h2>

            {/* 알림 있을 때만 알림 카드 노출 */}
            {summaryData && summaryData.totalLikeCount > 0 && (
              <div className="w-full max-w-[320px]">
                <NotificationCard
                  count={summaryData.totalLikeCount}
                  recentImages={summaryData.others.profileImageUrl}
                  dsti={summaryData.others.dsti}
                />
              </div>
            )}
          </div>
        )}

        {/* Swipe Deck */}
        {cards.length > 0 && (
          <div className="flex flex-1 items-start justify-center px-4">
            <SwipeDeck cards={cards} onSwipe={handleSwipe} />
          </div>
        )}
      </main>

      {/* Reset Dialog */}
      <ResetDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        onConfirm={confirmReset}
      />

      {/* 추가 설문 다이얼로그 */}
      <SurveyDialog
        open={showSurveyDialog}
        onOpenChange={setShowSurveyDialog}
        onSubmit={handleSurveySubmit}
      />
    </div>
  );
}
