'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import SwipeDeck from '@/app/(main)/recommendation/components/SwipeDeck';
import backIcon from '@/assets/icon/back.svg';
import resetIcon from '@/assets/icon/restart_alt.svg';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { useRecommendationController } from '@/hooks/useRecommendationController';

export default function RecommendationClient() {
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
  } = useRecommendationController();

  const handleBack = () => {
    router.back();
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
      <main className="relative flex h-full w-full flex-1 flex-col overflow-auto py-4">
        {/* Loading State */}
        {isLoading && cards.length === 0 && (
          <div className="text-custom-deepgray flex flex-1 animate-pulse items-center justify-center">
            매칭 상대를 찾고 있습니다...
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
        {!isLoading && !isError && cards.length === 0 && (
          <div className="-mt-14 flex h-full flex-col items-center justify-center px-6 text-center">
            <h2 className="text-custom-deepnavy mb-2 text-xl font-bold whitespace-pre-wrap">
              오늘의 매칭 기회를 모두 소진했습니다.{'\n'}
              나를 좋아하는 동료를 확인해보세요!
            </h2>

            {/* Placeholder for "Check Likes" CTA */}
            <div className="mt-8 mb-8 flex w-full max-w-[280px] cursor-pointer flex-col items-center rounded-[24px] bg-white p-6 shadow-lg transition-transform hover:scale-105">
              <div className="mb-4 flex justify-center -space-x-3">
                {/* Mock Avatars */}
                <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-gray-300" />
                <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-gray-400" />
                <div className="bg-custom-deepnavy flex h-10 w-10 items-center justify-center rounded-full border-2 border-white">
                  {/* Bunny Icon Mock */}
                  <div className="text-xs text-white">🐰</div>
                </div>
              </div>
              <p className="text-custom-deepnavy text-sm font-bold">새로운 대화 요청 확인 (3+)</p>
            </div>
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
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="max-w-[320px] rounded-[20px] p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="mb-2 text-center text-lg font-bold">매칭 초기화</DialogTitle>
            <DialogDescription className="text-center text-sm text-gray-500">
              현재까지의 추천을 초기화하고
              <br />
              새로운 동료를 찾아보시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={confirmReset}
              className="bg-custom-red hover:bg-custom-red/90 w-full rounded-xl py-6 text-base font-semibold text-white"
            >
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
