'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useUnreadCount } from '@/services/chat/hooks';

import IconChat from '../icons/IconChat';
import IconHouse from '../icons/IconHouse';
import IconUser from '../icons/IconUser';
import { Badge } from '../ui/Badge';

export default function BottomNavigation() {
  const pathname = usePathname();
  const { data: totalUnreadCount = 0 } = useUnreadCount();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="pb-safe fixed bottom-0 left-1/2 z-50 flex h-20 w-full max-w-[440px] -translate-x-1/2 items-center justify-around border-t bg-white">
      <div className="h-[61px] w-[64px]">
        <Link
          href="/chat"
          className={`flex flex-col items-center gap-1 p-2 ${
            isActive('/chat') ? 'text-custom-purple' : 'text-gray-400'
          }`}
        >
          <div className="relative">
            <IconChat className={isActive('/chat') ? 'text-custom-purple' : 'text-gray-400'} />
            {totalUnreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                <Badge className="bg-custom-red flex h-5 min-w-5 items-center justify-center px-1 text-white">
                  {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
                </Badge>
              </span>
            )}
          </div>
          <span className="caption2">채팅</span>
        </Link>
      </div>
      <div className="h-[61px] w-[64px]">
        <Link
          href="/home"
          className={`flex flex-col items-center gap-1 p-2 ${
            isActive('/home') ? 'text-custom-purple' : 'text-gray-400'
          }`}
        >
          <IconHouse className={isActive('/home') ? 'text-custom-purple' : 'text-gray-400'} />
          <span className="caption2">홈</span>
        </Link>
      </div>

      <div className="h-[61px] w-[64px]">
        <Link
          href="/mypage"
          className={`flex flex-col items-center gap-1 p-2 ${
            isActive('/mypage') ? 'text-custom-purple' : 'text-gray-400'
          }`}
        >
          <IconUser className={isActive('/mypage') ? 'text-custom-purple' : 'text-gray-400'} />
          <span className="caption2">마이페이지</span>
        </Link>
      </div>
    </nav>
  );
}
