'use client';

import { useState } from 'react';

import { RemovableBadge } from '@/components/common/modal/RemovableBadge';
import SelectionModal from '@/components/common/modal/SelectionModal';
import { TECH_SKILLS } from '@/constants/auth';
import { useUpdateTechSkillsMutation } from '@/services/user/hooks';

interface MyPageTechSkillsProps {
  techSkills: number[];
}

export function MyPageTechSkills({ techSkills }: MyPageTechSkillsProps) {
  const [localTechSkills, setLocalTechSkills] = useState<number[]>(techSkills);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: updateTechSkills } = useUpdateTechSkillsMutation();

  const removeItem = (id: number) => {
    if (localTechSkills.length <= 1) return;
    const newSkills = localTechSkills.filter((i) => i !== id);
    setLocalTechSkills(newSkills);
    updateTechSkills({ techSkills: newSkills });
  };

  const handleModalSave = (ids: number[]) => {
    setLocalTechSkills(ids);
    setIsModalOpen(false);
    updateTechSkills({ techSkills: ids });
  };

  const techSkillList = Object.entries(TECH_SKILLS).map(([id, val]) => ({
    id: Number(id),
    label: val.label,
  }));

  return (
    <section className="w-full">
      <label className="body1 text-custom-realblack mb-1 block">보유 기술</label>
      <p className="footnote text-custom-deepgray mb-3">최대 5개를 선택할 수 있습니다.</p>

      {/* Selected Badges */}
      <div className={`flex flex-wrap gap-2 ${localTechSkills.length > 0 ? 'mb-3' : ''}`}>
        {localTechSkills.map((skillId) => (
          <RemovableBadge
            key={skillId}
            label={TECH_SKILLS[skillId as keyof typeof TECH_SKILLS]?.label || ''}
            onRemove={() => removeItem(skillId)}
          />
        ))}
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="body2 text-custom-blue border-custom-blue bg-custom-realwhite flex w-full items-center justify-center gap-2 rounded-[10px] border px-2.5 py-3 active:bg-blue-50"
      >
        <span className="text-lg">+</span> 스킬 추가
      </button>

      <SelectionModal
        key={isModalOpen ? 'open' : 'closed'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="스킬 추가"
        items={techSkillList}
        selectedIds={localTechSkills}
        onSave={handleModalSave}
        maxCount={5}
        showSearch={true}
      />
    </section>
  );
}
