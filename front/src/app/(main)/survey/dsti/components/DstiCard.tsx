'use client';

import { DSTI_QUESTIONS } from '@/constants/dsti';
import { cn } from '@/lib/utils';

import DstiWindow from './DstiWindow';
import FolderIcons from './FolderIcons';

interface DstiCardProps {
  index: number;
  onSelect: (val: string) => void;
}

export default function DstiCard({ index, onSelect }: DstiCardProps) {
  const current = DSTI_QUESTIONS[index];

  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col">
      <div className="flex-grow" />

      <div className="flex flex-col">
        <FolderIcons />

        <DstiWindow>
          <div className="mb-6 flex h-28 items-center justify-center pt-2">
            <h2 className="title1 text-custom-realblack text-center leading-snug whitespace-pre-line">
              {current.question}
            </h2>
          </div>

          <div className="flex w-full flex-col gap-3">
            {current.options.map((option, i) => {
              const isFirst = i === 0;

              return (
                <button
                  key={i}
                  onClick={() => onSelect(option.value)}
                  className={cn(
                    'body1 flex h-16 w-full items-center justify-center rounded-xl border px-4 py-2 text-center whitespace-pre-line shadow-sm transition-all active:scale-[0.98]',
                    isFirst
                      ? 'border-custom-purple bg-custom-realwhite text-custom-purple'
                      : 'bg-custom-purple text-custom-realwhite border-transparent',
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </DstiWindow>
      </div>

      <div className="flex-grow" />
    </div>
  );
}
