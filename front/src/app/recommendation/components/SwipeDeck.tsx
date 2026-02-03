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
  const activeIndex = cards.length - 1;

  const cardRef = useRef<HTMLDivElement>(null);

  const startPosRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const lockDirectionRef = useRef<'SWIPE' | 'SCROLL' | null>(null);
  const currentProgressRef = useRef(0);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    const handleStart = (clientX: number, clientY: number) => {
      startPosRef.current = { x: clientX, y: clientY };
      isDraggingRef.current = true;
      lockDirectionRef.current = null; // 방향 초기화
      currentProgressRef.current = 0;
      element.style.transition = 'none'; // 드래그 중엔 애니메이션 끔
    };

    const updateOverlays = (element: HTMLElement, progress: number) => {
      // querySelector가 null일 수 있으므로 옵셔널 체이닝(?) 사용
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

    const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

    const resetCard = (element: HTMLElement) => {
      element.style.transition = 'transform 0.3s ease-out';
      element.style.transform = 'translate(0px, 0px) rotate(0deg)';
      updateOverlays(element, 0);
      setIsInteracting(false);
    };

    const finishSwipe = (element: HTMLElement) => {
      const progress = currentProgressRef.current;
      const isActionTriggered = Math.abs(progress) >= 0.5;
      const isGood = progress > 0;

      element.style.transition = 'transform 0.3s ease-in-out';

      if (isActionTriggered) {
        const endX = isGood ? window.innerWidth : -window.innerWidth;
        element.style.transform = `translate(${endX}px, 50px) rotate(${isGood ? 45 : -45}deg)`;

        setTimeout(() => {
          onSwipe(isGood ? 'right' : 'left', cards[activeIndex]);
          setIsInteracting(false);
        }, 300);
      } else {
        resetCard(element);
      }
    };

    // 2. 움직임 (핵심 로직: 스크롤 vs 스와이프 판별)
    const handleMove = (clientX: number, clientY: number, e: TouchEvent | MouseEvent) => {
      if (!isDraggingRef.current) return;
      if (lockDirectionRef.current === 'SCROLL') return; // 이미 스크롤로 판정났으면 JS 무시

      const dx = clientX - startPosRef.current.x;
      const dy = clientY - startPosRef.current.y;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      // (A) 방향이 아직 결정되지 않았을 때 (초기 움직임 10px 이내)
      if (!lockDirectionRef.current) {
        if (absX < 5 && absY < 5) return; // 너무 작은 움직임은 무시

        if (absY > absX) {
          // 세로 이동이 더 크면 -> 스크롤 모드 (네이티브 스크롤 허용)
          lockDirectionRef.current = 'SCROLL';
          return;
        } else {
          // 가로 이동이 더 크면 -> 스와이프 모드 (브라우저 동작 막고 카드 이동)
          lockDirectionRef.current = 'SWIPE';
          setIsInteracting(true);
        }
      }

      // (B) 스와이프 모드일 때 실행
      if (lockDirectionRef.current === 'SWIPE') {
        // iOS 뒤로가기/새로고침 방지 (중요!)
        if (e.cancelable && e.type === 'touchmove') {
          e.preventDefault();
        }

        const rotateDeg = (dx / 600) * -30;
        element.style.transform = `translate(${dx}px, ${dy * 0.2}px) rotate(${rotateDeg}deg)`;

        const progressVal = clamp(dx / 150, -1, 1);
        currentProgressRef.current = progressVal;

        // 오버레이 직접 업데이트 (성능 최적화)
        updateOverlays(element, progressVal);
      }
    };

    // 3. 종료 (손 뗌)
    const handleEnd = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;

      if (lockDirectionRef.current === 'SWIPE') {
        finishSwipe(element);
      } else {
        // 스크롤이었거나 클릭만 한 경우 원위치
        resetCard(element);
      }
      lockDirectionRef.current = null;
    };

    // --- 리스너 바인딩 함수들 ---

    const onTouchStart = (e: TouchEvent) => handleStart(e.touches[0].clientX, e.touches[0].clientY);
    const onTouchMove = (e: TouchEvent) =>
      handleMove(e.touches[0].clientX, e.touches[0].clientY, e);

    const onMouseDown = (e: MouseEvent) => handleStart(e.clientX, e.clientY);
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY, e);

    // [중요] non-passive 옵션으로 등록해야 preventDefault가 먹힘
    element.addEventListener('touchstart', onTouchStart, { passive: true });
    element.addEventListener('touchmove', onTouchMove, { passive: false }); // 핵심!
    element.addEventListener('touchend', handleEnd);
    element.addEventListener('touchcancel', handleEnd);

    // 마우스 이벤트 (테스트용)
    element.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove); // 마우스는 화면 밖으로 나갈 수 있어서 window에
    window.addEventListener('mouseup', handleEnd);

    return () => {
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchmove', onTouchMove);
      element.removeEventListener('touchend', handleEnd);
      element.removeEventListener('touchcancel', handleEnd);

      element.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', handleEnd);
    };
  }, [activeIndex, cards]); // 카드가 바뀌면 이벤트 리스너 재등록

  // --- 헬퍼 함수들 ---

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-4xl bg-gray-100">
      {cards.map((card, index) => {
        const isTop = index === cards.length - 1;

        return (
          <div
            key={card.nickname} // 고유 키 사용
            ref={isTop ? cardRef : null} // 맨 위 카드만 ref 연결
            className={`absolute top-0 left-0 h-full w-full rounded-2xl bg-white shadow-xl select-none ${
              isTop ? 'cursor-grab touch-pan-y' : 'pointer-events-none'
            } ${isInteracting && isTop ? 'cursor-grabbing' : ''}`}
            style={{
              zIndex: index,
              transform: !isTop
                ? `translateY(${(cards.length - 1 - index) * 10}px) scale(${1 - (cards.length - 1 - index) * 0.05})`
                : 'none',
              opacity: !isTop && cards.length - 1 - index > 2 ? 0 : 1,
              transition: isInteracting && isTop ? 'none' : 'transform 0.3s ease-out',
              // [중요] CSS로도 세로 스크롤 허용 명시
              touchAction: 'none',
            }}
          >
            {/* 오버레이 배지 */}
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

            {/* 내부 콘텐츠 (스크롤 가능) */}
            <div
              className="h-full w-full overflow-y-auto rounded-2xl"
              style={{ overscrollBehaviorY: 'contain' }} // 스크롤 끝날 때 부모 흔들림 방지
            >
              <SwipingCard card={card} />
            </div>

            {/* 색상 오버레이 */}
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
