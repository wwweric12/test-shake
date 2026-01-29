// 'use client';

// import { FormEvent, useEffect, useRef, useState } from 'react';
// import Image from 'next/image';

// import BackIcon from '@/assets/icon/back.svg';
// import FileIcon from '@/assets/icon/file-code.svg';
// import SendIcon from '@/assets/icon/paper-plane-right.svg';
// import { Button } from '@/components/ui/Button';
// import { Input } from '@/components/ui/Input';
// import { MESSAGE_MAX_LENGTH } from '@/constants/message';
// import { ChatMessage } from '@/types/chat';

// import { LeaveRoomButton } from './LeaveRoomButton';
// import { ReportButton } from './ReportButton';

// interface ChatRoomViewProps {
//   messages: ChatMessage[];
//   onSend: (message: string) => void;
//   onBack?: () => void;
//   roomName?: string;
//   isSending?: boolean;
// }

// export function ChatRoomView({
//   messages,
//   onSend,
//   onBack,
//   roomName = '채팅방',
//   isSending = false,
// }: ChatRoomViewProps) {
//   const [input, setInput] = useState('');
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // 새 메시지 시 스크롤
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const formatTime = (dateString: string) => {
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleTimeString('ko-KR', {
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true,
//       });
//     } catch {
//       return '';
//     }
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     // TODO: 웹소켓 연결
//   };

//   return (
//     <div className="bg-custom-lightpurple flex h-screen flex-col">
//       <header className="bg-custom-blue flex items-center justify-between px-4 py-3">
//         {/* 왼쪽 영역 */}
//         <div className="flex items-center gap-2">
//           {onBack && (
//             <button onClick={onBack} className="p-1" aria-label="뒤로가기">
//               <Image src={BackIcon} alt="뒤로가기" width={10} height={10} />
//             </button>
//           )}
//           <h2 className="body1">{roomName}</h2>
//         </div>

//         {/* 오른쪽 영역 */}
//         <div className="flex items-center gap-1">
//           <ReportButton />
//           <LeaveRoomButton />
//         </div>
//       </header>

//       <div className="flex-1 overflow-y-auto px-5 py-3">
//         {messages.length === 0 ? (
//           <div className="flex h-full items-center justify-center">
//             <p className="text-gray-400">메시지가 없습니다</p>
//           </div>
//         ) : (
//           messages.map((msg) => (
//             <div
//               key={msg.messageId}
//               className={`mb-2 flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
//             >
//               {/* 상대방 프로필 이미지 */}
//               {!msg.isMine && msg.senderProfileUrl && (
//                 <div className="relative mr-2 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
//                   <Image
//                     src={msg.senderProfileUrl}
//                     alt="상대방 프로필"
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//               )}

//               {/* 메시지 버블 */}
//               <div
//                 className={`max-w-[70%] rounded-lg px-3 py-2 shadow-md ${
//                   msg.isMine ? 'bg-custom-blue text-white' : 'bg-white text-gray-800'
//                 }`}
//               >
//                 <div className="body2 break-words">{msg.content}</div>
//                 <div
//                   className={`footnote text-right opacity-70 ${
//                     msg.isMine ? 'text-white' : 'text-custom-deepgray'
//                   }`}
//                 >
//                   {formatTime(msg.sendTime)}
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       <form
//         onSubmit={handleSubmit}
//         className="bg-custom-blue sticky bottom-0 flex items-center gap-2 p-2"
//       >
//         <Button type="button" size="icon" className="bg-custom-blue" disabled={isSending}>
//           <Image src={FileIcon} alt="파일 업로드" width={20} height={20} />
//         </Button>

//         <Input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="메시지를 입력하세요"
//           maxLength={MESSAGE_MAX_LENGTH}
//           disabled={isSending}
//         />

//         <Button
//           type="submit"
//           size="icon"
//           className="bg-custom-blue"
//           disabled={!input.trim() || isSending}
//         >
//           <Image src={SendIcon} alt="전송" width={20} height={20} />
//         </Button>
//       </form>
//     </div>
//   );
// }
/**
 * 채팅방 화면 컴포넌트
 *
 * 메시지 목록 표시 및 메시지 입력/전송 UI
 */

'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
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
  roomId: number; // 채팅방 ID
  messages: ChatMessageWithProfile[]; // 메시지 목록
  onSend: (message: string) => void; // 메시지 전송 콜백
  onBack?: () => void; // 뒤로가기 콜백
  roomName?: string; // 채팅방 이름
  isConnected?: boolean; // WebSocket 연결 여부
  connectionStatus?: ConnectionStatus; // WebSocket 연결 상태
}

/**
 * 채팅방 화면
 * 메시지 목록, 입력창, 연결 상태 표시
 */
export function ChatRoomView({
  roomId,
  messages,
  onSend,
  onBack,
  roomName = '채팅방',
  isConnected = false,
  connectionStatus = 'DISCONNECTED',
}: ChatRoomViewProps) {
  const [input, setInput] = useState(''); // 입력 중인 메시지
  const [isSending, setIsSending] = useState(false); // 전송 중 상태
  const messagesEndRef = useRef<HTMLDivElement>(null); // 스크롤 참조

  /**
   * 새 메시지 수신 시 자동 스크롤
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * 시간 포맷팅 (오전/오후 hh:mm)
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
   * 메시지 전송 핸들러
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedInput = input.trim();

    // 빈 메시지 체크
    if (!trimmedInput) {
      console.warn('[ChatRoomView] 빈 메시지는 전송할 수 없습니다.');
      return;
    }

    // WebSocket 연결 체크
    if (!isConnected) {
      console.error('[ChatRoomView] WebSocket이 연결되지 않았습니다.');
      alert('채팅 서버와 연결되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    try {
      setIsSending(true);

      // 메시지 전송
      onSend(trimmedInput);

      // 입력창 초기화
      setInput('');
    } catch (error) {
      console.error('[ChatRoomView] 메시지 전송 실패:', error);
      alert('메시지 전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSending(false);
    }
  };

  /**
   * 연결 상태에 따른 색상 반환
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
        {/* 왼쪽 영역: 뒤로가기 + 채팅방 이름 */}
        <div className="flex items-center gap-2">
          {onBack && (
            <button onClick={onBack} className="p-1" aria-label="뒤로가기">
              <Image src={BackIcon} alt="뒤로가기" width={10} height={10} />
            </button>
          )}
          <h2 className="body1">{roomName}</h2>

          {/* 연결 상태 표시 (개발 환경에서만 표시) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="ml-2 flex items-center gap-1">
              <div className={`h-2 w-2 rounded-full ${getConnectionStatusColor()}`} />
              <span className="text-xs text-gray-600">{connectionStatus}</span>
            </div>
          )}
        </div>

        {/* 오른쪽 영역: 신고 + 나가기 */}
        <div className="flex items-center gap-1">
          <ReportButton roomId={roomId} />
          <LeaveRoomButton roomId={roomId} onLeave={onBack} />
        </div>
      </header>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto px-5 py-3">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-400">메시지가 없습니다</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
            >
              {/* 상대방 프로필 이미지 */}
              {!msg.isMine && msg.senderProfileImageUrl && (
                <div className="relative mr-2 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={msg.senderProfileImageUrl}
                    alt="상대방 프로필"
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* 메시지 버블 */}
              <div
                className={`max-w-[70%] rounded-lg px-3 py-2 shadow-md ${
                  msg.isMine ? 'bg-custom-blue text-white' : 'bg-white text-gray-800'
                }`}
              >
                <div className="body2 break-words">{msg.content}</div>
                <div
                  className={`footnote text-right opacity-70 ${
                    msg.isMine ? 'text-white' : 'text-custom-deepgray'
                  }`}
                >
                  {formatTime(msg.sentAt)}
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
        {/* 파일 업로드 버튼 (비활성화) */}
        <Button type="button" size="icon" className="bg-custom-blue" disabled>
          <Image src={FileIcon} alt="파일 업로드" width={20} height={20} />
        </Button>

        {/* 메시지 입력창 */}
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isConnected ? '메시지를 입력하세요' : '연결 중...'}
          maxLength={MESSAGE_MAX_LENGTH}
          disabled={isSending || !isConnected}
          className="flex-1"
        />

        {/* 전송 버튼 */}
        <Button
          type="submit"
          size="icon"
          className="bg-custom-blue"
          disabled={!input.trim() || isSending || !isConnected}
        >
          <Image src={SendIcon} alt="전송" width={20} height={20} />
        </Button>
      </form>
    </div>
  );
}
