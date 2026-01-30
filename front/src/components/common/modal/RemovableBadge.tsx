import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

interface RemovableBadgeProps {
  label: string;
  onRemove: () => void;
  className?: string;
}

export function RemovableBadge({ label, onRemove, className }: RemovableBadgeProps) {
  return (
    <div
      className={cn(
        'subhead2 border-custom-blue bg-custom-blue text-custom-realwhite flex items-center gap-1 rounded-full border px-2.5 py-1',
        className,
      )}
    >
      <span>{label}</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="flex items-center justify-center hover:opacity-70"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
