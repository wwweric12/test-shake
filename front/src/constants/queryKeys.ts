export const QUERY_KEYS = {
  AUTH: {
    ALL: ['auth'] as const,
    USER: () => [...QUERY_KEYS.AUTH.ALL, 'user'] as const,
  },
  USER: {
    ALL: ['user'] as const,
    INFO: () => [...QUERY_KEYS.USER.ALL, 'info'] as const,
    CARD: () => [...QUERY_KEYS.USER.ALL, 'card'] as const,
    NICKNAME: (nickname: string) => [...QUERY_KEYS.USER.ALL, 'nickname', nickname] as const,
  },
  HOME: {
    ALL: ['home'] as const,
    SUMMARY: () => [...QUERY_KEYS.HOME.ALL, 'summary'] as const,
  },
  NOTIFICATION: {
    ALL: ['notification'] as const,
    LIST: () => [...QUERY_KEYS.NOTIFICATION.ALL, 'list'] as const,
  },
  CHAT: {
    ALL: ['chat'] as const,
    ROOMS: () => [...QUERY_KEYS.CHAT.ALL, 'rooms'] as const,
    MESSAGES: (roomId: number) => [...QUERY_KEYS.CHAT.ALL, 'messages', roomId] as const,
  },
  RECOMMENDATION: {
    ALL: ['recommendation'] as const,
    CANDIDATES: (limit?: number) =>
      [...QUERY_KEYS.RECOMMENDATION.ALL, 'candidates', limit] as const,
  },
} as const;
