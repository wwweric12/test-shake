import { UIEvent, useEffect, useRef } from 'react';

import { ChatMessageWithProfile } from '@/types/chat';

import { ChatMessageItem } from './ChatMessageItem';

interface ChatMessageListProps {
  messages: ChatMessageWithProfile[];
  loadingPrevious: boolean;
  onLoadPrevious: (cursor?: string) => Promise<{
    messages: ChatMessageWithProfile[];
    hasNext: boolean;
  }>;
  hasPrevious: boolean;
  onHasPreviousChange: (hasPrevious: boolean) => void;
  onLoadingChange: (loading: boolean) => void;
  isLoadingPreviousRef: React.MutableRefObject<boolean>;
  canSendMessage: boolean;
}

export function ChatMessageList({
  messages,
  loadingPrevious,
  onLoadPrevious,
  hasPrevious,
  onHasPreviousChange,
  onLoadingChange,
  isLoadingPreviousRef,
  canSendMessage,
}: ChatMessageListProps) {
  // Refs
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const previousMessagesLengthRef = useRef(messages.length);
  const lastMessageIdRef = useRef<string | null>(null);
  const hasScrolledToBottomRef = useRef(false);

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
  }, [messages, isLoadingPreviousRef]);

  /**
   * 스크롤 이벤트 핸들러
   * 맨 위에 도달하면 이전 메시지 로드
   */
  const handleScroll = async (e: UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;

    // 스크롤이 맨 위에 도달하고, 이전 메시지가 있으며, 로딩 중이 아닐 때
    if (target.scrollTop < 10 && hasPrevious && !loadingPrevious) {
      onLoadingChange(true);
      isLoadingPreviousRef.current = true;

      // 현재 가장 오래된 메시지 ID를 cursor로 사용
      const oldestMessage = messages[0];
      const cursor = oldestMessage?.id;

      const container = messagesContainerRef.current;
      if (!container) {
        onLoadingChange(false);
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

      onHasPreviousChange(hasNext);
      onLoadingChange(false);
      isLoadingPreviousRef.current = false;
    }
  };

  return (
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
          <p className="text-gray-400">채팅을 시작해보세요!</p>
        </div>
      ) : (
        /* 메시지 렌더링 */
        messages.map((msg) => <ChatMessageItem key={msg.id} message={msg} />)
      )}

      {/* 자동 스크롤 타겟 */}
      <div ref={messagesEndRef} />

      {!canSendMessage && (
        <div className="sticky right-0 bottom-0 left-0 flex justify-center pb-2">
          <div className="rounded-full bg-gray-800/80 px-4 py-2 text-white shadow-lg backdrop-blur-sm">
            <p className="caption2 text-center">상대방이 채팅방을 나갔습니다</p>
          </div>
        </div>
      )}
    </div>
  );
}
