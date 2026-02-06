import Image from 'next/image';
import Link from 'next/link';
import { Bell } from 'lucide-react';

import logoImg from '@/assets/icon/logo.png';
import { useHomeSummary } from '@/services/home/hooks';

export default function Header() {
  const { data: summaryData } = useHomeSummary();
  const hasUnread = (summaryData?.totalLikeCount ?? 0) > 0;

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-white px-4">
      <Link href="/home" className="flex items-center gap-2">
        <Image src={logoImg} alt="logo" width={25} height={25} />
        <span className="title3 text-custom-deepnavy">HandShake</span>
      </Link>
      <Link href="/notification" className="relative">
        <Bell className="text-custom-deepnavy h-6 w-6" />
        {hasUnread && (
          <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
        )}
      </Link>
    </header>
  );
}
