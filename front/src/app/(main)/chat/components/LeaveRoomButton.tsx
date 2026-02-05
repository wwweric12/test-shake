'use client';

import { useState } from 'react';
import Image from 'next/image';

import QuitIcon from '@/assets/icon/door-open.svg';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { useExitChatRoomMutation } from '@/services/chat/hooks';

interface LeaveRoomButtonProps {
  roomId: number;
  onLeave?: () => void;
}

export function LeaveRoomButton({ roomId, onLeave }: LeaveRoomButtonProps) {
  const [open, setOpen] = useState(false);
  const exitMutation = useExitChatRoomMutation();

  const handleLeave = async () => {
    await exitMutation.mutateAsync(roomId);
    setOpen(false);
    onLeave?.();
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="p-2" aria-label="방 나가기">
        <Image src={QuitIcon} alt="방 나가기" width={20} height={20} />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={`flex h-[150px] w-[90%] max-w-[355px] flex-col overflow-hidden rounded-[32px] border-none p-0 shadow-xl`}
        >
          <div className="flex h-full flex-col bg-white p-6">
            <DialogHeader className="mb-4 shrink-0">
              <DialogTitle className="title4">채팅방 나가기</DialogTitle>
              <DialogDescription className="footnote text-custom-deepgray">
                채팅방을 나가시겠습니까?
                <br />
                {/* 나가면 대화 내역이 모두 삭제됩니다. */}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-auto flex shrink-0 justify-center">
              <Button
                onClick={handleLeave}
                disabled={exitMutation.isPending}
                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:opacity-50"
              >
                {exitMutation.isPending ? '나가는 중...' : '나가기'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
