'use client';

import FullFolderIcon from '@/assets/icon/full-folder.svg';

interface DstiCardProps {
  index: number;
  onSelect: (value: string) => void;
}

interface QuestionOption {
  label: string;
  value: string;
}

interface QuestionData {
  question: string;
  options: QuestionOption[];
}

const MOCK_QUESTIONS: QuestionData[] = Array(12).fill({
  question: '프로젝트 도중 예상치 못한\n버그가 발생했을 때 당신은?',
  options: [
    { label: '원인을 끝까지 파악해야 직성이 풀린다.', value: 'D' },
    { label: '일단 빠르게 우회하는 방법을 찾는다.', value: 'B' },
  ],
});

export default function DstiCard({ index, onSelect }: DstiCardProps) {
  const current = MOCK_QUESTIONS[index];

  return (
    <div className="flex flex-col items-center pt-10">
      {/* 카드 상단 폴더 아이콘 */}
      <div
        className="bg-custom-blue z-10 mb-[-24px] h-12 w-12"
        style={{
          mask: `url(${FullFolderIcon.src}) no-repeat center / contain`,
          WebkitMask: `url(${FullFolderIcon.src}) no-repeat center / contain`,
        }}
      />

      {/* 질문 카드 (Dialog 스타일) */}
      <div className="border-custom-gray mb-10 flex min-h-[200px] w-full items-center justify-center rounded-2xl border bg-white p-6 text-center shadow-sm">
        <p className="subhead1 text-custom-realblack whitespace-pre-wrap">{current.question}</p>
      </div>

      {/* 선택지 */}
      <div className="flex w-full flex-col gap-4">
        {current.options.map((option, i) => (
          <button
            key={i}
            onClick={() => onSelect(option.value)}
            className="border-custom-gray body1 text-custom-realblack hover:border-custom-blue hover:text-custom-blue w-full rounded-xl border bg-white py-5 transition-all active:scale-[0.98]"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
