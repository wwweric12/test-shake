'use client';

import { Button } from '@/components/ui/Button';

import FolderIcons from './FolderIcons';

interface DstiIntroProps {
  onNext: () => void;
}

export default function DstiIntro({ onNext }: DstiIntroProps) {
  return (
    <div className="flex min-h-[calc(100vh-180px)] flex-col">
      <div className="flex-grow" />

      <div className="flex flex-col">
        {/* 1. 폴더 아이콘 영역 */}
        <FolderIcons />

        {/* 2. 메인 카드 */}
        <div className="border-custom-gray bg-custom-realwhite relative flex h-[240px] w-full flex-col items-center justify-center rounded-2xl border shadow-lg">
          <div className="absolute top-4 right-5 flex items-center gap-2">
            <div className="h-[2px] w-3 bg-gray-300" />
            <div className="h-3 w-3 border border-gray-300" />
            <div className="relative h-3 w-3">
              <div className="absolute top-1/2 left-0 h-[1px] w-full rotate-45 bg-gray-300" />
              <div className="absolute top-1/2 left-0 h-[1px] w-full -rotate-45 bg-gray-300" />
            </div>
          </div>

          <div className="text-center">
            <h2 className="large-title text-custom-realblack mb-1">나의 개발 성향,</h2>
            <h2 className="large-title">
              <span className="text-custom-blue">DSTI</span>
              <span className="text-custom-deepnavy">로 알아보기</span>
            </h2>
          </div>
        </div>

        {/* 3. 설명 문구 */}
        <div className="mt-9 space-y-1 text-center">
          <p className="body1 text-custom-deepnavy">서비스 지향성과 협업 스타일 등을 분석해,</p>
          <p className="body1 text-custom-deepnavy">당신과 딱 맞는 개발 동료를 연결해 드립니다.</p>
        </div>

        {/* 4. 버튼 */}
        <Button
          onClick={onNext}
          className="bg-custom-realblack hover:bg-custom-realblack subhead1 text-custom-realwhite mt-9 h-auto w-full rounded-[6px] py-4 shadow-md active:scale-[0.98]"
        >
          1분 만에 성향 확인하기
        </Button>
      </div>

      <div className="flex-grow" />
    </div>
  );
}
