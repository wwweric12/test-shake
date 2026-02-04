"use client";

import { useEffect, useRef } from 'react';

import { 
  useAcceptNotificationMutation, 
  useNotifications, 
  useRejectNotificationMutation 
} from '@/services/notification/hooks';

import NotificationHeader from './components/NotificationHeader';
import NotificationList from './components/NotificationList';

export default function NotificationPage() {
  const { data, 
    isLoading, 
    isError, 
    refetch, 
    fetchNextPage, 
    hasNextPage, 
      isFetchingNextPage
  } = useNotifications();
  
    const { mutate: acceptNotification, isPending: isAccepting } = useAcceptNotificationMutation();
    const { mutate: rejectNotification, isPending: isRejecting } = useRejectNotificationMutation();
    
    const observerTarget = useRef<HTMLDivElement>(null);

    useEffect(() => {
    if (!observerTarget.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(observerTarget.current);
    return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
    
  useEffect(() => {
    const handleFocus = () => refetch();
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [refetch]);

  if (isLoading) {
    return (
      <main className="bg-custom-white flex h-dvh flex-col overflow-hidden">
        <NotificationHeader />
        <p className="text-gray-500 mt-4">요청 목록을 불러오는 중...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="bg-custom-white flex h-dvh flex-col overflow-hidden">
        <NotificationHeader />
        <p className="text-red-500 mt-4">요청 목록을 불러오지 못했어요.</p>
      </main>
    );
  }

    const allNotifications = data?.pages.flatMap(page => page.data.notificationResponse.content) || [];

    const notifications = Array.from(
  new Map(allNotifications.map((item) => [item.targetUserId, item])).values()
    );
    
  return (
    <main className="bg-custom-white flex h-dvh flex-col overflow-hidden">
          <NotificationHeader />
          <div className="flex-1 overflow-y-auto px-5 py-4">
      <NotificationList 
        notifications={notifications}
        onAccept={(targetUserId) => acceptNotification({ targetUserId })}
              onReject={(targetUserId) => rejectNotification({ targetUserId })}
                isPending={isAccepting || isRejecting}
              />
<div ref={observerTarget} className="h-10 w-full flex items-center justify-center">
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