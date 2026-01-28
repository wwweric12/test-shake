import Image from 'next/image';
import Link from 'next/link';

import chat_dashed from '@/assets/icon/chat-dashed.svg';

interface NotificationCardProps {
  count: number;
  recentImages: string[];
}

export default function NotificationCard({ count, recentImages }: NotificationCardProps) {
  const hasNotifications = count > 0;

  return (
    <Link href="/notification">
      <div className="mb-5 flex h-32 w-full items-center justify-center rounded-[10px] border border-gray-100 bg-white px-3.5 py-6 shadow-sm">
        {hasNotifications ? (
          <div className="flex flex-col items-center gap-2">
            <div className="mb-2 flex items-center -space-x-2">
              {recentImages.slice(0, 3).map((img, i) => (
                <Image
                  key={i}
                  src={img}
                  width={48}
                  height={48}
                  alt="profile"
                  className="rounded-full border-2 border-white object-cover"
                />
              ))}
              {count > 3 && (
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs text-gray-500">
                  +{count - 3}
                </div>
              )}
            </div>
            <p className="body2 text-custom-realblack">새로운 대화 요청 확인 </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="mb-2 flex items-center">
              <Image src={chat_dashed} width={48} height={48} alt="profile" />
            </div>
            <p className="body2 text-custom-darkgray">새로운 대화 요청 없음</p>
          </div>
        )}
      </div>
    </Link>
  );
}
