'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { DSTI_INFO, DSTI_TITLES } from '@/constants/dsti';

interface DstiResultProps {
  resultType: string;
}

export default function DstiResult({ resultType }: DstiResultProps) {
  const router = useRouter();

  const chars = resultType.split('');

  return (
    <div className="flex flex-col items-center pt-6 pb-10">
      <div className="mb-10 text-center">
        <p className="subhead1 text-custom-blue mb-2">당신은 {DSTI_TITLES[resultType]}</p>
        <h2 className="display1 text-custom-realblack">
          <span className="text-custom-purple">{resultType}</span> 입니다
        </h2>
      </div>

      <div className="grid w-full grid-cols-1 gap-4">
        {chars.map((char, i) => {
          const info = DSTI_INFO[char];
          if (!info) return null;
          return (
            <div
              key={i}
              className="border-custom-gray flex w-full flex-col items-start rounded-2xl border bg-white p-5 shadow-sm"
            >
              <span className="caption1 text-custom-blue mb-1 font-bold">{info.label}</span>
              <p className="body1 text-custom-deepnavy font-medium">{info.desc}</p>
            </div>
          );
        })}
      </div>

      <Button
        onClick={() => router.push('/home')}
        className="bg-custom-realblack hover:bg-custom-realblack subhead1 text-custom-realwhite mt-12 h-auto w-full rounded-[6px] py-4 shadow-md active:scale-[0.98]"
      >
        동료 찾으러 가기
      </Button>
    </div>
  );
}
