import LayoutWrapper from '@/components/common/LayoutWrapper';
import { WebSocketDebugPanel } from '@/components/debug/WebSocketDebugPanel';
import { WebSocketProvider } from '@/providers/WebSocketProvider';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <WebSocketProvider enabled={true}>
      <div className="bg-custom-white relative flex h-dvh w-full max-w-[440px] min-w-[375px] flex-col overflow-hidden shadow-xl">
        <main className="custom-scrollbar flex flex-1 flex-col overflow-y-auto">
          <LayoutWrapper>
            {children}
            {process.env.NODE_ENV === 'development' && <WebSocketDebugPanel />}
          </LayoutWrapper>
        </main>
      </div>
    </WebSocketProvider>
  );
}
