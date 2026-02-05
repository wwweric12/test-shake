import Image from 'next/image';

import BackIcon from '@/assets/icon/back.svg';
import { ConnectionStatus } from '@/types/webSocket';

import { LeaveRoomButton } from './LeaveRoomButton';
import { ReportButton } from './ReportButton';

interface ChatRoomHeaderProps {
  roomId: number;
  reporteeId: number;
  roomName: string;
  onBack?: () => void;
  connectionStatus?: ConnectionStatus;
}

export function ChatRoomHeader({
  roomId,
  reporteeId,
  roomName,
  onBack,
  connectionStatus = 'DISCONNECTED',
}: ChatRoomHeaderProps) {
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
    <header className="bg-custom-blue flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2">
        {/* 뒤로가기 버튼 */}
        {onBack && (
          <button onClick={onBack} className="p-1" aria-label="뒤로가기">
            <Image src={BackIcon} alt="뒤로가기" width={6} height={6} />
          </button>
        )}

        {/* 채팅방 이름 */}
        <h2 className="body1">{roomName}</h2>

        {/* 개발 환경에서만 연결 상태 표시 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="ml-2 flex items-center gap-1">
            <div className={`h-2 w-2 rounded-full ${getConnectionStatusColor()}`} />
            <span className="footnote text-gray-600">{connectionStatus}</span>
          </div>
        )}
      </div>

      {/* 신고 및 나가기 버튼 */}
      <div className="flex items-center gap-1">
        <ReportButton roomId={roomId} reporteeId={reporteeId} />
        <LeaveRoomButton roomId={roomId} onLeave={onBack} />
      </div>
    </header>
  );
}
