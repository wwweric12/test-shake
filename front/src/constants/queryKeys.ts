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
} as const;
