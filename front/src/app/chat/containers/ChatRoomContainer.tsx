'use client';

import { ChatRoomView } from '../components/ChatRoomView';
import { useChatRoom } from '../hooks/useChatRoom';

interface ChatRoomContainerProps {
  roomId: number;
  roomName: string;
  onBack: () => void;
}

export function ChatRoomContainer({ roomId, roomName, onBack }: ChatRoomContainerProps) {
  const { messages, sendMessage, isLoading, isConnected, connectionStatus, loadPreviousMessages } =
    useChatRoom({ roomId });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">메시지를 불러오는 중...</p>
          <p className="mt-2 text-xs text-gray-400">채팅방 ID: {roomId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      {/* WebSocket 연결 실패 알림 */}
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

      <ChatRoomView
        roomId={roomId}
        roomName={roomName}
        messages={messages}
        onSend={sendMessage}
        onLoadPrevious={loadPreviousMessages}
        onBack={onBack}
        isConnected={isConnected}
        connectionStatus={connectionStatus}
      />
    </div>
  );
}
