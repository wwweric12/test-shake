'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { DSTI_INFO, DSTI_TITLES } from '@/constants/dsti';
import { cn } from '@/lib/utils';

interface DstiResultProps {
  resultType: string; // 예: "PDAR"
}

export default function DstiResult({ resultType }: DstiResultProps) {
  const router = useRouter();
  const chars = resultType.split(''); // ['P', 'D', 'A', 'R']

  return (
    <div className="flex flex-col items-center px-5 pt-12 pb-10">
      {/* 1. 상단 타이틀 영역 */}
      <div className="mb-8 text-center">
        <h1 className="display1 text-custom-realblack mb-2 font-bold tracking-tight">
          {resultType}
        </h1>
        <p className="title2 text-custom-purple font-semibold">
          {DSTI_TITLES[resultType] || '혁신적인 개발자'}
        </p>
      </div>

      {/* 2. 메인 캐릭터 이미지 */}
      <div className="relative mb-10 h-[260px] w-[260px]">
        <Image
          src={`/images/characters/${resultType}.png`}
          alt={resultType}
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* 3. 2x2 결과 분석 카드 그리드 */}
      <div className="grid w-full grid-cols-2 gap-3">
        {chars.map((char, i) => {
          const info = DSTI_INFO[char];
          if (!info) return null;

          return (
            <div
              key={i}
              className="border-custom-gray flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm"
            >
              {/* 카드 헤더 (라벨) */}
              <div className="bg-[#5C667B] py-2 text-center">
                <span className="caption1 font-bold text-white">{info.label}</span>
              </div>

              {/* 카드 바디 */}
              <div className="flex min-h-[160px] flex-col p-4">
                {/* 메인 카피 */}
                <p className="caption1 text-custom-realblack mb-2 leading-tight font-bold whitespace-pre-line">
                  {info.copy}
                </p>

                {/* 상세 설명 (작은 글씨) */}
                <p className="text-custom-deepnavy mb-3 text-[10px] leading-normal break-keep opacity-80">
                  {info.desc}
                </p>

                {/* 태그 영역 (map 활용) */}
                <div className="mt-auto flex flex-wrap gap-1">
                  {info.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-custom-purple bg-custom-purple/5 border-custom-purple/10 rounded-md border px-1.5 py-0.5 text-[9px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. 하단 액션 버튼 */}
      <Button
        onClick={() => router.push('/home')}
        className="bg-custom-realblack hover:bg-custom-realblack subhead1 text-custom-realwhite mt-10 h-auto w-full rounded-xl py-4 shadow-md active:scale-[0.98]"
      >
        동료 찾으러 가기
      </Button>
    </div>
  );
}
