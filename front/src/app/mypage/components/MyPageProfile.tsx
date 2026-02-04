'use client';

import { useRef } from 'react';
import Image from 'next/image';

import CameraIcon from '@/assets/icon/camera.svg';
import { DSTI_CHARACTERS } from '@/constants/dsti';
import { useUpdateProfileImageMutation } from '@/services/user/hooks';

interface MyPageProfileProps {
  nickname: string;
  profileImageUrl?: string;
  dsti: string;
  onLogout: () => void;
}

export function MyPageProfile({ nickname, profileImageUrl, onLogout, dsti }: MyPageProfileProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: uploadImage, isPending } = useUpdateProfileImageMutation();

  // 카메라 버튼 클릭 시 숨겨진 input 클릭
  const handleCameraButtonClick = () => {
    fileInputRef.current?.click();
  };

  // 파일이 선택되었을 때 실행되는 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 간단한 유효성 검사 (예: 5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB를 초과할 수 없습니다.');
      return;
    }

    uploadImage(file); // 업로드 프로세스 시작 (Presigned 발급 -> S3 업로드 -> DB 저장)
  };

  return (
    <div className="mb-6 flex flex-col items-center justify-center">
      <div className="relative mb-3">
        <div className="relative h-[150px] w-[150px] overflow-hidden rounded-full border border-gray-100 bg-gray-50">
          {/* Fallback to a placeholder if empty */}
          <Image
            src={profileImageUrl || DSTI_CHARACTERS[dsti]}
            alt="Profile"
            fill
            className="object-cover"
          />
        </div>
        {/* 카메라 버튼 */}
        <button
          onClick={handleCameraButtonClick}
          className="absolute right-0 bottom-0 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-transform active:scale-95 disabled:opacity-50"
          type="button"
          disabled={isPending}
        >
          <Image src={CameraIcon} alt="Edit" width={20} height={20} />
        </button>

        {/* 파일 선택 Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
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
