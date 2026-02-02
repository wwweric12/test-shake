'use client';

import { useState } from 'react';

import { Textarea } from '@/components/ui/Textarea';
import { SIGNUP_PLACEHOLDERS } from '@/constants/auth';
import { useUpdateSelfIntroMutation } from '@/services/user/hooks';

import { EditIcon } from './EditIcon';

interface MyPageSelfIntroProps {
  selfIntro: string;
}

export function MyPageSelfIntro({ selfIntro }: MyPageSelfIntroProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateSelfIntro } = useUpdateSelfIntroMutation();
  const [localSelfIntro, setLocalSelfIntro] = useState(selfIntro);

  const handleSave = () => {
    if (isEditing) {
      updateSelfIntro({ selfIntro: localSelfIntro });
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  return (
    <section className="w-full">
      <div className="mb-2 flex items-center gap-1">
        <label className="subhead2 text-custom-realblack">자기소개</label>
        <EditIcon isEditing={isEditing} onClick={handleSave} />
      </div>
      <div className="relative">
        <Textarea
          placeholder={SIGNUP_PLACEHOLDERS.SELF_INTRO}
          className={`subhead3 bg-custom-realwhite text-custom-realblack border-gray max-h-[300px] min-h-[150px] w-full resize-none overflow-y-auto px-4 py-4 leading-relaxed transition-all outline-none [-ms-overflow-style:'none'] [scrollbar-width:'none'] focus:border-blue-400 focus-visible:ring-0 [&::-webkit-scrollbar]:hidden ${!isEditing ? 'bg-gray-50 opacity-80' : ''}`}
          value={localSelfIntro}
          onChange={(e) => setLocalSelfIntro(e.target.value.slice(0, 200))}
          maxLength={200}
          disabled={!isEditing}
        />
      </div>
      <div className="flex justify-end pt-2">
        <p className="caption3 text-custom-deepgray">{localSelfIntro.length}/200</p>
      </div>
    </section>
  );
}
