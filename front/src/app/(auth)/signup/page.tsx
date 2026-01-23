'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import backIcon from '@/assets/icon/back.svg';
import { Progress } from '@/components/ui/Progress';
import Step1Profile from '@/features/auth/components/Step1Profile';
import Step2Networking from '@/features/auth/components/Step2Networking';
import Step3DSTI from '@/features/auth/components/Step3DSTI';
import { useFunnel } from '@/features/auth/hooks/useFunnel';
import { SignupRequestDTO } from '@/types/auth.dto';

export default function SignupPage() {
  const router = useRouter();
  const { Step, setStep, step } = useFunnel('step1');

  const [formData, setFormData] = useState<SignupRequestDTO>({
    nickname: '',
    profileImageUrl: 'https://cdn.yogiattacku.n-e.kr/profile/123.png',
    experience: true,
    career: '',
    dsti: '',
    positions: [],
    techSkills: [],
    networks: [],
    githubId: 'https://github.com/',
    selfIntro: '',
  });

  const updateFormData = (newData: Partial<SignupRequestDTO>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const stepToNumber = { step1: 1, step2: 2, step3: 3, step4: 4 };

  const stepTitles = {
    step1: '기본 프로필 정보',
    step2: '네트워킹 정보',
    step3: 'DSTI 성향 테스트',
    step4: '가입 완료',
  };

  return (
    /* 외부 배경: PC에서 보았을 때 중앙 정렬 */
    <div className="bg-custom-white flex min-h-screen w-full justify-center">
      {/* 모바일 컨테이너: width: 100%에 max-width: 420px */}
      <div className="bg-custom-white flex min-h-screen max-w-[420px] flex-col shadow-sm">
        {/* 헤더 영역 */}
        <header className="px-6 pt-6 pb-2">
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() =>
                step === 'step1' ? router.back() : setStep(step === 'step2' ? 'step1' : 'step2')
              }
              className="flex h-6 w-6 items-center justify-center transition-opacity hover:opacity-70"
            >
              <Image src={backIcon} alt="뒤로가기" />
            </button>
            <h1 className="body2">{stepTitles[step]}</h1>
            <div className="w-6" />
          </div>

          {/* 프로그레스 바 */}
          <div className="space-y-2">
            <Progress value={(stepToNumber[step] / 3) * 100} className="h-1" />
            <p className="text-custom-deepgray footnote text-right">{stepToNumber[step]} / 3</p>
          </div>
        </header>

        {/* 단계별 콘텐츠 영역 */}
        <main className="flex-1 overflow-y-auto px-5 pb-5">
          <Step name="step1">
            <Step1Profile
              data={formData}
              onNext={(data) => {
                updateFormData(data);
                setStep('step2');
              }}
            />
          </Step>

          <Step name="step2">
            <Step2Networking
              data={formData}
              onNext={(data) => {
                updateFormData(data);
                setStep('step3');
              }}
              onPrev={() => setStep('step1')}
            />
          </Step>

          <Step name="step3">
            <Step3DSTI
              onNext={() => {
                console.log('최종 데이터:', formData);
                alert('가입 완료!');
              }}
              onPrev={() => setStep('step2')}
            />
          </Step>
        </main>
      </div>
    </div>
  );
}
