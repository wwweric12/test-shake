// // // 'use client';

// // // import { ChatRoomView } from '@/app/chat/components/ChatRoomView';
// // // import { useChatRoom } from '@/app/chat/hooks/useChatRoom';

// // // interface ChatRoomContainerProps {
// // //   roomId: number;
// // //   roomName: string;
// // //   onBack: () => void;
// // // }

// // // export function ChatRoomContainer({ roomId, roomName, onBack }: ChatRoomContainerProps) {
// // //   const { messages, sendMessage, isLoading } = useChatRoom({ roomId });

// // //   if (isLoading) {
// // //     return (
// // //       <div className="flex h-screen items-center justify-center">
// // //         <p className="text-gray-500">메시지 불러오는 중...</p>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <ChatRoomView roomName={roomName} messages={messages} onSend={sendMessage} onBack={onBack} />
// // //   );
// // // }
// // /**
// //  * 채팅방 컨테이너 컴포넌트
// //  *
// //  * WebSocket 연결 상태 관리 및 메시지 송수신 로직 처리
// //  */

// // // //웹소켓 연결안되면 채팅방을 볼수 없음 버전
// // // 'use client';

// // // import { ChatRoomView } from '@/app/chat/components/ChatRoomView';
// // // import { useChatRoom } from '@/app/chat/hooks/useChatRoom';

// // // interface ChatRoomContainerProps {
// // //   roomId: number; // 채팅방 ID
// // //   roomName: string; // 채팅방 이름 (상대방 닉네임)
// // //   onBack: () => void; // 뒤로가기 콜백
// // // }

// // // /**
// // //  * 채팅방 컨테이너
// // //  * WebSocket 연결 및 메시지 관리 로직 담당
// // //  */
// // // export function ChatRoomContainer({ roomId, roomName, onBack }: ChatRoomContainerProps) {
// // //   // WebSocket 채팅 Hook 사용
// // //   const { messages, sendMessage, isLoading, isConnected, connectionStatus } = useChatRoom({
// // //     roomId,
// // //   });

// // //   // 로딩 중
// // //   if (isLoading) {
// // //     return (
// // //       <div className="flex h-screen items-center justify-center">
// // //         <div className="text-center">
// // //           <p className="text-gray-500">메시지를 불러오는 중...</p>
// // //           <p className="mt-2 text-xs text-gray-400">채팅방 ID: {roomId}</p>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   // WebSocket 연결 실패
// // //   if (connectionStatus === 'ERROR' && !isConnected) {
// // //     return (
// // //       <div className="flex h-screen items-center justify-center">
// // //         <div className="text-center">
// // //           <p className="text-red-500">WebSocket 연결에 실패했습니다.</p>
// // //           <p className="mt-2 text-xs text-gray-400">상태: {connectionStatus}</p>
// // //           <button
// // //             onClick={() => window.location.reload()}
// // //             className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
// // //           >
// // //             새로고침
// // //           </button>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <ChatRoomView
// // //       roomId={roomId}
// // //       roomName={roomName}
// // //       messages={messages}
// // //       onSend={sendMessage}
// // //       onBack={onBack}
// // //       isConnected={isConnected}
// // //       connectionStatus={connectionStatus}
// // //     />
// // //   );
// // // }

// // //웹소켓 연결 안되도 채팅방은 볼수 있음 버전
// // /**
// //  * 채팅방 컨테이너 컴포넌트
// //  *
// //  * WebSocket 연결 상태 관리 및 메시지 송수신 로직 처리
// //  * WebSocket 연결 실패 시에도 REST API로 받은 메시지는 표시
// //  */

// // 'use client';

// // import { ChatRoomView } from '@/app/chat/components/ChatRoomView';
// // import { useChatRoom } from '@/app/chat/hooks/useChatRoom';

// // interface ChatRoomContainerProps {
// //   roomId: number; // 채팅방 ID
// //   roomName: string; // 채팅방 이름 (상대방 닉네임)
// //   onBack: () => void; // 뒤로가기 콜백
// // }

// // /**
// //  * 채팅방 컨테이너
// //  * WebSocket 연결 및 메시지 관리 로직 담당
// //  */
// // export function ChatRoomContainer({ roomId, roomName, onBack }: ChatRoomContainerProps) {
// //   // WebSocket 채팅 Hook 사용
// //   const { messages, sendMessage, isLoading, isConnected, connectionStatus } = useChatRoom({
// //     roomId,
// //   });

