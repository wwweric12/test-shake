'use client';

import { FormEvent, UIEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import BackIcon from '@/assets/icon/back.svg';
import FileIcon from '@/assets/icon/file-code.svg';
import SendIcon from '@/assets/icon/paper-plane-right.svg';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MESSAGE_MAX_LENGTH } from '@/constants/message';
import { ChatMessageWithProfile } from '@/types/chat';
import { ConnectionStatus } from '@/types/webSocket';

import { LeaveRoomButton } from './LeaveRoomButton';
import { ReportButton } from './ReportButton';

interface ChatRoomViewProps {
  roomId: number;
  messages: ChatMessageWithProfile[];
  onSend: (message: string) => void;
  onLoadPrevious: (
    cursor?: string,
  ) => Promise<{ messages: ChatMessageWithProfile[]; hasNext: boolean }>;
  onBack?: () => void;
  roomName?: string;
  isConnected?: boolean;
  connectionStatus?: ConnectionStatus;
}

export function ChatRoomView({
  roomId,
  messages,
  onSend,
  onLoadPrevious,
  onBack,
  roomName = '채팅방',
  isConnected = false,
  connectionStatus = 'DISCONNECTED',
}: ChatRoomViewProps) {
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [loadingPrevious, setLoadingPrevious] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(true);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 새 메시지 수신 시 하단 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 시간 포맷
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return '';
    }
  };

  // 메시지 전송
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || !isConnected) return;

    try {
      setIsSending(true);
      onSend(trimmed);
      setInput('');
    } finally {
      setIsSending(false);
    }
  };

  // 스크롤 상단 감지 → 이전 메시지 로드
  const handleScroll = async (e: UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollTop === 0 && hasPrevious && !loadingPrevious) {
      setLoadingPrevious(true);

      const oldestMessage = messages[0];
      const cursor = oldestMessage?.sentAt;

      try {
        const { messages: prevMessages, hasNext } = await onLoadPrevious(cursor);
        if (prevMessages.length > 0 && messagesContainerRef.current) {
          const container = messagesContainerRef.current;
          const prevScrollHeight = container.scrollHeight;

          // ✅ 이전 메시지 순서 뒤집기 (백엔드 최신 → 오래된 경우)
          messages.unshift(...prevMessages.reverse());

          // 스크롤 위치 유지
          setTimeout(() => {
            container.scrollTop = container.scrollHeight - prevScrollHeight;
          }, 0);
        }

        setHasPrevious(hasNext);
      } finally {
        setLoadingPrevious(false);
      }
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'CONNECTED':
        return 'bg-green-500';
      case 'CONNECTING':
        return 'bg-yellow-500';
      case 'ERROR':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-custom-lightpurple flex h-screen flex-col">
      {/* 헤더 */}
      <header className="bg-custom-blue flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          {onBack && (
            <button onClick={onBack} className="p-1" aria-label="뒤로가기">
              <Image src={BackIcon} alt="뒤로가기" width={10} height={10} />
            </button>
          )}
          <h2 className="body1">{roomName}</h2>
          {process.env.NODE_ENV === 'development' && (
            <div className="ml-2 flex items-center gap-1">
              <div className={`h-2 w-2 rounded-full ${getConnectionStatusColor()}`} />
              <span className="text-xs text-gray-600">{connectionStatus}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <ReportButton roomId={roomId} />
          <LeaveRoomButton roomId={roomId} onLeave={onBack} />
        </div>
      </header>

      {/* 메시지 목록 */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-5 py-3"
        onScroll={handleScroll}
      >
        {loadingPrevious && (
          <div className="mb-2 text-center text-gray-500">이전 메시지 로딩 중...</div>
        )}

        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-400">메시지가 없습니다</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
            >
              {!msg.isMine && msg.senderProfileImageUrl && (
                <div className="relative mr-2 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={msg.senderProfileImageUrl}
                    alt="프로필"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div
                className={`max-w-[70%] rounded-lg px-3 py-2 shadow-md ${
                  msg.isMine ? 'bg-custom-blue text-white' : 'bg-white text-gray-800'
                }`}
              >
                <div className="body2 break-words">{msg.content}</div>
                <div
                  className={`footnote text-right opacity-70 ${
                    msg.isMine ? 'text-white' : 'text-custom-deepgray'
                  }`}
                >
                  {formatTime(msg.sentAt)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 메시지 입력 폼 */}
      <form
        onSubmit={handleSubmit}
        className="bg-custom-blue sticky bottom-0 flex items-center gap-2 p-2"
      >
        <Button type="button" size="icon" className="bg-custom-blue" disabled>
          <Image src={FileIcon} alt="파일 업로드" width={20} height={20} />
        </Button>

        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isConnected ? '메시지를 입력하세요' : '연결 중...'}
          maxLength={MESSAGE_MAX_LENGTH}
          disabled={!isConnected || isSending}
          className="flex-1"
        />

        <Button
          type="submit"
          size="icon"
          className="bg-custom-blue"
          disabled={!input.trim() || !isConnected || isSending}
        >
          <Image src={SendIcon} alt="전송" width={20} height={20} />
        </Button>
      </form>
    </div>
  );
}
