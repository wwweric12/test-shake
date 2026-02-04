'use client';

import { FormEvent, UIEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import BackIcon from '@/assets/icon/back.svg';
// import FileIcon from '@/assets/icon/file-code.svg';
import SendIcon from '@/assets/icon/paper-plane-right.svg';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DSTI_CHARACTERS } from '@/constants/dsti';
import { MESSAGE_MAX_LENGTH } from '@/constants/message';
import { ChatMessageWithProfile } from '@/types/chat';
import { ConnectionStatus } from '@/types/webSocket';
import { formatMessageTime } from '@/utils/dateFormat';

import { LeaveRoomButton } from './LeaveRoomButton';
import { ReportButton } from './ReportButton';

/**
 * Component Props
 */
interface ChatRoomViewProps {
  roomId: number; // 채팅방 ID
  reporteeId: number; //내 id
  messages: ChatMessageWithProfile[]; // 메시지 목록
  onSend: (message: string) => void; // 메시지 전송 핸들러
  onLoadPrevious: (cursor?: string) => Promise<{
    messages: ChatMessageWithProfile[];
    hasNext: boolean;
  }>; // 이전 메시지 로드 핸들러
  onBack?: () => void; // 뒤로가기 핸들러
  roomName?: string; // 채팅방 이름
  isConnected?: boolean; // WebSocket 연결 여부
  connectionStatus?: ConnectionStatus; // 연결 상태
  messageError?: string | null; // 메시지 에러
  onClearMessageError?: () => void; // 메시지 에러 초기화
  canSendMessage?: boolean; // 메시지 전송 가능 여부 (상대방이 나갔거나 백엔드에서 false로 보낸 경우)
}

/**
 * ChatRoomView Component
 *
 * 역할:
 * - 채팅 메시지 목록 렌더링
 * - 메시지 입력 및 전송
 * - 무한 스크롤로 이전 메시지 로드
 * - 자동 스크롤 처리
 * - 에러 상태 표시
 * - 상대방이 나간 채팅방 처리
 *
 * 사용 위치: ChatRoomContainer
 */
