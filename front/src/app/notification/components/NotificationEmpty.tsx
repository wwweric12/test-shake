"use client";

import { BellOff } from 'lucide-react';

export default function NotificationEmpty() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-20">

      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
        <BellOff className="h-8 w-8 text-slate-300" />
      </div>

      <div className="flex flex-col items-center gap-1 text-center">
        <p className="body1 text-custom-realblack">도착한 요청이 없어요</p>
        <p className="footnote text-slate-400">
          새로운 커피챗이나 협업 요청이 오면<br />
          여기에 표시될 거예요.
        </p>
      </div>
    </div>
  );
}