// //   // 로딩 중 (초기 메시지 로드 중)
// //   if (isLoading) {
// //     return (
// //       <div className="flex h-screen items-center justify-center">
// //         <div className="text-center">
// //           <p className="text-gray-500">메시지를 불러오는 중...</p>
// //           <p className="mt-2 text-xs text-gray-400">채팅방 ID: {roomId}</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // ✅ WebSocket 연결 실패해도 화면 표시 (경고만 표시)
// //   return (
// //     <div className="flex h-screen flex-col">
// //       {/* WebSocket 연결 실패 경고 배너 */}
// //       {!isConnected && connectionStatus === 'ERROR' && (
// //         <div className="border-b border-yellow-300 bg-yellow-100 px-4 py-2">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <p className="text-sm font-medium text-yellow-800">⚠️ 실시간 연결 실패</p>
// //               <p className="mt-0.5 text-xs text-yellow-600">
// //                 이전 메시지는 볼 수 있지만, 새 메시지 전송이 불가능합니다
// //               </p>
// //             </div>
// //             <button
// //               onClick={() => window.location.reload()}
// //               className="rounded bg-yellow-200 px-3 py-1 text-xs text-yellow-800 hover:bg-yellow-300"
// //             >
// //               새로고침
// //             </button>
// //           </div>
// //         </div>
// //       )}

// //       {/* 채팅방 화면 */}
// //       <ChatRoomView
// //         roomId={roomId}
// //         roomName={roomName}
// //         messages={messages}
// //         onSend={sendMessage}
// //         onLoadPrevious={loadPreviousMessages}
// //         onBack={onBack}
// //         isConnected={isConnected}
// //         connectionStatus={connectionStatus}
// //       />
// //     </div>
// //   );
// // }
// 'use client';

// import { useCallback, useEffect, useState } from 'react';

// import { ChatMessageWithProfile } from '@/types/chat';
// import { ConnectionStatus } from '@/types/webSocket';

// import { useWebSocketChat } from './useWebSocketChat'; // WebSocket Hook

// interface UseChatRoomParams {
//   roomId: number;
//   enabled?: boolean;
// }

// export function useChatRoom({ roomId, enabled = true }: UseChatRoomParams) {
//   const [messages, setMessages] = useState<ChatMessageWithProfile[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // WebSocket 연결 Hook
//   const {
//     messages: wsMessages,
//     sendMessage,
//     isConnected,
//     connectionStatus,
//   } = useWebSocketChat({ chatRoomId: roomId, userId: 1, enabled });

//   // WebSocket 메시지 병합
//   useEffect(() => {
//     if (wsMessages.length > 0) {
//       setMessages((prev) => {
//         const existingIds = new Set(prev.map((m) => m.id));
//         const filtered = wsMessages.filter((m) => !existingIds.has(m.id));
//         return [...prev, ...filtered];
//       });
//     }
//   }, [wsMessages]);

//   // 초기 REST API 메시지 로드
//   useEffect(() => {
//     const fetchInitialMessages = async () => {
//       try {
//         const res = await fetch(`/chat/rooms/${roomId}/messages?size=50`);
//         if (!res.ok) throw new Error('메시지 로드 실패');
//         const data = await res.json();
//         setMessages(data.messages ?? []);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchInitialMessages();
//   }, [roomId]);

//   // 이전 메시지 불러오기 (무한 스크롤)
//   const loadPreviousMessages = useCallback(
//     async (cursor?: string) => {
//       try {
//         const size = 50;
//         const params = new URLSearchParams();
//         if (cursor) params.append('cursor', cursor);
//         params.append('size', size.toString());

//         const res = await fetch(`/chat/rooms/${roomId}/messages?${params.toString()}`);
//         if (!res.ok) return { messages: [], hasNext: false };

//         const data = await res.json();
//         // 이전 메시지를 앞쪽에 추가
//         setMessages((prev) => [...data.messages.reverse(), ...prev]);
//         return { messages: data.messages ?? [], hasNext: data.hasNext ?? false };
//       } catch (err) {
//         console.error('이전 메시지 로딩 실패', err);
//         return { messages: [], hasNext: false };
//       }
//     },
//     [roomId],
//   );

//   return {
//     messages,
//     sendMessage,
//     isLoading,
//     isConnected,
//     connectionStatus,
//     loadPreviousMessages,
//   };
// }
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
