'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { QUERY_KEYS } from '@/constants/queryKeys';
import {
  useAcceptNotificationMutation,
  useNotifications,
  useRejectNotificationMutation,
} from '@/services/notification/hooks';

import NotificationHeader from './components/NotificationHeader';
import NotificationList from './components/NotificationList';

import { useQueryClient } from '@tanstack/react-query';

export default function NotificationPage() {
  const router = useRouter();
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useNotifications();

  const { mutateAsync: acceptNotification, isPending: isAccepting } =
    useAcceptNotificationMutation();
  const { mutate: rejectNotification, isPending: isRejecting } = useRejectNotificationMutation();

  const observerTarget = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    // 알림 페이지 진입 시 홈 요약 정보(알림 뱃지 등) 갱신
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HOME.SUMMARY() });
  }, [queryClient]);

  useEffect(() => {
    if (!observerTarget.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 },
    );

    observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <main className="bg-custom-white flex h-dvh flex-col overflow-hidden">
        <NotificationHeader />
        <p className="mt-4 text-center text-gray-500">요청 목록을 불러오는 중...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="bg-custom-white flex h-dvh flex-col overflow-hidden">
        <NotificationHeader />
        <p className="mt-4 text-center text-red-500">요청 목록을 불러오지 못했어요.</p>
      </main>
    );
  }

  const allNotifications =
    data?.pages.flatMap((page) => page.data.notificationResponse.content) || [];

  const notifications = Array.from(
    new Map(allNotifications.map((item) => [item.targetUserId, item])).values(),
  );

  const handleAccept = async (targetUserId: number) => {
    try {
      await acceptNotification({ targetUserId });
      router.push(`/chat`);
    } catch (error) {
      console.error('수락 실패:', error);
      alert('요청 수락에 실패했습니다.');
    }
  };

  return (
    <main className="bg-custom-white flex h-dvh flex-col overflow-hidden">
      <NotificationHeader />
      <div className="custom-scrollbar flex-1 overflow-y-auto px-5 py-4">
        <NotificationList
          notifications={notifications}
          onAccept={(targetUserId) => handleAccept(targetUserId)}
          onReject={(targetUserId) => rejectNotification({ targetUserId })}
          isPending={isAccepting || isRejecting}
        />
        <div ref={observerTarget} className="flex h-10 w-full items-center justify-center">
          {isFetchingNextPage && (
            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0.2s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0.4s]" />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
