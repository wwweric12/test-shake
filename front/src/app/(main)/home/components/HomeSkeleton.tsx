import Image from 'next/image';
import { Bell } from 'lucide-react';

import logoImg from '@/assets/icon/logo.png';

export default function HomeSkeleton() {
  return (
    <>
      {/* Header Skeleton (Static Lookalike) */}
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-white px-4">
        <div className="flex items-center gap-2">
          <Image src={logoImg} alt="logo" width={25} height={25} priority />
          <span className="title3 text-custom-deepnavy">HandShake</span>
        </div>
        <div className="relative">
          <Bell className="text-custom-deepnavy h-6 w-6" />
        </div>
      </header>

      <main className="bg-custom-white flex min-h-[calc(100vh-60px)] animate-pulse flex-col px-5 pt-6 pb-24">
        {/* Title Skeleton - title1 (24px * 1.5 = 36px) */}
        <div>
          <div className="mb-4 h-9 w-40 rounded bg-slate-200"></div>
        </div>

        {/* ProfileCard Skeleton */}
        <div className="mb-4 flex gap-2">
          {/* Left Card - Height matches Right Card via Flex stretch */}
          <div className="flex min-w-[128px] flex-col items-center justify-center rounded-[10px] bg-white py-[18px] shadow-sm">
            <div className="mb-3 h-[70px] w-[70px] rounded-full bg-slate-200"></div>
            {/* title1 (36px) */}
            <div className="h-9 w-12 rounded bg-slate-200"></div>
            {/* subhead1 (15px * 1.5 = 22.5px) approx 23px */}
            <div className="h-[23px] w-24 rounded bg-slate-200"></div>
          </div>

          {/* Right Card */}
          <div className="flex w-full flex-col gap-2">
            {/* Top Info Section - Exactly 4 items to match DSTI char count */}
            <div className="flex flex-1 flex-col justify-between rounded-[10px] bg-white px-5 py-4 shadow-sm">
              <div className="flex flex-col gap-1.5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex flex-col items-start">
                    {/* footout pill (19.5 + 2 padding = 21.5px) */}
                    <div className="mb-0.5 h-[21.5px] w-12 rounded-[30px] bg-slate-200"></div>
                    {/* footout text (19.5px) */}
                    <div className="h-[19.5px] w-full rounded bg-slate-200"></div>
                  </div>
                ))}
              </div>
            </div>
            {/* Button Section - py-2 (8+8) + footout (19.5) = 35.5px */}
            <div className="h-[35.5px] w-full rounded-[10px] bg-slate-200 shadow-sm"></div>
          </div>
        </div>

        {/* MatchingCard Wrapper matching HomeContent structure */}
        <div className="flex flex-1 flex-col">
          {/* MatchingCard Skeleton - Expands to fill available space */}
          <div className="flex w-full flex-1 flex-col items-center justify-center rounded-[10px] bg-slate-200 p-4 shadow-sm">
            <div className="mb-2 h-9 w-9 rounded bg-white/50"></div>
            <div className="flex w-full flex-col items-center gap-2">
              {/* title1 (36px) */}
              <div className="h-9 w-32 rounded bg-white/50"></div>
              {/* body1 (17px * 1.5 = 25.5px) */}
              <div className="h-[26px] w-48 rounded bg-white/50"></div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
