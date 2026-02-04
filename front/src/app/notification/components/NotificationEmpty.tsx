"use client";

import Image from 'next/image';

import BellOff from '@/assets/icon/tray.svg';

export default function NotificationEmpty() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-20">

      <div className="mb-4 flex h-30 w-30 items-center justify-center rounded-full bg-slate-50">
        <Image src={BellOff} alt="Empty Notification" className="h-30 w-30 text-slate-300" />
      </div>

      <div className="flex flex-col items-center gap-1 text-center">
        <p className="body2 text-custom-darkgray">새로운 알림이 없습니다.</p>
        <p className="footnote text-slate-400">
          새로운 알림 요청이 오면<br />
          여기에 표시될 거예요.
        </p>
      </div>
    </div>
  );
}