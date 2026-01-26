'use client';

import { createContext, useContext, useState } from 'react';

interface ChatContextValue {
  roomId: string | null;
  setRoomId: (id: string | null) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [roomId, setRoomId] = useState<string | null>(null);

  return <ChatContext.Provider value={{ roomId, setRoomId }}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
}
