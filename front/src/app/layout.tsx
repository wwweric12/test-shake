import type { Metadata } from 'next';

import { QueryProvider } from '@/providers/QueryProvider';

import './globals.css';

export const metadata: Metadata = {
  title: 'HandShake',
  description: '개발 성향 분석을 통한 실시간 개발자 매칭 서비스',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex justify-center bg-gray-100">
        <QueryProvider>
          <div className="bg-custom-white flex min-h-screen w-full max-w-[440px] min-w-[375px] flex-col overflow-x-hidden shadow-xl">
            <main className="flex h-full flex-1 flex-col px-5">{children}</main>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
