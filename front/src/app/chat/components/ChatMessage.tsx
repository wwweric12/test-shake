import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

import type { ChatMessage as ChatMessageModel } from '../types/models';

interface ChatMessageProps {
  message: ChatMessageModel;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const time = new Date(message.createdAt).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex w-full', message.isMine ? 'justify-end' : 'justify-start')}
    >
      <div className={cn('max-w-[70%] space-y-1')}>
        {!message.isMine && <p className="px-2 text-xs text-gray-600">{message.senderName}</p>}

        <div
          className={cn(
            'rounded-2xl px-4 py-2',
            message.isMine ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900',
          )}
        >
          <p className="text-sm break-words">{message.content}</p>
        </div>

        <p className="px-2 text-xs text-gray-400">{time}</p>
      </div>
    </motion.div>
  );
}
