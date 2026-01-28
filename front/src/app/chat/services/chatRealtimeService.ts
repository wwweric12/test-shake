import mitt, { Emitter } from 'mitt';

import { ChatMessage } from '@/app/chat/types/models';

/**
 * ===============================
 * 이벤트 타입 정의
 * ===============================
 */
type ChatRealtimeEvents = {
  message: ChatMessage;
  // typing: { roomId: number; userId: string; isTyping: boolean };
  // read: { roomId: number; messageId: string };
};

/**
 * ===============================
 * Realtime Service
 * - 지금: mitt (Mock)
 * - 나중: WebSocket 내부 구현 교체
 * ===============================
 */
class ChatRealtimeService {
  private emitter: Emitter<ChatRealtimeEvents>;

  constructor() {
    this.emitter = mitt<ChatRealtimeEvents>();
  }

  /**
   * 메시지 전송 (mock)
   */
  async sendMessage(roomId: number, content: string, senderId: string): Promise<ChatMessage> {
    // 네트워크 지연 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 200));

    const message: ChatMessage = {
      id: crypto.randomUUID(),
      roomId,
      senderId,
      content,
      createdAt: new Date().toISOString(),
      isMine: true,
    };

    // 🔥 핵심: 이벤트 발생
    this.emitter.emit('message', message);

    return message;

    /**
     * ===============================
     * 🔥 WebSocket 전환 시 (예시)
     * ===============================
     *
     * this.socket.send(
     *   JSON.stringify({
     *     type: 'message',
     *     payload: { roomId, content },
     *   }),
     * );
     */
  }

  /**
   * 메시지 수신 구독
   */
  subscribeMessage(callback: (message: ChatMessage) => void) {
    this.emitter.on('message', callback);

    return () => {
      this.emitter.off('message', callback);
    };

    /**
     * ===============================
     * 🔥 WebSocket 전환 시 (예시)
     * ===============================
     *
     * this.socket.onmessage = (event) => {
     *   const data = JSON.parse(event.data);
     *   if (data.type === 'message') {
     *     callback(data.payload);
     *   }
     * };
     */
  }
}

/**
 * ✅ 앱 전역 싱글톤
 */
export const chatRealtimeService = new ChatRealtimeService();
