'use client';

import { useEffect, useState } from 'react';

import { webSocketService } from '@/services/chat/websocket';
import { ConnectionStatus } from '@/types/webSocket';

/**
 * WebSocket 디버그 패널
 *
 * 표시 정보:
 * - 연결 상태 (CONNECTED, CONNECTING, DISCONNECTED, ERROR)
 * - 구독 중인 채팅방 수
 * - 마지막 연결 시각
 * - 연결/해제 버튼
 *
 * @example
 * // app/layout.tsx에 추가
 * {process.env.NODE_ENV === 'development' && <WebSocketDebugPanel />}
 */

export function WebSocketDebugPanel() {
  const [status, setStatus] = useState<ConnectionStatus>('DISCONNECTED');
  const [subscribedRooms, setSubscribedRooms] = useState<number[]>([]);
  const [isChatListSubscribed, setIsChatListSubscribed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(webSocketService.getConnectionStatus());
      setSubscribedRooms(Array.from(webSocketService.messageHandlers.keys()));
      setIsChatListSubscribed(webSocketService.isSubscribedToChatList());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (process.env.NODE_ENV !== 'development') return null;

  const getStatusColor = () => {
    switch (status) {
      case 'CONNECTED':
        return 'bg-green-500';
      case 'CONNECTING':
        return 'bg-yellow-500';
      case 'ERROR':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed right-4 bottom-20 z-50 rounded-lg border border-gray-300 bg-white p-3 shadow-lg">
      <div className="mb-2 flex items-center gap-2">
        <div className={`h-3 w-3 rounded-full ${getStatusColor()}`} />
        <span className="text-xs font-semibold">WebSocket: {status}</span>
      </div>

      <div className="space-y-1 text-xs text-gray-600">
        <div>
          <span className="font-medium">채팅방 구독:</span>{' '}
          {subscribedRooms.length > 0 ? subscribedRooms.join(', ') : 'None'}
        </div>
        <div>
          <span className="font-medium">목록 구독:</span> {isChatListSubscribed ? '✅' : '❌'}
        </div>
      </div>
    </div>
  );
}
