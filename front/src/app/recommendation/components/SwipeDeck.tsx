'use client';

import { useEffect, useRef, useState } from 'react';

import { UserInfo } from '@/types/user';
import { clamp } from '@/utils/math';

import SwipingCard from './SwipingCard';

interface SwipeDeckProps {
  cards: UserInfo[];
  onSwipe: (direction: 'left' | 'right', card: UserInfo) => void;
}

interface OverlayElements {
  likeBadge: HTMLElement | null;
  skipBadge: HTMLElement | null;
  likeOverlay: HTMLElement | null;
  skipOverlay: HTMLElement | null;
}

export default function SwipeDeck({ cards, onSwipe }: SwipeDeckProps) {
  const [isInteracting, setIsInteracting] = useState(false);
  const activeIndex = cards.length - 1;

  // 제스처 상태 관리 Ref (렌더링 방지)
  const startPosRef = useRef({ x: 0, y: 0 });
  const interactionStateRef = useRef<'IDLE' | 'SWIPING' | 'SCROLLING'>('IDLE');
  const isDraggingRef = useRef(false); // 실제로 드래그(클릭) 중인가? (hover 방지)
  const currentProgressRef = useRef(0);

  const overlaysRef = useRef<OverlayElements>({
    likeBadge: null,
    skipBadge: null,
    likeOverlay: null,
    skipOverlay: null,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // 1. 초기화
    startPosRef.current = { x: e.clientX, y: e.clientY };
    isDraggingRef.current = true; // 드래그 시작
    interactionStateRef.current = 'IDLE';
    currentProgressRef.current = 0;

    const element = e.currentTarget;
    element.style.transition = 'none';

    overlaysRef.current = {
      likeBadge: element.querySelector('[data-badge="like"]') as HTMLElement,
      skipBadge: element.querySelector('[data-badge="skip"]') as HTMLElement,
      likeOverlay: element.querySelector('[data-overlay="like"]') as HTMLElement,
      skipOverlay: element.querySelector('[data-overlay="skip"]') as HTMLElement,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || interactionStateRef.current === 'SCROLLING') return;

    const element = e.currentTarget;
    const dx = e.clientX - startPosRef.current.x;
    const dy = e.clientY - startPosRef.current.y;

    if (interactionStateRef.current === 'IDLE') {
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if (absX < 10 && absY < 10) return;

      if (absY > absX) {
        interactionStateRef.current = 'SCROLLING';
        return;
      } else {
        interactionStateRef.current = 'SWIPING';
        setIsInteracting(true);
        element.setPointerCapture(e.pointerId);
      }
    }

    if (interactionStateRef.current === 'SWIPING') {
      e.preventDefault();

      const rotateDeg = (dx / 600) * -30;
      element.style.transform = `translate(${dx}px, ${dy * 0.2}px) rotate(${rotateDeg}deg)`;

      const progressVal = clamp(dx / 150, -1, 1);
      currentProgressRef.current = progressVal;

      updateOverlays(progressVal);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false; // 1. 드래그 종료 (모든 경로에서 공통)
    const element = e.currentTarget;

    // 캡처 해제
    if (element.hasPointerCapture(e.pointerId)) {
      element.releasePointerCapture(e.pointerId);
    }

    // 스크롤 중이었다면 그냥 리셋하고 종료
    if (interactionStateRef.current === 'SCROLLING') {
      interactionStateRef.current = 'IDLE';
      return;
    }

    if (interactionStateRef.current !== 'SWIPING') {
      // 클릭만 하고 끝난 경우 등
      resetCard(element);
      return;
    }

    // 스와이프 결과 처리
    const progress = currentProgressRef.current;
    const isActionTriggered = Math.abs(progress) >= 0.5;
    const isGood = progress > 0;

    element.style.transition = 'transform 0.3s ease-in-out';

    if (isActionTriggered) {
      const endX = isGood ? window.innerWidth : -window.innerWidth;
      element.style.transform = `translate(${endX}px, 50px) rotate(${isGood ? 45 : -45}deg)`;

      timerRef.current = setTimeout(() => {
        onSwipe(isGood ? 'right' : 'left', cards[activeIndex]);

        // 상태 초기화
        setIsInteracting(false);
        interactionStateRef.current = 'IDLE';
        startPosRef.current = { x: 0, y: 0 };
        // overlaysRef는 다음 터치 때 덮어씌워지므로 초기화 안 해도 됨
      }, 300);
    } else {
      resetCard(element);
    }
  };

  // 카드 위치 및 오버레이 초기화 헬퍼 함수
  const resetCard = (element: HTMLElement) => {
    element.style.transform = 'translate(0px, 0px) rotate(0deg)';
    updateOverlays(0);
    setIsInteracting(false);
    interactionStateRef.current = 'IDLE';
    isDraggingRef.current = false; // 드래그 종료
    startPosRef.current = { x: 0, y: 0 };
  };

  // 오버레이 업데이트 헬퍼 함수
  const updateOverlays = (progress: number) => {
    const { likeBadge, skipBadge, likeOverlay, skipOverlay } = overlaysRef.current;

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

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-4xl">
      {cards.map((card, index) => {
        const isTop = index === cards.length - 1;

        return (
          <div
            key={card.nickname}
            className={`absolute top-0 left-0 h-full w-full select-none ${
              isTop ? 'cursor-grab' : 'pointer-events-none'
            } ${isInteracting && isTop ? 'cursor-grabbing' : ''}`}
            style={{
              zIndex: index,
              transform: !isTop
                ? `translateY(${(cards.length - 1 - index) * 10}px) scale(${1 - (cards.length - 1 - index) * 0.05})`
                : 'none',
              opacity: !isTop && cards.length - 1 - index > 2 ? 0 : 1,
              transition: isInteracting && isTop ? 'none' : 'transform 0.3s ease-out',
              touchAction: 'none',
              userSelect: 'none',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
            }}
            onDragStart={(e) => e.preventDefault()}
            onPointerDown={isTop ? handlePointerDown : undefined}
            onPointerMove={isTop ? handlePointerMove : undefined}
            onPointerUp={isTop ? handlePointerUp : undefined}
            onPointerCancel={isTop ? handlePointerUp : undefined}
            onPointerLeave={isTop ? handlePointerUp : undefined}
          >
            {/* 오버레이 렌더링 (기존과 동일) */}
            {isTop && (
              <>
                <div
                  data-badge="like"
                  className="pointer-events-none absolute top-10 left-10 z-50 rounded-lg border-4 border-green-500 bg-white/20 p-2 px-4 shadow-lg backdrop-blur-sm transition-opacity duration-200"
                  style={{ opacity: 0, transform: 'rotate(-12deg)' }}
                >
                  <span className="text-4xl font-bold text-green-500">LIKE</span>
                </div>
                <div
                  data-badge="skip"
                  className="pointer-events-none absolute top-10 right-10 z-50 rounded-lg border-4 border-red-500 bg-white/20 p-2 px-4 shadow-lg backdrop-blur-sm transition-opacity duration-200"
                  style={{ opacity: 0, transform: 'rotate(12deg)' }}
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
                  className="pointer-events-none absolute inset-0 z-40 rounded-[30px] bg-green-500 transition-opacity duration-200"
                  style={{ opacity: 0 }}
                />
                <div
                  data-overlay="skip"
                  className="pointer-events-none absolute inset-0 z-40 rounded-[30px] bg-red-500 transition-opacity duration-200"
                  style={{ opacity: 0 }}
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
