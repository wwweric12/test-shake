'use client';

import Image from 'next/image';

import CameraIcon from '@/assets/icon/camera.svg';

interface MyPageProfileProps {
  nickname: string;
  profileImageUrl?: string;
  onLogout: () => void;
}

export function MyPageProfile({ nickname, profileImageUrl, onLogout }: MyPageProfileProps) {
  const handleImageUpload = () => {
    alert('프로필 이미지 수정 기능은 준비 중입니다.');
  };

  return (
    <div className="mb-6 flex flex-col items-center justify-center">
      <div className="relative mb-3">
        <div className="relative h-[150px] w-[150px] overflow-hidden rounded-full border border-gray-100 bg-gray-50">
          {/* Fallback to a placeholder if empty */}
          <Image
            src={profileImageUrl || 'https://github.com/shadcn.png'}
            alt="Profile"
            fill
            className="object-cover"
          />
        </div>
        <button
          onClick={handleImageUpload}
          className="absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-transform active:scale-95"
          type="button"
        >
          <Image src={CameraIcon} alt="Edit" width={20} height={20} />
        </button>
      </div>

      <h2 className="title2 text-custom-realblack mb-2">{nickname}</h2>

      <button
        onClick={onLogout}
        className="caption1 text-custom-blue border-custom-blue rounded-full border bg-white px-3 py-1 transition-colors hover:bg-blue-50"
      >
        로그아웃
      </button>
    </div>
  );
}
