'use client';

import { DSTI_QUESTIONS } from '@/constants/dsti';

import DstiWindow from './DstiWindow';
import FolderIcons from './FolderIcons';

interface DstiCardProps {
  index: number;
  onSelect: (val: string) => void;
}

export default function DstiCard({ index, onSelect }: DstiCardProps) {
  const current = DSTI_QUESTIONS[index];

  return (
    <div className="flex flex-col px-5">
      <FolderIcons />

      <DstiWindow>
        <div className="mb-10 pt-6">
          <h2 className="title2 text-custom-realblack text-center leading-snug whitespace-pre-line">
            {current.question}
          </h2>
        </div>

        <div className="flex w-full flex-col gap-3">
          {current.options.map((option, i) => (
            <button
              key={i}
              onClick={() => onSelect(option.value)}
              className="subhead1 bg-custom-purple text-custom-realwhite min-h-[60px] w-full rounded-xl border border-transparent px-4 py-3 text-center whitespace-pre-line shadow-sm transition-all active:scale-[0.98]"
            >
              {option.label}
            </button>
          ))}
        </div>
      </DstiWindow>
    </div>
  );
}
