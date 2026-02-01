'use client';

import { useState } from 'react';
import Image from 'next/image';

import SirenIcon from '@/assets/icon/siren.svg';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { useReportChatRoomMutation } from '@/services/chat/hooks';

interface ReportButtonProps {
  roomId: number;
}

export function ReportButton({ roomId }: ReportButtonProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const reportMutation = useReportChatRoomMutation();

  const handleSubmit = async () => {
    const trimmedReason = reason.trim();

    if (!trimmedReason || trimmedReason.length < 10) {
      alert('신고 사유는 최소 10자 이상 입력해주세요.');
      return;
    }

    await reportMutation.mutateAsync({
      chatRoomId: roomId,
      data: { chatRoomId: roomId, reason: trimmedReason },
    });

    alert('신고가 접수되었습니다.');
    setOpen(false);
    setReason('');
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="p-2" aria-label="신고하기">
        <Image src={SirenIcon} alt="신고하기" width={20} height={20} />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>채팅방 신고</DialogTitle>
            <DialogDescription>
              신고 사유를 상세히 입력해주세요.
              <br />
              허위 신고 시 제재를 받을 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="신고 사유를 입력하세요 (최소 10자)"
            maxLength={500}
            rows={5}
            disabled={reportMutation.isPending}
            className="w-full resize-none rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
          />

          <div className="text-right text-xs text-gray-500">{reason.length} / 500</div>

          <DialogFooter>
            <button
              onClick={() => setOpen(false)}
              disabled={reportMutation.isPending}
              className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={reportMutation.isPending || reason.trim().length < 10}
              className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:opacity-50"
            >
              {reportMutation.isPending ? '신고 중...' : '신고하기'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
