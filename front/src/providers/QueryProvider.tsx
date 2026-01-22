'use client';

import { useState } from 'react';

import { removeAccessToken } from '@/utils/token';

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
        // TODO: 에러 핸들링 추가(재시도 로직 )
        queryCache: new QueryCache({
          onError: (error) => {
            if (error.message.includes('401')) {
              removeAccessToken();
              window.location.href = '/login';
            }
          },
        }),
        // TODO: 에러 핸들링 추가(재시도 로직 )
        mutationCache: new MutationCache({
          onError: (error) => {
            if (error.message.includes('401')) {
              removeAccessToken();
              window.location.href = '/login';
            }
          },
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
