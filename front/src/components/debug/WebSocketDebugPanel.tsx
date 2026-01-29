/**
 * WebSocket 디버그 패널 컴포넌트
 *
 * 개발 환경에서 WebSocket 연결 상태를 실시간으로 확인
 * 화면 하단에 고정 표시
 */

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
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // 1초마다 상태 업데이트 (setState는 setInterval 콜백 내부에서만 호출)
    const interval = setInterval(() => {
      const connected = webSocketService.isConnected();
      const currentStatus = webSocketService.getConnectionStatus();

      setIsConnected(connected);
      setStatus(currentStatus);
      setLastUpdate(new Date().toLocaleTimeString('ko-KR'));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /**
   * 상태에 따른 색상 반환
   */
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

  /**
   * 상태에 따른 텍스트 색상
   */
  const getTextColor = () => {
    switch (status) {
      case 'CONNECTED':
        return 'text-green-600';
      case 'CONNECTING':
        return 'text-yellow-600';
      case 'ERROR':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  /**
   * 수동 연결 테스트
   */
  const handleConnect = () => {
    console.log('[Debug] 수동 연결 시도');
    webSocketService.connect({
      url: process.env.NEXT_PUBLIC_WS_URL || '',
      reconnectDelay: 3000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: true,
    });
  };

  /**
   * 수동 연결 해제 테스트
   */
  const handleDisconnect = () => {
    console.log('[Debug] 수동 연결 해제');
    webSocketService.disconnect();
  };

  if (isMinimized) {
    return (
      <div className="fixed right-4 bottom-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 rounded-full bg-gray-800 px-4 py-2 text-white shadow-lg hover:bg-gray-700"
        >
          <div className={`h-3 w-3 rounded-full ${getStatusColor()}`} />
          <span className="text-sm">WS Debug</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 min-w-[320px] rounded-lg border-2 border-gray-300 bg-white p-4 shadow-2xl">
      {/* 헤더 */}
      <div className="mb-3 flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${getStatusColor()} animate-pulse`} />
          <h3 className="font-bold text-gray-800">WebSocket Debug</h3>
        </div>
        <button onClick={() => setIsMinimized(true)} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      {/* 연결 상태 */}
      <div className="mb-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">상태:</span>
          <span className={`text-sm font-semibold ${getTextColor()}`}>{status}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">연결:</span>
          <span className="text-sm font-semibold">
            {isConnected ? '✅ 연결됨' : '❌ 연결 안됨'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">마지막 확인:</span>
          <span className="text-xs text-gray-500">{lastUpdate}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">WS URL:</span>
          <span className="max-w-[180px] truncate text-xs text-gray-500">
            {process.env.NEXT_PUBLIC_WS_URL || 'Not set'}
          </span>
        </div>
      </div>

      {/* 컨트롤 버튼 */}
      <div className="flex gap-2 border-t pt-2">
        <button
          onClick={handleConnect}
          disabled={isConnected}
          className="flex-1 rounded bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          연결
        </button>
        <button
          onClick={handleDisconnect}
          disabled={!isConnected}
          className="flex-1 rounded bg-red-500 px-3 py-1.5 text-sm text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          해제
        </button>
      </div>

      {/* 추가 정보 */}
      <div className="mt-3 border-t pt-2">
        <p className="text-xs text-gray-500">💡 콘솔에서 [WebSocket] 로그 확인</p>
      </div>
    </div>
  );
}
