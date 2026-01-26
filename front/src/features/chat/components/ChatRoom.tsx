'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

import { useChatMessages } from '@/services/chat/hooks';

import { useChatStore } from '../hooks/useChatStore';
import { useSocket } from '../hooks/useSocket';
import type { WSMessage } from '../types';

import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';

interface ChatRoomProps {
  roomId: string;
  roomName: string;
  onBack?: () => void;
}

export function ChatRoom({ roomId, roomName, onBack }: ChatRoomProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  //   const isHistoryLoadedRef = useRef(false);

  const [shouldLoadHistory, setShouldLoadHistory] = useState(true);

  const {
    messages,
    currentUserId,
    currentUsername,
    typingUsers,
    addMessage,
    setCurrentUser,
    setCurrentRoom,
    clearMessages,
    setTypingUser,
    removeTypingUser,
  } = useChatStore();

  // ✅ REST API로 과거 메시지 불러오기
  const { data: historyMessages, isLoading } = useChatMessages(roomId);

  // ✅ WebSocket으로 실시간 메시지 처리
  const { status, connect, sendMessage, isConnected } = useSocket({
    onMessage: useCallback(
      (message: WSMessage) => {
        addMessage(message);
      },
      [addMessage],
    ),

    onTyping: useCallback(
      (data: { userId: string; username: string; isTyping: boolean }) => {
        if (data.isTyping) {
          setTypingUser(data.userId, data.username);
        } else {
          removeTypingUser(data.userId);
        }
      },
      [setTypingUser, removeTypingUser],
    ),
  });

  // 초기 설정
  useEffect(() => {
    // 임시 사용자 설정 (실제로는 auth에서 가져와야 함)
    const userId = `user_${Math.random().toString(36).substr(2, 9)}`;
    const username = `사용자${Math.floor(Math.random() * 1000)}`;
    setCurrentUser(userId, username);
    setCurrentRoom(roomId);

    // WebSocket 연결
    connect();

    return () => {
      clearMessages();
      //   isHistoryLoadedRef.current = false;
    };
  }, [roomId, connect, setCurrentUser, setCurrentRoom, clearMessages]);

  // 과거 메시지 로드 (한 번만)
  //   useEffect(() => {
  //     if (historyMessages && Array.isArray(historyMessages) && !isHistoryLoadedRef.current) {
  //       historyMessages.forEach((msg: WSMessage) => addMessage(msg));
  //       isHistoryLoadedRef.current = true;
  //       console.log('📚 Loaded history messages:', historyMessages.length);
  //     }
  //   }, [historyMessages, addMessage]);
  //   useEffect(() => {
  //     if (historyMessages && Array.isArray(historyMessages) && shouldLoadHistory) {
  //       historyMessages.forEach((msg: WSMessage) => addMessage(msg));
  //       setShouldLoadHistory(false); // ✅ 딱 한 번만 로드
  //     }
  //   }, [historyMessages, shouldLoadHistory, addMessage]);
  const hasLoadedHistoryRef = useRef(false);

  useEffect(() => {
    if (historyMessages && Array.isArray(historyMessages) && !hasLoadedHistoryRef.current) {
      historyMessages.forEach((msg: WSMessage) => addMessage(msg));
      hasLoadedHistoryRef.current = true; // ✅ render 트리거 없음
    }
  }, [historyMessages, addMessage]);

  // WebSocket 연결 후 방 입장
  useEffect(() => {
    if (isConnected && currentUserId) {
      sendMessage('join_room', {
        roomId,
        userId: currentUserId,
        username: currentUsername,
      });
    }
  }, [isConnected, currentUserId, roomId, currentUsername, sendMessage]);

  // 새 메시지 시 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(
    (content: string) => {
      if (!isConnected) {
        console.warn('WebSocket not connected');
        return;
      }

      // ✅ WebSocket으로 실시간 전송
      sendMessage('message', {
        id: `msg-${Date.now()}`,
        roomId,
        senderId: currentUserId,
        senderName: currentUsername,
        content,
        timestamp: new Date().toISOString(),
      });
    },
    [isConnected, sendMessage, roomId, currentUserId, currentUsername],
  );

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center">
          {onBack && (
            <button onClick={onBack} className="mr-3 rounded-full p-1 hover:bg-gray-100">
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="text-lg font-semibold">{roomName}</h1>
            <p className="text-xs text-gray-500">
              {status === 'connected' && '🟢 연결됨'}
              {status === 'connecting' && '🟡 연결 중...'}
              {status === 'disconnected' && '🔴 연결 끊김'}
              {status === 'error' && '❌ 오류'}
            </p>
          </div>
        </div>
        <div className="text-sm text-gray-600">{currentUsername}</div>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-400">메시지 불러오는 중...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex h-full items-center justify-center text-gray-400"
              >
                <p>메시지가 없습니다. 대화를 시작해보세요!</p>
              </motion.div>
            ) : (
              messages.map((message: WSMessage) => (
                <ChatMessage key={message.id} message={message} />
              ))
            )}

            {/* 타이핑 인디케이터 */}
            {typingUsers.size > 0 && (
              <TypingIndicator username={Array.from(typingUsers.values())[0]} />
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 입력창 */}
      <ChatInput onSend={handleSendMessage} disabled={!isConnected} />
    </div>
  );
}
