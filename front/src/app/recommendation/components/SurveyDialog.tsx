'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';

interface SurveyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (isSatisfied: boolean, metaInfoType?: string) => void;
}

export function SurveyDialog({ open, onOpenChange, onSubmit }: SurveyDialogProps) {
  const [surveyStep, setSurveyStep] = useState<'SATISFACTION' | 'META_INFO'>('SATISFACTION');

  // 설문 제출 시 호출할 래퍼 함수
  const handleSurveySubmit = (isSatisfied: boolean, metaInfoType?: string) => {
    onSubmit(isSatisfied, metaInfoType);

    setTimeout(() => {
      setSurveyStep('SATISFACTION');
    }, 300);
  };

  const metaOptions = [
    { label: '보유 기술', value: 'tech_skills' },
    { label: '네트워킹 목적', value: 'networks' },
    { label: '직무', value: 'positions' },
    { label: '개발 성향(DSTI)', value: 'dsti' },
  ];

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) return;
        onOpenChange(isOpen);
      }}
      modal={true}
    >
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="w-[90%] max-w-[355px] rounded-[30px] border-none p-8 shadow-2xl [&>button]:hidden"
      >
        {surveyStep === 'SATISFACTION' ? (
          <div className="flex flex-col items-center">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-custom-realblack title3 text-center">
                매칭이 만족스러우신가요?
              </DialogTitle>
              <DialogDescription className="text-custom-deepgray subhead3 pt-2 text-center">
                더 나은 추천을 위해 의견을 들려주세요.
              </DialogDescription>
            </DialogHeader>
            <div className="flex w-full gap-3">
              <Button
                variant="outline"
                className="border-custom-purple text-custom-purple subhead1 hover:bg-custom-purple/5 flex-1 rounded-2xl py-6"
                onClick={() => setSurveyStep('META_INFO')}
              >
                아쉬워요
              </Button>
              <Button
                className="bg-custom-purple hover:bg-custom-purple subhead1 flex-1 rounded-2xl py-6"
                onClick={() => handleSurveySubmit(true)}
              >
                좋아요!
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <DialogHeader className="mb-6">
              <DialogTitle className="title3 text-center">어떤 정보가 더 필요하신가요?</DialogTitle>
            </DialogHeader>
            <div className="grid w-full grid-cols-2 gap-3">
              {metaOptions.map((option) => (
                <Button
                  key={option.value}
                  variant="secondary"
                  className="text-custom-realblack body3 rounded-xl bg-gray-100 py-6 hover:bg-gray-200"
                  onClick={() => handleSurveySubmit(false, option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
