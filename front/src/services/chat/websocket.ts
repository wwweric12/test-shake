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

import { ReceivedMessage } from '@/types/chat';
import {
  ConnectionStatus,
  SendMessagePayload,
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
  private subscriptions: Map<number, StompSub> = new Map();
  private connectionStatus: ConnectionStatus = 'DISCONNECTED';
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private eventListeners: WebSocketEventListeners = {};
  public messageHandlers: Map<number, (message: ReceivedMessage) => void> = new Map();

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
      debug: config.debug ? (str) => console.log('[STOMP]', str) : undefined,
      onConnect: () => {
        this.connectionStatus = 'CONNECTED';
        this.reconnectAttempts = 0;
        this.eventListeners.onConnect?.();

        this.messageHandlers.forEach((handler, chatRoomId) => {
          if (!this.subscriptions.has(chatRoomId)) {
            this.subscribe(chatRoomId, handler);
          }
        });
      },
      onDisconnect: () => {
        this.connectionStatus = 'DISCONNECTED';
        this.eventListeners.onDisconnect?.();
      },
      onStompError: (frame) => {
        this.connectionStatus = 'ERROR';
        const error = new Error(`STOMP Error: ${frame.headers['message']}`);
        this.eventListeners.onError?.(error);
        this.reconnectAttempts++;

        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          this.disconnect();
        }
      },
      onWebSocketError: () => {
        this.connectionStatus = 'ERROR';
        this.eventListeners.onError?.(new Error('WebSocket 연결 에러'));
      },
    });

    this.client.activate();
  }

  disconnect(): void {
    if (!this.client) return;

    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.clear();
    this.messageHandlers.clear();
    this.client.deactivate();
    this.client = null;
    this.connectionStatus = 'DISCONNECTED';
  }

  subscribe(
    chatRoomId: number,
    onMessage: (message: ReceivedMessage) => void,
  ): StompSubscription | null {
    this.messageHandlers.set(chatRoomId, onMessage);

    if (!this.client?.connected) return null;

    if (this.subscriptions.has(chatRoomId)) {
      this.unsubscribe(chatRoomId);
    }

    const destination = `/user/queue/chat/${chatRoomId}`;
    const subscription = this.client.subscribe(destination, (message: IMessage) => {
      const parsed = JSON.parse(message.body);
      const actualMessage: ReceivedMessage = parsed.data?.message || parsed;

      onMessage(actualMessage);
      this.eventListeners.onMessage?.(actualMessage);
    });

    this.subscriptions.set(chatRoomId, subscription);
    return { chatRoomId, unsubscribe: () => this.unsubscribe(chatRoomId) };
  }

  unsubscribe(chatRoomId: number): void {
    const subscription = this.subscriptions.get(chatRoomId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(chatRoomId);
      this.messageHandlers.delete(chatRoomId);
    }
  }

  sendMessage(chatRoomId: number, content: string): void {
    if (!this.client?.connected) {
      throw new Error('WebSocket이 연결되지 않았습니다.');
    }

    const destination = `/pub/chat/${chatRoomId}/send`;
    const payload: SendMessagePayload = { content };

    this.client.publish({
      destination,
      body: JSON.stringify(payload),
    });
  }

  getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  isConnected(): boolean {
    return this.client?.connected ?? false;
  }

  isSubscribed(chatRoomId: number): boolean {
    return this.subscriptions.has(chatRoomId);
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
//       console.log('[WebSocket] ✅ ACCESS_TOKEN 쿠키 찾음');
//       return value;
//     }
//   }

//   console.warn('[WebSocket] ⚠️ ACCESS_TOKEN 쿠키를 찾을 수 없습니다');
//   return null;
// }
export const webSocketService = new WebSocketService();
