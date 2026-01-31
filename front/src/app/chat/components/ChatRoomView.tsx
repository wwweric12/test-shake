/* eslint-disable no-console */
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
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const previousMessagesLengthRef = useRef(messages.length);
  const lastMessageIdRef = useRef<string | null>(null); // 마지막 메시지 ID 추적
  const isLoadingPreviousRef = useRef(false);

  /**
   * 초기 진입 시 최하단 스크롤 (즉시)
   */
  useEffect(() => {
    if (isInitialLoad && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      setIsInitialLoad(false);
      // 초기 로드 시 마지막 메시지 ID 저장
      if (messages.length > 0) {
        lastMessageIdRef.current = messages[messages.length - 1].id;
      }
    }
  }, [messages.length, isInitialLoad, messages]);

  /**
   * 새 메시지 수신 시에만 하단 스크롤 (뒤쪽에 추가된 경우만)
   */
  useEffect(() => {
    // 초기 로드 중이거나 이전 메시지 로딩 중이면 스크롤 안 함
    if (isInitialLoad || isLoadingPreviousRef.current) return;

    // 메시지가 증가했을 때
    if (messages.length > previousMessagesLengthRef.current) {
      // 마지막 메시지 ID가 변경되었는지 확인
      const currentLastMessage = messages[messages.length - 1];

      if (currentLastMessage && currentLastMessage.id !== lastMessageIdRef.current) {
        // 새로운 메시지가 뒤쪽에 추가됨 → 하단 스크롤
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        lastMessageIdRef.current = currentLastMessage.id;
      }
      // else: 앞쪽에 메시지가 추가됨 (무한 스크롤) → 스크롤 안 함
    }

    previousMessagesLengthRef.current = messages.length;
  }, [messages, isInitialLoad]);

  /**
   * 시간 포맷 (오전/오후 hh:mm)
   */
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return '';
    }
  };

  /**
   * 메시지 전송
   */
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

  /**
   * 스크롤 상단 감지 → 이전 메시지 로드 (스크롤 위치 유지)
   */
  const handleScroll = async (e: UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;

    // 스크롤이 최상단에 도달했을 때
    if (target.scrollTop === 0 && hasPrevious && !loadingPrevious) {
      setLoadingPrevious(true);
      isLoadingPreviousRef.current = true; // 로딩 플래그 설정

      const oldestMessage = messages[0];
      const cursor = oldestMessage?.sentAt;

      // 현재 스크롤 위치 저장
      const container = messagesContainerRef.current;
      if (!container) {
        setLoadingPrevious(false);
        isLoadingPreviousRef.current = false;
        return;
      }

      const previousScrollHeight = container.scrollHeight;
      const previousScrollTop = container.scrollTop;

      try {
        const { messages: prevMessages, hasNext } = await onLoadPrevious(cursor);

        if (prevMessages.length > 0) {
          // DOM 업데이트를 기다린 후 스크롤 복원
          setTimeout(() => {
            if (container) {
              const newScrollHeight = container.scrollHeight;
              const scrollDiff = newScrollHeight - previousScrollHeight;
              container.scrollTop = previousScrollTop + scrollDiff;
            }
            isLoadingPreviousRef.current = false; // 로딩 완료
          }, 100); // DOM 업데이트 대기
        } else {
          isLoadingPreviousRef.current = false;
        }

        setHasPrevious(hasNext);
      } catch (err) {
        console.error('[ChatRoomView] 이전 메시지 로드 실패:', err);
        isLoadingPreviousRef.current = false;
      } finally {
        setLoadingPrevious(false);
      }
    }
  };

  /**
   * 연결 상태 색상
   */
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
              {/* 상대방 프로필 이미지 */}
              {!msg.isMine && (
                <div className="relative mr-2 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                  {msg.senderProfileImageUrl ? (
                    <Image
                      src={msg.senderProfileImageUrl}
                      alt={msg.senderName || '프로필'}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-300 text-sm font-semibold text-gray-600">
                      {msg.senderName?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                  )}
                </div>
              )}

              <div className={`flex flex-col ${msg.isMine ? 'items-end' : 'items-start'}`}>
                {/* 상대방 이름 */}
                {!msg.isMine && msg.senderName && (
                  <span className="mb-1 text-xs text-gray-600">{msg.senderName}</span>
                )}

                {/* 메시지 말풍선 - 카톡 스타일 */}
                <div
                  className={`inline-block max-w-[280px] min-w-[60px] rounded-lg px-3 py-2 shadow-md ${
                    msg.isMine ? 'bg-custom-blue text-white' : 'bg-white text-gray-800'
                  }`}
                >
                  {/* 메시지 내용 */}
                  <div className="body2 break-words whitespace-pre-wrap">{msg.content}</div>

                  {/* 시간 */}
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
