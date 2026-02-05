'use client';

import { useState } from 'react';

import { RemovableBadge } from '@/components/common/modal/RemovableBadge';
import SelectionModal from '@/components/common/modal/SelectionModal';
import { POSITIONS } from '@/constants/auth';
import { useUpdatePositionsMutation } from '@/services/user/hooks';

interface MyPagePositionsProps {
  positions: number[];
}

export function MyPagePositions({ positions }: MyPagePositionsProps) {
  const [localPositions, setLocalPositions] = useState<number[]>(positions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: updatePositions } = useUpdatePositionsMutation();

  const removeItem = (id: number) => {
    if (localPositions.length <= 1) return;
    const newPositions = localPositions.filter((i) => i !== id);
    setLocalPositions(newPositions);
    updatePositions({ positions: newPositions });
  };

  const handleModalSave = (ids: number[]) => {
    setLocalPositions(ids);
    setIsModalOpen(false);
    updatePositions({ positions: ids });
  };

  const positionList = Object.entries(POSITIONS).map(([id, val]) => ({
    id: Number(id),
    label: val.label,
  }));

  return (
    <section className="w-full">
      <label className="body1 text-custom-realblack block">직무</label>
      <p className="footnote text-custom-deepgray mb-2">최대 3개를 선택할 수 있습니다.</p>

      <div className={`flex flex-wrap gap-2 ${localPositions.length > 0 ? 'mb-3' : ''}`}>
        {localPositions.map((posId) => (
          <RemovableBadge
            key={posId}
            label={POSITIONS[posId].label}
            onRemove={() => removeItem(posId)}
          />
        ))}
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="body2 text-custom-blue border-custom-blue bg-custom-realwhite flex w-full items-center justify-center gap-2 rounded-[10px] border px-2.5 py-3 active:bg-blue-50"
      >
        <span className="text-lg">+</span> 직무 추가
      </button>

      <SelectionModal
        key={isModalOpen ? 'open' : 'closed'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="직무 추가"
        items={positionList}
        selectedIds={localPositions}
        onSave={handleModalSave}
        maxCount={3}
        className="h-auto"
      />
    </section>
  );
}
