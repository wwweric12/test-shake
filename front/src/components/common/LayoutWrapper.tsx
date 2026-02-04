'use client';

import { usePathname, useSearchParams } from 'next/navigation';

import BottomNavigation from './BottomNavigation';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isChatRoom = pathname.startsWith('/chat') && searchParams.get('room');
  const showBottomNav =
    ['/home', '/chat', '/mypage'].some((route) => pathname.startsWith(route)) && !isChatRoom;

  return (
    <>
      {children}
      {showBottomNav && <BottomNavigation />}
    </>
  );
}
