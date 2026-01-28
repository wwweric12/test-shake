import { chatBus } from '@/app/chat/events/chatEventBus';
import { ChatMessage } from '@/app/chat/types/models';
import { chatApi } from '@/services/chat/api';
import { ChatMessage as ApiChatMessage } from '@/types/chat';

interface SendMessageParams {
  roomId: number;
  content: string;
  senderId: string;
}

/*
 * 메시지 서비스
 * - fetch: REST API로 이전 메시지 조회
 * - send: 실시간 메시지 전송 (현재 mitt, 나중에 WebSocket)
 */
export const messageService = {
  async fetch(roomId: number): Promise<ChatMessage[]> {
    const res = await chatApi.getChatMessages(roomId);
    const msgResponse = res.data;

    return msgResponse.map(
      (msg: ApiChatMessage): ChatMessage => ({
        id: crypto.randomUUID(),
        roomId,
        senderId: 'other-user', // API에 없음 → 임시
        content: String(msg.lastMessage ?? msg.content),
        createdAt: msg.sendTime,
        isMine: false,
      }),
    );
  },

  async send({ roomId, content, senderId }: SendMessageParams): Promise<ChatMessage> {
    // 네트워크 지연 시뮬레이션
    await new Promise((r) => setTimeout(r, 300));

    const confirmed: ChatMessage = {
      id: crypto.randomUUID(),
      roomId,
      senderId,
      content,
      createdAt: new Date().toISOString(),
      isMine: true,
    };

    // 가짜 실시간 수신 (mitt)
    chatBus.emit('message', confirmed);

    chatBus.emit('roomUpdate', { roomId, lastMessage: content });

    return confirmed;
    /**
     * ===============================
     * 🔥 WebSocket 전환 시 (예시)
     * ===============================
     *
     * this.socket.send(
     *   JSON.stringify({
     *     type: 'CHAT_MESSAGE',
     *     payload: { roomId, content, senderId },
     *   }),
     * );
     *
     * // 서버 응답 대기
     * return new Promise((resolve) => {
     *   this.socket.once('message_confirmed', (data) => {
     *     resolve(data);
     *   });
     * });
     */
  },
};
