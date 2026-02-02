'use client';

import { useState } from 'react';
import Image from 'next/image';

import LinkIcon from '@/assets/icon/link.svg';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/Input';
import { useUpdateGithubMutation } from '@/services/user/hooks';

import { EditIcon } from './EditIcon';

interface MyPageGithubProps {
  githubId: string | null;
}

export function MyPageGithub({ githubId }: MyPageGithubProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateGithub } = useUpdateGithubMutation();

  const [localGithubId, setLocalGithubId] = useState(githubId || '');
  const [noGithub, setNoGithub] = useState(!githubId);

  const handleGithubBlur = () => {
    const finalGithubId = noGithub ? '' : localGithubId;
    if (finalGithubId !== githubId) {
      updateGithub({ githubId: finalGithubId });
    }
  };

  const handleNoGithubChange = (checked: boolean | string) => {
    const isChecked = !!checked;
    setNoGithub(isChecked);
    if (isChecked) {
      setLocalGithubId('');
      updateGithub({ githubId: '' });
    }
  };

  return (
    <section>
      <div className="mb-2 flex items-center gap-1">
        <label className="body1 text-custom-realblack">Github</label>
        <EditIcon isEditing={isEditing} onClick={() => setIsEditing(!isEditing)} />
      </div>

      <div className="relative flex items-center">
        <div className="absolute left-3 z-10">
          <Image src={LinkIcon} alt="link" width={18} height={18} style={{ height: 'auto' }} />
        </div>

        <div
          className={`flex h-12 w-full items-center rounded-lg border transition-all ${
            noGithub
              ? 'border-gray-200 bg-gray-100'
              : 'border-gray bg-custom-realwhite focus-within:border-blue-400'
          } ${!isEditing ? 'bg-gray-50 opacity-80' : ''}`}
        >
          <span
            className={`subhead3 ml-10 select-none ${noGithub ? 'text-gray-400' : 'text-custom-deepgray'}`}
          >
            https://github.com/
          </span>
          <Input
            disabled={!isEditing || noGithub}
            value={localGithubId}
            onChange={(e) => setLocalGithubId(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
            onBlur={handleGithubBlur}
            className="text-custom-realblack subhead3 flex-1 border-none bg-transparent pl-0 shadow-none focus-visible:ring-0 disabled:cursor-not-allowed"
          />
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Checkbox
          id="noGithub"
          checked={noGithub}
          onCheckedChange={handleNoGithubChange}
          disabled={!isEditing}
        />
        <label
          htmlFor="noGithub"
          className="subhead3 text-custom-deepgray cursor-pointer select-none"
        >
          Github 주소가 없어요.
        </label>
      </div>
    </section>
  );
}
