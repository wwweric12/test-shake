'use client';

import { useCallback, useEffect, useState } from 'react';

import { chatBus } from '@/app/chat/events/chatEventBus';
import { messageService } from '@/app/chat/services/messageService';
import { ChatMessage } from '@/app/chat/types/models';

interface Params {
  roomId: number;
  currentUserId: string;
}

export function useChatRoom({ roomId, currentUserId }: Params) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // 1️⃣ 초기 메시지 (REST)
  useEffect(() => {
    messageService.fetch(roomId).then(setMessages);
  }, [roomId]);

  // 2️⃣ 실시간 수신 (mitt)
  useEffect(() => {
    const handler = (msg: ChatMessage) => {
      if (msg.roomId === roomId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    chatBus.on('message', handler);
    return () => chatBus.off('message', handler);
  }, [roomId]);

  // 3️⃣ 전송
  const sendMessage = useCallback(
    async (content: string) => {
      await messageService.send({
        roomId,
        content,
        senderId: currentUserId,
      });
    },
    [roomId, currentUserId],
  );

  return { messages, sendMessage };
}
