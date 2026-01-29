'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/Button';

interface ReportModalProps {
  onClose: () => void;
}

export function ReportModal({ onClose }: ReportModalProps) {
  const [content, setContent] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[340px] rounded-lg bg-white p-5">
        <h3 className="title4 mb-3 text-center">신고하기</h3>

        <textarea
          className="subhead3 h-32 w-full resize-none rounded-md border p-2"
          placeholder="신고 내용을 입력해주세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button
            className="bg-custom-red"
            onClick={() => {
              // TODO: 신고 API 연결
              onClose();
            }}
          >
            신고
          </Button>
        </div>
      </div>
    </div>
  );
}
