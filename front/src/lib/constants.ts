// 전역 상수 정의
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
// 개발 모드에서는 mock 사용, 프로덕션에서는 실제 서버 사용
export const USE_MOCK_SOCKET = process.env.NEXT_PUBLIC_USE_MOCK_SOCKET !== 'false';

export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  MESSAGE: 'message',
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  TYPING: 'typing',
  ERROR: 'error',
} as const;

export const CHAT_LIMITS = {
  MAX_MESSAGE_LENGTH: 1000,
  MAX_ROOM_USERS: 50,
} as const;
