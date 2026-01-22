'use client';

import Image from 'next/image';

import KakaoImg from '@/assets/icon/kakao-icon.svg';
import LogoImg from '@/assets/icon/logo.png';

export default function LoginPage() {
  const handleKakaoLogin = () => {
    console.log('카카오 로그인 연동 예정');

    // 백엔드에서 받을 카카오 로그인 인증 URL 예시
    // window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
  };

  return (
    <div className="bg-custom-white flex min-h-screen flex-col items-center justify-center">
      {/* 로고 영역 */}
      <div className="mb-14 flex flex-col items-center text-center">
        <div className="relative mb-4 h-40 w-40">
          <Image src={LogoImg} alt="HandShake Logo" priority className="object-contain" />
        </div>
        <h1 className="large-title text-custom-deepnavy">HandShake</h1>
      </div>

      {/* 카카오 로그인 버튼 */}
      <button
        className="text-custom-realblack flex w-full max-w-sm items-center justify-center gap-3 rounded-full bg-[#FEE500] py-4 shadow-sm transition-all hover:bg-[#FADA0A] active:scale-95"
        onClick={handleKakaoLogin}
      >
        {/* 카카오 아이콘 */}
        <Image src={KakaoImg} alt="Kakao Icon" width={24} height={24} />

        <span className="body1">카카오로 계속하기</span>
      </button>
    </div>
  );
}
