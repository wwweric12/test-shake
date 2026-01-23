'use client';

import { SignupRequestDTO } from '@/types/auth.dto';

interface StepProps {
  data: SignupRequestDTO;
  onNext: (data: Partial<SignupRequestDTO>) => void;
}

export default function Step1Profile({ data, onNext }: StepProps) {
  return (
    <div className="flex h-full flex-col">
      {/* 폼 섹션 */}
      <div className="flex-1 space-y-8">
        {/* 닉네임 */}
        <section>
          <label className="subhead2 mb-3 block">닉네임</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Evil Rabbit"
              className="focus:border-gray bg-custom-realwhite footnote flex-1 rounded-lg border px-4 py-2 outline-none"
              defaultValue={data.nickname}
            />
            <button className="custom-deepgray bg-custom-realwhite caption1 rounded-lg border px-4 py-2">
              중복확인
            </button>
          </div>
          <p className="caption3 text-custom-deepgray mt-2">
            ※ 한 번 생성한 닉네임은 수정할 수 없습니다.
          </p>
        </section>

        {/* 실무 개발 경험 */}
        <section>
          <label className="subhead2 mb-3 block">실무 개발 경험</label>
          <div className="flex gap-2">
            {['경험 있음', '경험 없음'].map((label) => (
              <button
                key={label}
                className={`subhead2 rounded-full border px-2.5 py-1 ${
                  (label === '경험 있음' && data.experience) ||
                  (label === '경험 없음' && !data.experience)
                    ? 'border-custom-blue bg-custom-blue text-custom-realwhite'
                    : 'border-gray bg-custom-realwhite text-custom-border-gray'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* 현재 상태 */}
        <section>
          <label className="subhead2 mb-3 block">현재 상태</label>
          <div className="flex flex-wrap gap-2">
            {['재직 중', '구직 중', '프리랜서', '학생'].map((label) => (
              <button
                key={label}
                className={`subhead2 rounded-full border px-2.5 py-1 ${
                  label === '재직 중' // 임시 선택 로직
                    ? 'border-custom-blue bg-custom-blue text-custom-realwhite'
                    : 'border-gray bg-custom-realwhite text-custom-border-gray'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* 직무 추가 */}
        <section>
          <label className="subhead2 mb-1 block">직무</label>
          <p className="mb-3 text-xs text-gray-400">최대 5개를 선택할 수 있습니다.</p>
          <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-200 py-4 font-medium text-blue-500">
            <span className="text-xl">+</span> 직무 추가
          </button>
        </section>

        {/* 기술 스택 추가 */}
        <section>
          <label className="subhead2 mb-1 block">보유 기술 스택</label>
          <p className="mb-3 text-xs text-gray-400">최대 5개를 선택할 수 있습니다.</p>
          <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-200 py-4 font-medium text-blue-500">
            <span className="text-xl">+</span> 스택 추가
          </button>
        </section>
      </div>

      {/* 하단 버튼 */}
      <button
        onClick={() => onNext({})}
        className="mt-8 w-full rounded-xl bg-black py-4 font-bold text-white"
      >
        다음으로
      </button>
    </div>
  );
}
