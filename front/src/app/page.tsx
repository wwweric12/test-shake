'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import LogoImg from '@/assets/icon/logo.png';
import { useIsClient, useStandalone } from '@/hooks/usePWA';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function InstallPrompt() {
  const router = useRouter();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  const isClient = useIsClient();
  const isStandalone = useStandalone();
  const isIos = isClient && /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());

  useEffect(() => {
    if (isStandalone) {
      router.replace('/home');
    }
  }, [isStandalone, router]);

  useEffect(() => {
    if (!isClient) return;

    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
  }, [isClient]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  const handleLoginClick = () => {
    router.push('/login');
  };

  if (!isClient || isStandalone) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-[#F9F8FE] to-[#E0D7FE]">
        <div className="relative mb-6 h-32 w-32 animate-pulse">
          <Image src={LogoImg} alt="HandShake Logo" fill className="object-contain" priority />
        </div>
        <p className="text-custom-deepnavy animate-pulse text-lg font-medium">HandShake</p>
      </div>
    );
  }

  // 브라우저: 설치 유도 모달
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5 backdrop-blur-sm">
      <div className="animate-in fade-in zoom-in relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl duration-300">
        {/* 상단 장식 그라데이션 */}
        <div className="h-2 w-full bg-linear-to-r from-indigo-500 to-purple-500" />

        <div className="p-6 text-center">
          <div className="relative mx-auto mb-4 h-20 w-20">
            <Image src={LogoImg} alt="App Icon" fill className="object-contain drop-shadow-md" />
          </div>

          <h3 className="mb-2 text-xl font-bold text-gray-900">앱으로 더 편하게!</h3>
          <p className="mb-6 text-sm leading-relaxed whitespace-pre-line text-gray-500">
            {isIos
              ? '홈 화면에 추가하여 앱처럼 사용해보세요.\n 알림도 받을 수 있어요!'
              : '앱을 설치하면 더 빠르고 편리하게 HandShake를 이용할 수 있습니다.'}
          </p>

          <div className="flex flex-col gap-3">
            {/* 설치 버튼 (안드로이드/PC) */}
            {!isIos && deferredPrompt && (
              <button
                onClick={handleInstallClick}
                className="w-full rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 py-3.5 font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-95"
              >
                앱 설치하고 시작하기
              </button>
            )}

            {/* iOS 가이드 */}
            {isIos && (
              <div className="mb-2 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
                <p className="mb-2 text-gray-900">
                  Safari에서⬇️ 하단, <br />
                  Chrome에서 오른쪽 상단↗️
                  <br />
                  <span className="font-bold text-blue-600">공유 버튼</span>을 누르고
                </p>

                <p>
                  <span className="font-bold text-gray-900">홈 화면에 추가</span>를 선택하세요!
                </p>
              </div>
            )}

            {/* 그냥 로그인하기 (설치 안함) */}
            <button
              onClick={handleLoginClick}
              className="w-full rounded-xl border border-gray-200 bg-white py-3.5 font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              웹으로 계속하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
