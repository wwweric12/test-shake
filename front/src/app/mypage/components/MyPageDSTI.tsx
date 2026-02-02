import Link from 'next/link';

import { cn } from '@/lib/utils';

interface MyPageDSTIProps {
  dsti: string;
  className?: string;
}

export function MyPageDSTI({ dsti, className }: MyPageDSTIProps) {
  return (
    <div
      className={cn(
        'bg-custom-blue flex w-full items-center justify-between rounded-xl px-5 py-4 text-white shadow-sm',
        className,
      )}
    >
      <div className="flex w-full flex-col items-baseline">
        <span className="subhead1 opacity-80">나의 DSTI:</span>
        <div className="flex w-full items-center justify-between gap-2">
          <span className="title1">{dsti || '검사 필요'}</span>
          <Link
            href="/survey/dsti"
            className="body1 text-custom-blue rounded-lg bg-white px-3 py-2 shadow-sm transition-colors hover:bg-white/90"
          >
            검사 다시하기
          </Link>
        </div>
      </div>
    </div>
  );
}
