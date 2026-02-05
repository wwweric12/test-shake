import { ConnectionStatus } from '@/types/webSocket';

interface ChatRoomBannersProps {
  isConnected: boolean;
  connectionStatus: ConnectionStatus;
  canSendMessage: boolean;
  messageError?: string | null;
  messageErrorType?: 'PARTNER_LEFT' | 'STOMP_ERROR' | 'CONNECTION_ERROR' | 'SEND_ERROR' | null;
  onClearMessageError?: () => void;
}

export function ChatRoomBanners({
  isConnected,
  connectionStatus,

  messageError,
  messageErrorType,
  onClearMessageError,
}: ChatRoomBannersProps) {
  const shouldShowErrorBanner = messageError && messageErrorType !== 'PARTNER_LEFT';
  return (
    <>
      {/* 연결 에러 배너 */}
      {!isConnected && connectionStatus === 'ERROR' && (
        <div className="border-b border-yellow-300 bg-yellow-100/70 px-4 py-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="footnote font-medium text-yellow-800">⚠️ 연결이 불안정 합니다</p>
              <p className="caption3 mt-0.5 text-yellow-600">
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

      {/* 메시지 에러 배너 */}
      {shouldShowErrorBanner && (
        <div className="border-b border-red-300 bg-red-100 px-4 py-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-red-800">{messageError}</p>
            {onClearMessageError && (
              <button
                onClick={onClearMessageError}
                className="text-xs text-red-600 hover:text-red-800"
              >
                닫기
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
