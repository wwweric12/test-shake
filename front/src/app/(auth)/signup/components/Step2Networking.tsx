'use client';

import { useState } from 'react';
import Image from 'next/image';

import LinkIcon from '@/assets/icon/link.svg';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { NETWORK_LIST, SIGNUP_MESSAGES, SIGNUP_PLACEHOLDERS } from '@/constants/auth';
import { Network, UserProfile } from '@/types/user';

import { SelectButton } from './Button';

interface StepProps {
  data: UserProfile;
  onUpdate: (data: Partial<UserProfile>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step2Networking({ data, onUpdate, onNext }: StepProps) {
  const [localGithubId, setLocalGithubId] = useState(data.githubId || '');
  const [localSelfIntro, setLocalSelfIntro] = useState(data.selfIntro || '');
  const [noGithub, setNoGithub] = useState(false);

  const handleNetworkClick = (value: Network) => {
    const current = data.networks || [];

    const isSelected = current.includes(value);

    onUpdate({
      networks: isSelected ? current.filter((v) => v !== value) : [...current, value],
    });
  };

  const handleGithubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filteredValue = e.target.value.replace(/[^a-zA-Z0-9-]/g, '');

    setLocalGithubId(filteredValue);
  };

  const handleNoGithubChange = (checked: boolean | string) => {
    const isChecked = !!checked;
    setNoGithub(isChecked);
    if (isChecked) {
      setLocalGithubId('');
    }
  };

  const handleSelfIntroChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalSelfIntro(e.target.value.slice(0, 200));
  };

  const handleNextStep = () => {
    if (!data.networks || data.networks.length === 0) {
      return alert(SIGNUP_MESSAGES.ERROR_NETWORKS_REQUIRED);
    }
    if (!noGithub && !localGithubId.trim()) {
      return alert(SIGNUP_MESSAGES.ERROR_GITHUB_REQUIRED);
    }
    if (!localSelfIntro.trim()) {
      return alert(SIGNUP_MESSAGES.ERROR_INTRO_REQUIRED);
    }

    const finalGithubId = noGithub ? '' : localGithubId;

    onUpdate({
      ...data,
      githubId: finalGithubId,
      selfIntro: localSelfIntro,
    });
    onNext();
  };

  return (
    <div className="flex flex-col">
      <div className="space-y-5">
        {/* 1. 네트워킹 목적 */}
        <section>
          <label className="subhead2 text-custom-realblack mb-1 block">네트워킹 목적</label>

          <p className="text-custom-deepgray caption3 mb-3">{SIGNUP_MESSAGES.INTRO_GUIDE}</p>

          <div className="flex flex-wrap gap-2">
            {NETWORK_LIST.map((item) => (
              <SelectButton
                key={item.value}
                label={item.label}
                isSelected={data.networks?.includes(item.value)}
                onClick={() => handleNetworkClick(item.value)}
              />
            ))}
          </div>
        </section>

        {/* 2. Github ID */}
        <section>
          <label className="subhead2 text-custom-realblack mb-1 block">Github</label>

          <div className="relative flex items-center">
            <div className="absolute left-3 z-10">
              <Image src={LinkIcon} alt="link" width={18} height={18} style={{ height: 'auto' }} />
            </div>

            <div
              className={`flex h-12 w-full items-center rounded-lg border transition-all ${
                noGithub
                  ? 'border-gray-200 bg-gray-100'
                  : 'border-gray bg-custom-realwhite focus-within:border-blue-400'
              }`}
            >
              <span
                className={`subhead3 ml-10 select-none ${noGithub ? 'text-gray-400' : 'text-custom-deepgray'}`}
              >
                {SIGNUP_MESSAGES.GITHUB_GUIDE}
              </span>

              <Input
                placeholder={SIGNUP_PLACEHOLDERS.GITHUB_ID}
                disabled={noGithub}
                className="text-custom-realblack subhead3 flex-1 border-none bg-transparent pl-0 shadow-none focus-visible:ring-0 disabled:cursor-not-allowed"
                value={localGithubId}
                onChange={handleGithubChange}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Checkbox id="noGithub" checked={noGithub} onCheckedChange={handleNoGithubChange} />

            <label
              htmlFor="noGithub"
              className="subhead3 text-custom-deepgray cursor-pointer select-none"
            >
              {SIGNUP_MESSAGES.GITHUB_NO_CHECK}
            </label>
          </div>
        </section>

        {/* 3. 자기소개 */}
        <section>
          <label className="subhead2 text-custom-realblack mb-3 block">자기소개</label>

          <div className="relative">
            <Textarea
              placeholder={SIGNUP_PLACEHOLDERS.SELF_INTRO}
              className="subhead3 bg-custom-realwhite text-custom-realblack border-gray min-h-[200px] w-full resize-none p-4 leading-relaxed transition-all outline-none focus:border-blue-400 focus-visible:ring-0"
              value={localSelfIntro}
              onChange={handleSelfIntroChange}
              maxLength={200}
            />

            <p className="caption3 text-custom-deepgray absolute right-3 bottom-3">
              {localSelfIntro.length}/200
            </p>
          </div>
        </section>
      </div>

      <div className="mt-20 mb-10">
        <Button
          onClick={handleNextStep}
          className="bg-custom-realblack hover:bg-custom-realblack subhead1 text-custom-realwhite h-auto w-full rounded-[6px] px-3 py-4 shadow-[0_4px_10px_rgba(0,0,0,0.15)] active:scale-[0.98]"
        >
          다음으로
        </Button>
      </div>
    </div>
  );
}
