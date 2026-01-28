export const WSCHAT_EVENT = {
  MESSAGE: 'message',
  TYPING: 'typing',
  READ: 'read',
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
} as const;

export type WSCHATEventType = (typeof WSCHAT_EVENT)[keyof typeof WSCHAT_EVENT];

// 메시지 최대 길이
export const MESSAGE_MAX_LENGTH = 1000;

// WebSocket 재연결 지연 시간 (ms)
export const RECONNECT_DELAY = 5000;

// 타이핑 표시 지속 시간 (ms)
export const TYPING_INDICATOR_DURATION = 2000;
