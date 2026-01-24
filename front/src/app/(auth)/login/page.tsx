'use client';

import Image from 'next/image';

import KakaoImg from '@/assets/icon/kakao-icon.svg';
import LogoImg from '@/assets/icon/logo.png';

export default function LoginPage() {
  const handleKakaoLogin = () => {
    console.log('카카오 로그인 연동 예정');
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      {/* 1. 로고와 타이틀 영역 */}
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4 h-40 w-40">
          <Image src={LogoImg} alt="HandShake Logo" priority className="object-contain" fill />
        </div>
        <h1 className="large-title text-custom-deepnavy">HandShake</h1>
      </div>

      {/* 2. 간격 조절용 공간 */}
      <div className="mb-10" />

      {/* 3. 카카오 로그인 버튼 */}
      <div className="w-full">
        <button
          className="text-custom-realblack flex h-[56px] w-full items-center justify-center gap-3 rounded-full bg-[#FEE500] shadow-sm transition-all hover:bg-[#FADA0A] active:scale-95"
          onClick={handleKakaoLogin}
        >
          <Image src={KakaoImg} alt="Kakao Icon" width={24} height={24} />
          <span className="body1 font-semibold">카카오로 계속하기</span>
        </button>
      </div>
    </div>
  );
}
