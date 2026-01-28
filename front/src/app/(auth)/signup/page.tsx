'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import backIcon from '@/assets/icon/back.svg';
import { Progress } from '@/components/ui/Progress';
import { INITIAL_SIGNUP_DATA, SIGNUP_MESSAGES, STEP_INFO } from '@/constants/auth';
import { useRegisterUserProfileMutation } from '@/services/user/hooks';
import { UserProfile } from '@/types/user';

import { useFunnel } from '../../../hooks/useFunnel';

import Step1Profile from './components/Step1Profile';
import Step2Networking from './components/Step2Networking';

type SignupStep = 'step1' | 'step2';

export default function SignupPage() {
  const router = useRouter();
  const { Step, setStep, step } = useFunnel<SignupStep>('step1');
  const [formData, setFormData] = useState<UserProfile>(INITIAL_SIGNUP_DATA);

  const { mutate: registerUser } = useRegisterUserProfileMutation();

  const updateFormData = (newData: Partial<UserProfile>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handleBack = () => {
    if (step === 'step1') router.back();
    else if (step === 'step2') setStep('step1');
  };

  const handleInfoSubmit = () => {
    const { dsti, ...infoRequestData } = formData;

    registerUser(infoRequestData, {
      onSuccess: () => {
        router.push('/survey/dsti');
      },
      onError: (error: Error) => {
        const errorMsg = error.message || SIGNUP_MESSAGES.DEFAULT_SUBMIT;
        alert(errorMsg);
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
          <Progress value={(currentStepInfo.index / 2) * 100} className="h-1" />
          <p className="text-custom-deepgray footnote text-right">{currentStepInfo.index} / 2</p>
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
            onNext={handleInfoSubmit}
            onPrev={() => setStep('step1')}
          />
        </Step>
      </main>
    </div>
  );
}
