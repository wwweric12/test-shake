import Image from 'next/image';
import Link from 'next/link';

import handshake from '@/assets/icon/handshake.svg';

interface MatchingCardProps {
  remainingSwipes: number;
  dailyLimit: number;
}

export default function MatchingCard({ remainingSwipes, dailyLimit }: MatchingCardProps) {
  const isAvailable = remainingSwipes > 0;

  return (
    <Link href="/recommendation" className="block w-full">
      <div
        className={`flex w-full flex-col items-center justify-center rounded-[10px] p-4 text-white shadow-sm ${
          isAvailable
            ? 'bg-[linear-gradient(90deg,#CEE2FF_0%,#B4A6FF_62%,#879EFE_100%)] shadow-indigo-200'
            : 'bg-custom-darkgray cursor-not-allowed'
        }`}
      >
        <Image src={handshake} alt="handshake" width={36} height={36} className="mb-2" />

        <div className="text-custom-white flex h-full flex-col items-center gap-2">
          <h3 className="title1">{isAvailable ? '매칭 시작하기' : '내일 다시 매칭'}</h3>
          <p className="body1">
            오늘 남은 기회 {remainingSwipes} / {dailyLimit}
          </p>
        </div>
      </div>
    </Link>
  );
}
