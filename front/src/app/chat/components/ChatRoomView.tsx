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
  const previousMessagesLengthRef = useRef(messages.length);
  const lastMessageIdRef = useRef<string | null>(null);
  const isLoadingPreviousRef = useRef(false);
  const hasScrolledToBottomRef = useRef(false);

  useEffect(() => {
    if (!hasScrolledToBottomRef.current && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      hasScrolledToBottomRef.current = true;
      lastMessageIdRef.current = messages[messages.length - 1].id;
    }
  }, [messages.length]);

  useEffect(() => {
    if (!hasScrolledToBottomRef.current || isLoadingPreviousRef.current) return;

    if (messages.length > previousMessagesLengthRef.current) {
      const currentLastMessage = messages[messages.length - 1];

      if (currentLastMessage && currentLastMessage.id !== lastMessageIdRef.current) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        lastMessageIdRef.current = currentLastMessage.id;
      }
    }

    previousMessagesLengthRef.current = messages.length;
  }, [messages]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || !isConnected) return;

    setIsSending(true);
    onSend(trimmed);
    setInput('');
    setIsSending(false);
  };

  const handleScroll = async (e: UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;

    if (target.scrollTop < 10 && hasPrevious && !loadingPrevious) {
      setLoadingPrevious(true);
      isLoadingPreviousRef.current = true;

      const oldestMessage = messages[0];
      const cursor = oldestMessage?.id;

      const container = messagesContainerRef.current;
      if (!container) {
        setLoadingPrevious(false);
        isLoadingPreviousRef.current = false;
        return;
      }

      const previousScrollHeight = container.scrollHeight;
      const previousScrollTop = container.scrollTop;

      const { messages: prevMessages, hasNext } = await onLoadPrevious(cursor);

      if (prevMessages.length > 0) {
        setTimeout(() => {
          if (container) {
            const newScrollHeight = container.scrollHeight;
            const scrollDiff = newScrollHeight - previousScrollHeight;
            container.scrollTop = previousScrollTop + scrollDiff;
          }
          isLoadingPreviousRef.current = false;
        }, 100);
      } else {
        isLoadingPreviousRef.current = false;
      }

      setHasPrevious(hasNext);
      setLoadingPrevious(false);
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

      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-5 py-3"
        onScroll={handleScroll}
      >
        {loadingPrevious && (
          <div className="mb-2 text-center text-sm text-gray-500">이전 메시지 로딩 중...</div>
        )}

        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-400">메시지가 없습니다</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-3 flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
            >
              {!msg.isMine && (
                <div className="relative mr-2 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                  {msg.senderProfileImageUrl ? (
                    <Image
                      src={msg.senderProfileImageUrl}
                      alt={msg.senderName || '프로필'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-300 text-sm font-semibold text-gray-600">
                      {msg.senderName?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                  )}
                </div>
              )}

              <div className={`flex flex-col ${msg.isMine ? 'items-end' : 'items-start'}`}>
                {!msg.isMine && msg.senderName && (
                  <span className="mb-1 text-xs text-gray-600">{msg.senderName}</span>
                )}

                <div
                  className={`inline-block max-w-[280px] min-w-[60px] rounded-lg px-3 py-2 shadow-md ${
                    msg.isMine ? 'bg-custom-blue text-white' : 'bg-white text-gray-800'
                  }`}
                >
                  <div className="body2 break-words whitespace-pre-wrap">{msg.content}</div>
                  <div
                    className={`footnote mt-1 text-right opacity-70 ${
                      msg.isMine ? 'text-white' : 'text-custom-deepgray'
                    }`}
                  >
                    {formatTime(msg.sentAt)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

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
