import Image from 'next/image';

import { DSTI_CHARACTERS } from '@/constants/dsti';
import { ChatMessageWithProfile } from '@/types/chat';
import { formatMessageTime } from '@/utils/dateFormat';

interface ChatMessageItemProps {
  message: ChatMessageWithProfile;
}

export function ChatMessageItem({ message }: ChatMessageItemProps) {
  return (
    <div className={`mb-3 flex ${message.isMine ? 'justify-end' : 'justify-start'}`}>
      {/* 상대방 프로필 이미지 (내 메시지가 아닐 때만) */}
      {!message.isMine && (
        <div className="relative mr-2 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
          {message.senderProfileImageUrl ? (
            <Image
              src={message.senderProfileImageUrl}
              alt={message.senderName || '프로필'}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-300">
              <Image
                src={DSTI_CHARACTERS[message.dsti]}
                alt={`${message.dsti || '상대방'} 프로필`}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </div>
      )}

      {/* 메시지 내용 */}
      <div className={`flex flex-col ${message.isMine ? 'items-end' : 'items-start'}`}>
        {/* 발신자 이름 (상대방 메시지만) */}
        {!message.isMine && message.senderName && (
          <span className="footnote mb-1 text-gray-600">{message.senderName}</span>
        )}

        {/* 메시지 말풍선 */}
        <div
          className={`inline-block max-w-[280px] min-w-[60px] rounded-lg px-3 py-2 shadow-md ${
            message.isMine ? 'bg-custom-blue text-white' : 'bg-white text-gray-800'
          }`}
        >
          {/* 메시지 내용 */}
          <div className="body2 break-words whitespace-pre-wrap">{message.content}</div>

          {/* 전송 시간 */}
          <div
            className={`footnote mt-1 text-right opacity-70 ${
              message.isMine ? 'text-white' : 'text-custom-deepgray'
            }`}
          >
            {formatMessageTime(message.sentAt)}
          </div>
        </div>
      </div>
    </div>
  );
}
