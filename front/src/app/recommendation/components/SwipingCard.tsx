import Image from 'next/image';

import github from '@/assets/icon/github.svg';
import { Badge } from '@/components/ui/Badge';
import { NETWORK_STYLES } from '@/constants/style';
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
  const networkRotateStyles = ['rotate-[-2deg]', 'rotate-[1deg]', 'rotate-[-1deg]'];

  const radius = 87;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[30px] bg-white shadow-xl select-none">
      <div
        className="custom-scrollbar h-full overflow-y-auto overscroll-y-contain bg-white"
        style={{ touchAction: 'pan-y' }}
      >
        <div className="relative flex flex-col items-center bg-white p-4 pt-8">
          {/* Profile Image & Match Score Container */}
          <div className="relative mb-2.5 flex items-center justify-center">
            {/* Networks Section */}
            <div className="absolute top-[20%] -right-12 z-30 flex flex-col gap-2">
              {card.networks.slice(0, 3).map((net, index) => {
                const style = NETWORK_STYLES[net] || { border: 'border-r-gray-200' };
                return (
                  <div
                    key={net}
                    className={`flex min-w-[70px] items-center justify-center border border-r-4 bg-white px-2 py-1 shadow-sm ${style.border} ${networkRotateStyles[index % 3]} `}
                  >
                    <span className="subhead2 font-bold">#{getNetworkLabel(net)}</span>
                  </div>
                );
              })}
            </div>

            {/* 프로필 링 */}
            <div className="text-custom-purple relative size-[180px]">
              <svg className="size-full -rotate-90">
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (matchingPercent / 100) * circumference}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              {/* 내부 이미지 */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative z-10 size-[164px] overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-lg">
                  {card.profileImageUrl ? (
                    <Image
                      src={card.profileImageUrl}
                      alt={card.nickname}
                      fill
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

            {/* DSTI 배지 */}
            <div className="absolute top-2 -left-4 z-20">
              {' '}
              <div className="subhead1 text-custom-deeppurple border-custom-lightpurple flex size-16 items-center justify-center rounded-full border-2 bg-white shadow-md">
                {card.dsti}
              </div>
            </div>

            {/* 매칭 퍼센트 배지 */}
            <div className="absolute bottom-2 -left-4 z-20">
              {' '}
              <div className="border-custom-lightpurple flex size-16 flex-col items-center justify-center rounded-full border-2 bg-white shadow-md">
                <span className="subhead1 text-custom-deeppurple">{matchingPercent}%</span>
                <span className="text-custom-deepnavy footout">성향 매치</span>
              </div>
            </div>
          </div>

          {/* Name & Github */}
          <div className="mb-4 flex items-center gap-2">
            <h2 className="text-custom-deepnavy title1">{card.nickname}</h2>
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
          <div className="mb-2.5 flex flex-wrap justify-center gap-1">
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
            <h3 className="text-custom-deepnavy body1 mb-2">주요 기술</h3>
            <div className="flex flex-wrap gap-1">
              {card.techSkills.map((skill) => {
                const iconSrc = TECH_SKILL_ICONS[skill];
                const label = getTechSkillLabel(skill);
                const displayLabel = label.length > 6 ? `${label.slice(0, 6)}...` : label;

                return (
                  <div key={skill} className="flex w-[52px] flex-col items-center gap-1">
                    <div className="border-custom-lightpurple flex size-[52px] items-center justify-center rounded-xl border p-0.5">
                      {iconSrc ? (
                        <div className="relative size-10">
                          <Image
                            src={iconSrc}
                            alt={label}
                            fill
                            draggable={false}
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="flex size-10 items-center justify-center text-gray-400">
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
          <section className="mb-4 flex w-full flex-col">
            <div className="flex items-end justify-between px-1">
              <h3 className="text-custom-deepnavy body1 mb-2 leading-none">자기소개</h3>

              {/* career/experience 탭 모양 뱃지 */}
              <div className="flex gap-1">
                <div className="bg-custom-lightpurple footout text-custom-deepgray rounded-t-lg px-3 py-1">
                  #{CAREER_LABELS[card.career] || card.career}
                </div>
                {card.experience && (
                  <div className="bg-custom-lightpurple footout text-custom-deepgray rounded-t-lg px-3 py-1">
                    #경력
                  </div>
                )}
              </div>
            </div>

            {/* 자기소개 박스 */}
            <div className="border-custom-lightpurple text-custom-deepnavy subhead3 min-h-[150px] w-full rounded-2xl rounded-tr-none border bg-white p-4 leading-relaxed whitespace-pre-wrap">
              {card.selfIntro || '자기소개가 없습니다.'}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
