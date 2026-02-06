import Image from 'next/image';
import Link from 'next/link';

import right_vector from '@/assets/icon/right_vector.svg';
import { DSTI_CHARACTERS, DSTI_INFO, DSTI_TITLES } from '@/constants/dsti';

interface ProfileCardProps {
  dsti: string;
  profileImageUrl: string;
}

export default function ProfileCard({ dsti, profileImageUrl }: ProfileCardProps) {
  const characterImg = profileImageUrl || DSTI_CHARACTERS[dsti];
  const dstiTitle = DSTI_TITLES[dsti] || '알 수 없는 유형';

  return (
    <div className="mb-4 flex gap-2">
      <div className="flex min-w-[128px] flex-col items-center justify-center rounded-[10px] bg-white py-[18px] shadow-sm">
        <div className="bg-custom-deepgray/10 relative mb-3 h-[70px] w-[70px] overflow-hidden rounded-full">
          <Image src={characterImg} alt="profile-img" fill className="object-cover" priority />
        </div>
        <p className="title1 text-custom-realblack">{dsti}</p>
        <p className="subhead1 text-custom-realblack">[{dstiTitle}]</p>
      </div>
      <div className="flex w-full flex-col gap-2">
        <div className="flex flex-1 flex-col justify-between rounded-[10px] bg-white px-5 py-4 shadow-sm">
          <div className="flex flex-col gap-1.5">
            {dsti.split('').map((char, index) => {
              const info = DSTI_INFO[char] || { label: char, desc: '' };
              return (
                <div key={`${char}-${index}`} className="flex flex-col items-start">
                  <span className="text-custom-realwhite bg-custom-blue footout mb-0.5 rounded-[30px] px-2 py-[1px]">
                    {info.label}
                  </span>
                  <span className="footout text-custom-blue">{info.copy}</span>
                </div>
              );
            })}
          </div>
        </div>
        <Link
          href="/dsti"
          className="bg-custom-blue flex w-full items-center justify-center rounded-[10px] px-[14px] py-2 text-white shadow-sm"
        >
          <span className="footout flex-1 text-center">DSTI 상세 정보</span>
          <Image src={right_vector} alt="arrow-right" width={4} height={4} />
        </Link>
      </div>
    </div>
  );
}
