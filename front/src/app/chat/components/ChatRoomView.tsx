'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import { ChatMessage } from '@/app/chat/types/models';
import BackIcon from '@/assets/icon/back.svg';
import SendIcon from '@/assets/icon/paper-plane-right.svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { MESSAGE_MAX_LENGTH } from '../types/constants';

interface ChatRoomViewProps {
  messages: ChatMessage[];
  onSend: (message: string) => void;
  onBack?: () => void;
  roomName?: string;
}

export function ChatRoomView({ messages, onSend, onBack, roomName = '채팅방' }: ChatRoomViewProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 새 메시지 시 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <header className="flex items-center gap-2 border-b bg-white px-4 py-3">
        {onBack && (
          <button onClick={onBack} className="p-1">
            <Image src={BackIcon} alt="뒤로가기" width={10} height={10} />
          </button>
        )}
        <h2 className="text-lg font-semibold">{roomName}</h2>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`mb-2 flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
                msg.isMine ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 shadow'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 flex items-center gap-2 border-t bg-white p-2"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요"
          maxLength={MESSAGE_MAX_LENGTH}
        />

        <Button type="submit" size="icon">
          <Image src={SendIcon} alt="전송" width={20} height={20} />
        </Button>
      </form>
    </div>
  );
}
