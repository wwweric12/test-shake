// /* eslint-disable no-console */
// /**
//  * WebSocket/STOMP 연결 관리 서비스
//  *
//  * 주요 기능:
//  * - STOMP over SockJS 연결 관리
//  * - 채팅방 구독 및 메시지 송수신
//  * - 자동 재연결 처리
//  * - 연결 상태 관리
//  *
//  * 싱글톤 패턴으로 구현하여 전역에서 하나의 인스턴스만 사용
//  */
import SockJS, { Options as SockJSOptions } from 'sockjs-client';

import {
  ChatListUpdateData,
  ChatRoomEnterRequest,
  ChatRoomLeaveRequest,
  ReceivedMessageData,
  SendMessageRequest,
} from '@/types/chat';
import {
  ConnectionStatus,
  StompSubscription,
  WebSocketConfig,
  WebSocketEventListeners,
} from '@/types/webSocket';

import { Client, IMessage, StompSubscription as StompSub } from '@stomp/stompjs';

interface ExtendedSockJSOptions extends SockJSOptions {
  withCredentials?: boolean;
}

class WebSocketService {
  private client: Client | null = null;
  private chatRoomSubscriptions: Map<number, StompSub> = new Map();
  private chatListSubscription: StompSub | null = null;
  private connectionStatus: ConnectionStatus = 'DISCONNECTED';
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private eventListeners: WebSocketEventListeners = {};
  private debug: boolean = false;

  // 채팅방 메시지 핸들러
  public messageHandlers: Map<number, (data: ReceivedMessageData) => void> = new Map();
  // 채팅 목록 업데이트 핸들러
  private chatListUpdateHandler: ((data: ChatListUpdateData) => void) | null = null;

  private log(message: string, ...args: unknown[]): void {
    if (this.debug) {
      console.log(`[WebSocket] ${message}`, ...args);
    }
  }

  // WebSocket 연결
  connect(config: WebSocketConfig): void {
    if (this.client?.connected || this.connectionStatus === 'CONNECTING') return;

    this.connectionStatus = 'CONNECTING';

    // const accessToken = this.getAccessToken();

    // if (!accessToken) {
    //   console.error('[WebSocket] ACCESS_TOKEN 쿠키가 없습니다');
    //   throw new Error('ACCESS_TOKEN 쿠키가 없습니다. 로그인이 필요합니다.');
    // }

    this.client = new Client({
      webSocketFactory: () =>
        new SockJS(config.url, undefined, {
          withCredentials: true,
        } as ExtendedSockJSOptions) as WebSocket,
      connectHeaders: {},
      heartbeatIncoming: config.heartbeatIncoming ?? 10000,
      heartbeatOutgoing: config.heartbeatOutgoing ?? 10000,
      reconnectDelay: 0,
      debug: config.debug ? (str) => this.log(str) : undefined,
      onConnect: () => {
        this.connectionStatus = 'CONNECTED';
        this.reconnectAttempts = 0;
        this.log('WebSocket 연결 성공');
        this.eventListeners.onConnect?.();
        // 재연결 시 기존 구독 복원
        this.restoreSubscriptions();
      },
      onDisconnect: () => {
        this.connectionStatus = 'DISCONNECTED';
        this.log('WebSocket 연결 해제');
        this.eventListeners.onDisconnect?.();
      },
      onStompError: (frame) => {
        this.connectionStatus = 'ERROR';
        const error = new Error(`STOMP Error: ${frame.headers['message']}`);
        this.log('STOMP 에러:', error);
        this.eventListeners.onError?.(error);
        this.reconnectAttempts++;

        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          this.disconnect();
        }
      },
      onWebSocketError: () => {
        this.connectionStatus = 'ERROR';
        const error = new Error('WebSocket 연결 에러');
        this.log('WebSocket 에러:', error);
        this.eventListeners.onError?.(error);
      },
    });

