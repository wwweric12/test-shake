'use client';

import { useState } from 'react';

import { userApi } from '@/services/user/api';
import { Career, UserProfile } from '@/types/user';

interface StepProps {
  data: UserProfile;

  onUpdate: (data: Partial<UserProfile>) => void;

  onNext: (data: Partial<UserProfile>) => void;
}

export default function Step1Profile({ data, onUpdate, onNext }: StepProps) {
  const [localNickname, setLocalNickname] = useState(data.nickname || '');

  const [verifiedNickname, setVerifiedNickname] = useState(data.nickname || '');

  const [status, setStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';

    message: string;
  }>({ type: 'idle', message: '' });

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');

    if (value.length <= 10) {
      setLocalNickname(value);

      if (status.type !== 'idle') {
        setStatus({ type: 'idle', message: '' });
      }
    }
  };

  const handleCheckNickname = async () => {
    if (localNickname.length < 2) {
      setStatus({ type: 'error', message: '닉네임은 2자 이상 입력해주세요.' });

      return;
    }

    setStatus({ type: 'loading', message: '확인 중...' });

    // --- 테스트용 가짜 로직 ---

    setTimeout(() => {
      if (localNickname === 'test') {
        setStatus({ type: 'error', message: '이미 사용 중인 닉네임입니다.' });

        setVerifiedNickname('');
      } else {
        setStatus({ type: 'success', message: '사용 가능한 닉네임입니다.' });

        setVerifiedNickname(localNickname);

        onUpdate({ nickname: localNickname });
      }
    }, 500);

    // --- 실제 API 연결 시 사용할 로직 (주석 해제 시 위는 삭제/주석처리) ---
    // try {
    //   const response = await userApi.checkNickname({ nickname: localNickname });
    //   if (response.possible) {
    //     setStatus({ type: 'success', message: '사용 가능한 닉네임입니다.' });
    //     setVerifiedNickname(localNickname);
    //     onUpdate({ nickname: localNickname });
    //   } else {
    //     setStatus({ type: 'error', message: '이미 사용 중인 닉네임입니다.' });
    //     setVerifiedNickname('');
    //   }
    // } catch (error: unknown) {
    //   let errorMsg = '중복 확인 중 오류가 발생했습니다.';
    //   if (error && typeof error === 'object' && 'response' in error) {
    //     const axiosError = error as { response?: { data?: { message?: string } } };
    //     errorMsg = axiosError.response?.data?.message || errorMsg;
    //   }
    //   setStatus({ type: 'error', message: errorMsg });
    // }
  };

  const handleNextStep = () => {
    const isVerified = verifiedNickname !== '' && localNickname === verifiedNickname;

    if (!isVerified) {
      alert('닉네임 중복 확인이 필요합니다.');

      return;
    }
    if (data.experience === null || data.experience === undefined) {
      alert('실무 개발 경험 여부를 선택해주세요.');
      return;
    }

    if (!data.career) {
      alert('현재 상태를 선택해주세요.');
      return;
    }
    onNext({ ...data, nickname: localNickname });
  };

  const handleExperienceSelect = (value: boolean) => {
    onUpdate({ experience: value });
  };

  const handleCareerSelect = (value: Career) => {
    onUpdate({ career: value });
  };

  const handleOpenPositionModal = () => {
    console.log('직무 선택 모달 오픈 - Position 타입 활용 예정');
  };

  const handleOpenStackModal = () => {
    console.log('스택 선택 모달 오픈 - TechSkill 타입 활용 예정');
  };

  const careerList: { label: string; value: Career }[] = [
    { label: '재직 중', value: 'employed' },
    { label: '구직 중', value: 'job_seeking' },
    { label: '프리랜서', value: 'freelancer' },
    { label: '학생', value: 'student' },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-5 overflow-y-auto pb-5">
        {/* 1. 닉네임 섹션 */}

        <section>
          <div className="mb-3">
            <label className="subhead2 text-custom-realblack block">닉네임</label>

            <p className="caption3 text-custom-deepgray mt-1">
              ※ 한 번 생성한 닉네임은 수정할 수 없습니다. (2~10자, 공백 불가)
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="닉네임을 입력해주세요"
              className={`focus:border-gray bg-custom-realwhite footnote flex-1 rounded-lg border px-4 py-2 shadow-xs outline-none ${
                status.type === 'error' ? 'border-red-500' : 'border-gray'
              }`}
              value={localNickname}
              onChange={handleNicknameChange}
            />

            <button
              type="button"
              onClick={handleCheckNickname}
              disabled={status.type === 'loading' || localNickname.length < 2}
              className="bg-custom-realwhite text-custom-deepgray caption1 rounded-lg border px-4 py-2 shadow-xs active:bg-gray-50 disabled:opacity-50"
            >
              중복 확인
            </button>
          </div>

          {/* 검증 메시지 */}

          <div className="mt-1 h-5">
            {(status.message || (localNickname !== '' && localNickname === verifiedNickname)) && (
              <p
                className={`caption3 ${
                  status.type === 'success' || localNickname === verifiedNickname
                    ? 'text-custom-blue'
                    : status.type === 'error'
                      ? 'text-custom-red'
                      : 'text-custom-deepgray'
                }`}
              >
                {status.message || '사용 가능한 닉네임입니다.'}
              </p>
            )}
          </div>
        </section>

        {/* 2. 실무 개발 경험 */}

        <section>
          <label className="subhead2 text-custom-realblack mb-3 block">실무 개발 경험</label>

          <div className="flex gap-2">
            {[
              { label: '경험 있음', value: true },
              { label: '경험 없음', value: false },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => handleExperienceSelect(item.value)}
                className={`subhead2 rounded-full border px-2.5 py-1 transition-colors ${
                  data.experience === item.value
                    ? 'border-custom-blue bg-custom-blue text-custom-realwhite'
                    : 'border-gray bg-custom-realwhite text-custom-border-gray'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>

        {/* 3. 현재 상태 */}

        <section>
          <label className="subhead2 text-custom-realblack mb-3 block">현재 상태</label>

          <div className="flex flex-wrap gap-2">
            {careerList.map((item) => (
              <button
                key={item.value}
                onClick={() => handleCareerSelect(item.value)}
                className={`subhead2 rounded-full border px-2.5 py-1 transition-colors ${
                  data.career === item.value
                    ? 'border-custom-blue bg-custom-blue text-custom-realwhite'
                    : 'border-gray bg-custom-realwhite text-custom-border-gray'
                }`}
              >
                {item.label}
              </button>
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

      {/* 다음 이동 버튼 */}

      <div className="pt-4 pb-[15px]">
        <button
          onClick={handleNextStep}
          className="bg-custom-realblack subhead1 text-custom-realwhite w-full rounded-[6px] px-3 py-4 shadow-lg transition-transform active:scale-[0.98]"
        >
          다음으로
        </button>
      </div>
    </div>
  );
}
