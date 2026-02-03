import { useSyncExternalStore } from 'react';

// 브라우저 환경인지 확인 (Hydration Mismatch 방지용)
export function useIsClient() {
  return useSyncExternalStore(
    () => () => {}, // 서버/클라이언트 변화 구독할 필요 없음 (항상 고정)
    () => true, // 클라이언트에서는 true
    () => false, // 서버에서는 false
  );
}

// PWA 모드 확인
export function useStandalone() {
  return useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia('(display-mode: standalone)');
      mq.addEventListener('change', callback);
      return () => mq.removeEventListener('change', callback);
    },
    () =>
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true,
    () => false,
  );
}
