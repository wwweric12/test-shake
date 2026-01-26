'use client';

import { useEffect, useState } from 'react';

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function enableMocking() {
      if (typeof window !== 'undefined') {
        if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
          const { worker } = await import('@/mocks/browser');
          await worker.start({
            onUnhandledRequest: 'bypass',
          });
        }
      }
      setIsReady(true);
    }

    enableMocking();
  }, []);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}
