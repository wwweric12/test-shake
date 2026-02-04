'use client';

import { useState } from 'react';

import { SelectButton } from '@/app/(auth)/signup/components/Button';
import { CAREER_LABELS } from '@/constants/user';
import { useUpdateCareerMutation } from '@/services/user/hooks';
import { Career } from '@/types/user';

import { EditIcon } from './EditIcon';

interface MyPageCareerProps {
  career: Career;
}

export function MyPageCareer({ career }: MyPageCareerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempCareer, setTempCareer] = useState<Career>(career);
  const { mutate: updateCareer } = useUpdateCareerMutation();

  const careerOptions = Object.entries(CAREER_LABELS).map(([value, label]) => ({
    value: value as Career,
    label,
  }));

  const handleEditClick = () => {
    if (isEditing) {
      if (tempCareer) {
        updateCareer(
          { career: tempCareer },
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
        <label className="body1 text-custom-realblack">현재 상태</label>
        <EditIcon isEditing={isEditing} onClick={handleEditClick} />
      </div>
      {isEditing ? (
        <div className="flex flex-wrap gap-2">
          {careerOptions.map((item) => (
            <SelectButton
              key={item.value}
              label={item.label}
              isSelected={tempCareer === item.value}
              onClick={() => setTempCareer(item.value)}
            />
          ))}
        </div>
      ) : (
        <div className="flex gap-2">
          <SelectButton
            label={tempCareer ? CAREER_LABELS[tempCareer] : '선택 안 함'}
            isSelected={true}
          />
        </div>
      )}
    </section>
  );
}
