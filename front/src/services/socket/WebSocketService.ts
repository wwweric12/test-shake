import SockJS, { Options as SockJSOptions } from 'sockjs-client';

import {
  ChatListUpdateData,
  ChatRoomEnterRequest,
  ChatRoomLeaveRequest,
  ReceivedMessageData,
  SendMessageRequest,
} from '@/types/chat';
import { HomeBadgeCountData } from '@/types/home';
import { NotificationUpdateData } from '@/types/notification';
import {
  ConnectionStatus,
  ErrorSubscription,
  StompSubscription,
  WebSocketConfig,
  WebSocketError,
  WebSocketEventListeners,
} from '@/types/webSocket';

import { Client, IMessage, StompSubscription as StompSub } from '@stomp/stompjs';

interface ExtendedSockJSOptions extends SockJSOptions {
  withCredentials?: boolean;
}

declare global {
  interface Window {
    wsDebug: WebSocketService;
  }
}

class WebSocketService {
  private client: Client | null = null;
  private chatRoomSubscriptions: Map<number, StompSub> = new Map();
  private chatListSubscription: StompSub | null = null;
  private errorSubscription: StompSub | null = null; // 🔥 에러 구독 추가
  private connectionStatus: ConnectionStatus = 'DISCONNECTED';
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private eventListeners: WebSocketEventListeners = {};
  private debug: boolean = false;

  // 재연결 시 복원용 핸들러
  public messageHandlers: Map<number, (data: ReceivedMessageData) => void> = new Map();
  private chatListUpdateHandler: ((data: ChatListUpdateData) => void) | null = null;
  private errorHandlers: Set<(error: WebSocketError) => void> = new Set(); // 🔥 에러 핸들러 Set

  private subscriptionMonitorInterval: NodeJS.Timeout | null = null;

  private notificationSubscription: StompSub | null = null;
  private notificationHandler: ((data: NotificationUpdateData) => void) | null = null;

  private badgeCountSubscription: StompSub | null = null;
  private badgeCountHandler: ((data: HomeBadgeCountData) => void) | null = null;

  private log(message: string, ...args: unknown[]): void {
    if (this.debug) {
      console.log(`[WebSocket] ${message}`, ...args);
    }
  }

  connect(config: WebSocketConfig): void {
    if (this.client?.connected || this.connectionStatus === 'CONNECTING') {
      this.log('이미 연결 중이거나 연결됨 상태');
      return;
    }

    this.connectionStatus = 'CONNECTING';
    this.debug = config.debug ?? false;

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

        // 구독 상태 초기화
        this.chatRoomSubscriptions.clear();
        this.chatListSubscription = null;
        this.errorSubscription = null;

        this.eventListeners.onConnect?.();

        // 재구독
        setTimeout(() => {
          this.restoreSubscriptions();
        }, 100);

        this.startSubscriptionMonitoring();
      },

      onDisconnect: () => {
        this.connectionStatus = 'DISCONNECTED';
        this.log('WebSocket 연결 해제');

        this.chatRoomSubscriptions.clear();
        this.chatListSubscription = null;
        this.errorSubscription = null;

        this.eventListeners.onDisconnect?.();
        this.stopSubscriptionMonitoring();
      },

