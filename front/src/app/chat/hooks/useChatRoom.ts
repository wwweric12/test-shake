'use client';

import { useCallback, useState } from 'react';

import { messageService } from '@/app/chat/services/messageService';
import { ChatMessage } from '@/app/chat/types/models';

interface UseChatRoomParams {
  roomId: number;
  currentUserId: string;
  initialMessages?: ChatMessage[];
}

export function useChatRoom({ roomId, currentUserId, initialMessages = [] }: UseChatRoomParams) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const sendMessage = useCallback(
    async (content: string) => {
      // 🔥 optimistic update
      const optimisticMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        roomId,
        senderId: currentUserId,
        content,
        createdAt: new Date().toISOString(),
        isMine: true,
      };

      setMessages((prev) => [...prev, optimisticMessage]);

      try {
        const confirmed = await messageService.send({
          roomId,
          content,
          senderId: currentUserId,
        });

        setMessages((prev) =>
          prev.map((msg) => (msg.id === optimisticMessage.id ? confirmed : msg)),
        );
      } catch {
        // 실패 시 롤백
        setMessages((prev) => prev.filter((msg) => msg.id !== optimisticMessage.id));
      }
    },
    [roomId, currentUserId],
  );

  return {
    messages,
    sendMessage,
  };
}
