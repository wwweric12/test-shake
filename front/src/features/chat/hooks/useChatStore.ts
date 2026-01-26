import { create } from 'zustand';

import type { WSMessage } from '../types';

interface ChatState {
  messages: WSMessage[];
  currentUserId: string;
  currentUsername: string;
  currentRoomId: string | null;
  typingUsers: Map<string, string>; // userId -> username

  addMessage: (message: WSMessage) => void;
  setCurrentUser: (userId: string, username: string) => void;
  setCurrentRoom: (roomId: string | null) => void;
  clearMessages: () => void;
  setTypingUser: (userId: string, username: string) => void;
  removeTypingUser: (userId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  currentUserId: '',
  currentUsername: '',
  currentRoomId: null,
  typingUsers: new Map(),

  addMessage: (message) =>
    set((state) => {
      // 중복 메시지 방지
      if (state.messages.some((m) => m.id === message.id)) {
        return state;
      }

      return {
        messages: [
          ...state.messages,
          { ...message, isOwn: message.senderId === state.currentUserId },
        ],
      };
    }),

  setCurrentUser: (userId, username) => set({ currentUserId: userId, currentUsername: username }),

  setCurrentRoom: (roomId) => set({ currentRoomId: roomId }),

  clearMessages: () => set({ messages: [], typingUsers: new Map() }),

  setTypingUser: (userId, username) =>
    set((state) => {
      const newTypingUsers = new Map(state.typingUsers);
      newTypingUsers.set(userId, username);
      return { typingUsers: newTypingUsers };
    }),

  removeTypingUser: (userId) =>
    set((state) => {
      const newTypingUsers = new Map(state.typingUsers);
      newTypingUsers.delete(userId);
      return { typingUsers: newTypingUsers };
    }),
}));