export function ChatRoomView({
  roomId,
  reporteeId,
  messages,
  onSend,
  onLoadPrevious,
  onBack,
  roomName = '채팅방',
  isConnected = false,
  connectionStatus = 'DISCONNECTED',
  messageError,
  onClearMessageError,
  canSendMessage = true, // 기본값 true
}: ChatRoomViewProps) {
  // 메시지 입력 상태
  const [input, setInput] = useState('');
  // 전송 중 상태
  const [isSending, setIsSending] = useState(false);
  // 이전 메시지 로딩 상태
  const [loadingPrevious, setLoadingPrevious] = useState(false);
  // 이전 메시지 존재 여부
  const [hasPrevious, setHasPrevious] = useState(true);

  // Refs
  const messagesContainerRef = useRef<HTMLDivElement>(null); // 메시지 컨테이너
  const messagesEndRef = useRef<HTMLDivElement>(null); // 메시지 끝 (자동 스크롤용)
  const previousMessagesLengthRef = useRef(messages.length); // 이전 메시지 길이
  const lastMessageIdRef = useRef<string | null>(null); // 마지막 메시지 ID
  const isLoadingPreviousRef = useRef(false); // 이전 메시지 로딩 중인지
  const hasScrolledToBottomRef = useRef(false); // 최초 스크롤 완료 여부

  /**
   * 최초 로드 시 스크롤을 맨 아래로 이동
   */
  useEffect(() => {
    if (!hasScrolledToBottomRef.current && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      hasScrolledToBottomRef.current = true;
      lastMessageIdRef.current = messages[messages.length - 1].id;
    }
  }, [messages.length]);

  /**
   * 새 메시지 수신 시 자동 스크롤
   * 이전 메시지 로딩 중이 아닐 때만 실행
   */
  useEffect(() => {
    // 최초 스크롤 전이거나 이전 메시지 로딩 중이면 스킵
    if (!hasScrolledToBottomRef.current || isLoadingPreviousRef.current) return;

    // 메시지가 추가되었는지 확인
    if (messages.length > previousMessagesLengthRef.current) {
      const currentLastMessage = messages[messages.length - 1];

      // 새로운 메시지인지 확인 (ID 비교)
      if (currentLastMessage && currentLastMessage.id !== lastMessageIdRef.current) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        lastMessageIdRef.current = currentLastMessage.id;
      }
    }

    previousMessagesLengthRef.current = messages.length;
  }, [messages]);

  // const reporteeId = messages.find((msg) => msg.senderId && msg.senderId !== myUserId)?.senderId;
  /**
   * 메시지 전송 핸들러
   */
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = input.trim();

    // 빈 메시지, 연결 안됨, 전송 불가 상태면 리턴
    if (!trimmed || !isConnected || !canSendMessage) return;

    setIsSending(true);
    onSend(trimmed);
    setInput('');
    setIsSending(false);
  };

  /**
   * 스크롤 이벤트 핸들러
   * 맨 위에 도달하면 이전 메시지 로드
   */
  const handleScroll = async (e: UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;

    // 스크롤이 맨 위에 도달하고, 이전 메시지가 있으며, 로딩 중이 아닐 때
    if (target.scrollTop < 10 && hasPrevious && !loadingPrevious) {
      setLoadingPrevious(true);
      isLoadingPreviousRef.current = true;

      // 현재 가장 오래된 메시지 ID를 cursor로 사용
      const oldestMessage = messages[0];
      const cursor = oldestMessage?.id;

      const container = messagesContainerRef.current;
      if (!container) {
        setLoadingPrevious(false);
        isLoadingPreviousRef.current = false;
        return;
      }

      // 현재 스크롤 위치 저장
      const previousScrollHeight = container.scrollHeight;
      const previousScrollTop = container.scrollTop;

      // 이전 메시지 로드
      const { messages: prevMessages, hasNext } = await onLoadPrevious(cursor);

      // 메시지가 로드되었으면 스크롤 위치 복원
      if (prevMessages.length > 0 && container) {
        const newScrollHeight = container.scrollHeight;
        const scrollDiff = newScrollHeight - previousScrollHeight;
        // 스크롤 위치를 기존 위치에서 새로 추가된 메시지 높이만큼 이동
        container.scrollTop = previousScrollTop + scrollDiff;
      }

      setHasPrevious(hasNext);
      setLoadingPrevious(false);
      isLoadingPreviousRef.current = false;
    }
  };

  /**
   * 연결 상태에 따른 배지 색상
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

  /**
   * 입력창 placeholder 텍스트
   */
  const getPlaceholderText = () => {
    if (!canSendMessage) return '상대방이 채팅방을 나가 메시지를 보낼 수 없습니다';
    if (!isConnected) return '연결 중...';
    return '메시지를 입력하세요';
  };

  return (
    <div className="bg-custom-lightpurple flex h-screen flex-col">
      {/* 헤더 */}
      <header className="bg-custom-blue flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          {/* 뒤로가기 버튼 */}
          {onBack && (
            <button onClick={onBack} className="p-1" aria-label="뒤로가기">
              <Image src={BackIcon} alt="뒤로가기" width={10} height={10} />
            </button>
          )}

          {/* 채팅방 이름 */}
          <h2 className="body1">{roomName}</h2>

          {/* 개발 환경에서만 연결 상태 표시 */}
          {process.env.NODE_ENV === 'development' && (
            <div className="ml-2 flex items-center gap-1">
              <div className={`h-2 w-2 rounded-full ${getConnectionStatusColor()}`} />
              <span className="footnote text-gray-600">{connectionStatus}</span>
            </div>
          )}
        </div>

        {/* 신고 및 나가기 버튼 */}
        <div className="flex items-center gap-1">
          <ReportButton roomId={roomId} reporteeId={reporteeId} />

          <LeaveRoomButton roomId={roomId} onLeave={onBack} />
        </div>
      </header>

      {/* 연결 에러 배너 */}
      {!isConnected && connectionStatus === 'ERROR' && (
        <div className="border-b border-yellow-300 bg-yellow-100 px-4 py-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800">⚠️ 실시간 연결 실패</p>
              <p className="mt-0.5 text-xs text-yellow-600">
                이전 메시지는 볼 수 있지만, 새 메시지 전송이 불가능합니다
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="rounded bg-yellow-200 px-3 py-1 text-xs text-yellow-800 hover:bg-yellow-300"
            >
              새로고침
            </button>
          </div>
        </div>
      )}

      {/* 상대방이 나간 채팅방 배너 */}
      {!canSendMessage && (
        <div className="border-b border-orange-300 bg-orange-100 px-4 py-2">
          <p className="text-sm font-medium text-orange-800">
            ℹ️ 상대방이 채팅방을 나가 메시지를 보낼 수 없습니다
          </p>
        </div>
      )}

      {/* 메시지 에러 배너 */}
      {messageError && (
        <div className="border-b border-red-300 bg-red-100 px-4 py-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-red-800">{messageError}</p>
            {onClearMessageError && (
              <button
                onClick={onClearMessageError}
                className="text-xs text-red-600 hover:text-red-800"
              >
                닫기
              </button>
            )}
          </div>
        </div>
      )}

      {/* 메시지 목록 */}
      <div
        ref={messagesContainerRef}
        className="custom-scrollbar flex-1 overflow-y-auto px-5 py-3"
        onScroll={handleScroll}
      >
        {/* 이전 메시지 로딩 표시 */}
        {loadingPrevious && (
          <div className="subhead2 mb-2 text-center text-gray-500">이전 메시지 로딩 중...</div>
        )}

        {/* 메시지가 없을 때 */}
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-400">메시지가 불러오는중</p>
          </div>
        ) : (
          /* 메시지 렌더링 */
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-3 flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
            >
              {/* 상대방 프로필 이미지 (내 메시지가 아닐 때만) */}
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
                    <div className="flex h-full w-full items-center justify-center bg-gray-300">
                      <Image
                        src={DSTI_CHARACTERS[msg.dsti]}
                        alt={`${msg.dsti || '상대방'} 프로필`}
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  )}
                </div>
              )}

              {/* 메시지 내용 */}
              <div className={`flex flex-col ${msg.isMine ? 'items-end' : 'items-start'}`}>
                {/* 발신자 이름 (상대방 메시지만) */}
                {!msg.isMine && msg.senderName && (
                  <span className="footnote mb-1 text-gray-600">{msg.senderName}</span>
                )}

                {/* 메시지 말풍선 */}
                <div
                  className={`inline-block max-w-[280px] min-w-[60px] rounded-lg px-3 py-2 shadow-md ${
                    msg.isMine ? 'bg-custom-blue text-white' : 'bg-white text-gray-800'
                  }`}
                >
                  {/* 메시지 내용 */}
                  <div className="body2 break-words whitespace-pre-wrap">{msg.content}</div>

                  {/* 전송 시간 */}
                  <div
                    className={`footnote mt-1 text-right opacity-70 ${
                      msg.isMine ? 'text-white' : 'text-custom-deepgray'
                    }`}
                  >
                    {formatMessageTime(msg.sentAt)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {/* 자동 스크롤 타겟 */}
        <div ref={messagesEndRef} />
      </div>

      {/* 메시지 입력 폼 */}
      <form
        onSubmit={handleSubmit}
        className="bg-custom-blue sticky bottom-0 flex items-center gap-2 p-2"
      >
        {/* 메시지 입력창 */}
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={getPlaceholderText()}
          maxLength={MESSAGE_MAX_LENGTH}
          disabled={!isConnected || isSending || !canSendMessage} // canSendMessage도 체크
          className="flex-1"
        />

        {/* 전송 버튼 */}
        <Button
          type="submit"
          size="icon"
          className="bg-custom-blue"
          disabled={!canSendMessage || !input.trim() || !isConnected || isSending} // canSendMessage도 체크
        >
          <Image src={SendIcon} alt="전송" width={20} height={20} />
        </Button>
      </form>
    </div>
  );
}
