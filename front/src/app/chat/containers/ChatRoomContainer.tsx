// 'use client';

// import { ChatRoomView } from '@/app/chat/components/ChatRoomView';
// import { useChatRoom } from '@/app/chat/hooks/useChatRoom';

// interface ChatRoomContainerProps {
//   roomId: number;
//   roomName: string;
//   onBack: () => void;
// }

// export function ChatRoomContainer({ roomId, roomName, onBack }: ChatRoomContainerProps) {
//   const { messages, sendMessage, isLoading } = useChatRoom({ roomId });

//   if (isLoading) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <p className="text-gray-500">메시지 불러오는 중...</p>
//       </div>
//     );
//   }

//   return (
//     <ChatRoomView roomName={roomName} messages={messages} onSend={sendMessage} onBack={onBack} />
//   );
// }
/**
 * 채팅방 컨테이너 컴포넌트
 *
 * WebSocket 연결 상태 관리 및 메시지 송수신 로직 처리
 */

'use client';

import { ChatRoomView } from '@/app/chat/components/ChatRoomView';
import { useChatRoom } from '@/app/chat/hooks/useChatRoom';

interface ChatRoomContainerProps {
  roomId: number; // 채팅방 ID
  roomName: string; // 채팅방 이름 (상대방 닉네임)
  onBack: () => void; // 뒤로가기 콜백
}

/**
 * 채팅방 컨테이너
 * WebSocket 연결 및 메시지 관리 로직 담당
 */
export function ChatRoomContainer({ roomId, roomName, onBack }: ChatRoomContainerProps) {
  // WebSocket 채팅 Hook 사용
  const { messages, sendMessage, isLoading, isConnected, connectionStatus } = useChatRoom({
    roomId,
  });

  // 로딩 중
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

  // WebSocket 연결 실패
  if (connectionStatus === 'ERROR' && !isConnected) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">WebSocket 연결에 실패했습니다.</p>
          <p className="mt-2 text-xs text-gray-400">상태: {connectionStatus}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            새로고침
          </button>
        </div>
      </div>
    );
  }

  return (
    <ChatRoomView
      roomId={roomId}
      roomName={roomName}
      messages={messages}
      onSend={sendMessage}
      onBack={onBack}
      isConnected={isConnected}
      connectionStatus={connectionStatus}
    />
  );
}
