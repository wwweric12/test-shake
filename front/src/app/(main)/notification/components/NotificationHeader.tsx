"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import backIcon from '@/assets/icon/back.svg';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useNotifications } from '@/services/notification/hooks';

import { useQueryClient } from '@tanstack/react-query';

export default function NotificationHeader() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const { data } = useNotifications();
  const unreadCount = data?.pages?.[0]?.data.unreadCount ?? 0;

  const handleBack = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATION.LIST() });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HOME.SUMMARY() });
    router.back();
  };

  return (
    <header className="flex h-[60px] shrink-0 items-center bg-gray--50 px-4 border-b border-gray-100/50">
      
      <button 
        onClick={handleBack} 
        className="mr-2 p-1 active:opacity-50 transition-opacity"
        aria-label="뒤로 가기"
      >
        <Image src={backIcon} alt="Back" width={7} height={14} />
      </button>

      <div className="flex items-center gap-2">
        <h1 className="title2">알림</h1>
        
        {unreadCount > 0 && (
          <div className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-custom-red px-1.5 shadow-sm">
            <span className="text-[13px] font-bold text-white leading-none">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}