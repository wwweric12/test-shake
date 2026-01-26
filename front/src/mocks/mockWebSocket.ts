/* eslint-disable no-console */
import type { WSMessage } from '@/features/chat/types';

interface MessagePayload {
  roomId: string;
  id?: string;
  content: string;
}

/**
 * Mock WebSocket - 실시간 채팅 시뮬레이션
 * 목서버 없이 WebSocket 동작을 완벽히 재현
 */
export class MockWebSocket {
  public readyState: number = WebSocket.CONNECTING;
  public onopen: ((event: Event) => void) | null = null;
  public onclose: ((event: CloseEvent) => void) | null = null;
  public onmessage: ((event: MessageEvent) => void) | null = null;
  public onerror: ((event: Event) => void) | null = null;

  private messageQueue: string[] = [];
  private typingTimeout: NodeJS.Timeout | null = null;

  constructor(url: string) {
    console.log('🔧 Mock WebSocket created:', url);

    // 연결 시뮬레이션 (100ms 후 연결됨)
    setTimeout(() => {
      this.readyState = WebSocket.OPEN;
      this.onopen?.(new Event('open'));
      console.log('✅ Mock WebSocket connected');

      // 대기 중이던 메시지 전송
      this.flushQueue();
    }, 100);
  }

  send(data: string): void {
    if (this.readyState !== WebSocket.OPEN) {
      this.messageQueue.push(data);
      return;
    }

    try {
      const parsed = JSON.parse(data) as { type: string; payload: MessagePayload };
      console.log('📤 Mock send:', parsed);

      if (parsed.type === 'message') {
        // 1. 즉시 읽음 표시 (100ms 후)
        this.sendReadReceipt(parsed.payload.roomId, parsed.payload.id || '');

        // 2. 타이핑 중 표시 (500ms 후)
        this.simulateTyping(parsed.payload.roomId);

        // 3. 스마트 자동 응답 (2-4초 후)
        const delay = 2000 + Math.random() * 2000;
        setTimeout(() => {
          this.sendAutoReply(parsed.payload);
        }, delay);
      }
    } catch (error) {
      console.error('Mock send error:', error);
    }
  }

  close(): void {
    this.readyState = WebSocket.CLOSED;
    this.stopAllTimers();
    this.onclose?.(new CloseEvent('close'));
    console.log('🔌 Mock WebSocket closed');
  }

  // ============================================
  // Private 헬퍼 메서드
  // ============================================

  private flushQueue(): void {
    while (this.messageQueue.length > 0) {
      const msg = this.messageQueue.shift();
      if (msg) this.send(msg);
    }
  }

  /**
   * 읽음 표시 전송
   */
  private sendReadReceipt(roomId: string, messageId: string): void {
    if (!this.onmessage) return;

    setTimeout(() => {
      this.onmessage?.(
        new MessageEvent('message', {
          data: JSON.stringify({
            type: 'read',
            payload: {
              roomId,
              messageId,
              readBy: 'mock-bot',
              readAt: new Date().toISOString(),
            },
          }),
        }),
      );
    }, 100);
  }

  /**
   * 타이핑 중 시뮬레이션
   */
  private simulateTyping(roomId: string): void {
    if (!this.onmessage) return;

    // 타이핑 시작
    setTimeout(() => {
      this.onmessage?.(
        new MessageEvent('message', {
          data: JSON.stringify({
            type: 'typing',
            payload: {
              roomId,
              userId: 'mock-bot',
              username: 'AI 봇',
              isTyping: true,
            },
          }),
        }),
      );
    }, 500);

    // 타이핑 종료 (2초 후)
    this.typingTimeout = setTimeout(() => {
      this.onmessage?.(
        new MessageEvent('message', {
          data: JSON.stringify({
            type: 'typing',
            payload: {
              roomId,
              userId: 'mock-bot',
              username: 'AI 봇',
              isTyping: false,
            },
          }),
        }),
      );
    }, 2000);
  }

  /**
   * 스마트 자동 응답 생성
   */
  private sendAutoReply(originalMessage: MessagePayload): void {
    if (!this.onmessage) return;

    const responses = this.generateSmartReply(originalMessage.content);
    const randomReply = responses[Math.floor(Math.random() * responses.length)];

    const replyMessage: WSMessage = {
      id: `mock-${Date.now()}`,
      roomId: originalMessage.roomId,
      senderId: 'mock-bot',
      senderName: 'AI 봇',
      content: randomReply,
      timestamp: new Date().toISOString(),
    };

    this.onmessage(
      new MessageEvent('message', {
        data: JSON.stringify({
          type: 'message',
          payload: replyMessage,
        }),
      }),
    );
  }

  /**
   * 스마트 자동 응답 생성 (내용에 따라 다른 응답)
   */
  private generateSmartReply(content: string): string[] {
    const lowerContent = content.toLowerCase();

    // 인사
    if (
      lowerContent.includes('안녕') ||
      lowerContent.includes('hi') ||
      lowerContent.includes('hello')
    ) {
      return ['안녕하세요! 반갑습니다', '네, 안녕하세요!', '안녕하세요! 무엇을 도와드릴까요?'];
    }

    // 질문
    if (lowerContent.includes('?') || lowerContent.includes('어떻게')) {
      return ['좋은 질문이네요!', '음... 한번 생각해볼게요', '그건 조금 복잡한 문제인데요...'];
    }

    // 감사
    if (lowerContent.includes('감사') || lowerContent.includes('고마워')) {
      return ['천만에요!', '도움이 되었다니 기쁩니다!', '별말씀을요 ㅎㅎ'];
    }

    // 시간 관련
    if (lowerContent.includes('시간') || lowerContent.includes('언제')) {
      return [
        '시간 확인해보고 알려드릴게요!',
        '일정 조정이 필요할 것 같네요',
        '오후 3시쯤 어떠세요?',
      ];
    }

    // 회의 관련
    if (lowerContent.includes('회의') || lowerContent.includes('미팅')) {
      return [
        '회의 일정 조율해볼게요!',
        '온라인으로 할까요, 오프라인으로 할까요?',
        '회의실 예약 먼저 해두겠습니다',
      ];
    }

    // 개발 관련
    if (
      lowerContent.includes('코드') ||
      lowerContent.includes('개발') ||
      lowerContent.includes('프로젝트')
    ) {
      return [
        '프로젝트 진행 상황 공유드립니다!',
        '코드 리뷰 부탁드려요',
        '개발 일정 체크해보겠습니다',
      ];
    }

    // 기본 응답
    return ['네, 알겠습니다!', '좋아요!', '확인했습니다', '그렇군요!', '오케이!', '네네 ㅎㅎ'];
  }

  // 모든 타이머 정리
  private stopAllTimers(): void {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = null;
    }
  }

  // WebSocket 표준 상수
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;
}
