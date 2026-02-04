import LayoutWrapper from '@/components/common/LayoutWrapper';
import { WebSocketDebugPanel } from '@/components/debug/WebSocketDebugPanel';
import { WebSocketProvider } from '@/providers/WebSocketProvider';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <WebSocketProvider enabled={true}>
      <LayoutWrapper>
        {children}
        {/* 개발 환경에서만 디버그 패널 표시 */}
        {process.env.NODE_ENV === 'development' && <WebSocketDebugPanel />}
      </LayoutWrapper>
    </WebSocketProvider>
  );
}
