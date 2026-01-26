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
import { userApi } from '@/services/user/api';
import { Career, UserProfile } from '@/types/user';

export default function SignupPage() {
  const router = useRouter();
  const { Step, setStep, step } = useFunnel('step1');

  const [formData, setFormData] = useState<UserProfile>({
    nickname: '',
    profileImageUrl: 'https://cdn.yogiattacku.n-e.kr/profile/123.png',
    experience: null as unknown as boolean,
    career: '' as Career,
    dsti: 'NONE',
    positions: [],
    techSkills: [],
    networks: [],
    githubId: '',
    selfIntro: '',
  });

  const updateFormData = (newData: Partial<UserProfile>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handleFinalSubmit = async (dstiResult: string) => {
    try {
      const finalData = { ...formData, dsti: dstiResult };

      const { nickname, dsti, ...infoRequestData } = finalData;

      await userApi.registerUserProfile(infoRequestData);

      alert('가입이 완료되었습니다!');
      router.push('/home');
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입 처리 중 오류가 발생했습니다.');
    }
  };

  const stepToNumber = { step1: 1, step2: 2, step3: 3, step4: 4 };

  const stepTitles = {
    step1: '기본 프로필 정보',
    step2: '네트워킹 정보',
    step3: 'DSTI 성향 테스트',
    step4: '가입 완료',
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* 헤더 영역 */}
      <header className="py-6">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => {
              if (step === 'step1') router.back();
              else if (step === 'step2') setStep('step1');
              else if (step === 'step3') setStep('step2');
            }}
            className="flex h-6 w-6 items-center justify-center transition-opacity hover:opacity-70"
          >
            <Image src={backIcon} alt="뒤로가기" />
          </button>
          <h1 className="body2 text-custom-realblack">{stepTitles[step]}</h1>
          <div className="w-6" />
        </div>

        {/* 프로그레스 바 */}
        <div className="space-y-2">
          <Progress value={(stepToNumber[step] / 3) * 100} className="h-1" />
          <p className="text-custom-deepgray footnote text-right">{stepToNumber[step]} / 3</p>
        </div>
      </header>

      {/* 단계별 콘텐츠 영역 */}
      <main className="flex-1 overflow-y-auto pb-10">
        <Step name="step1">
          <Step1Profile
            data={formData}
            onUpdate={updateFormData}
            onNext={(data) => {
              updateFormData(data);
              setStep('step2');
            }}
          />
        </Step>

        <Step name="step2">
          <Step2Networking
            data={formData}
            onNext={(data: Partial<UserProfile>) => {
              updateFormData(data);
              setStep('step3');
            }}
            onPrev={() => setStep('step1')}
          />
        </Step>

        <Step name="step3">
          <Step3DSTI onNext={handleFinalSubmit} onPrev={() => setStep('step2')} />
        </Step>
      </main>
    </div>
  );
}
