import Image from 'next/image';
import Link from 'next/link';

import { DSTI_CHARACTERS } from '@/constants/dsti';
import { ChatMessageWithProfile } from '@/types/chat';
import { formatMessageTime } from '@/utils/dateFormat';

interface ChatMessageItemProps {
  message: ChatMessageWithProfile;
}

export function ChatMessageItem({ message }: ChatMessageItemProps) {
  const img = message.senderProfileImageUrl || DSTI_CHARACTERS[message.dsti];

  return (
    <div className={`mb-3 flex ${message.isMine ? 'justify-end' : 'justify-start'}`}>
      {/* 상대방 프로필 이미지 (내 메시지가 아닐 때만) */}
      {!message.isMine && (
        <div className="relative mr-2 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
          <Link href={`/user/info/${message.senderId}`}>
            <div className="relative mr-2 h-10 w-10 flex-shrink-0 cursor-pointer overflow-hidden rounded-full bg-gray-200">
              <Image
                src={img}
                alt={message.senderName || '상대방 프로필'}
                fill
                className="object-cover"
              />
            </div>
          </Link>
        </div>
      )}

      {/* 메시지 내용 */}
      <div className={`flex flex-col ${message.isMine ? 'items-end' : 'items-start'}`}>
        {!message.isMine && message.senderName && (
          <span className="footnote mb-1 text-gray-600">{message.senderName}</span>
        )}

        <div
          className={`inline-block max-w-[280px] min-w-[60px] rounded-lg px-3 py-2 shadow-md ${
            message.isMine ? 'bg-custom-blue text-white' : 'bg-white text-gray-800'
          }`}
        >
          <div className="body2 break-words whitespace-pre-wrap">{message.content}</div>

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
