'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import { ChatMessage } from '@/app/chat/types/models';
import BackIcon from '@/assets/icon/back.svg';
import FileIcon from '@/assets/icon/file-code.svg';
import SendIcon from '@/assets/icon/paper-plane-right.svg';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import { MESSAGE_MAX_LENGTH } from '../types/constants';

import { LeaveRoomButton } from './LeaveRoomButton';
import { ReportButton } from './ReportButton';

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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, // 오후/오전 표시
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  return (
    <div className="bg-custom-lightpurple flex h-screen flex-col">
      <header className="bg-custom-blue flex items-center justify-between px-4 py-3">
        {/* 왼쪽 영역 */}
        <div className="flex items-center gap-2">
          {onBack && (
            <button onClick={onBack} className="p-1">
              <Image src={BackIcon} alt="뒤로가기" width={10} height={10} />
            </button>
          )}
          <h2 className="body1">{roomName}</h2>
        </div>

        {/* 오른쪽 영역 */}
        <div className="flex items-center gap-1">
          <ReportButton />
          <LeaveRoomButton />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`mb-2 flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[70%] rounded-lg px-3 py-2 shadow-md ${
                msg.isMine ? 'bg-custom-blue text-white' : 'bg-white text-gray-800'
              }`}
            >
              <div className="body2">{msg.content}</div>
              {/* <div>{msg.createdAt}</div> */}
              <div
                className={`footnote text-right opacity-70 ${msg.isMine ? 'text-white' : 'text-custom-deepgray'}`}
              >
                {formatTime(msg.createdAt)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-custom-blue sticky bottom-0 flex items-center gap-2 p-2"
      >
        <Button type="button" size="icon" className="bg-custom-blue">
          <Image src={FileIcon} alt="파일 업로드" width={20} height={20} />
        </Button>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요"
          maxLength={MESSAGE_MAX_LENGTH}
        />

        <Button type="submit" size="icon" className="bg-custom-blue">
          <Image src={SendIcon} alt="전송" width={20} height={20} />
        </Button>
      </form>
    </div>
  );
}
