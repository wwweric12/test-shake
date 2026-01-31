/* eslint-disable no-console */
/**
 * WebSocket/STOMP 연결 관리 서비스
 *
 * 주요 기능:
 * - STOMP over SockJS 연결 관리
 * - 채팅방 구독 및 메시지 송수신
 * - 자동 재연결 처리
 * - 연결 상태 관리
 *
 * 싱글톤 패턴으로 구현하여 전역에서 하나의 인스턴스만 사용
 */

import SockJS, { Options as SockJSOptions } from 'sockjs-client';

import {
  ConnectionStatus,
  ReceivedChatMessage,
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
  private reconnectDelay = 3000;
  private eventListeners: WebSocketEventListeners = {};
  public messageHandlers: Map<number, (message: ReceivedChatMessage) => void> = new Map();

  /**
   * WebSocket 연결
   * 백엔드의 JwtHandshakeInterceptor가 쿠키에서 ACCESS_TOKEN을 읽어 인증 처리
   */
  connect(config: WebSocketConfig): void {
    if (this.client?.connected) {
      console.log('[WebSocket] 이미 연결됨');
      return;
    }
    if (this.connectionStatus === 'CONNECTING') {
      console.log('[WebSocket] 연결 진행 중');
      return;
    }

    this.connectionStatus = 'CONNECTING';
    console.log('[WebSocket] 연결 시작...');

    try {
      // const accessToken = this.getAccessToken();

      // if (!accessToken) {
      //   console.error('[WebSocket] ACCESS_TOKEN 쿠키가 없습니다');
      //   throw new Error('ACCESS_TOKEN 쿠키가 없습니다. 로그인이 필요합니다.');
      // }

      this.client = new Client({
        webSocketFactory: () =>
          new SockJS(config.url, undefined, {
            withCredentials: true, // 🔥 쿠키 자동 전송 (백엔드 인증용)
          } as ExtendedSockJSOptions) as WebSocket,
        connectHeaders: {
          // Authorization 헤더는 백엔드가 사용하지 않지만, 호환성을 위해 유지
          // Authorization: accessToken,
        },
        heartbeatIncoming: config.heartbeatIncoming ?? 10000,
        heartbeatOutgoing: config.heartbeatOutgoing ?? 10000,
        reconnectDelay: 0, // 수동 재연결 관리
        debug: config.debug ? (str) => console.log('[STOMP Debug]', str) : undefined,
        beforeConnect: () => console.log('[WebSocket] STOMP 연결 시작'),
        onConnect: () => {
          console.log('[WebSocket] ✅ 연결 성공!');
          this.connectionStatus = 'CONNECTED';
          this.reconnectAttempts = 0;
          this.eventListeners.onConnect?.();

          // 🔥 연결 후 등록된 핸들러 기준으로 자동 구독
          this.messageHandlers.forEach((handler, chatRoomId) => {
            if (!this.subscriptions.has(chatRoomId)) {
              console.log(`[WebSocket] 연결 후 채팅방 ${chatRoomId} 자동 구독`);
              this.subscribe(chatRoomId, handler);
            }
          });
        },
        onDisconnect: () => {
          console.log('[WebSocket] 연결 해제');
          this.connectionStatus = 'DISCONNECTED';
          this.eventListeners.onDisconnect?.();
        },
        onStompError: (frame) => {
          console.error('[WebSocket] STOMP 에러:', frame.headers['message']);
          this.connectionStatus = 'ERROR';
          const error = new Error(`STOMP Error: ${frame.headers['message']}`);
          this.eventListeners.onError?.(error);
          this.reconnectAttempts++;

          if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('[WebSocket] 최대 재연결 시도 횟수 초과');
            this.disconnect();
          }
        },
        onWebSocketError: (event) => {
          console.error('[WebSocket] WebSocket 에러:', event);
          this.connectionStatus = 'ERROR';
          this.eventListeners.onError?.(new Error('WebSocket 연결 에러'));
        },
      });

      this.client.activate();
    } catch (error) {
      console.error('[WebSocket] 연결 실패:', error);
      this.connectionStatus = 'ERROR';
      this.eventListeners.onError?.(
        error instanceof Error ? error : new Error('WebSocket 연결 실패'),
      );
    }
  }

  /**
   * WebSocket 연결 해제
   */
  disconnect(): void {
    if (!this.client) return;

    console.log('[WebSocket] 연결 해제 시작');
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.clear();
    this.messageHandlers.clear();
    this.client.deactivate();
    this.client = null;
    this.connectionStatus = 'DISCONNECTED';
    console.log('[WebSocket] 연결 해제 완료');
  }

  /**
   * 채팅방 구독
   * 백엔드: /sub/chat/{chatRoomId}
   */
  subscribe(
    chatRoomId: number,
    onMessage: (message: ReceivedChatMessage) => void,
  ): StompSubscription | null {
    // 메시지 핸들러 등록
    this.messageHandlers.set(chatRoomId, onMessage);

    if (!this.client?.connected) {
      console.warn(`[WebSocket] 채팅방 ${chatRoomId} 구독 대기 (연결 전)`);
      return null; // 연결 후 onConnect에서 자동 구독
    }

    // 이미 구독 중이면 해제 후 재구독
    if (this.subscriptions.has(chatRoomId)) {
      console.log(`[WebSocket] 채팅방 ${chatRoomId} 재구독`);
      this.unsubscribe(chatRoomId);
    }

    try {
      const destination = `/sub/chat/${chatRoomId}`;
      const subscription = this.client.subscribe(destination, (message: IMessage) => {
        try {
          const parsedMessage: ReceivedChatMessage = JSON.parse(message.body);
          console.log(`[WebSocket] 메시지 수신 (채팅방 ${chatRoomId}):`, parsedMessage);
          onMessage(parsedMessage);
          this.eventListeners.onMessage?.(parsedMessage);
        } catch (err) {
          console.error('[WebSocket] 메시지 파싱 에러:', err);
        }
      });

      this.subscriptions.set(chatRoomId, subscription);
      console.log(`[WebSocket] ✅ 채팅방 ${chatRoomId} 구독 성공`);
      return { chatRoomId, unsubscribe: () => this.unsubscribe(chatRoomId) };
    } catch (err) {
      console.error(`[WebSocket] 채팅방 ${chatRoomId} 구독 실패:`, err);
      return null;
    }
  }

  /**
   * 채팅방 구독 해제
   */
  unsubscribe(chatRoomId: number): void {
    const subscription = this.subscriptions.get(chatRoomId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(chatRoomId);
      this.messageHandlers.delete(chatRoomId);
      console.log(`[WebSocket] 채팅방 ${chatRoomId} 구독 해제`);
    }
  }

  /**
   * 메시지 전송
   * 백엔드: /pub/chat/{chatRoomId}/send
   */
  sendMessage(chatRoomId: number, content: string): void {
    if (!this.client?.connected) {
      throw new Error('WebSocket이 연결되지 않았습니다.');
    }

    const destination = `/pub/chat/${chatRoomId}/send`;
    const payload: SendMessagePayload = { content };

    console.log(`[WebSocket] 메시지 전송 (채팅방 ${chatRoomId}):`, payload);
    this.client.publish({
      destination,
      body: JSON.stringify(payload),
    });
  }

  /**
   * 연결 상태 조회
   */
  getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  /**
   * 연결 여부 확인
   */
  isConnected(): boolean {
    return this.client?.connected ?? false;
  }

  /**
   * 구독 여부 확인
   */
  isSubscribed(chatRoomId: number): boolean {
    return this.subscriptions.has(chatRoomId);
  }

  /**
   * 이벤트 리스너 설정
   */
  setEventListeners(listeners: WebSocketEventListeners): void {
    this.eventListeners = { ...this.eventListeners, ...listeners };
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
}

export const webSocketService = new WebSocketService();
