import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface DstiWindowProps {
  children: ReactNode;
  className?: string;
}

export default function DstiWindow({ children, className }: DstiWindowProps) {
  return (
    <div
      className={cn(
        'border-custom-gray bg-custom-realwhite relative flex w-full flex-col rounded-2xl border shadow-lg outline-none',
        className,
      )}
    >
      <div className="flex w-full items-center justify-end px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="h-[2px] w-3 bg-gray-300" />
          <div className="h-3 w-3 border border-gray-300" />
          <div className="relative h-3 w-3">
            <div className="absolute top-1/2 left-0 h-[1px] w-full rotate-45 bg-gray-300" />
            <div className="absolute top-1/2 left-0 h-[1px] w-full -rotate-45 bg-gray-300" />
          </div>
        </div>
      </div>

      <div className="flex flex-col px-6 pb-10">{children}</div>
    </div>
  );
}
