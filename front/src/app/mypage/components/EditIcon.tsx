'use client';

import Image from 'next/image';

import PencilIcon from '@/assets/icon/write.svg';

interface EditIconProps {
  isEditing: boolean;
  onClick: () => void;
}

export function EditIcon({ isEditing, onClick }: EditIconProps) {
  return (
    <button
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()}
      className="flex h-[32px] items-center justify-center rounded-full px-2 transition-colors hover:bg-gray-100"
      type="button"
    >
      {isEditing ? (
        <span className="subhead3 text-custom-blue px-1 font-semibold whitespace-nowrap">완료</span>
      ) : (
        <Image src={PencilIcon} alt="Edit" width={14} height={14} />
      )}
    </button>
  );
}
