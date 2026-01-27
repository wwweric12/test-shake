import Image from 'next/image';
import Link from 'next/link';

import logoImg from '@/assets/icon/logo.png';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-white px-4">
      <Link href="/home" className="flex items-center gap-2">
        <Image src={logoImg} alt="logo" width={25} height={25} />
        <span className="title3 text-custom-deepnavy">HandShake</span>
      </Link>
    </header>
  );
}