    this.client.activate();
  }

  // 재연결 시 기존 구독 복원
  private restoreSubscriptions(): void {
    // 채팅방 메시지 구독 복원
    this.messageHandlers.forEach((handler, chatRoomId) => {
      if (!this.chatRoomSubscriptions.has(chatRoomId)) {
        this.subscribeChatRoom(chatRoomId, handler);
      }
    });

    // 채팅 목록 업데이트 구독 복원
    if (this.chatListUpdateHandler && !this.chatListSubscription) {
      this.subscribeChatListUpdate(this.chatListUpdateHandler);
    }
  }

  // WebSocket 연결 해제
  disconnect(): void {
    if (!this.client) return;

    this.chatRoomSubscriptions.forEach((sub) => sub.unsubscribe());
    this.chatRoomSubscriptions.clear();
    this.chatListSubscription?.unsubscribe();
    this.chatListSubscription = null;
    this.messageHandlers.clear();
    this.chatListUpdateHandler = null;

    this.client.deactivate();
    this.client = null;
    this.connectionStatus = 'DISCONNECTED';
  }

  //채팅방 입장 알림 (SEND /pub/chat/enter)
  enterChatRoom(chatRoomId: number): void {
    if (!this.client?.connected) {
      this.log(`연결 안됨: 채팅방 ${chatRoomId} 입장 실패`);
      return;
    }

    const destination = '/pub/chat/enter';
    const payload: ChatRoomEnterRequest = { chatRoomId };

    this.client.publish({
      destination,
      body: JSON.stringify(payload),
    });

    this.log(`채팅방 ${chatRoomId} 입장 알림 전송`);
  }

  // 채팅방 퇴장 알림 (SEND /pub/chat/leave)
  leaveChatRoom(chatRoomId: number): void {
    if (!this.client?.connected) {
      this.log(`연결 안됨: 채팅방 ${chatRoomId} 퇴장 실패`);
      return;
    }

    const destination = '/pub/chat/leave';
    const payload: ChatRoomLeaveRequest = { chatRoomId };

    this.client.publish({
      destination,
      body: JSON.stringify(payload),
    });
    this.log(`채팅방 ${chatRoomId} 퇴장 알림`);
  }

  // 채팅방 메시지 구독 (SUBSCRIBE /user/queue/chat/{chatRoomId})

  subscribeChatRoom(
    chatRoomId: number,
    onMessage: (data: ReceivedMessageData) => void,
  ): StompSubscription | null {
    this.messageHandlers.set(chatRoomId, onMessage);

    if (!this.client?.connected) {
      this.log(`WebSocket 미연결 상태: 채팅방 ${chatRoomId} 구독 실패`);
      return null;
    }

    if (this.chatRoomSubscriptions.has(chatRoomId)) {
      this.unsubscribeChatRoom(chatRoomId);
    }

    const destination = `/user/queue/chat/${chatRoomId}`;
    this.log(`채팅방 ${chatRoomId} 구독 시작: ${destination}`);

    const subscription = this.client.subscribe(destination, (message: IMessage) => {
      const parsed = JSON.parse(message.body);
      const messageData: ReceivedMessageData = {
        message: parsed.data.message,
        isMine: parsed.data.isMine,
      };

      this.log(`채팅방 ${chatRoomId} 메시지 수신`);
      onMessage(messageData);
      this.eventListeners.onMessage?.(messageData.message);
    });

    this.chatRoomSubscriptions.set(chatRoomId, subscription);

    return { chatRoomId, unsubscribe: () => this.unsubscribeChatRoom(chatRoomId) };
  }

  // 채팅방 메시지 구독 해제
  unsubscribeChatRoom(chatRoomId: number): void {
    const subscription = this.chatRoomSubscriptions.get(chatRoomId);
    if (subscription) {
      subscription.unsubscribe();
      this.chatRoomSubscriptions.delete(chatRoomId);
      this.messageHandlers.delete(chatRoomId);
      this.log(`채팅방 ${chatRoomId} 구독 해제`);
    }
  }

  // 채팅 목록 업데이트 구독 (SUBSCRIBE /user/queue/chat-list/update)

  subscribeChatListUpdate(onUpdate: (data: ChatListUpdateData) => void): void {
    this.chatListUpdateHandler = onUpdate;

    if (!this.client?.connected) {
      this.log('WebSocket 미연결 상태: 채팅 목록 구독 실패');
      return;
    }

    // 이미 구독 중이면 해제 후 재구독
    if (this.chatListSubscription) {
      this.chatListSubscription.unsubscribe();
    }

    const destination = '/user/queue/chat-list/update';
    this.log(`채팅 목록 업데이트 구독 시작: ${destination}`);

    this.chatListSubscription = this.client.subscribe(destination, (message: IMessage) => {
      const parsed = JSON.parse(message.body);
      const updateData: ChatListUpdateData = parsed.data;

      this.log('채팅 목록 업데이트 수신');
      onUpdate(updateData);
    });
  }

  // 채팅 목록 업데이트 구독 해제
  unsubscribeChatListUpdate(): void {
    if (this.chatListSubscription) {
      this.chatListSubscription.unsubscribe();
      this.chatListSubscription = null;
      this.chatListUpdateHandler = null;
      this.log('채팅 목록 업데이트 구독 해제');
    }
  }

  // 메시지 전송 (SEND /pub/chat/{chatRoomId}/send)
  sendMessage(chatRoomId: number, content: string): void {
    if (!this.client?.connected) {
      this.log(`연결 안됨: 메시지 전송 실패 (chatRoomId: ${chatRoomId})`);
      return;
    }

    const destination = `/pub/chat/${chatRoomId}/send`;
    const payload: SendMessageRequest = { content };

    this.client.publish({
      destination,
      body: JSON.stringify(payload),
    });
    this.log(`메시지 전송 (chatRoomId: ${chatRoomId}): ${content}`);
  }

  // ==================== 상태 조회 ====================
  getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  isConnected(): boolean {
    return this.client?.connected ?? false;
  }

  isSubscribedToChatRoom(chatRoomId: number): boolean {
    return this.chatRoomSubscriptions.has(chatRoomId);
  }

  isSubscribedToChatList(): boolean {
    return this.chatListSubscription !== null;
  }

  setEventListeners(listeners: WebSocketEventListeners): void {
    this.eventListeners = { ...this.eventListeners, ...listeners };
  }
}
/**
 * 쿠키에서 ACCESS_TOKEN 추출
 * 백엔드의 JwtHandshakeInterceptor가 쿠키를 읽어 인증 처리
 */
// private getAccessToken(): string | null {
//   if (typeof document === 'undefined') return null;

//   const cookies = document.cookie.split(';');
//   for (const cookie of cookies) {
//     const [name, value] = cookie.trim().split('=');
//     if (name.toUpperCase() === 'ACCESS_TOKEN') {
//       console.log('[WebSocket] ACCESS_TOKEN 쿠키 찾음');
//       return value;
//     }
//   }

//   console.warn('[WebSocket] ACCESS_TOKEN 쿠키를 찾을 수 없습니다');
//   return null;
// }
export const webSocketService = new WebSocketService();
