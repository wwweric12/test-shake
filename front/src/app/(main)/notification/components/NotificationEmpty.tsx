import Image from 'next/image';

import BellOff from '@/assets/icon/tray.svg';

export default function NotificationEmpty() {
  return (
    <div className="flex h-[200px] flex-1 flex-col items-center justify-center gap-4 py-20">

      <div className="flex flex-col items-center justify-center text-gray-400">
        <Image src={BellOff} alt="Empty Notification" className="h-20 w-20 text-slate-300" />
      </div>

      <div className="text-center">
        <p className="body2 text-custom-darkgray">새로운 알림이 없습니다.</p>
      </div>
    </div>
  );
}