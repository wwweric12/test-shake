/**
 * WebSocket/STOMP 관련 타입 정의
 * 백엔드 STOMP 설정과 일치하도록 구성
 */
import { ReceivedMessage } from '@/types/chat';

// WebSocket 연결 상태
export type ConnectionStatus = 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'ERROR';

// WebSocket 연결 설정
export interface WebSocketConfig {
  url: string; // WebSocket 엔드포인트 URL
  reconnectDelay?: number; // 재연결 대기 시간 (ms)
  heartbeatIncoming?: number; // 서버로부터 heartbeat 수신 간격 (ms)
  heartbeatOutgoing?: number; // 서버로 heartbeat 전송 간격 (ms)
  debug?: boolean; // 디버그 모드
}

// WebSocket 연결 상태 정보
export interface WebSocketConnectionState {
  status: ConnectionStatus;
  error: Error | null;
  isConnecting: boolean;
  isConnected: boolean;
}

// STOMP 구독 정보 (채팅방용)
export interface StompSubscription {
  chatRoomId: number;
  unsubscribe: () => void;
}

// 에러 구독 정보
export interface ErrorSubscription {
  unsubscribe: () => void;
}

// 확장된 에러 타입
export interface WebSocketError extends Error {
  type?: 'PARTNER_LEFT' | 'CONNECTION_ERROR' | 'STOMP_ERROR';
}

// WebSocket 이벤트 리스너 타입
export interface WebSocketEventListeners {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: WebSocketError) => void;
  onMessage?: (message: ReceivedMessage) => void;
}

// 알림 업데이트 데이터 타입
export interface NotificationUpdateData {
  targetUserId: number;
  targetNickname: string;
  targetImageUrl: string;
  dsti: string;
  unreadCount: number;
}