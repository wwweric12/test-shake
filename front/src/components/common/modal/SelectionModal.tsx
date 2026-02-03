'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import { SelectButton } from '@/app/(auth)/signup/components/Button';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';

interface Item {
  id: number;
  label: string;
}

interface SelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: Item[];
  selectedIds: number[];
  onSave: (ids: number[]) => void;
  maxCount?: number;
  showSearch?: boolean;
  className?: string;
}

export default function SelectionModal({
  isOpen,
  onClose,
  title,
  items,
  selectedIds,
  onSave,
  maxCount = 5,
  showSearch = false,
  className = 'h-[355px]',
}: SelectionModalProps) {
  const [tempSelected, setTempSelected] = useState<number[]>(selectedIds);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    return items.filter((item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase().trim()),
    );
  }, [items, searchQuery]);

  const handleToggle = (id: number) => {
    if (tempSelected.includes(id)) {
      setTempSelected(tempSelected.filter((i) => i !== id));
    } else {
      if (tempSelected.length >= maxCount) return;
      setTempSelected([...tempSelected, id]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className={`flex w-[90%] max-w-[355px] flex-col overflow-hidden rounded-[32px] border-none p-0 shadow-xl ${className}`}
      >
        <div className="flex h-full flex-col bg-white p-6">
          <DialogHeader className="mb-4 shrink-0">
            <DialogTitle className="subhead1 text-left">{title}</DialogTitle>
            <DialogDescription className="footnote text-custom-deepgray text-left">
              최대 {maxCount}개를 선택할 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          {showSearch && (
            <div className="relative mb-4 shrink-0">
              <Search className="text-custom-gray absolute top-3 left-3 size-5" />
              <input
                className="bg-custom-realwhite border-custom-gray subhead3 w-full rounded-lg border py-2.5 pr-4 pl-10 outline-none focus:border-blue-400"
                placeholder="스킬 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}

          {/* 리스트 영역만 스크롤되도록 설정 */}
          <div className="scrollbar-hide mb-4 flex-1 overflow-y-auto">
            <div className="flex flex-wrap gap-2">
              {filteredItems.map((item) => (
                <SelectButton
                  key={item.id}
                  label={item.label}
                  isSelected={tempSelected.includes(item.id)}
                  onClick={() => handleToggle(item.id)}
                />
              ))}
            </div>
          </div>

          <div className="mt-auto flex shrink-0 justify-center">
            <Button
              onClick={() => onSave(tempSelected)}
              disabled={tempSelected.length === 0}
              className="bg-custom-realblack hover:bg-custom-realblack subhead1 h-12 w-1/2 rounded-xl text-white disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              저장
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
