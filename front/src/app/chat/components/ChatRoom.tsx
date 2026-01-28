'use client';

import { useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';

import type { ChatMessage as ChatMessageModel } from '../types/models';

import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';

interface ChatRoomProps {
  roomId: number;
  roomName: string;
  messages: ChatMessageModel[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  onBack?: () => void;
}

export function ChatRoom({
  // roomId,
  roomName,
  messages,
  // currentUserId,
  onSendMessage,
  onBack,
}: ChatRoomProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <div className="flex items-center border-b bg-white px-4 py-3">
        {onBack && (
          <button onClick={onBack} className="mr-3">
            <ArrowLeft size={20} />
          </button>
        )}
        <h1 className="text-lg font-semibold">{roomName}</h1>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSend={onSendMessage} />
    </div>
  );
}
