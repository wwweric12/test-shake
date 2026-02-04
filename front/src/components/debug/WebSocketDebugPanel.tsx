'use client';

import { useEffect, useState } from 'react';

import { webSocketService } from '@/services/socket/WebSocketService';
import { ConnectionStatus } from '@/types/webSocket';

interface LogEntry {
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

/**
 * 강화된 WebSocket 디버그 패널
 *
 * 추가된 기능:
 * - 상세 이벤트 로그
 * - 구독/해제 이력
 * - 재연결 시도 횟수
 * - 마지막 메시지 수신 시각
 */
export function WebSocketDebugPanel() {
  const [status, setStatus] = useState<ConnectionStatus>('DISCONNECTED');
  const [subscribedRooms, setSubscribedRooms] = useState<number[]>([]);
  const [isChatListSubscribed, setIsChatListSubscribed] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastMessageTime, setLastMessageTime] = useState<string>('');
  const [reconnectCount, setReconnectCount] = useState(0);

  // 로그 추가 헬퍼
  const addLog = (type: LogEntry['type'], message: string) => {
    const timestamp = new Date().toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    });

    setLogs((prev) => {
      const newLogs = [{ timestamp, type, message }, ...prev];
      return newLogs.slice(0, 50); // 최근 50개만 유지
    });
  };

  useEffect(() => {
    let prevStatus = webSocketService.getConnectionStatus();
    let prevRooms = Array.from(webSocketService.messageHandlers.keys());
    let prevChatList = webSocketService.isSubscribedToChatList();

    const interval = setInterval(() => {
      const currentStatus = webSocketService.getConnectionStatus();
      const currentRooms = Array.from(webSocketService.messageHandlers.keys());
      const currentChatList = webSocketService.isSubscribedToChatList();

      // 상태 변경 감지 및 로깅
      if (currentStatus !== prevStatus) {
        addLog(
          currentStatus === 'CONNECTED'
            ? 'success'
            : currentStatus === 'ERROR'
              ? 'error'
              : 'warning',
          `연결 상태 변경: ${prevStatus} → ${currentStatus}`,
        );

        if (currentStatus === 'CONNECTED' && prevStatus === 'CONNECTING') {
          setReconnectCount((prev) => prev + 1);
        }

        prevStatus = currentStatus;
      }

      // 채팅방 구독 변경 감지
      if (JSON.stringify(currentRooms) !== JSON.stringify(prevRooms)) {
        const added = currentRooms.filter((r) => !prevRooms.includes(r));
        const removed = prevRooms.filter((r) => !currentRooms.includes(r));

        if (added.length > 0) {
          addLog('success', `채팅방 구독: ${added.join(', ')}`);
        }
        if (removed.length > 0) {
          addLog('warning', `채팅방 구독 해제: ${removed.join(', ')}`);
        }

        prevRooms = currentRooms;
      }

      // 채팅 목록 구독 변경 감지
      if (currentChatList !== prevChatList) {
        addLog(
          currentChatList ? 'success' : 'warning',
          `목록 구독: ${currentChatList ? '✅ 활성' : '❌ 비활성'}`,
        );
        prevChatList = currentChatList;
      }

      setStatus(currentStatus);
      setSubscribedRooms(currentRooms);
      setIsChatListSubscribed(currentChatList);
    }, 500); // 500ms마다 체크 (더 민감하게)

    return () => clearInterval(interval);
  }, []);

  // WebSocket 메시지 수신 감지 (실제 구현 시 webSocketService에 리스너 추가 필요)
  useEffect(() => {
    // 메시지 수신 시각 업데이트를 위한 전역 이벤트 리스너
    const handleMessage = () => {
      const now = new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setLastMessageTime(now);
      addLog('info', '메시지 수신');
    };

    // 실제 구현에서는 webSocketService에 리스너 등록
    window.addEventListener('websocket-message', handleMessage);
    return () => window.removeEventListener('websocket-message', handleMessage);
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

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="fixed right-4 bottom-20 z-50 rounded-lg border border-gray-300 bg-white shadow-lg">
      {/* 헤더 */}
      <div className="cursor-pointer p-3" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${getStatusColor()} animate-pulse`} />
            <span className="text-xs font-semibold">WebSocket: {status}</span>
          </div>
          <button className="text-xs text-gray-500">{isExpanded ? '▼' : '▲'}</button>
        </div>

        <div className="space-y-1 text-xs text-gray-600">
          <div>
            <span className="font-medium">채팅방 구독:</span>{' '}
            {subscribedRooms.length > 0 ? subscribedRooms.join(', ') : 'None'}
          </div>
          <div className="flex items-center justify-between">
            <span>
              <span className="font-medium">목록 구독:</span> {isChatListSubscribed ? '✅' : '❌'}
            </span>
            {!isChatListSubscribed && status === 'CONNECTED' && (
              <span className="font-bold text-red-500">⚠️ 구독 끊김!</span>
            )}
          </div>
          <div>
            <span className="font-medium">재연결 횟수:</span> {reconnectCount}
          </div>
          {lastMessageTime && (
            <div>
              <span className="font-medium">마지막 메시지:</span> {lastMessageTime}
            </div>
          )}
        </div>
      </div>

      {/* 확장 영역 - 로그 */}
      {isExpanded && (
        <div className="max-h-96 overflow-y-auto border-t border-gray-200 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-xs font-semibold">이벤트 로그</h4>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLogs([]);
              }}
              className="text-xs text-blue-500 hover:underline"
            >
              Clear
            </button>
          </div>

          {/* 액션 버튼 */}
          <div className="mb-3 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                webSocketService.connect({
                  url: process.env.NEXT_PUBLIC_WS_URL!,
                  heartbeatIncoming: 10000,
                  heartbeatOutgoing: 10000,
                  debug: true,
                });
                addLog('info', '수동 연결 시도');
              }}
            >
              연결
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                webSocketService.disconnect();
                addLog('info', '수동 연결 해제');
              }}
              className="rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
            >
              해제
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // 강제 재구독 (실제 구현 필요)
                addLog('info', '채팅 목록 재구독 시도');
                // webSocketService.resubscribeToChatList();
              }}
              className="rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
            >
              목록 재구독
            </button>
          </div>

          {/* 로그 리스트 */}
          <div className="space-y-1">
            {logs.length === 0 ? (
              <p className="text-xs text-gray-400">이벤트 없음</p>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="rounded border border-gray-100 bg-gray-50 p-2">
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] whitespace-nowrap text-gray-400">
                      {log.timestamp}
                    </span>
                    <span className={`font-mono text-[10px] ${getLogColor(log.type)}`}>
                      {log.message}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
