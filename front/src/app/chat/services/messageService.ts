import { ChatMessage } from '@/app/chat/types/models';

interface SendMessageParams {
  roomId: number;
  content: string;
  senderId: string;
}

export const messageService = {
  send: async ({ roomId, content, senderId }: SendMessageParams): Promise<ChatMessage> => {
    // ⏳ 네트워크 지연 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 200));

    return {
      id: crypto.randomUUID(),
      roomId,
      senderId,
      content,
      createdAt: new Date().toISOString(),
      isMine: true,
    };
  },
};
