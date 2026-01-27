'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import backIcon from '@/assets/icon/back.svg';
import { Progress } from '@/components/ui/Progress';
import { useRegisterUserProfileMutation } from '@/services/user/hooks';
import { UserProfile } from '@/types/user';

import Step1Profile from './components/Step1Profile';
import Step2Networking from './components/Step2Networking';
import Step3DSTI from './components/Step3DSTI';
import { useFunnel } from './hooks/useFunnel';
import { INITIAL_SIGNUP_DATA, STEP_INFO } from './constants';

export default function SignupPage() {
  const router = useRouter();
  const { Step, setStep, step } = useFunnel('step1');
  const [formData, setFormData] = useState<UserProfile>(INITIAL_SIGNUP_DATA);

  const { mutate: registerUser } = useRegisterUserProfileMutation();

  const updateFormData = (newData: Partial<UserProfile>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handleBack = () => {
    if (step === 'step1') router.back();
    else if (step === 'step2') setStep('step1');
    else if (step === 'step3') setStep('step2');
  };

  const handleFinalSubmit = (dstiResult: string) => {
    const finalData = { ...formData, dsti: dstiResult };
    const { nickname, dsti, ...infoRequestData } = finalData;

    registerUser(infoRequestData, {
      onSuccess: () => {
        alert('가입이 완료되었습니다!');
        router.push('/home');
      },
      onError: (error) => {
        console.error('회원가입 실패:', error);
        alert('회원가입 처리 중 오류가 발생했습니다.');
      },
    });
  };

  const currentStepInfo = STEP_INFO[step as keyof typeof STEP_INFO];

  return (
    <div className="flex flex-col">
      <header className="px-5 py-6">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex h-6 w-6 items-center justify-center transition-opacity hover:opacity-70"
          >
            <Image src={backIcon} alt="뒤로가기" />
          </button>
          <h1 className="body2 text-custom-realblack">{currentStepInfo.title}</h1>
          <div className="w-6" />
        </div>

        <div className="space-y-2">
          <Progress value={(currentStepInfo.index / 3) * 100} className="h-1" />
          <p className="text-custom-deepgray footnote text-right">{currentStepInfo.index} / 3</p>
        </div>
      </header>

      <main className="px-5">
        <Step name="step1">
          <Step1Profile
            data={formData}
            onUpdate={updateFormData}
            onNext={() => {
              setStep('step2');
            }}
          />
        </Step>

        <Step name="step2">
          <Step2Networking
            data={formData}
            onUpdate={updateFormData}
            onNext={() => {
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
