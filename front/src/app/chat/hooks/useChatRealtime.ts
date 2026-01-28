'use client';

import { useCallback, useEffect, useState } from 'react';

import { chatRealtimeService } from '@/app/chat/services/chatRealtimeService';
import { ChatMessage } from '@/app/chat/types/models';

interface UseChatRealtimeParams {
  roomId: number;
  currentUserId: string;
  initialMessages: ChatMessage[];
}

export function useChatRealtime({ roomId, currentUserId, initialMessages }: UseChatRealtimeParams) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  useEffect(() => {
    const unsubscribe = chatRealtimeService.subscribeMessage((message) => {
      if (message.roomId !== roomId) return;

      setMessages((prev) => {
        // optimistic 메시지 교체
        const tempIndex = prev.findIndex(
          (m) => m.id.startsWith('temp-') && m.content === message.content,
        );

        if (tempIndex !== -1) {
          const next = [...prev];
          next[tempIndex] = message;
          return next;
        }

        return [...prev, message];
      });
    });

    return unsubscribe;
  }, [roomId]);

  const sendMessage = useCallback(
    async (content: string) => {
      const tempId = `temp-${Date.now()}`;

      const optimisticMessage: ChatMessage = {
        id: tempId,
        roomId,
        senderId: currentUserId,
        content,
        createdAt: new Date().toISOString(),
        isMine: true,
      };

      setMessages((prev) => [...prev, optimisticMessage]);

      try {
        await chatRealtimeService.sendMessage(roomId, content, currentUserId);
      } catch {
        setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      }
    },
    [roomId, currentUserId],
  );

  return {
    messages,
    sendMessage,
  };
}
