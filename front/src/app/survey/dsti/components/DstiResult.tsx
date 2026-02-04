'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { DSTI_CHARACTERS, DSTI_INFO, DSTI_TITLES } from '@/constants/dsti';

interface DstiResultProps {
  resultType: string;
}

export default function DstiResult({ resultType }: DstiResultProps) {
  const router = useRouter();
  const chars = resultType.split('');

  const characterImg = DSTI_CHARACTERS[resultType];

  return (
    <div className="flex min-h-[calc(100vh-100px)] flex-col items-center">
      <div className="max-h-[40px] flex-grow" />

      <div className="flex w-full flex-col items-center pb-10">
        <div className="mb-2 text-center">
          <h1 className="large-title text-custom-realblack tracking-tight">{resultType}</h1>
          <p className="title1 text-custom-purple">{DSTI_TITLES[resultType]}</p>
        </div>

        <div className="border-custom-purple bg-custom-deepgray/5 relative mb-4 flex h-37.5 w-37.5 items-center justify-center overflow-hidden rounded-full border-2">
          <Image src={characterImg} alt={resultType} fill className="object-contain" priority />
        </div>

        <div className="grid w-full grid-cols-2 gap-1.5">
          {chars.map((char, i) => {
            const info = DSTI_INFO[char];
            if (!info) return null;

            return (
              <div
                key={i}
                className="border-custom-gray flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm"
              >
                <div className="bg-custom-navy py-2 text-center">
                  <span className="body1 text-custom-realwhite">{info.label}</span>
                </div>

                <div className="flex flex-col p-1.5 text-center">
                  <p className="text-custom-realblack mb-1 text-[14px] leading-tight font-bold whitespace-pre-line">
                    {info.copy}
                  </p>
                  <p className="text-custom-deepnavy footout leading-normal break-keep opacity-80">
                    {info.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <Button
          onClick={() => router.push('/home')}
          className="bg-custom-realblack hover:bg-custom-realblack subhead1 text-custom-realwhite mt-10 h-auto w-full rounded-xl py-4 shadow-md active:scale-[0.98]"
        >
          동료 찾으러 가기
        </Button>
      </div>

      <div className="flex-grow" />
    </div>
  );
}
