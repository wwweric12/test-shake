/**
 * 채팅 시간 포맷팅 유틸
 */

/**
 * 채팅 메시지 시간 포맷팅
 * - 24시간 이내: 오전/오후 hh:mm
 * - 24시간 이후: M월 D일
 *
 * @param timestamp - ISO 8601 형식 날짜 문자열
 * @returns 포맷된 시간 문자열
 *
 * @example
 * formatChatTime('2026-02-02T10:30:00') // '오전 10:30'
 * formatChatTime('2026-01-30T10:30:00') // '1월 30일'
 */
export function formatChatTime(timestamp?: string): string {
  if (!timestamp) return '';

  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    // 24시간 이내면 시간만 표시
    if (diffInHours < 24) {
      return date.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    }

    // 24시간 이후면 날짜 표시
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

/**
 * 채팅 메시지 시간만 포맷팅 (날짜 구분 없이)
 * - 항상 오전/오후 hh:mm 형식
 *
 * @param timestamp - ISO 8601 형식 날짜 문자열
 * @returns 포맷된 시간 문자열
 *
 * @example
 * formatMessageTime('2026-02-02T10:30:00') // '오전 10:30'
 * formatMessageTime('2026-01-30T15:45:00') // '오후 3:45'
 */
export function formatMessageTime(timestamp?: string): string {
  if (!timestamp) return '';

  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return '';
  }
}
