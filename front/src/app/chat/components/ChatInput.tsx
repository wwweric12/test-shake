import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}
export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t bg-white p-4">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="메시지를 입력하세요..."
        disabled={disabled}
        className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
        maxLength={1000}
      />
      <motion.button
        type="submit"
        disabled={!message.trim() || disabled}
        whileTap={{ scale: 0.95 }}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white disabled:bg-gray-300"
      >
        <Send size={18} />
      </motion.button>
    </form>
  );
}
