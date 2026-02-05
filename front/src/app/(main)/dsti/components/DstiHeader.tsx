'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import backIcon from '@/assets/icon/back.svg';

export default function DstiHeader() {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  return (
    <header className="sticky top-0 z-50 flex h-[60px] items-center justify-between bg-white px-5 shadow-sm">
      <button
        onClick={handleBack}
        className="flex h-6 w-6 items-center justify-center transition-opacity hover:opacity-70"
      >
        <Image src={backIcon} alt="Back" />
      </button>
      <h1 className="body2 text-custom-realblack">DSTI 상세 정보</h1>
      <div className="w-6" />
    </header>
  );
}