      onStompError: (frame) => {
        this.connectionStatus = 'ERROR';
        const errorMessage = frame.headers['message'] || frame.body;
        this.log('STOMP 에러:', errorMessage);

        const error: WebSocketError = new Error(`STOMP Error: ${errorMessage}`);
        error.type = 'STOMP_ERROR';
        this.eventListeners.onError?.(error);

        this.reconnectAttempts++;
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          this.log('최대 재연결 시도 횟수 초과, 연결 해제');
          this.disconnect();
        }
      },

      onWebSocketError: () => {
        this.connectionStatus = 'ERROR';
        this.chatRoomSubscriptions.clear();
        this.chatListSubscription = null;
        this.errorSubscription = null;

        const error: WebSocketError = new Error('WebSocket 연결 에러');
        error.type = 'CONNECTION_ERROR';
        this.log('WebSocket 에러:', error);
        this.eventListeners.onError?.(error);
      },
    });

    this.client.activate();
  }

  private restoreSubscriptions(): void {
    this.log('구독 복원 시작');

    // 채팅방 메시지 구독 복원
    this.messageHandlers.forEach((handler, chatRoomId) => {
      this.log(`채팅방 ${chatRoomId} 구독 복원`);
      this.subscribeChatRoom(chatRoomId, handler);
    });

    // 채팅 목록 업데이트 구독 복원
    if (this.chatListUpdateHandler) {
      this.log('채팅 목록 업데이트 구독 복원');
      this.subscribeChatListUpdate(this.chatListUpdateHandler);
    }

    // 🔥 에러 큐 구독 복원
    this.subscribeErrorQueue();

    if (this.notificationHandler) {
      this.log('홈 알림 구독 복원 중...');
      this.subscribeNotification(this.notificationHandler);
    }

    if (this.badgeCountHandler) {
      this.log('홈 채팅 구독 복원 중...');
      this.subscribeHomeBadgeCount(this.badgeCountHandler);
    }
  }

  disconnect(): void {
    if (!this.client) return;

    this.log('WebSocket 연결 해제 시작');
    this.stopSubscriptionMonitoring();

    // 모든 구독 해제
    this.chatRoomSubscriptions.forEach((sub) => sub.unsubscribe());
    this.chatRoomSubscriptions.clear();

    this.chatListSubscription?.unsubscribe();
    this.chatListSubscription = null;

    this.errorSubscription?.unsubscribe();
    this.errorSubscription = null;

    // 핸들러 정리
    this.messageHandlers.clear();
    this.chatListUpdateHandler = null;
    this.errorHandlers.clear();

    this.client.deactivate();
    this.client = null;
    this.connectionStatus = 'DISCONNECTED';

    this.log('WebSocket 연결 해제 완료');
  }

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

    this.log(`채팅방 ${chatRoomId} 퇴장 알림 전송`);
  }

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
      this.log(`채팅방 ${chatRoomId} 기존 구독 해제 후 재구독`);
      this.unsubscribeChatRoom(chatRoomId);
    }

    const destination = `/user/queue/chat/${chatRoomId}`;
    this.log(`채팅방 ${chatRoomId} 구독 시작: ${destination}`);

    const subscription = this.client.subscribe(destination, (message: IMessage) => {
      try {
        const parsed = JSON.parse(message.body);
        const messageData: ReceivedMessageData = {
          message: parsed.data.message,
          isMine: parsed.data.isMine,
        };

        this.log(`채팅방 ${chatRoomId} 메시지 수신:`, messageData);

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('websocket-message'));
        }

        onMessage(messageData);
        this.eventListeners.onMessage?.(messageData.message);
      } catch (error) {
        this.log(`메시지 파싱 에러:`, error);
      }
    });

    this.chatRoomSubscriptions.set(chatRoomId, subscription);

    return {
      chatRoomId,
      unsubscribe: () => this.unsubscribeChatRoom(chatRoomId),
    };
  }

  unsubscribeChatRoom(chatRoomId: number): void {
    const subscription = this.chatRoomSubscriptions.get(chatRoomId);
    if (subscription) {
      subscription.unsubscribe();
      this.chatRoomSubscriptions.delete(chatRoomId);
      this.messageHandlers.delete(chatRoomId);
      this.log(`채팅방 ${chatRoomId} 구독 해제`);
    }
  }

  subscribeChatListUpdate(onUpdate: (data: ChatListUpdateData) => void): void {
    this.chatListUpdateHandler = onUpdate;

    if (!this.client?.connected) {
      this.log('WebSocket 미연결 상태: 채팅 목록 구독 실패');
      return;
    }

    if (this.chatListSubscription) {
      this.chatListSubscription.unsubscribe();
    }

    const destination = '/user/queue/chat-list/update';
    this.log(`채팅 목록 업데이트 구독 시작: ${destination}`);

    this.chatListSubscription = this.client.subscribe(destination, (message: IMessage) => {
      try {
        const parsed = JSON.parse(message.body);
        const updateData: ChatListUpdateData = parsed.data;

        this.log('채팅 목록 업데이트 수신:', updateData);

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('websocket-message'));
        }

        onUpdate(updateData);
      } catch (error) {
        this.log(`채팅 목록 업데이트 파싱 에러:`, error);
      }
    });
  }

  unsubscribeChatListUpdate(): void {
    if (this.chatListSubscription) {
      this.chatListSubscription.unsubscribe();
      this.chatListSubscription = null;
      this.chatListUpdateHandler = null;
      this.log('채팅 목록 업데이트 구독 해제');
    }
  }

  // 🔥 에러 큐 구독
  private subscribeErrorQueue(): void {
    if (!this.client?.connected) {
      this.log('WebSocket 미연결 상태: 에러 큐 구독 실패');
      return;
    }

    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }

    const destination = '/user/queue/errors';
    this.log(`에러 큐 구독 시작: ${destination}`);

    this.errorSubscription = this.client.subscribe(destination, (message: IMessage) => {
      try {
        const payload = JSON.parse(message.body);
        const { errorCode, message: errorMessage } = payload;

        this.log('에러 메시지 수신:', payload);

        const error: WebSocketError = new Error(errorMessage || '알 수 없는 에러');

        // 에러 타입 분류
        if (errorCode === 'PARTNER_EXITED_CHAT_ROOM') {
          error.type = 'PARTNER_LEFT';
        } else {
          error.type = 'STOMP_ERROR';
        }

        // 모든 에러 핸들러에 전파
        this.errorHandlers.forEach((handler) => handler(error));
        this.eventListeners.onError?.(error);
      } catch (err) {
        this.log('에러 메시지 파싱 실패:', err);
      }
    });

    this.log('에러 큐 구독 완료');
  }

  // 🔥 에러 구독 메서드 (Hook에서 사용)
  subscribeError(handler: (error: WebSocketError) => void): ErrorSubscription {
    this.errorHandlers.add(handler);
    this.log('에러 핸들러 추가됨');

    return {
      unsubscribe: () => {
        this.errorHandlers.delete(handler);
        this.log('에러 핸들러 제거됨');
      },
    };
  }

  sendMessage(chatRoomId: number, content: string): void {
    if (!this.client?.connected) {
      this.log(`연결 안됨: 메시지 전송 실패 (chatRoomId: ${chatRoomId})`);
      throw new Error('WebSocket 연결이 끊어졌습니다.');
    }

    const destination = `/pub/chat/${chatRoomId}/send`;
    const payload: SendMessageRequest = { content };

    this.client.publish({
      destination,
      body: JSON.stringify(payload),
    });

    this.log(`메시지 전송 (chatRoomId: ${chatRoomId}): ${content}`);
  }

  subscribeNotification(onUpdate: (data: NotificationUpdateData) => void): void {
    this.notificationHandler = onUpdate;

    if (!this.client?.connected) {
      this.log('WebSocket 미연결 상태: 알림 구독 실패 (연결 시 자동 복원됨)');
      return;
    }

    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }

    const destination = '/user/queue/notification';
    this.log(`알림 구독 시작: ${destination}`);

    this.notificationSubscription = this.client.subscribe(destination, (message: IMessage) => {
      try {
        const parsed = JSON.parse(message.body);
        const notificationData = parsed.data;

        this.log('실시간 알림 수신:', notificationData);
        
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('websocket-message'));
        }

        onUpdate(notificationData);
      } catch (error) {
        this.log('알림 데이터 파싱 에러:', error);
      }
    });
  }

  unsubscribeNotification(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
      this.notificationSubscription = null;
      this.notificationHandler = null;
      this.log('알림 구독 해제 완료');
    }
  }

  subscribeHomeBadgeCount(onUpdate: (data: HomeBadgeCountData) => void): void {
    this.badgeCountHandler = onUpdate;

    if (!this.client?.connected) return;

    if (this.badgeCountSubscription) {
      this.badgeCountSubscription.unsubscribe();
    }

    const destination = '/user/queue/home/badge-count';
    this.badgeCountSubscription = this.client.subscribe(destination, (message) => {
      try {
        const parsed = JSON.parse(message.body);
        onUpdate(parsed.data);
      } catch (error) {
        this.log('배지 카운트 파싱 에러:', error);
      }
    });
  }

  unsubscribeHomeBadgeCount(): void {
    if (this.badgeCountSubscription) {
      this.badgeCountSubscription.unsubscribe();
      this.badgeCountSubscription = null;
      this.badgeCountHandler = null;
    }
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

  setDebug(debug: boolean): void {
    this.debug = debug;
  }

  // ==================== 디버깅 메서드 ====================

  resubscribeToChatList(): void {
    if (!this.client?.connected) {
      console.warn('[WebSocket] 연결되지 않아 재구독할 수 없습니다.');
      return;
    }

    if (this.chatListSubscription) {
      this.chatListSubscription.unsubscribe();
      this.chatListSubscription = null;
      console.log('[WebSocket] 기존 채팅 목록 구독 해제');
    }

    if (this.chatListUpdateHandler) {
      this.subscribeChatListUpdate(this.chatListUpdateHandler);
      console.log('[WebSocket] 채팅 목록 재구독 완료');
    }
  }

  resubscribeToChatRoom(roomId: number): void {
    if (!this.client?.connected) {
      console.warn('[WebSocket] 연결되지 않아 재구독할 수 없습니다.');
      return;
    }

    const handler = this.messageHandlers.get(roomId);
    if (!handler) {
      console.warn(`[WebSocket] 채팅방 ${roomId}에 대한 핸들러가 없습니다.`);
      return;
    }

    const subscription = this.chatRoomSubscriptions.get(roomId);
    if (subscription) {
      subscription.unsubscribe();
      this.chatRoomSubscriptions.delete(roomId);
      console.log(`[WebSocket] 채팅방 ${roomId} 기존 구독 해제`);
    }

    this.subscribeChatRoom(roomId, handler);
    console.log(`[WebSocket] 채팅방 ${roomId} 재구독 완료`);
  }

  debugStatus(): void {
    console.group('[WebSocket Debug Status]');
    console.log('연결 상태:', this.connectionStatus);
    console.log('STOMP 연결:', this.client?.connected);
    console.log('채팅 목록 구독:', this.chatListSubscription !== null);
    console.log('에러 큐 구독:', this.errorSubscription !== null);
    console.log('구독 중인 채팅방:', Array.from(this.chatRoomSubscriptions.keys()));
    console.log('메시지 핸들러:', Array.from(this.messageHandlers.keys()));
    console.log('에러 핸들러 수:', this.errorHandlers.size);
    console.log('재연결 시도 횟수:', this.reconnectAttempts);
    console.groupEnd();
  }

  startSubscriptionMonitoring(): void {
    if (this.subscriptionMonitorInterval) {
      clearInterval(this.subscriptionMonitorInterval);
    }

    this.subscriptionMonitorInterval = setInterval(() => {
      if (!this.isConnected()) return;

      // 채팅 목록 구독 체크
      if (this.chatListUpdateHandler && !this.chatListSubscription) {
        console.warn('[WebSocket] 채팅 목록 구독이 끊어짐. 자동 재구독 시도...');
        this.resubscribeToChatList();
      }

      // 에러 큐 구독 체크
      if (!this.errorSubscription) {
        console.warn('[WebSocket] 에러 큐 구독이 끊어짐. 자동 재구독 시도...');
        this.subscribeErrorQueue();
      }

      // 채팅방 구독 체크
      this.messageHandlers.forEach((_, roomId) => {
        if (!this.chatRoomSubscriptions.has(roomId)) {
          console.warn(`[WebSocket] 채팅방 ${roomId} 구독이 끊어짐. 자동 재구독 시도...`);
          this.resubscribeToChatRoom(roomId);
        }
      });
    }, 5000);

    console.log('[WebSocket] 구독 모니터링 시작 (5초 간격)');
  }

  stopSubscriptionMonitoring(): void {
    if (this.subscriptionMonitorInterval) {
      clearInterval(this.subscriptionMonitorInterval);
      this.subscriptionMonitorInterval = null;
      console.log('[WebSocket] 구독 모니터링 중지');
    }
  }

  enableDebugLogging(): void {
    if (this.client) {
      this.client.debug = (str) => {
        console.log('[STOMP Debug]', str);
      };
      console.log('[WebSocket] STOMP 상세 로깅 활성화');
    }
  }

  disableDebugLogging(): void {
    if (this.client) {
      this.client.debug = () => {};
      console.log('[WebSocket] STOMP 상세 로깅 비활성화');
    }
  }
}

export const webSocketService = new WebSocketService();

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.wsDebug = webSocketService;
  console.log(
    '%c[WebSocket] 디버깅 모드 활성화',
    'color: green; font-weight: bold;',
    '\n콘솔에서 window.wsDebug로 접근 가능',
  );
}