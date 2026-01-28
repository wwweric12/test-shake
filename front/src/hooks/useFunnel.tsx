import { useState } from 'react';

export function useFunnel<T extends string>(defaultStep: T) {
  const [step, setStep] = useState<T>(defaultStep);

  const Step = ({ name, children }: { name: T; children: React.ReactNode }) => {
    return step === name ? <>{children}</> : null;
  };

  return { step, setStep, Step };
}
