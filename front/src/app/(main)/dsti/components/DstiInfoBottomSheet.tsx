'use client';

import { useEffect } from 'react';

import DstiContent from '@/app/(main)/dsti/components/DstiContent';
import DstiTraitItem from '@/app/(main)/dsti/components/DstiTraitItem';
import { DSTI_INDICATORS, DSTI_INFO } from '@/constants/dsti';

interface DstiInfoBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DstiInfoBottomSheet({ isOpen, onClose }: DstiInfoBottomSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/40 transition-opacity" onClick={onClose} />
      <div className="animate-in slide-in-from-bottom fixed bottom-0 left-1/2 z-[70] w-full max-w-[440px] -translate-x-1/2 transform rounded-t-[32px] bg-slate-50 p-6 shadow-2xl transition-transform duration-300">
        <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-slate-300" />

        <div className="mb-4 flex items-center justify-between">
          <h3 className="body1 text-custom-realblack">DSTI 지표 정의</h3>
          <button onClick={onClose} className="subhead2 text-custom-deepgray">
            닫기
          </button>
        </div>

        <div className="custom-scrollbar max-h-[60vh] overflow-y-auto pb-6">
          {DSTI_INDICATORS.map((indicator, index) => (
            <DstiContent
              key={indicator.title}
              id={String(index + 1).padStart(2, '0')}
              title={indicator.title}
              label={indicator.label}
            >
              {indicator.types.map((type) => (
                <DstiTraitItem key={type} type={type} {...DSTI_INFO[type]} />
              ))}
            </DstiContent>
          ))}
        </div>
      </div>
    </>
  );
}
