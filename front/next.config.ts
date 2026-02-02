import type { NextConfig } from 'next';

import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public', // 서비스 워커 파일이 생성될 위치
  cacheOnFrontEndNav: true, // 프론트엔드 네비게이션 시 캐싱 활성화
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true, // 온라인 상태가 되면 새로고침
  disable: process.env.NODE_ENV === 'development', // 개발 환경에서는 PWA 비활성화
  workboxOptions: {
    disableDevLogs: true, // 개발 시 불필요한 로그 숨김
  },
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
};

export default withPWA(nextConfig);
