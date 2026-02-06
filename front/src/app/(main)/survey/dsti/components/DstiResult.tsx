'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import DstiInfoBottomSheet from '@/app/(main)/dsti/components/DstiInfoBottomSheet';
import infoIcon from '@/assets/icon/Info.svg';
import { Button } from '@/components/ui/Button';
import { DSTI_CHARACTERS, DSTI_INFO, DSTI_TITLES } from '@/constants/dsti';

interface DstiResultProps {
  resultType: string;
  isReadOnly?: boolean;
}

export default function DstiResult({ resultType, isReadOnly = false }: DstiResultProps) {
  const router = useRouter();
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const chars = resultType.split('');
  const characterImg = DSTI_CHARACTERS[resultType];

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full flex-col items-center pb-10">
        <div className="mb-2 text-center">
          <div className="relative flex items-center justify-center">
            <h1 className="large-title text-custom-realblack tracking-tight">{resultType}</h1>
            <button
              onClick={() => setIsInfoOpen(true)}
              className="absolute left-[calc(50%+60px)] flex h-5 w-5 items-center justify-center rounded-full transition-colors hover:bg-slate-100 active:scale-90"
            >
              <Image src={infoIcon} alt="정보" />
            </button>
          </div>
          <p className="title1 text-custom-purple">{DSTI_TITLES[resultType]}</p>
        </div>

        <div className="border-custom-purple relative mb-4 flex h-37.5 w-37.5 items-center justify-center overflow-hidden rounded-full border-2 bg-slate-200">
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

        {!isReadOnly && (
          <Button
            onClick={() => router.push('/home')}
            className="bg-custom-realblack hover:bg-custom-realblack subhead1 text-custom-realwhite mt-10 h-auto w-full rounded-xl py-4 shadow-md active:scale-[0.98]"
          >
            동료 찾으러 가기
          </Button>
        )}
      </div>

      {/* 바텀 시트 형태의 정보 모달 */}
      <DstiInfoBottomSheet isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </div>
  );
}
