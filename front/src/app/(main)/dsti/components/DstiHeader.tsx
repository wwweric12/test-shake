'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import backIcon from '@/assets/icon/back.svg';

export default function DstiHeader() {
  const router = useRouter();
  const handleBack = () => {
    router.push('/home');
  };

  return (
    <header className="fixed top-0 left-1/2 z-50 flex h-[60px] w-full max-w-[440px] -translate-x-1/2 items-center justify-between bg-white px-5 shadow-sm">
      <button
        onClick={handleBack}
        className="flex h-6 w-6 items-center justify-center transition-opacity hover:opacity-70"
      >
        <Image src={backIcon} alt="Back" />
      </button>
      <h1 className="body2 text-custom-realblack">DSTI 유형 상세</h1>
      <div className="w-6" />
    </header>
  );
}
