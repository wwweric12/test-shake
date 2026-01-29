'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import backIcon from '@/assets/icon/back.svg';
import { Progress } from '@/components/ui/Progress';
import { DSTI_STEP_INFO } from '@/constants/dsti';
import { useFunnel } from '@/hooks/useFunnel';
import { cn } from '@/lib/utils';
import { useSubmitDstiMutation } from '@/services/user/hooks';

import DstiCard from './components/DstiCard';
import DstiIntro from './components/DstiIntro';
import DstiResult from './components/DstiResult';

type DstiStep = 'intro' | 'main' | 'result';

export default function DstiPage() {
  const router = useRouter();
  const { Step, setStep, step } = useFunnel<DstiStep>('intro');
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

  const [finalDsti, setFinalDsti] = useState<string>('');

  const { mutate: submitDsti, isPending } = useSubmitDstiMutation();

  const currentStepInfo = DSTI_STEP_INFO[step];

  const calculateScores = (allAnswers: string[]) => {
    const getCount = (start: number, end: number, target: string) =>
      allAnswers.slice(start, end + 1).filter((a) => a === target).length;

    return [getCount(0, 2, 'P'), getCount(3, 5, 'D'), getCount(6, 8, 'A'), getCount(9, 11, 'R')];
  };

  const handleSelect = (val: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIdx] = val;
    setAnswers(newAnswers);

    if (currentQuestionIdx < 11) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      // 12번째 답변까지 완료되면 서버 전송
      const resultScores = calculateScores(newAnswers);

      submitDsti(
        { result: resultScores },
        {
          onSuccess: (response) => {
            // 추후 API 명세에 맞춰서 수정하기
            setFinalDsti(response.dsti);
            setStep('result');
          },
          onError: () => {
            alert('결과 전송에 실패했습니다. 다시 시도해주세요.');
          },
        },
      );
    }
  };

  const handleBack = () => {
    if (step === 'main') {
      if (currentQuestionIdx === 0) setStep('intro');
      else setCurrentQuestionIdx((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col">
      <header className={cn('px-5 pt-6', step === 'intro' ? 'pb-6' : 'pb-0')}>
        <div className="mb-4 flex items-center justify-between">
          {step === 'main' ? (
            <button
              onClick={handleBack}
              className="flex h-6 w-6 items-center justify-center transition-opacity hover:opacity-70"
            >
              <Image src={backIcon} alt="뒤로가기" />
            </button>
          ) : (
            <div className="w-6" />
          )}

          <h1 className="body2 text-custom-realblack font-medium">{currentStepInfo.title}</h1>
          <div className="w-6" />
        </div>

        {step === 'main' && (
          <div className="space-y-2 pb-4">
            <Progress
              value={((currentQuestionIdx + 1) / 12) * 100}
              className="h-1"
              indicatorClassName="bg-custom-purple"
            />
            <p className="text-custom-deepgray footnote text-right">
              {currentQuestionIdx + 1} / 12
            </p>
          </div>
        )}
      </header>

      <main className={cn(step === 'result' ? 'px-5 pt-0' : 'px-5')}>
        <Step name="intro">
          <DstiIntro onNext={() => setStep('main')} />
        </Step>

        <Step name="main">
          {isPending ? (
            <div className="flex h-[60vh] flex-col items-center justify-center">
              <p className="body1 text-custom-purple animate-pulse font-medium">분석 중...</p>
            </div>
          ) : (
            <DstiCard index={currentQuestionIdx} onSelect={handleSelect} />
          )}
        </Step>

        <Step name="result">{finalDsti && <DstiResult resultType={finalDsti} />}</Step>
      </main>
    </div>
  );
}
