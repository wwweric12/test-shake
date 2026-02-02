import Image from 'next/image';

import backIcon from '@/assets/icon/back.svg';

interface ProfileHeaderProps {
  nickname: string;
  onBack: () => void;
}

export function ProfileHeader({ nickname, onBack }: ProfileHeaderProps) {
  return (
    <header className="bg-custom-white sticky top-0 z-50 px-5 pt-6 pb-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex h-6 w-6 items-center justify-center transition-opacity hover:opacity-70"
        >
          <Image src={backIcon} alt="뒤로가기" />
        </button>
        <h1 className="body2 text-custom-realblack font-medium">{nickname}님의 프로필</h1>
        <div className="w-6" />
      </div>
    </header>
  );
}
