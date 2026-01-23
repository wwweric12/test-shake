import { useState } from 'react';

export type SignupStep = 'step1' | 'step2' | 'step3' | 'step4';

export function useFunnel(defaultStep: SignupStep) {
  const [step, setStep] = useState<SignupStep>(defaultStep);

  const Step = ({ name, children }: { name: SignupStep; children: React.ReactNode }) => {
    return step === name ? <>{children}</> : null;
  };

  return { step, setStep, Step };
}
