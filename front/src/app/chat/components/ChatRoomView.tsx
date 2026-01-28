'use client';

import { FormEvent, useState } from 'react';

import { ChatMessage } from '@/app/chat/types/models';

interface ChatRoomViewProps {
  messages: ChatMessage[];
  onSend: (message: string) => void;
}

export function ChatRoomView({ messages, onSend }: ChatRoomViewProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`mb-2 flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
            <div className="rounded-lg bg-gray-200 px-3 py-2 text-sm">{msg.content}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 border-t p-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded border px-2 py-1"
          placeholder="메시지를 입력하세요"
        />
        <button type="submit" className="rounded bg-blue-500 px-3 py-1 text-white">
          전송
        </button>
      </form>
    </div>
  );
}
