import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { useCheckNicknameMutation } from '@/services/user/hooks';
import { UserProfile } from '@/types/user';

import { CAREER_LIST, EXPERIENCE_LIST, SIGNUP_MESSAGES } from '../constants';

import { SelectButton } from './Button';

interface StepProps {
  data: UserProfile;
  onUpdate: (data: Partial<UserProfile>) => void;
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

    setStatus({ type: 'loading', message: '확인 중...' });

    checkNickname(localNickname, {
      onSuccess: (response: { possible: boolean }) => {
        if (response.possible) {
          setStatus({ type: 'success', message: SIGNUP_MESSAGES.SUCCESS_NICKNAME });
          setVerifiedNickname(localNickname);
          onUpdate({ nickname: localNickname });
        } else {
          setStatus({ type: 'error', message: '이미 사용 중인 닉네임입니다.' });
          setVerifiedNickname('');
        }
      },
      onError: (error: unknown) => {
        let errorMsg = '중복 확인 중 오류가 발생했습니다.';

        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { data?: { message?: string } } };
          errorMsg = axiosError.response?.data?.message || errorMsg;
        }

        setStatus({ type: 'error', message: errorMsg });
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
  const showSuccessMessage = status.type === 'success' || isNicknameVerified;
  const showErrorMessage = status.type === 'error' && !isNicknameVerified;

  const handleNextStep = () => {
    if (!isNicknameVerified) return alert(SIGNUP_MESSAGES.ERROR_CHECK_REQUIRED);
    if (data.experience === null || data.experience === undefined)
      return alert(SIGNUP_MESSAGES.ERROR_EXPERIENCE_REQUIRED);
    if (!data.career) return alert(SIGNUP_MESSAGES.ERROR_CAREER_REQUIRED);

    onUpdate({ ...data, nickname: localNickname });
    onNext();
  };

  return (
    <div className="flex flex-col">
      <div className="space-y-5">
        {/* 1. 닉네임 섹션 */}
        <section>
          <div>
            <label className="subhead2 text-custom-realblack mb-1 block">닉네임</label>
            <p className="caption3 text-custom-deepgray mb-3">{SIGNUP_MESSAGES.NICKNAME_GUIDE}</p>
          </div>

          <div className="mt-3 flex gap-2">
            <input
              type="text"
              placeholder="닉네임을 입력해주세요"
              className={`bg-custom-realwhite footnote flex-1 rounded-lg border px-4 py-2 shadow-xs outline-none focus:border-blue-400 ${
                status.type === 'error' ? 'border-red-500' : 'border-gray'
              }`}
              value={localNickname}
              onChange={handleNicknameChange}
            />
            <button
              type="button"
              onClick={handleCheckNickname}
              disabled={isPending || status.type === 'loading' || localNickname.length < 2}
              className="bg-custom-realwhite text-custom-deepgray caption1 rounded-lg border px-4 py-2 whitespace-nowrap shadow-xs active:bg-gray-50 disabled:opacity-50"
            >
              중복 확인
            </button>
          </div>

          <div className="mt-1 h-5">
            {status.type !== 'loading' && (showSuccessMessage || showErrorMessage) && (
              <p
                className={`caption3 ${showSuccessMessage ? 'text-custom-blue' : 'text-custom-red'}`}
              >
                {showSuccessMessage ? SIGNUP_MESSAGES.SUCCESS_NICKNAME : status.message}
              </p>
            )}
          </div>
        </section>

        {/* 2. 실무 개발 경험 */}
        <section>
          <label className="subhead2 text-custom-realblack mb-1 block">실무 개발 경험</label>
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
          <label className="subhead2 text-custom-realblack mb-1 block">현재 상태</label>
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
            <label className="subhead2 text-custom-realblack mb-1 block">직무</label>
            <p className="text-custom-deepgray caption3 mb-3">최대 5개를 선택할 수 있습니다.</p>
            <button
              onClick={handleOpenPositionModal}
              className="subhead1 text-custom-blue border-custom-blue bg-custom-realwhite flex w-full items-center justify-center gap-2 rounded-[10px] border px-2.5 py-3 active:bg-blue-50"
            >
              <span className="text-lg">+</span> 직무 추가
            </button>
          </section>

          <section>
            <label className="subhead2 text-custom-realblack mb-1 block">스택</label>
            <p className="text-custom-deepgray caption3 mb-3">최대 5개를 선택할 수 있습니다.</p>
            <button
              onClick={handleOpenStackModal}
              className="subhead1 text-custom-blue border-custom-blue bg-custom-realwhite flex w-full items-center justify-center gap-2 rounded-[10px] border px-2.5 py-3 active:bg-blue-50"
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
