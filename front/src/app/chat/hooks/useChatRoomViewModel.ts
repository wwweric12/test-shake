// hooks/chat/useChatRoomViewModel.ts
import { useCallback, useState } from 'react';

import { ChatMessageWithProfile } from '@/types/chat';

interface UseChatRoomViewModelProps {
  roomId: number;
  onSendMessage: (msg: string) => void;
  onLoadPreviousMessages: (
    cursor?: string,
  ) => Promise<{ messages: ChatMessageWithProfile[]; hasNext: boolean }>;
}

export function useChatRoomViewModel({
  roomId,
  onSendMessage,
  onLoadPreviousMessages,
}: UseChatRoomViewModelProps) {
  const [messages, setMessages] = useState<ChatMessageWithProfile[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loadingPrevious, setLoadingPrevious] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(true);

  const handleSend = (message: string) => {
    onSendMessage(message);
    setInputValue('');
  };

  const handleLoadPrevious = useCallback(
    async (cursor?: string) => {
      if (!hasPrevious || loadingPrevious) return;
      setLoadingPrevious(true);
      try {
        const { messages: prevMessages, hasNext } = await onLoadPreviousMessages(cursor);
        setMessages((prev) => [...prevMessages.reverse(), ...prev]);
        setHasPrevious(hasNext);
      } finally {
        setLoadingPrevious(false);
      }
    },
    [hasPrevious, loadingPrevious, onLoadPreviousMessages],
  );

  return {
    messages,
    inputValue,
    loadingPrevious,
    hasPrevious,
    setMessages,
    setInputValue,
    handleSend,
    handleLoadPrevious,
  };
}
