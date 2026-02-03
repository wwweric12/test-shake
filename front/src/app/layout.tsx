import type { Metadata, Viewport } from 'next';

import LayoutWrapper from '@/components/common/LayoutWrapper';
import { WebSocketDebugPanel } from '@/components/debug/WebSocketDebugPanel';
import { MSWProvider } from '@/providers/MSWProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { WebSocketProvider } from '@/providers/WebSocketProvider';

import './globals.css';

export const metadata: Metadata = {
  title: 'HandShake',
  description: '개발 성향 분석을 통한 실시간 개발자 매칭 서비스',
  manifest: '/manifest.json',
  icons: {
    apple: '/icons/icon-192x192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#f9f8fe',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full">
      <body className="flex h-full justify-center bg-white md:bg-gray-100">
        <QueryProvider>
          <MSWProvider>
            <WebSocketProvider enabled={true}>
              <div className="bg-custom-white relative flex h-dvh w-full max-w-[440px] min-w-[375px] flex-col overflow-hidden shadow-xl">
                <main className="custom-scrollbar flex flex-1 flex-col overflow-y-auto">
                  <LayoutWrapper>
                    {children}
                    {/* 개발 환경에서만 디버그 패널 표시 */}
                    {process.env.NODE_ENV === 'development' && <WebSocketDebugPanel />}
                  </LayoutWrapper>
                </main>
              </div>
            </WebSocketProvider>
          </MSWProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
