import Image from 'next/image';

import github from '@/assets/icon/github.svg';
import { Badge } from '@/components/ui/Badge';
import { TECH_SKILL_ICONS } from '@/constants/techSkillIcons';
import {
  CAREER_LABELS,
  getNetworkLabel,
  getPositionLabel,
  getTechSkillLabel,
} from '@/constants/user';
import { UserInfo } from '@/types/user';

interface SwipingCardProps {
  card: UserInfo;
}

export default function SwipingCard({ card }: SwipingCardProps) {
  const { matchingPercent } = card;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[30px] bg-white shadow-xl select-none">
      {/* 2. 스크롤 컨테이너 설정 
          - touch-action: pan-y -> 세로 스크롤은 여기서 처리, 가로는 부모에게 위임
          - overscroll-y-contain -> 스크롤 바운스 전파 방지
      */}
      <div
        className="custom-scrollbar h-full overflow-y-auto overscroll-y-contain bg-white"
        style={{ touchAction: 'pan-y' }}
      >
        {/* Profile Header Section */}
        <div className="relative flex flex-col items-center bg-white p-4">
          {/* Top Badges */}
          <div className="mb-4 flex w-full justify-between">
            <Badge
              variant="secondary"
              className="bg-custom-blue text-custom-white subhead1 px-3 py-1"
            >
              {CAREER_LABELS[card.career] || card.career}
            </Badge>
            {card.experience && (
              <Badge
                variant="secondary"
                className="bg-custom-blue text-custom-white subhead1 px-3 py-1"
              >
                실무 경험 있음
              </Badge>
            )}
          </div>

          {/* Profile Image & Match Score */}
          <div className="relative mb-2 flex items-center justify-center">
            {/* Match Percentage Progress Ring */}
            <div className="text-custom-purple relative size-[150px]">
              <svg className="size-full -rotate-90">
                <circle
                  cx="75"
                  cy="75"
                  r="72"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 72}
                  strokeDashoffset={2 * Math.PI * 72 - (matchingPercent / 100) * (2 * Math.PI * 72)}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              {/* Profile Image Container */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative z-10 size-[134px] overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-lg">
                  {card.profileImageUrl ? (
                    <Image
                      src={card.profileImageUrl}
                      alt={card.nickname}
                      fill
                      // 3. 이미지 드래그 방지 (중요)
                      draggable={false}
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* DSTI Badge */}
            <div className="absolute top-0 -left-2 z-20">
              <div className="subhead1 text-custom-deeppurple flex size-14 items-center justify-center rounded-full border border-gray-100 bg-white text-sm font-bold shadow-md">
                {card.dsti}
              </div>
            </div>

            {/* Match Score Badge */}
            <div className="absolute -right-2 bottom-0 z-20">
              <div className="flex size-16 flex-col items-center justify-center rounded-full border border-gray-100 bg-white p-1 shadow-md">
                <span className="subhead1 text-custom-deeppurple">{matchingPercent}%</span>
                <span className="caption1 text-custom-deepnavy">성향 매치</span>
              </div>
            </div>
          </div>

          {/* Name & Github */}
          <div className="mb-4 flex items-center gap-2">
            <h2 className="text-custom-deepnavy text-2xl font-bold">{card.nickname}</h2>
            {card.githubId && (
              <a
                href={`https://github.com/${card.githubId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black"
                // 링크 클릭 시 스와이프 씹힘 방지
                onPointerDown={(e) => e.stopPropagation()}
              >
                <Image src={github} alt="github" width={24} height={24} draggable={false} />
              </a>
            )}
          </div>

          {/* Position Tags */}
          <div className="mb-2.5 flex flex-wrap justify-center gap-2">
            {card.positions.map((pos) => (
              <Badge key={pos} className="bg-custom-blue subhead1 border-0 px-3 py-1 text-white">
                {getPositionLabel(pos)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="px-5 pb-8">
          {/* Tech Stack */}
          <section className="mb-4 flex flex-col items-start">
            <h3 className="text-custom-deepnavy body1 mb-2">기술 스택</h3>
            <div className="flex flex-wrap gap-2">
              {card.techSkills.map((skill) => {
                const iconSrc = TECH_SKILL_ICONS[skill];
                const label = getTechSkillLabel(skill);
                const displayLabel = label.length > 6 ? `${label.slice(0, 6)}...` : label;

                return (
                  <div key={skill} className="flex flex-col items-center gap-1">
                    <div className="rounded-xl border border-gray-300 p-1.5">
                      {iconSrc ? (
                        <Image src={iconSrc} alt={label} width={40} height={40} draggable={false} />
                      ) : (
                        <div className="flex size-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400">
                          ?
                        </div>
                      )}
                    </div>
                    <span className="footout text-custom-navy line-clamp-2 text-center leading-tight">
                      {displayLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Self Introduction */}
          <section className="mb-4 flex w-full flex-col items-baseline">
            <h3 className="text-custom-deepnavy mb-3 font-semibold">자기소개</h3>
            <div className="min-h-[150px] w-full rounded-2xl border border-gray-200 bg-white p-4 text-sm leading-relaxed whitespace-pre-wrap text-gray-600 shadow-sm">
              {card.selfIntro || '자기소개가 없습니다.'}
            </div>
          </section>

          {/* Networks */}
          {card.networks.length > 0 && (
            <section className="mb-4 flex flex-col items-start">
              <h3 className="text-custom-deepnavy body1 mb-2">네트워크 목적</h3>
              <div className="flex flex-wrap gap-1">
                {card.networks.map((net) => (
                  <Badge
                    key={net}
                    variant="secondary"
                    className="bg-custom-blue subhead1 border-0 px-3 py-1 text-white"
                  >
                    #{getNetworkLabel(net)}
                  </Badge>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
