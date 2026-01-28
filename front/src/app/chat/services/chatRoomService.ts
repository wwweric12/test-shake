import { ChatRoom } from '@/app/chat/types/models';

export async function fetchChatRooms(): Promise<ChatRoom[]> {
  const res = await fetch('/api/chat/rooms');
  const json = await res.json();
  return json.data;
}
