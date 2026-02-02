'use client';

import { useState } from 'react';

import { SelectButton } from '@/app/(auth)/signup/components/Button';
import { useUpdateExperienceMutation } from '@/services/user/hooks';

import { EditIcon } from './EditIcon';

const EXPERIENCE_LIST = [
  { label: '경험 있음', value: true },
  { label: '경험 없음', value: false },
] as const;

interface MyPageExperienceProps {
  experience: boolean | null;
}

export function MyPageExperience({ experience }: MyPageExperienceProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempExperience, setTempExperience] = useState<boolean | null>(experience);
  const { mutate: updateExperience } = useUpdateExperienceMutation();

  const handleEditClick = () => {
    if (isEditing) {
      if (tempExperience !== null) {
        updateExperience(
          { experience: tempExperience },
          {
            onSuccess: () => setIsEditing(false),
          },
        );
      } else {
        setIsEditing(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  return (
    <section>
      <div className="mb-2 flex items-center gap-1">
        <label className="body1 text-custom-realblack">실무 개발 경험</label>
        <EditIcon isEditing={isEditing} onClick={handleEditClick} />
      </div>
      {isEditing ? (
        <div className="flex gap-2">
          {EXPERIENCE_LIST.map((item) => (
            <SelectButton
              key={String(item.value)}
              label={item.label}
              isSelected={tempExperience === item.value}
              onClick={() => setTempExperience(item.value)}
            />
          ))}
        </div>
      ) : (
        <div className="flex gap-2">
          <SelectButton
            key={String(tempExperience)}
            label={tempExperience ? '경험 있음' : '경험 없음'}
            isSelected={true}
          />
        </div>
      )}
    </section>
  );
}
