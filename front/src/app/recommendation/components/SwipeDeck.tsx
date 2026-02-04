'use client';

import { useEffect, useRef, useState } from 'react';

import { UserInfo } from '@/types/user';

import SwipingCard from './SwipingCard';

interface SwipeDeckProps {
  cards: UserInfo[];
  onSwipe: (direction: 'left' | 'right', card: UserInfo) => void;
}

export default function SwipeDeck({ cards, onSwipe }: SwipeDeckProps) {
  const [isInteracting, setIsInteracting] = useState(false);

  // 방어 코드: 카드가 없을 때 처리
  const hasCards = cards.length > 0;
  const activeIndex = cards.length - 1;
  const activeCard = hasCards ? cards[activeIndex] : null;

  const cardRef = useRef<HTMLDivElement>(null);

  // [개선 2] onSwipe가 바뀌어도 useEffect가 재실행되지 않도록 Ref로 관리
  const onSwipeRef = useRef(onSwipe);
  useEffect(() => {
    onSwipeRef.current = onSwipe;
  }, [onSwipe]);

  const startPosRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const lockDirectionRef = useRef<'SWIPE' | 'SCROLL' | null>(null);
  const currentProgressRef = useRef(0);

  useEffect(() => {
    const element = cardRef.current;
    if (!element || !activeCard) return;

    // 유틸리티 함수: querySelector 최적화를 위해 변수 캐싱 고려 가능하나, 현재 수준도 무방
    const updateOverlays = (progress: number) => {
      const likeBadge = element.querySelector('[data-badge="like"]') as HTMLElement;
      const skipBadge = element.querySelector('[data-badge="skip"]') as HTMLElement;
      const likeOverlay = element.querySelector('[data-overlay="like"]') as HTMLElement;
      const skipOverlay = element.querySelector('[data-overlay="skip"]') as HTMLElement;

      if (progress > 0) {
        if (likeBadge) likeBadge.style.opacity = progress.toString();
        if (skipBadge) skipBadge.style.opacity = '0';
        if (likeOverlay) likeOverlay.style.opacity = (progress * 0.4).toString();
        if (skipOverlay) skipOverlay.style.opacity = '0';
      } else {
        if (likeBadge) likeBadge.style.opacity = '0';
        if (skipBadge) skipBadge.style.opacity = Math.abs(progress).toString();
        if (likeOverlay) likeOverlay.style.opacity = '0';
        if (skipOverlay) skipOverlay.style.opacity = (Math.abs(progress) * 0.4).toString();
      }
    };

    const handleStart = (clientX: number, clientY: number) => {
      startPosRef.current = { x: clientX, y: clientY };
      isDraggingRef.current = true;
      lockDirectionRef.current = null;
      currentProgressRef.current = 0;
      element.style.transition = 'none';
    };

    const resetCard = () => {
      element.style.transition = 'transform 0.3s ease-out';
      element.style.transform = 'translate(0px, 0px) rotate(0deg)';
      updateOverlays(0);
      setIsInteracting(false);
    };

    const finishSwipe = () => {
      const progress = currentProgressRef.current;
      const isActionTriggered = Math.abs(progress) >= 0.5; // 50% 이상 이동 시 트리거
      const isGood = progress > 0;

      element.style.transition = 'transform 0.3s ease-in-out';

      if (isActionTriggered) {
        const endX = isGood ? window.innerWidth : -window.innerWidth;
        // 약간의 회전과 y축 이동을 더해 자연스럽게 날아가는 느낌
        element.style.transform = `translate(${endX}px, 50px) rotate(${isGood ? 45 : -45}deg)`;

        // 애니메이션 시간 후 상태 업데이트
        setTimeout(() => {
          // [개선 2] Ref를 통해 최신 onSwipe 함수 호출
          onSwipeRef.current(isGood ? 'right' : 'left', activeCard);
          setIsInteracting(false);
        }, 300);
      } else {
        resetCard();
      }
    };

    const handleMove = (clientX: number, clientY: number, e: TouchEvent | MouseEvent) => {
      if (!isDraggingRef.current) return;
      if (lockDirectionRef.current === 'SCROLL') return;

      const dx = clientX - startPosRef.current.x;
      const dy = clientY - startPosRef.current.y;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if (!lockDirectionRef.current) {
        // [UX 튜닝] 민감도 조절: 5px -> 10px로 약간 둔감하게 하여 오작동 방지
        if (absX < 10 && absY < 10) return;

        if (absY > absX) {
          lockDirectionRef.current = 'SCROLL';
          return;
        } else {
          lockDirectionRef.current = 'SWIPE';
          setIsInteracting(true);
        }
      }

      if (lockDirectionRef.current === 'SWIPE') {
        // [중요] passive: false 옵션이 있더라도, 여기서 preventDefault는 신중해야 함.
        // CSS touch-action: pan-y를 사용하면 이 부분 의존도를 낮출 수 있음.
        if (e.cancelable && e.type === 'touchmove') {
          e.preventDefault();
        }

        const rotateDeg = (dx / 600) * -30; // 회전 각도 계산
        element.style.transform = `translate(${dx}px, ${dy * 0.2}px) rotate(${rotateDeg}deg)`;

        // clamp 함수 인라인화 or 외부 분리
        const progressVal = Math.min(Math.max(dx / 150, -1), 1);
        currentProgressRef.current = progressVal;
        updateOverlays(progressVal);
      }
    };

    const handleEnd = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;

      if (lockDirectionRef.current === 'SWIPE') {
        finishSwipe();
      } else {
        resetCard();
      }
      lockDirectionRef.current = null;
    };

    const onTouchStart = (e: TouchEvent) => handleStart(e.touches[0].clientX, e.touches[0].clientY);
    const onTouchMove = (e: TouchEvent) =>
      handleMove(e.touches[0].clientX, e.touches[0].clientY, e);
    const onMouseDown = (e: MouseEvent) => handleStart(e.clientX, e.clientY);
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY, e);

    // 이벤트 등록
    element.addEventListener('touchstart', onTouchStart, { passive: true });
    element.addEventListener('touchmove', onTouchMove, { passive: false }); // iOS 스크롤 방지 필수
    element.addEventListener('touchend', handleEnd);
    element.addEventListener('touchcancel', handleEnd);

    element.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', handleEnd);

    return () => {
      // 이벤트 해제
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchmove', onTouchMove);
      element.removeEventListener('touchend', handleEnd);
      element.removeEventListener('touchcancel', handleEnd);

      element.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', handleEnd);
    };
  }, [activeCard]); // [개선 2] onSwipe를 의존성에서 제거하여 불필요한 재등록 방지

  if (!hasCards) {
    return (
      <div className="flex h-full w-full items-center justify-center text-gray-400">
        카드가 없습니다.
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-4xl bg-gray-100">
      {cards.map((card, index) => {
        const isTop = index === cards.length - 1;

        return (
          <div
            key={card.nickname || index} // 고유 키가 없다면 index 사용 주의
            ref={isTop ? cardRef : null}
            // [개선 1] touch-action: pan-y 추가 (가로 스와이프 시 브라우저 개입 차단)
            className={`absolute top-0 left-0 h-full w-full touch-pan-y rounded-2xl bg-white shadow-xl select-none ${
              isTop ? 'cursor-grab' : 'pointer-events-none'
            } ${isInteracting && isTop ? 'cursor-grabbing' : ''}`}
            style={{
              zIndex: index,
              // 스택 효과 로직 유지
              transform: !isTop
                ? `translateY(${(cards.length - 1 - index) * 10}px) scale(${1 - (cards.length - 1 - index) * 0.05})`
                : 'none',
              // 뒤에 있는 카드는 3번째부터 숨김 처리 (성능 최적화)
              opacity: !isTop && cards.length - 1 - index > 2 ? 0 : 1,
              transition: isInteracting && isTop ? 'none' : 'transform 0.3s ease-out',
            }}
          >
            {/* ... 오버레이 및 뱃지 코드 유지 ... */}
            {isTop && (
              <>
                <div
                  data-badge="like"
                  className="absolute top-10 left-10 z-50 rounded-lg border-4 border-green-500 p-2 opacity-0 transition-opacity"
                  style={{ transform: 'rotate(-12deg)' }}
                >
                  <span className="text-4xl font-bold text-green-500">LIKE</span>
                </div>
                <div
                  data-badge="skip"
                  className="absolute top-10 right-10 z-50 rounded-lg border-4 border-red-500 p-2 opacity-0 transition-opacity"
                  style={{ transform: 'rotate(12deg)' }}
                >
                  <span className="text-4xl font-bold text-red-500">SKIP</span>
                </div>
              </>
            )}

            <div className="pointer-events-auto h-full w-full">
              <SwipingCard card={card} />
            </div>

            {isTop && (
              <>
                <div
                  data-overlay="like"
                  className="pointer-events-none absolute inset-0 z-40 rounded-2xl bg-green-500 opacity-0"
                />
                <div
                  data-overlay="skip"
                  className="pointer-events-none absolute inset-0 z-40 rounded-2xl bg-red-500 opacity-0"
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
