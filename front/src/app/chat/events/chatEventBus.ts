import mitt from 'mitt';

import { ChatMessage } from '@/app/chat/types/models';

type ChatEvents = {
  message: ChatMessage;
  roomUpdate: { roomId: number; lastMessage: string };
};

export const chatBus = mitt<ChatEvents>();
