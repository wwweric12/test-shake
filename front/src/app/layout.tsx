import type { Metadata } from 'next';

import { MSWProvider } from '@/providers/MSWProvider';
import { QueryProvider } from '@/providers/QueryProvider';

import './globals.css';

export const metadata: Metadata = {
  title: 'HandShake',
  description: '개발 성향 분석을 통한 실시간 개발자 매칭 서비스',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full">
      <body className="flex h-full justify-center bg-white md:bg-gray-100">
        <QueryProvider>
          <MSWProvider>
            <div className="bg-custom-white relative flex h-dvh w-full max-w-[440px] min-w-[375px] flex-col overflow-hidden shadow-xl">
              <main className="custom-scrollbar flex flex-1 flex-col overflow-y-auto">
                {children}
              </main>
            </div>
          </MSWProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
