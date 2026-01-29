import { motion } from 'framer-motion';

interface TypingIndicatorProps {
  username: string;
}

//소켓 연결 후, 사용가능시 사용할 입력중 ... 말풍선
export function TypingIndicator({ username }: TypingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-2"
    >
      <div className="flex items-center gap-1 rounded-2xl bg-gray-200 px-3 py-2">
        <motion.div
          className="h-2 w-2 rounded-full bg-gray-500"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
        />
        <motion.div
          className="h-2 w-2 rounded-full bg-gray-500"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div
          className="h-2 w-2 rounded-full bg-gray-500"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
        />
      </div>
      <span className="text-xs text-gray-500">{username}님이 입력 중...</span>
    </motion.div>
  );
}
