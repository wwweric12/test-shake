import { cn } from '@/lib/utils';

interface SelectButtonProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}

export function SelectButton({ label, isSelected, onClick, className }: SelectButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'subhead2 rounded-full border px-2.5 py-1 transition-colors',
        isSelected
          ? 'border-custom-blue bg-custom-blue text-custom-realwhite'
          : 'border-darkgray bg-custom-realwhite text-custom-darkgray',
        className,
      )}
    >
      {label}
    </button>
  );
}
