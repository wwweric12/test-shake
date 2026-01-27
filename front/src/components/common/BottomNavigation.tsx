'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import IconChat from '../icons/IconChat';
import IconHouse from '../icons/IconHouse';
import IconUser from '../icons/IconUser';

export default function BottomNavigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="pb-safe fixed bottom-0 left-1/2 z-50 flex h-16 w-full max-w-[440px] -translate-x-1/2 items-center justify-around border-t bg-white">
      <Link
        href="/chat"
        className={`flex flex-col items-center gap-1 p-2 ${
          isActive('/chat') ? 'text-custom-purple' : 'text-gray-400'
        }`}
      >
        <div className="relative">
          <IconChat className={isActive('/chat') ? 'text-custom-purple' : 'text-gray-400'} />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            99
          </span>
        </div>
        <span className="caption2">채팅</span>
      </Link>

      <Link
        href="/home"
        className={`flex flex-col items-center gap-1 p-2 ${
          isActive('/home') ? 'text-custom-purple' : 'text-gray-400'
        }`}
      >
        <IconHouse className={isActive('/home') ? 'text-custom-purple' : 'text-gray-400'} />
        <span className="caption2">홈</span>
      </Link>

      <Link
        href="/mypage"
        className={`flex flex-col items-center gap-1 p-2 ${
          isActive('/mypage') ? 'text-custom-purple' : 'text-gray-400'
        }`}
      >
        <IconUser className={isActive('/mypage') ? 'text-custom-purple' : 'text-gray-400'} />
        <span className="caption2">마이페이지</span>
      </Link>
    </nav>
  );
}
