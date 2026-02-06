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

/**
 * ChatMessageList - 심플 버전
 *
 * 핵심:
 * 1. 단순한 useEffect로 자동 스크롤
 * 2. 복잡한 RAF나 이벤트 리스너 없음
 */
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
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  /**
   * 새 메시지 추가 시 자동 스크롤
   */
  useEffect(() => {
    if (isLoadingPreviousRef.current) return;

    endRef.current?.scrollIntoView({
      behavior: messages.length === 0 ? 'auto' : 'smooth',
    });
  }, [messages.length, isLoadingPreviousRef]);

  /**
   * 스크롤 이벤트 - 이전 메시지 로드
   */
  const handleScroll = async (e: UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;

    if (target.scrollTop < 50 && hasPrevious && !loadingPrevious) {
      const container = containerRef.current;
      if (!container) return;

      onLoadingChange(true);
      isLoadingPreviousRef.current = true;

      const oldestMessage = messages[0];
      const cursor = oldestMessage?.id;

      const prevScrollHeight = container.scrollHeight;
      const prevScrollTop = container.scrollTop;

      // 이전 메시지 로드
      const result = await onLoadPrevious(cursor);

      // 에러 체크 (result가 없는 경우)
      if (!result) {
        console.error('Failed to load previous messages: No result');
        onLoadingChange(false);
        isLoadingPreviousRef.current = false;
        return;
      }

      const { messages: prevMessages, hasNext } = result;

      // 메시지 로드 성공 시 스크롤 위치 복원
      if (prevMessages.length > 0) {
        const newScrollHeight = container.scrollHeight;
        const scrollDiff = newScrollHeight - prevScrollHeight;
        container.scrollTop = prevScrollTop + scrollDiff;
      }

      onHasPreviousChange(hasNext);
      onLoadingChange(false);
      isLoadingPreviousRef.current = false;
    }
  };

  return (
    <div
      ref={containerRef}
      className="custom-scrollbar flex-1 overflow-y-auto px-5 py-3"
      onScroll={handleScroll}
    >
      {loadingPrevious && (
        <div className="subhead2 mb-2 text-center text-gray-500">이전 메시지 로딩 중...</div>
      )}

      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-gray-400">채팅을 시작해보세요!</p>
        </div>
      ) : (
        messages.map((msg) => <ChatMessageItem key={msg.id} message={msg} />)
      )}

      <div ref={endRef} />

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
