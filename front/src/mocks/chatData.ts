// Mock 데이터 (개발용 - 백엔드 준비되면 제거)
import { WSChatRoom, WSMessage } from '@/features/chat/types';

export const MOCK_ROOMS: WSChatRoom[] = [
  {
    id: '1',
    name: '김철수',
    participantCount: 2,
    lastMessage: '안녕하세요!',
    lastMessageTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    name: '이영희',
    participantCount: 2,
    lastMessage: '오늘 회의는 몇 시에 하나요?',
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    name: '박민수',
    participantCount: 2,
    lastMessage: '프로젝트 진행 상황 공유드립니다.',
    lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const MOCK_MESSAGES: Record<string, WSMessage[]> = {
  '1': [
    {
      id: 'msg-1',
      roomId: '1',
      senderId: 'user-1',
      senderName: '김철수',
      content: '안녕하세요!',
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      isOwn: false,
    },
    {
      id: 'msg-2',
      roomId: '1',
      senderId: 'current-user',
      senderName: '나',
      content: '네, 안녕하세요! 반갑습니다.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      isOwn: true,
    },
  ],
  '2': [
    {
      id: 'msg-3',
      roomId: '2',
      senderId: 'user-2',
      senderName: '이영희',
      content: '오늘 회의는 몇 시에 하나요?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isOwn: false,
    },
    {
      id: 'msg-4',
      roomId: '2',
      senderId: 'current-user',
      senderName: '나',
      content: '오후 3시에 진행 예정입니다!',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      isOwn: true,
    },
  ],
  '3': [
    {
      id: 'msg-5',
      roomId: '3',
      senderId: 'user-3',
      senderName: '박민수',
      content: '프로젝트 진행 상황 공유드립니다.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      isOwn: false,
    },
  ],
};
