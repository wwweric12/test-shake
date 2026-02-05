/**
 * WebSocket/STOMP 연결 관리 서비스 (싱글톤)
 *
 * 주요 기능:
 * - STOMP over SockJS 연결 관리
 * - 채팅방 구독 및 메시지 송수신
 * - 자동 재연결 처리
 * - 쿠키 기반 인증 (백엔드가 자동으로 처리)
 */

/**
 * WebSocket/STOMP 연결 관리 서비스 (싱글톤)
 *
 * 주요 기능:
 * - STOMP over SockJS 연결 관리
 * - 채팅방 구독 및 메시지 송수신
 * - 자동 재연결 처리
 * - 쿠키 기반 인증 (백엔드가 자동으로 처리)
 */
/* eslint-disable no-console */
/**
 * WebSocket/STOMP 연결 관리 서비스 (싱글톤)
 */
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
  private isDebugMode: boolean = false;

  // 재연결 시 복원용 핸들러
  public messageHandlers: Map<number, (data: ReceivedMessageData) => void> = new Map();
  private chatListUpdateHandler: ((data: ChatListUpdateData) => void) | null = null;
  private errorHandlers: Set<(error: WebSocketError) => void> = new Set(); // 🔥 에러 핸들러 Set

  private subscriptionMonitorInterval: NodeJS.Timeout | null = null;

  private log(message: string, ...args: unknown[]): void {
    if (this.isDebugMode) {
      console.log(`[WebSocket] ${message}`, ...args);
    }
  }

  connect(config: WebSocketConfig): void {
    if (this.client?.connected || this.connectionStatus === 'CONNECTING') {
      this.log('이미 연결 중이거나 연결됨 상태');
      return;
    }

    this.connectionStatus = 'CONNECTING';
    this.isDebugMode = !!config.debug;

    this.client = new Client({
      webSocketFactory: () =>
        new SockJS(config.url, undefined, {
          withCredentials: true,
        } as ExtendedSockJSOptions) as WebSocket,

      connectHeaders: {},
      heartbeatIncoming: config.heartbeatIncoming ?? 10000,
      heartbeatOutgoing: config.heartbeatOutgoing ?? 10000,
      reconnectDelay: 0,
      debug: config.debug,

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
    this.isDebugMode = debug;
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
// /**
//  * WebSocket/STOMP 연결 관리 서비스 (싱글톤)
//  *
//  * 주요 기능:
//  * - STOMP over SockJS 연결 관리
//  * - 채팅방 구독 및 메시지 송수신
//  * - 자동 재연결 처리
//  * - 쿠키 기반 인증 (백엔드가 자동으로 처리)
//  */
// /* eslint-disable no-console */
// /**
//  * WebSocket/STOMP 연결 관리 서비스 (싱글톤)
//  *
//  * 주요 기능:
//  * - STOMP over SockJS 연결 관리
//  * - 채팅방 구독 및 메시지 송수신
//  * - 자동 재연결 처리
//  * - 쿠키 기반 인증 (백엔드가 자동으로 처리)
//  */
// import SockJS, { Options as SockJSOptions } from 'sockjs-client';

// import {
//   ChatListUpdateData,
//   ChatRoomEnterRequest,
//   ChatRoomLeaveRequest,
//   ReceivedMessageData,
//   SendMessageRequest,
// } from '@/types/chat';
// import {
//   ConnectionStatus,
//   StompSubscription,
//   WebSocketConfig,
//   WebSocketEventListeners,
// } from '@/types/webSocket';

// import { Client, IMessage, StompSubscription as StompSub } from '@stomp/stompjs';

// interface ExtendedSockJSOptions extends SockJSOptions {
//   withCredentials?: boolean;
// }

// // 🆕 전역 window 타입 확장
// declare global {
//   interface Window {
//     wsDebug: WebSocketService;
//   }
// }

// class WebSocketService {
//   private client: Client | null = null; // STOMP 클라이언트
//   private chatRoomSubscriptions: Map<number, StompSub> = new Map(); // 채팅방별 구독 관리
//   private chatListSubscription: StompSub | null = null; // 채팅 목록 업데이트 구독
//   private connectionStatus: ConnectionStatus = 'DISCONNECTED'; // 현재 연결 상태
//   private reconnectAttempts = 0; // 재연결 시도 횟수
//   private maxReconnectAttempts = 5; // 최대 재연결 시도 횟수
//   private eventListeners: WebSocketEventListeners = {}; // 이벤트 리스너
//   private debug: boolean = false; // 디버그 모드

//   // 채팅방 메시지 핸들러 맵 (재연결 시 복원용)
//   public messageHandlers: Map<number, (data: ReceivedMessageData) => void> = new Map();
//   // 채팅 목록 업데이트 핸들러 (재연결 시 복원용)
//   private chatListUpdateHandler: ((data: ChatListUpdateData) => void) | null = null;

//   // 🆕 디버깅: 구독 모니터링 인터벌
//   private subscriptionMonitorInterval: NodeJS.Timeout | null = null;

//   /**
//    * 디버그 로그 출력
//    */
//   private log(message: string, ...args: unknown[]): void {
//     if (this.debug) {
//       console.log(`[WebSocket] ${message}`, ...args);
//     }
//   }

//   /**
//    * WebSocket 연결 시작
//    * @param config - 연결 설정 (URL, heartbeat 등)
//    */
//   connect(config: WebSocketConfig): void {
//     // 이미 연결 중이거나 연결됨 상태면 중복 연결 방지
//     if (this.client?.connected || this.connectionStatus === 'CONNECTING') {
//       this.log('이미 연결 중이거나 연결됨 상태');
//       return;
//     }

//     this.connectionStatus = 'CONNECTING';
//     this.debug = config.debug ?? false;

//     // STOMP 클라이언트 생성
//     this.client = new Client({
//       // SockJS를 WebSocket 팩토리로 사용
//       webSocketFactory: () =>
//         new SockJS(config.url, undefined, {
//           withCredentials: true, // 쿠키를 함께 전송 (백엔드가 쿠키에서 토큰 읽음)
//         } as ExtendedSockJSOptions) as WebSocket,

//       // 연결 헤더 (백엔드가 쿠키에서 토큰을 읽으므로 비워둠)
//       connectHeaders: {},

//       // Heartbeat 설정 (연결 유지)
//       heartbeatIncoming: config.heartbeatIncoming ?? 10000,
//       heartbeatOutgoing: config.heartbeatOutgoing ?? 10000,

//       // 자동 재연결 비활성화 (수동으로 관리)
//       reconnectDelay: 0,

//       // 디버그 모드
//       debug: config.debug ? (str) => this.log(str) : undefined,

//       // let isReady = false;

//       // onConnect: () => {
//       //   setTimeout(() => {
//       //     isReady = true;
//       //     this.restoreSubscriptions();
//       //   }, this.heartbeatIncoming);
//       // };

//       // 연결 성공 시
//       onConnect: () => {
//         this.connectionStatus = 'CONNECTED';
//         this.reconnectAttempts = 0;

//         this.log('WebSocket 연결 성공');

//         /**
//          * 🔥 [핵심 수정]
//          * 재연결 시 기존 구독 객체는 전부 무효이므로
//          * "구독 상태"를 강제로 초기화
//          */
//         this.chatRoomSubscriptions.clear();
//         this.chatListSubscription = null;

//         this.eventListeners.onConnect?.();

//         // 🔥 handler 기반으로 무조건 재구독
//         // this.restoreSubscriptions();
//         setTimeout(() => {
//           this.restoreSubscriptions();
//         }, 100);

//         // 디버그용 구독 모니터링
//         this.startSubscriptionMonitoring();
//       },

//       // 연결 해제 시
//       onDisconnect: () => {
//         this.connectionStatus = 'DISCONNECTED';
//         this.log('WebSocket 연결 해제');
//         /**
//          * 🔥 구독 객체만 정리 (handler는 유지)
//          */
//         this.chatRoomSubscriptions.clear();
//         this.chatListSubscription = null;

//         this.eventListeners.onDisconnect?.();

//         this.stopSubscriptionMonitoring();
//       },

//       // // STOMP 에러 발생 시
//       // onStompError: (frame) => {
//       //   this.connectionStatus = 'ERROR';
//       //   const error = new Error(`STOMP Error: ${frame.headers['message']}`);
//       //   this.log('STOMP 에러:', error);
//       //   this.eventListeners.onError?.(error);

//       //   // 재연결 시도 증가
//       //   this.reconnectAttempts++;

//       //   // 최대 재연결 시도 초과 시 연결 해제
//       //   if (this.reconnectAttempts >= this.maxReconnectAttempts) {
//       //     this.log('최대 재연결 시도 횟수 초과, 연결 해제');
//       //     this.disconnect();
//       //   }
//       // },
//       // STOMP 에러 발생 시
//       onStompError: (frame) => {
//         this.connectionStatus = 'ERROR';
//         const errorMessage = frame.headers['message'] || frame.body;

//         this.log('STOMP 에러:', errorMessage);

//         // 🔥 상대방이 나간 경우 특별 처리
//         if (errorMessage?.includes('상대방이 채팅방을 나갔습니다')) {
//           const error = new Error(errorMessage) as Error & { type: 'PARTNER_LEFT' };
//           error.type = 'PARTNER_LEFT';
//           this.eventListeners.onError?.(error);

//           // if (typeof window !== 'undefined') {
//           //   window.dispatchEvent(
//           //     new CustomEvent('chat-partner-left', { detail: { message: errorMessage } }),
//           //   );
//           // }
//           return; // 재연결 시도 안 함
//         }

//         // 일반 에러 처리
//         const error = new Error(`STOMP Error: ${errorMessage}`);
//         this.eventListeners.onError?.(error);

//         // 재연결 시도 증가
//         this.reconnectAttempts++;

//         // 최대 재연결 시도 초과 시 연결 해제
//         if (this.reconnectAttempts >= this.maxReconnectAttempts) {
//           this.log('최대 재연결 시도 횟수 초과, 연결 해제');
//           this.disconnect();
//         }
//       },

//       // WebSocket 에러 발생 시
//       onWebSocketError: () => {
//         this.connectionStatus = 'ERROR';
//         /**
//          * 🔥 에러 발생 시 구독 객체 무효화
//          */
//         this.chatRoomSubscriptions.clear();
//         this.chatListSubscription = null;

//         const error = new Error('WebSocket 연결 에러');
//         this.log('WebSocket 에러:', error);
//         this.eventListeners.onError?.(error);
//       },
//     });

//     // 연결 활성화
//     this.client.activate();
//   }

//   /**
//    * 재연결 시 기존 구독 복원
//    * messageHandlers와 chatListUpdateHandler에 저장된 핸들러를 사용하여 재구독
//    */
//   private restoreSubscriptions(): void {
//     this.log('구독 복원 시작');

//     // 채팅방 메시지 구독 복원
//     this.messageHandlers.forEach((handler, chatRoomId) => {
//       // if (!this.chatRoomSubscriptions.has(chatRoomId)) {
//       // }
//       this.log(`채팅방 ${chatRoomId} 구독 복원`);
//       this.subscribeChatRoom(chatRoomId, handler);
//     });

//     // 채팅 목록 업데이트 구독 복원
//     if (
//       this.chatListUpdateHandler
//       // && !this.chatListSubscription
//     ) {
//       this.log('채팅 목록 업데이트 구독 복원');
//       this.subscribeChatListUpdate(this.chatListUpdateHandler);
//     }
//   }

//   /**
//    * WebSocket 연결 해제
//    * 모든 구독을 해제하고 클라이언트를 정리
//    */
//   disconnect(): void {
//     if (!this.client) return;

//     this.log('WebSocket 연결 해제 시작');

//     // 🆕 구독 모니터링 중지
//     this.stopSubscriptionMonitoring();

//     // 모든 채팅방 구독 해제
//     this.chatRoomSubscriptions.forEach((sub) => sub.unsubscribe());
//     this.chatRoomSubscriptions.clear();

//     // 채팅 목록 구독 해제
//     this.chatListSubscription?.unsubscribe();
//     this.chatListSubscription = null;

//     // 핸들러 정리
//     this.messageHandlers.clear();
//     this.chatListUpdateHandler = null;

//     // 클라이언트 비활성화
//     this.client.deactivate();
//     this.client = null;
//     this.connectionStatus = 'DISCONNECTED';

//     this.log('WebSocket 연결 해제 완료');
//   }

//   /**
//    * 채팅방 입장 알림 전송
//    * @param chatRoomId - 입장할 채팅방 ID
//    */
//   enterChatRoom(chatRoomId: number): void {
//     if (!this.client?.connected) {
//       this.log(`연결 안됨: 채팅방 ${chatRoomId} 입장 실패`);
//       return;
//     }

//     const destination = '/pub/chat/enter';
//     const payload: ChatRoomEnterRequest = { chatRoomId };

//     this.client.publish({
//       destination,
//       body: JSON.stringify(payload),
//     });

//     this.log(`채팅방 ${chatRoomId} 입장 알림 전송`);
//   }

//   /**
//    * 채팅방 퇴장 알림 전송
//    * @param chatRoomId - 퇴장할 채팅방 ID
//    */
//   leaveChatRoom(chatRoomId: number): void {
//     if (!this.client?.connected) {
//       this.log(`연결 안됨: 채팅방 ${chatRoomId} 퇴장 실패`);
//       return;
//     }

//     const destination = '/pub/chat/leave';
//     const payload: ChatRoomLeaveRequest = { chatRoomId };

//     this.client.publish({
//       destination,
//       body: JSON.stringify(payload),
//     });

//     this.log(`채팅방 ${chatRoomId} 퇴장 알림 전송`);
//   }

//   /**
//    * 채팅방 메시지 구독
//    * @param chatRoomId - 구독할 채팅방 ID
//    * @param onMessage - 메시지 수신 시 호출될 콜백
//    * @returns 구독 객체 (구독 해제용)
//    */
//   subscribeChatRoom(
//     chatRoomId: number,
//     onMessage: (data: ReceivedMessageData) => void,
//   ): StompSubscription | null {
//     // 핸들러 저장 (재연결 시 복원용)
//     this.messageHandlers.set(chatRoomId, onMessage);

//     if (!this.client?.connected) {
//       this.log(`WebSocket 미연결 상태: 채팅방 ${chatRoomId} 구독 실패`);
//       return null;
//     }

//     // 기존 구독이 있으면 해제 후 재구독
//     if (this.chatRoomSubscriptions.has(chatRoomId)) {
//       this.log(`채팅방 ${chatRoomId} 기존 구독 해제 후 재구독`);
//       this.unsubscribeChatRoom(chatRoomId);
//     }

//     const destination = `/user/queue/chat/${chatRoomId}`;
//     this.log(`채팅방 ${chatRoomId} 구독 시작: ${destination}`);

//     // STOMP 구독
//     const subscription = this.client.subscribe(destination, (message: IMessage) => {
//       try {
//         const parsed = JSON.parse(message.body);
//         const messageData: ReceivedMessageData = {
//           message: parsed.data.message,
//           isMine: parsed.data.isMine,
//         };

//         this.log(`채팅방 ${chatRoomId} 메시지 수신:`, messageData);

//         // 🆕 메시지 수신 이벤트 발생 (디버그 패널용)
//         if (typeof window !== 'undefined') {
//           window.dispatchEvent(new CustomEvent('websocket-message'));
//         }

//         // 콜백 호출
//         onMessage(messageData);
//         this.eventListeners.onMessage?.(messageData.message);
//       } catch (error) {
//         this.log(`메시지 파싱 에러:`, error);
//       }
//     });

//     // 구독 저장
//     this.chatRoomSubscriptions.set(chatRoomId, subscription);

//     return {
//       chatRoomId,
//       unsubscribe: () => this.unsubscribeChatRoom(chatRoomId),
//     };
//   }

//   /**
//    * 채팅방 메시지 구독 해제
//    * @param chatRoomId - 구독 해제할 채팅방 ID
//    */
//   unsubscribeChatRoom(chatRoomId: number): void {
//     const subscription = this.chatRoomSubscriptions.get(chatRoomId);
//     if (subscription) {
//       subscription.unsubscribe();
//       this.chatRoomSubscriptions.delete(chatRoomId);
//       this.messageHandlers.delete(chatRoomId);
//       this.log(`채팅방 ${chatRoomId} 구독 해제`);
//     }
//   }

//   /**
//    * 채팅 목록 업데이트 구독
//    * @param onUpdate - 업데이트 수신 시 호출될 콜백
//    */
//   subscribeChatListUpdate(onUpdate: (data: ChatListUpdateData) => void): void {
//     // 핸들러 저장 (재연결 시 복원용)
//     this.chatListUpdateHandler = onUpdate;

//     if (!this.client?.connected) {
//       this.log('WebSocket 미연결 상태: 채팅 목록 구독 실패');
//       return;
//     }

//     // 이미 구독 중이면 해제 후 재구독
//     if (this.chatListSubscription) {
//       this.chatListSubscription.unsubscribe();
//     }

//     const destination = '/user/queue/chat-list/update';
//     this.log(`채팅 목록 업데이트 구독 시작: ${destination}`);

//     // STOMP 구독
//     this.chatListSubscription = this.client.subscribe(destination, (message: IMessage) => {
//       try {
//         const parsed = JSON.parse(message.body);
//         const updateData: ChatListUpdateData = parsed.data;

//         this.log('채팅 목록 업데이트 수신:', updateData);

//         // 🆕 메시지 수신 이벤트 발생 (디버그 패널용)
//         if (typeof window !== 'undefined') {
//           window.dispatchEvent(new CustomEvent('websocket-message'));
//         }

//         // 콜백 호출
//         onUpdate(updateData);
//       } catch (error) {
//         this.log(`채팅 목록 업데이트 파싱 에러:`, error);
//       }
//     });
//   }

//   /**
//    * 채팅 목록 업데이트 구독 해제
//    */
//   unsubscribeChatListUpdate(): void {
//     if (this.chatListSubscription) {
//       this.chatListSubscription.unsubscribe();
//       this.chatListSubscription = null;
//       this.chatListUpdateHandler = null;
//       this.log('채팅 목록 업데이트 구독 해제');
//     }
//   }

//   /**
//    * 메시지 전송
//    * @param chatRoomId - 메시지를 보낼 채팅방 ID
//    * @param content - 메시지 내용
//    */
//   sendMessage(chatRoomId: number, content: string): void {
//     if (!this.client?.connected) {
//       this.log(`연결 안됨: 메시지 전송 실패 (chatRoomId: ${chatRoomId})`);
//       throw new Error('WebSocket 연결이 끊어졌습니다.');
//     }

//     const destination = `/pub/chat/${chatRoomId}/send`;
//     const payload: SendMessageRequest = { content };

//     this.client.publish({
//       destination,
//       body: JSON.stringify(payload),
//     });

//     this.log(`메시지 전송 (chatRoomId: ${chatRoomId}): ${content}`);
//   }

//   // ==================== 상태 조회 메서드 ====================

//   /**
//    * 현재 연결 상태 반환
//    */
//   getConnectionStatus(): ConnectionStatus {
//     return this.connectionStatus;
//   }

//   /**
//    * 연결 여부 확인
//    */
//   isConnected(): boolean {
//     return this.client?.connected ?? false;
//   }

//   /**
//    * 특정 채팅방 구독 여부 확인
//    */
//   isSubscribedToChatRoom(chatRoomId: number): boolean {
//     return this.chatRoomSubscriptions.has(chatRoomId);
//   }

//   /**
//    * 채팅 목록 구독 여부 확인
//    */
//   isSubscribedToChatList(): boolean {
//     return this.chatListSubscription !== null;
//   }

//   /**
//    * 이벤트 리스너 설정
//    * @param listeners - 설정할 이벤트 리스너
//    */
//   setEventListeners(listeners: WebSocketEventListeners): void {
//     this.eventListeners = { ...this.eventListeners, ...listeners };
//   }

//   /**
//    * 디버그 모드 설정
//    */
//   setDebug(debug: boolean): void {
//     this.debug = debug;
//   }

//   // ==================== 🆕 디버깅 메서드 ====================

//   /**
//    * 🆕 디버깅: 채팅 목록 강제 재구독
//    */
//   resubscribeToChatList(): void {
//     if (!this.client?.connected) {
//       console.warn('[WebSocket] 연결되지 않아 재구독할 수 없습니다.');
//       return;
//     }

//     // 기존 구독 해제
//     if (this.chatListSubscription) {
//       this.chatListSubscription.unsubscribe();
//       this.chatListSubscription = null;
//       console.log('[WebSocket] 기존 채팅 목록 구독 해제');
//     }

//     // 재구독
//     if (this.chatListUpdateHandler) {
//       this.subscribeChatListUpdate(this.chatListUpdateHandler);
//       console.log('[WebSocket] 채팅 목록 재구독 완료');
//     }
//   }

//   /**
//    * 🆕 디버깅: 채팅방 강제 재구독
//    */
//   resubscribeToChatRoom(roomId: number): void {
//     if (!this.client?.connected) {
//       console.warn('[WebSocket] 연결되지 않아 재구독할 수 없습니다.');
//       return;
//     }

//     const handler = this.messageHandlers.get(roomId);
//     if (!handler) {
//       console.warn(`[WebSocket] 채팅방 ${roomId}에 대한 핸들러가 없습니다.`);
//       return;
//     }

//     // 기존 구독 해제
//     const subscription = this.chatRoomSubscriptions.get(roomId);
//     if (subscription) {
//       subscription.unsubscribe();
//       this.chatRoomSubscriptions.delete(roomId);
//       console.log(`[WebSocket] 채팅방 ${roomId} 기존 구독 해제`);
//     }

//     // 재구독
//     this.subscribeChatRoom(roomId, handler);
//     console.log(`[WebSocket] 채팅방 ${roomId} 재구독 완료`);
//   }

//   /**
//    * 🆕 디버깅: 모든 상태 정보 출력
//    */
//   debugStatus(): void {
//     console.group('[WebSocket Debug Status]');
//     console.log('연결 상태:', this.connectionStatus);
//     console.log('STOMP 연결:', this.client?.connected);
//     console.log('채팅 목록 구독:', this.chatListSubscription !== null);
//     console.log('구독 중인 채팅방:', Array.from(this.chatRoomSubscriptions.keys()));
//     console.log('메시지 핸들러:', Array.from(this.messageHandlers.keys()));
//     console.log('재연결 시도 횟수:', this.reconnectAttempts);
//     console.groupEnd();
//   }

//   /**
//    * 🆕 디버깅: 구독 상태 자동 모니터링 시작
//    * 5초마다 구독 상태를 체크하고 문제 감지 시 자동 재구독
//    */
//   startSubscriptionMonitoring(): void {
//     // 기존 인터벌이 있으면 정리
//     if (this.subscriptionMonitorInterval) {
//       clearInterval(this.subscriptionMonitorInterval);
//     }

//     this.subscriptionMonitorInterval = setInterval(() => {
//       if (!this.isConnected()) return;

//       // 채팅 목록 구독 체크
//       if (this.chatListUpdateHandler && !this.chatListSubscription) {
//         console.warn('[WebSocket] 채팅 목록 구독이 끊어짐. 자동 재구독 시도...');
//         this.resubscribeToChatList();
//       }

//       // 채팅방 구독 체크
//       this.messageHandlers.forEach((_, roomId) => {
//         if (!this.chatRoomSubscriptions.has(roomId)) {
//           console.warn(`[WebSocket] 채팅방 ${roomId} 구독이 끊어짐. 자동 재구독 시도...`);
//           this.resubscribeToChatRoom(roomId);
//         }
//       });
//     }, 5000); // 5초마다 체크

//     console.log('[WebSocket] 구독 모니터링 시작 (5초 간격)');
//   }

//   /**
//    * 🆕 디버깅: 구독 상태 모니터링 중지
//    */
//   stopSubscriptionMonitoring(): void {
//     if (this.subscriptionMonitorInterval) {
//       clearInterval(this.subscriptionMonitorInterval);
//       this.subscriptionMonitorInterval = null;
//       console.log('[WebSocket] 구독 모니터링 중지');
//     }
//   }

//   /**
//    * 🆕 디버깅: STOMP 프레임 상세 로깅 활성화
//    */
//   enableDebugLogging(): void {
//     if (this.client) {
//       this.client.debug = (str) => {
//         console.log('[STOMP Debug]', str);
//       };
//       console.log('[WebSocket] STOMP 상세 로깅 활성화');
//     }
//   }

//   /**
//    * 🆕 디버깅: STOMP 프레임 로깅 비활성화
//    */
//   disableDebugLogging(): void {
//     if (this.client) {
//       this.client.debug = () => {};
//       console.log('[WebSocket] STOMP 상세 로깅 비활성화');
//     }
//   }
// }

// // 싱글톤 인스턴스 export
// export const webSocketService = new WebSocketService();

// // 🆕 개발 환경에서 전역 접근 허용 (브라우저 콘솔에서 디버깅용)
// if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
//   window.wsDebug = webSocketService;
//   console.log(
//     '%c[WebSocket] 디버깅 모드 활성화',
//     'color: green; font-weight: bold;',
//     '\n콘솔에서 window.wsDebug로 접근 가능',
//   );
// }
