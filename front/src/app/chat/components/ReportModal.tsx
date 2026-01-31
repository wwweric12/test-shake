/**
 * 채팅방 신고 모달
 */

'use client';

import { useState } from 'react';

import { useReportChatRoomMutation } from '@/services/chat/hooks';
import { getErrorMessage } from '@/utils/error';

interface ReportModalProps {
  roomId: number; // 채팅방 ID
  onClose: () => void; // 모달 닫기 콜백
}

/**
 * 채팅방 신고 모달
 * 신고 사유 입력 및 API 호출
 */
export function ReportModal({ roomId, onClose }: ReportModalProps) {
  const [reason, setReason] = useState(''); // 신고 사유
  const [isSubmitting, setIsSubmitting] = useState(false);
  const reportMutation = useReportChatRoomMutation();

  /**
   * 신고 제출 처리
   */
  const handleSubmit = async () => {
    const trimmedReason = reason.trim();

    // 신고 사유 검증
    if (!trimmedReason) {
      alert('신고 사유를 입력해주세요.');
      return;
    }

    if (trimmedReason.length < 10) {
      alert('신고 사유는 최소 10자 이상 입력해주세요.');
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // API 호출: POST /chat/rooms/{chatRoomId}/report
      await reportMutation.mutateAsync({
        chatRoomId: roomId,
        data: { chatRoomId: roomId, reason: trimmedReason },
      });

      console.log(`[ReportModal] 채팅방 ${roomId} 신고 성공`);

      alert('신고가 접수되었습니다.');
      onClose();
    } catch (error) {
      console.error('[ReportModal] 채팅방 신고 실패:', error);
      const message = getErrorMessage(error, '신고 접수에 실패했습니다.');
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="mx-4 w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-2 text-lg font-semibold">채팅방 신고</h3>
        <p className="mb-4 text-sm text-gray-600">
          신고 사유를 상세히 입력해주세요.
          <br />
          허위 신고 시 제재를 받을 수 있습니다.
        </p>

        {/* 신고 사유 입력 */}
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="신고 사유를 입력하세요 (최소 10자)"
          maxLength={500}
          rows={5}
          disabled={isSubmitting}
          className="w-full resize-none rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
        />

        <div className="mt-1 text-right text-xs text-gray-500">{reason.length} / 500</div>

        {/* 버튼 */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || reason.trim().length < 10}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:opacity-50"
          >
            {isSubmitting ? '신고 중...' : '신고하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
