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

  const hasCards = cards.length > 0;
  const activeIndex = cards.length - 1;
  const activeCard = hasCards ? cards[activeIndex] : null;

  const cardRef = useRef<HTMLDivElement>(null);

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
      const isActionTriggered = Math.abs(progress) >= 0.5;
      const isGood = progress > 0;

      element.style.transition = 'transform 0.3s ease-in-out';

      if (isActionTriggered) {
        const endX = isGood ? window.innerWidth : -window.innerWidth;
        element.style.transform = `translate(${endX}px, 50px) rotate(${isGood ? 45 : -45}deg)`;

        setTimeout(() => {
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
        if (e.cancelable && e.type === 'touchmove') {
          e.preventDefault();
        }

        const rotateDeg = (dx / 600) * -30;
        element.style.transform = `translate(${dx}px, ${dy * 0.2}px) rotate(${rotateDeg}deg)`;

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

    element.addEventListener('touchstart', onTouchStart, { passive: true });
    element.addEventListener('touchmove', onTouchMove, { passive: false });
    element.addEventListener('touchend', handleEnd);
    element.addEventListener('touchcancel', handleEnd);

    element.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
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
  }, [activeCard]);

  if (!hasCards) {
    return (
      <div className="flex h-full w-full items-center justify-center text-gray-400">
        카드가 없습니다.
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-4xl">
      {cards.map((card, index) => {
        const isTop = index === cards.length - 1;

        return (
          <div
            key={card.nickname}
            ref={isTop ? cardRef : null}
            className={`absolute top-0 left-0 h-full w-full touch-pan-y rounded-2xl bg-white shadow-xl select-none ${
              isTop ? 'cursor-grab' : 'pointer-events-none'
            } ${isInteracting && isTop ? 'cursor-grabbing' : ''}`}
            style={{
              zIndex: index,
              transform: !isTop
                ? `translateY(${(cards.length - 1 - index) * 10}px) scale(${1 - (cards.length - 1 - index) * 0.05})`
                : 'none',
              opacity: !isTop && cards.length - 1 - index > 2 ? 0 : 1,
              transition: isInteracting && isTop ? 'none' : 'transform 0.3s ease-out',
            }}
          >
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
