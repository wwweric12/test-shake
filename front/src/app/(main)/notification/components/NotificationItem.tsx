"use client";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { DSTI_CHARACTERS } from '@/constants/dsti';
import { NotificationData } from '@/types/notification';

interface NotificationItemProps {
  notification: NotificationData;
  onAccept: (targetUserId: number) => void;
  onReject: (targetUserId: number) => void;
  isPending: boolean;
}

export default function NotificationItem({ 
  notification, 
  onAccept, 
  onReject,
  isPending
}: NotificationItemProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  const [imgSrc, setImgSrc] = useState(
    notification.targetImageUrl || 
    DSTI_CHARACTERS[notification.dsti]
  );

  return (
    <div className="flex flex-col rounded-[12px] border border-gray-100 bg-white shadow-sm overflow-hidden">
      
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gray-100">
            <Image
              src={imgSrc}
              alt={notification.targetNickname}
              fill
              className={`object-cover transition-opacity duration-300 ${
                isImageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoadingComplete={() => setIsImageLoaded(true)}
              onError={() => setImgSrc(DSTI_CHARACTERS[notification.dsti])}
            />
          </div>
          
          <div className="flex flex-col">
            <p className="body1 font-bold text-custom-realblack leading-tight">
                {notification.targetNickname}
              <span className="footnote inline-block ml-1 text-gray-500">님이</span>
            </p>
            <p className="footnote text-gray-500">
              채팅 요청을 보냈어요
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-2">
          <button
            type="button"
            disabled={isPending}
            onClick={() => onReject(notification.targetUserId)}
            className="rounded-full border border-gray-100 px-3 py-1 text-[13px] text-gray-500 active:bg-gray-50 disabled:opacity-50"
          >
            거절
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => onAccept(notification.targetUserId)}
            className="rounded-full bg-custom-deeppurple px-3 py-1 text-[13px] text-white active:opacity-80 disabled:opacity-50"
          >
            수락
          </button>
        </div>
      </div>

      <Link 
          href={`/user/info/${notification.targetUserId}`}
           className="flex items-center justify-center border-t border-gray-50 bg-gray-50/30 py-2">
        <p className="footnote font-semibold text-custom-deeppurple hover:underline whitespace-nowrap">
          프로필 보러가기
        </p>
      </Link>
      </div>
  );
}