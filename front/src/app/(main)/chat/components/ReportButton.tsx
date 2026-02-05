'use client';

import { useState } from 'react';
import Image from 'next/image';

import SirenIcon from '@/assets/icon/siren.svg';
import { Button } from '@/components/ui/Button';
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
  reporteeId: number;
}

export function ReportButton({ roomId, reporteeId }: ReportButtonProps) {
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
      chatroomId: roomId,
      reporteeId,
      content: trimmedReason,
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
        <DialogContent
          className={`flex h-[355px] w-[90%] max-w-[355px] flex-col overflow-hidden rounded-[32px] border-none p-0 shadow-xl`}
        >
          <div className="flex h-full flex-col bg-white p-6">
            <DialogHeader className="mb-4 shrink-0">
              <DialogTitle className="title4">채팅방 신고</DialogTitle>
              <DialogDescription className="footnote text-custom-deepgray">
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

            <div className="footnote text-right text-gray-500">{reason.length} / 500</div>

            <div className="mt-auto flex shrink-0 justify-center">
              <Button
                onClick={handleSubmit}
                disabled={reportMutation.isPending || reason.trim().length < 10}
                className="subhead1 bg-custom-red hover:bg-custom-red h-12 w-1/2 rounded rounded-xl px-4 py-2 text-white"
              >
                {/* bg-custom-realblack hover:bg-custom-realblack subhead1 h-12 w-1/2 rounded-xl text-white disabled:cursor-not-allowed disabled:bg-gray-300 */}
                {reportMutation.isPending ? '신고 중...' : '신고하기'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
