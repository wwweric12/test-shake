import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import {
  CAREER_LIST,
  EXPERIENCE_LIST,
  SIGNUP_MESSAGES,
  SIGNUP_PLACEHOLDERS,
} from '@/constants/auth';
import { useCheckNicknameMutation } from '@/services/user/hooks';
import { UserInfo } from '@/types/user';
import { getErrorMessage } from '@/utils/error';

import { SelectButton } from './Button';

interface StepProps {
  data: UserInfo;
  onUpdate: (data: Partial<UserInfo>) => void;
  onNext: () => void;
}

interface FormStatus {
  type: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}

export default function Step1Profile({ data, onUpdate, onNext }: StepProps) {
  const { mutate: checkNickname, isPending } = useCheckNicknameMutation();

  const [localNickname, setLocalNickname] = useState(data.nickname || '');
  const [verifiedNickname, setVerifiedNickname] = useState(data.nickname || '');
  const [status, setStatus] = useState<FormStatus>({ type: 'idle', message: '' });

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 10) {
      setLocalNickname(value);
      if (status.type !== 'idle') setStatus({ type: 'idle', message: '' });
    }
  };

  const handleCheckNickname = () => {
    if (localNickname.length < 2) {
      setStatus({ type: 'error', message: SIGNUP_MESSAGES.ERROR_NICKNAME_LENGTH });
      return;
    }

    setStatus({ type: 'loading', message: SIGNUP_MESSAGES.STATUS_LOADING });

    checkNickname(localNickname, {
      onSuccess: () => {
        setStatus({ type: 'success', message: SIGNUP_MESSAGES.SUCCESS_NICKNAME });
        setVerifiedNickname(localNickname);
        onUpdate({ nickname: localNickname });
      },
      onError: (error: unknown) => {
        setVerifiedNickname('');
        setStatus({
          type: 'error',
          message: getErrorMessage(error, SIGNUP_MESSAGES.ERROR_NICKNAME_CHECK_FAILED),
        });
      },
    });
  };

  const handleOpenPositionModal = () => {
    console.log('직무 선택 모달 오픈 - Position 타입 활용 예정');
  };

  const handleOpenStackModal = () => {
    console.log('스택 선택 모달 오픈 - TechSkill 타입 활용 예정');
  };

  const isNicknameVerified = localNickname !== '' && localNickname === verifiedNickname;

  const handleNextStep = () => {
    if (!isNicknameVerified) return alert(SIGNUP_MESSAGES.ERROR_CHECK_REQUIRED);
    if (data.experience === null || data.experience === undefined)
      return alert(SIGNUP_MESSAGES.ERROR_EXPERIENCE_REQUIRED);
    if (!data.career) return alert(SIGNUP_MESSAGES.ERROR_CAREER_REQUIRED);
    // if (data.positions.length === 0) return alert(SIGNUP_MESSAGES.ERROR_POSITION_REQUIRED);
    // if (data.techSkills.length === 0) return alert(SIGNUP_MESSAGES.ERROR_SKILL_REQUIRED);

    onUpdate({ ...data, nickname: localNickname });
    onNext();
  };

  const getMessageContent = () => {
    if (status.type === 'loading') return SIGNUP_MESSAGES.STATUS_LOADING;
    if (status.type === 'error') return status.message;
    if (status.type === 'success' || isNicknameVerified) return SIGNUP_MESSAGES.SUCCESS_NICKNAME;
    return SIGNUP_MESSAGES.NICKNAME_GUIDE;
  };

  const getMessageColor = () => {
    if (status.type === 'error') return 'text-custom-red';
    if (status.type === 'success' || isNicknameVerified) return 'text-custom-blue';
    return 'text-custom-deepgray';
  };

  return (
    <div className="flex flex-col">
      <div className="space-y-5">
        {/* 1. 닉네임 섹션 */}
        <section>
          <label className="body1 text-custom-realblack mb-1 block">닉네임</label>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder={SIGNUP_PLACEHOLDERS.NICKNAME}
              className={`bg-custom-realwhite subhead3 flex-1 rounded-lg border px-4 py-2 shadow-xs outline-none focus:border-blue-400 ${
                status.type === 'error' ? 'border-red-500' : 'border-gray'
              }`}
              value={localNickname}
              onChange={handleNicknameChange}
            />
            <button
              type="button"
              onClick={handleCheckNickname}
              disabled={
                isPending ||
                status.type === 'loading' ||
                localNickname.length < 2 ||
                isNicknameVerified
              }
              className="bg-custom-lightpurple text-custom-deepgray subhead3 rounded-lg px-4 py-2 whitespace-nowrap shadow-xs active:bg-gray-50 disabled:opacity-30"
            >
              중복 확인
            </button>
          </div>

          {/* 통합 메시지 영역: 입력 전엔 가이드, 클릭 후엔 결과 */}
          <div className="mt-2 min-h-5 px-1">
            <p className={`text-[12px] leading-relaxed transition-colors ${getMessageColor()}`}>
              {getMessageContent()}
            </p>
          </div>
        </section>

        {/* 2. 실무 개발 경험 */}
        <section>
          <label className="body1 text-custom-realblack mb-1 block">실무 개발 경험</label>
          <div className="flex gap-2">
            {EXPERIENCE_LIST.map((item) => (
              <SelectButton
                key={String(item.value)}
                label={item.label}
                isSelected={data.experience === item.value}
                onClick={() => onUpdate({ experience: item.value })}
              />
            ))}
          </div>
        </section>

        {/* 3. 현재 상태 */}
        <section>
          <label className="body1 text-custom-realblack mb-1 block">현재 상태</label>
          <div className="flex flex-wrap gap-2">
            {CAREER_LIST.map((item) => (
              <SelectButton
                key={item.value}
                label={item.label}
                isSelected={data.career === item.value}
                onClick={() => onUpdate({ career: item.value })}
              />
            ))}
          </div>
        </section>

        {/* 4. 직무/스택 추가 */}
        <div className="space-y-5">
          <section>
            <label className="body1 text-custom-realblack block">직무</label>
            <p className="text-custom-deepgray footnote mb-2">{SIGNUP_MESSAGES.POSITION_GUIDE}</p>
            <button
              onClick={handleOpenPositionModal}
              className="body2 text-custom-blue border-custom-blue bg-custom-realwhite flex w-full items-center justify-center gap-2 rounded-[10px] border px-2.5 py-3 active:bg-blue-50"
            >
              <span className="text-lg">+</span> 직무 추가
            </button>
          </section>

          <section>
            <label className="body1 text-custom-realblack block">스택</label>
            <p className="text-custom-deepgray footnote mb-2">{SIGNUP_MESSAGES.STACK_GUIDE}</p>
            <button
              onClick={handleOpenStackModal}
              className="body2 text-custom-blue border-custom-blue bg-custom-realwhite flex w-full items-center justify-center gap-2 rounded-[10px] border px-2.5 py-3 active:bg-blue-50"
            >
              <span className="text-lg">+</span> 스택 추가
            </button>
          </section>
        </div>
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
