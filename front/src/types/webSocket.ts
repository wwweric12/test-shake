// /**
//  * WebSocket/STOMP 관련 타입 정의
//  * 백엔드 STOMP 설정과 일치하도록 구성
//  */

// /**
//  * WebSocket 연결 상태
//  */
// export type ConnectionStatus = 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'ERROR';

// /**
//  * WebSocket 연결 설정
//  */
// export interface WebSocketConfig {
//   url: string; // WebSocket 엔드포인트 URL (예: https://api.hand-shake.site/ws)
//   reconnectDelay?: number; // 재연결 대기 시간 (ms)
//   heartbeatIncoming?: number; // 서버로부터 heartbeat 수신 간격 (ms)
//   heartbeatOutgoing?: number; // 서버로 heartbeat 전송 간격 (ms)
//   debug?: boolean; // 디버그 모드
// }

// /**
//  * 백엔드 /pub/chat/{chatRoomId}/send 요청 Payload
//  * @MessageMapping("/chat/{chatRoomId}/send")
//  */
// export interface SendMessagePayload {
//   content: string; // 메시지 내용
// }

// /**
//  * 백엔드 /sub/chat/{chatRoomId} 구독 시 수신하는 메시지
//  * ChatMessageResponse 타입
//  */
// export interface ReceivedChatMessage {
//   messageId: string; // 메시지 ID
//   chatRoomId: number; // 채팅방 ID
//   senderId: number; // 발신자 ID
//   senderName: string; // 발신자 닉네임
//   senderProfileImageUrl: string; // 발신자 프로필 이미지
//   content: string; // 메시지 내용
//   sentAt: string; // 전송 시각 (ISO 8601 형식: 2026-01-29T21:11:01)
//   isRead: boolean; // 읽음 여부
// }

// /**
//  * WebSocket 연결 상태 정보
//  */
// export interface WebSocketConnectionState {
//   status: ConnectionStatus; // 연결 상태
//   error: Error | null; // 에러 정보
//   isConnecting: boolean; // 연결 중 여부
//   isConnected: boolean; // 연결됨 여부
// }

// /**
//  * STOMP 구독 정보
//  */
// export interface StompSubscription {
//   chatRoomId: number; // 채팅방 ID
//   unsubscribe: () => void; // 구독 해제 함수
// }

// /**
//  * WebSocket 이벤트 리스너 타입
//  */
// export interface WebSocketEventListeners {
//   onConnect?: () => void; // 연결 성공 시
//   onDisconnect?: () => void; // 연결 해제 시
//   onError?: (error: Error) => void; // 에러 발생 시
//   onMessage?: (message: ReceivedChatMessage) => void; // 메시지 수신 시
// }
/**
 * WebSocket/STOMP 관련 타입 정의
 * 백엔드 STOMP 설정과 일치하도록 구성
 */

/**
 * WebSocket 연결 상태
 */
export type ConnectionStatus = 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'ERROR';

/**
 * WebSocket 연결 설정
 */
export interface WebSocketConfig {
  url: string; // WebSocket 엔드포인트 URL (예: https://api.hand-shake.site/ws)
  reconnectDelay?: number; // 재연결 대기 시간 (ms)
  heartbeatIncoming?: number; // 서버로부터 heartbeat 수신 간격 (ms)
  heartbeatOutgoing?: number; // 서버로 heartbeat 전송 간격 (ms)
  debug?: boolean; // 디버그 모드
}

/**
 * 백엔드 /pub/chat/{chatRoomId}/send 요청 Payload
 * @MessageMapping("/chat/{chatRoomId}/send")
 */
export interface SendMessagePayload {
  content: string; // 메시지 내용
}

/**
 * 백엔드 /sub/chat/{chatRoomId} 구독 시 수신하는 메시지
 * ChatMessageResponse 타입
 */
export interface ReceivedChatMessage {
  messageId: string; // 메시지 ID
  chatRoomId: number; // 채팅방 ID
  senderId: number; // 발신자 ID
  senderName: string; // 발신자 닉네임
  senderProfileImageUrl: string; // 발신자 프로필 이미지
  content: string; // 메시지 내용
  sentAt: string; // 전송 시각 (ISO 8601 형식: 2026-01-29T21:11:01)
  isRead: boolean; // 읽음 여부
}

/**
 * WebSocket 연결 상태 정보
 */
export interface WebSocketConnectionState {
  status: ConnectionStatus; // 연결 상태
  error: Error | null; // 에러 정보
  isConnecting: boolean; // 연결 중 여부
  isConnected: boolean; // 연결됨 여부
}

/**
 * STOMP 구독 정보
 */
export interface StompSubscription {
  chatRoomId: number; // 채팅방 ID
  unsubscribe: () => void; // 구독 해제 함수
}

/**
 * WebSocket 이벤트 리스너 타입
 */
export interface WebSocketEventListeners {
  onConnect?: () => void; // 연결 성공 시
  onDisconnect?: () => void; // 연결 해제 시
  onError?: (error: Error) => void; // 에러 발생 시
  onMessage?: (message: ReceivedChatMessage) => void; // 메시지 수신 시
}
