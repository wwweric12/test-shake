'use client';

import { useRef, useState } from 'react';

import { ChatMessageWithProfile } from '@/types/chat';
import { ConnectionStatus } from '@/types/webSocket';

import { ChatMessageInput } from './ChatMessageInput';
import { ChatMessageList } from './ChatMessageList';
import { ChatRoomBanners } from './ChatRoomBanners';
import { ChatRoomHeader } from './ChatRoomHeader';

/**
 * Component Props
 */
interface ChatRoomViewProps {
  roomId: number; // 채팅방 ID
  reporteeId: number; // 내 id
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
 * - 채팅방 UI 전체 레이아웃 관리
 * - 하위 컴포넌트들 조합 및 상태 전달
 *
 * 하위 컴포넌트:
 * - ChatRoomHeader: 헤더 (뒤로가기, 방 이름, 연결 상태, 신고/나가기)
 * - ChatRoomBanners: 상태 배너 (연결 에러, 상대방 나감, 메시지 에러)
 * - ChatMessageList: 메시지 목록 (무한 스크롤, 자동 스크롤)
 * - ChatMessageInput: 메시지 입력 폼
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
  canSendMessage = true,
}: ChatRoomViewProps) {
  // 이전 메시지 로딩 상태
  const [loadingPrevious, setLoadingPrevious] = useState(false);
  // 이전 메시지 존재 여부
  const [hasPrevious, setHasPrevious] = useState(true);

  // 이전 메시지 로딩 중인지 (자동 스크롤 제어용)
  const isLoadingPreviousRef = useRef(false);

  return (
    <div className="bg-custom-lightpurple flex h-screen flex-col">
      {/* 헤더 */}
      <ChatRoomHeader
        roomId={roomId}
        reporteeId={reporteeId}
        roomName={roomName}
        onBack={onBack}
        connectionStatus={connectionStatus}
      />

      {/* 상태 배너들 */}
      <ChatRoomBanners
        isConnected={isConnected}
        connectionStatus={connectionStatus}
        canSendMessage={canSendMessage}
        messageError={messageError}
        onClearMessageError={onClearMessageError}
      />

      {/* 메시지 목록 */}
      <ChatMessageList
        messages={messages}
        loadingPrevious={loadingPrevious}
        onLoadPrevious={onLoadPrevious}
        hasPrevious={hasPrevious}
        onHasPreviousChange={setHasPrevious}
        onLoadingChange={setLoadingPrevious}
        isLoadingPreviousRef={isLoadingPreviousRef}
        canSendMessage={canSendMessage}
      />

      {/* 메시지 입력 폼 */}
      <ChatMessageInput onSend={onSend} isConnected={isConnected} canSendMessage={canSendMessage} />
    </div>
  );
}
