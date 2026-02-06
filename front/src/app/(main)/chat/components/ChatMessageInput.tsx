import { FormEvent, KeyboardEvent, useState } from 'react';
import Image from 'next/image';

import SendIcon from '@/assets/icon/paper-plane-right.svg';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MESSAGE_MAX_LENGTH } from '@/constants/message';

interface ChatMessageInputProps {
  onSend: (message: string) => void;
  isConnected: boolean;
  canSendMessage: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export function ChatMessageInput({
  onSend,
  isConnected,
  canSendMessage,
  inputRef,
}: ChatMessageInputProps) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Enter만: 기본 동작 방지

      // 전송 로직
      const trimmed = input.trim();
      if (!trimmed || !isConnected || !canSendMessage) return;
      onSend(trimmed);
      setInput('');
    }
    // Shift + Enter: preventDefault 안 함 → 줄바꿈
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = input.trim();

    // 빈 메시지, 연결 안됨, 전송 불가 상태면 리턴
    if (!trimmed || !isConnected || !canSendMessage) return;

    onSend(trimmed);
    setInput('');
  };

  const getPlaceholderText = () => {
    if (!canSendMessage) return '상대방이 채팅방을 나가 메시지를 보낼 수 없습니다';
    if (!isConnected) return '연결 중...';
    return '메시지를 입력하세요';
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-14 items-center gap-2 p-2">
      <Input
        value={input}
        ref={inputRef}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={getPlaceholderText()}
        maxLength={MESSAGE_MAX_LENGTH}
        disabled={!isConnected || !canSendMessage}
        className="flex-1"
        enterKeyHint="send"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />

      <Button
        type="submit"
        size="icon"
        className="bg-custom-blue sticky"
        disabled={!canSendMessage || !input.trim() || !isConnected}
      >
        <Image src={SendIcon} alt="전송" width={20} height={20} />
      </Button>
    </form>
  );
}
