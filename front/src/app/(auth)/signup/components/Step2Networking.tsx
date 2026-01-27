'use client';

import { useState } from 'react';
import Image from 'next/image';

import LinkIcon from '@/assets/icon/link.svg';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Network, UserProfile } from '@/types/user';

import { NETWORK_LIST, SIGNUP_MESSAGES } from '../constants';

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

  /** 네트워킹 목적 선택 핸들러 */
  const handleNetworkClick = (value: Network) => {
    const current = data.networks || [];

    const isSelected = current.includes(value);

    onUpdate({
      networks: isSelected ? current.filter((v) => v !== value) : [...current, value],
    });
  };

  /** Github ID 입력 핸들러 (영문, 숫자, 하이픈만 허용) */
  const handleGithubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filteredValue = e.target.value.replace(/[^a-zA-Z0-9-]/g, '');

    setLocalGithubId(filteredValue);
  };

  /** Github 없음 체크박스 핸들러 */
  const handleNoGithubChange = (checked: boolean | string) => {
    const isChecked = !!checked;

    setNoGithub(isChecked);

    if (isChecked) {
      setLocalGithubId('');
    }
  };

  /** 자기소개 입력 핸들러 (200자 제한) */
  const handleSelfIntroChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalSelfIntro(e.target.value.slice(0, 200));
  };

  /** 다음 단계 이동 핸들러 */
  const handleNextStep = () => {
    // 1. 유효성 검사 (실패 시 return 필수)
    if (!data.networks || data.networks.length === 0) {
      return alert(SIGNUP_MESSAGES.ERROR_NETWORKS_REQUIRED);
    }

    if (!noGithub && !localGithubId.trim()) {
      return alert(SIGNUP_MESSAGES.ERROR_GITHUB_REQUIRED);
    }

    if (!localSelfIntro.trim()) {
      return alert(SIGNUP_MESSAGES.ERROR_INTRO_REQUIRED);
    }

    // 2. 최종 데이터 확정 (체크박스 여부에 따라 ID 값 처리)
    const finalGithubId = noGithub ? '' : localGithubId;

    // 3. 부모에게 데이터 전달 및 이동
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

          <p className="text-custom-deepgray caption3 mb-3">복수 선택 가능합니다.</p>

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
                https://github.com/
              </span>

              <Input
                placeholder="ID"
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
              Github 주소가 없어요.
            </label>
          </div>
        </section>

        {/* 3. 자기소개 */}
        <section>
          <label className="subhead2 text-custom-realblack mb-3 block">자기소개</label>

          <div className="relative">
            <Textarea
              placeholder={`나누고 싶은 대화 주제 또는 간단한 자기소개를 적어주세요!\nex) 함께 Spring에 deep dive할 개발자를 찾고 있습니다. 편하게 좋아요 눌러주세요!`}
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
