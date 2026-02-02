'use client';

import { usePathname } from 'next/navigation';

import BottomNavigation from './BottomNavigation';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showBottomNav = ['/home', '/chat', '/mypage'].some((route) => pathname.startsWith(route));

  return (
    <>
      {children}
      {showBottomNav && <BottomNavigation />}
    </>
  );
}
