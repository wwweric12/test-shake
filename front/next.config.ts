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
        hostname: 'd2blv8nn6wgtte.cloudfront.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hand-shake-bucket.s3.ap-northeast-2.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
  // 보안 및 통신 허용 설정 추가
  async headers() {
    const cspHeader = [
      "default-src 'self';",
      // [Script] 필요한 경우 카카오 등 추가
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.kakao.com https://*.daumcdn.net;",
      // [Style] Pretendard CDN 추가
      "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;",
      // [Image] S3, CloudFront, 카카오, 다음 이미지 등
      "img-src 'self' data: https://d2blv8nn6wgtte.cloudfront.net https://hand-shake-bucket.s3.ap-northeast-2.amazonaws.com https://picsum.photos https://*.daumcdn.net https://*.kakaocdn.net;",
      // [Font] Pretendard 폰트 파일 허용
      "font-src 'self' data: https://cdn.jsdelivr.net;",
      // [Connect] API 서버와 S3 업로드 주소 모두 허용 (중요!)
      "connect-src 'self' https://api.hand-shake.site https://d2blv8nn6wgtte.cloudfront.net https://hand-shake-bucket.s3.ap-northeast-2.amazonaws.com https://*.kakao.com;",
    ].join(' ');

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
        ],
      },
    ];
  },
};

export default withPWA(nextConfig);
