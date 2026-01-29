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

import SockJS from 'sockjs-client';

import {
  ConnectionStatus,
  ReceivedChatMessage,
  SendMessagePayload,
  StompSubscription,
  WebSocketConfig,
  WebSocketEventListeners,
} from '@/types/webSocket';

import { Client, IMessage, StompSubscription as StompSub } from '@stomp/stompjs';

class WebSocketService {
  private client: Client | null = null; // STOMP 클라이언트
  private subscriptions: Map<number, StompSub> = new Map(); // 채팅방별 구독 관리
  private connectionStatus: ConnectionStatus = 'DISCONNECTED'; // 현재 연결 상태
  private reconnectAttempts = 0; // 재연결 시도 횟수
  private maxReconnectAttempts = 5; // 최대 재연결 시도 횟수
  private reconnectDelay = 3000; // 재연결 대기 시간 (ms)
  private eventListeners: WebSocketEventListeners = {}; // 이벤트 리스너
  private messageHandlers: Map<number, (message: ReceivedChatMessage) => void> = new Map(); // 채팅방별 메시지 핸들러

  /**
   * WebSocket 연결 초기화
   * @param config WebSocket 설정
   */
  connect(config: WebSocketConfig): void {
    // 이미 연결되어 있으면 무시
    if (this.client?.connected) {
      console.log('[WebSocket] 이미 연결되어 있습니다.');
      return;
    }

    // 연결 중이면 무시
    if (this.connectionStatus === 'CONNECTING') {
      console.log('[WebSocket] 연결 시도 중입니다.');
      return;
    }

    this.connectionStatus = 'CONNECTING';

    try {
      // STOMP 클라이언트 생성
      this.client = new Client({
        // SockJS를 통한 WebSocket 연결 (폴백 지원)
        webSocketFactory: () => new SockJS(config.url) as WebSocket,

        // Heartbeat 설정 (연결 유지 확인)
        heartbeatIncoming: config.heartbeatIncoming ?? 10000, // 서버 -> 클라이언트 (10초)
        heartbeatOutgoing: config.heartbeatOutgoing ?? 10000, // 클라이언트 -> 서버 (10초)

        // 재연결 설정
        reconnectDelay: config.reconnectDelay ?? this.reconnectDelay,

        // 디버그 로그
        debug: config.debug
          ? (str: string) => {
              console.log('[STOMP Debug]', str);
            }
          : undefined,

        // 연결 성공 콜백
        onConnect: () => {
          this.connectionStatus = 'CONNECTED';
          this.reconnectAttempts = 0;
          console.log('[WebSocket] 연결 성공');
          this.eventListeners.onConnect?.();
        },

        // 연결 해제 콜백
        onDisconnect: () => {
          this.connectionStatus = 'DISCONNECTED';
          console.log('[WebSocket] 연결 해제됨');
          this.eventListeners.onDisconnect?.();
        },

        // 에러 콜백
        onStompError: (frame) => {
          this.connectionStatus = 'ERROR';
          const error = new Error(`STOMP Error: ${frame.headers['message']}`);
          console.error('[WebSocket] STOMP 에러:', frame);
          this.eventListeners.onError?.(error);

          // 최대 재연결 시도 횟수 초과 시
          if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('[WebSocket] 최대 재연결 시도 횟수 초과. 연결을 중단합니다.');
            this.disconnect();
          }
        },

        // WebSocket 에러 콜백
        onWebSocketError: (event) => {
          this.connectionStatus = 'ERROR';
          const error = new Error('WebSocket 연결 에러');
          console.error('[WebSocket] 연결 에러:', event);
          this.eventListeners.onError?.(error);
        },
      });

      // 연결 활성화
      this.client.activate();
      console.log('[WebSocket] 연결 시도 중...');
    } catch (error) {
      this.connectionStatus = 'ERROR';
      const err = error instanceof Error ? error : new Error('WebSocket 연결 실패');
      console.error('[WebSocket] 연결 실패:', err);
      this.eventListeners.onError?.(err);
    }
  }

  /**
   * WebSocket 연결 해제
   */
  disconnect(): void {
    if (!this.client) return;

    try {
      // 모든 구독 해제
      this.subscriptions.forEach((sub) => sub.unsubscribe());
      this.subscriptions.clear();
      this.messageHandlers.clear();

      // 연결 해제
      this.client.deactivate();
      this.client = null;
      this.connectionStatus = 'DISCONNECTED';
      console.log('[WebSocket] 연결 해제 완료');
    } catch (error) {
      console.error('[WebSocket] 연결 해제 중 에러:', error);
    }
  }

  /**
   * 채팅방 구독
   * @param chatRoomId 채팅방 ID
   * @param onMessage 메시지 수신 콜백
   * @returns 구독 정보 (구독 해제 함수 포함)
   */
  subscribe(
    chatRoomId: number,
    onMessage: (message: ReceivedChatMessage) => void,
  ): StompSubscription | null {
    if (!this.client?.connected) {
      console.error('[WebSocket] 연결되지 않았습니다. 구독할 수 없습니다.');
      return null;
    }

    // 이미 구독 중이면 기존 구독 해제
    if (this.subscriptions.has(chatRoomId)) {
      console.warn(`[WebSocket] 채팅방 ${chatRoomId}은 이미 구독 중입니다. 재구독합니다.`);
      this.unsubscribe(chatRoomId);
    }

    try {
      // 백엔드 구독 경로: /sub/chat/{chatRoomId}
      const destination = `/sub/chat/${chatRoomId}`;

      // 구독 시작
      const subscription = this.client.subscribe(destination, (message: IMessage) => {
        try {
          // 메시지 파싱
          const parsedMessage: ReceivedChatMessage = JSON.parse(message.body);
          console.log('[WebSocket] 메시지 수신:', parsedMessage);

          // 메시지 핸들러 호출
          onMessage(parsedMessage);
          this.eventListeners.onMessage?.(parsedMessage);
        } catch (error) {
          console.error('[WebSocket] 메시지 파싱 에러:', error);
        }
      });

      // 구독 정보 저장
      this.subscriptions.set(chatRoomId, subscription);
      this.messageHandlers.set(chatRoomId, onMessage);

      console.log(`[WebSocket] 채팅방 ${chatRoomId} 구독 완료`);

      return {
        chatRoomId,
        unsubscribe: () => this.unsubscribe(chatRoomId),
      };
    } catch (error) {
      console.error(`[WebSocket] 채팅방 ${chatRoomId} 구독 실패:`, error);
      return null;
    }
  }

  /**
   * 채팅방 구독 해제
   * @param chatRoomId 채팅방 ID
   */
  unsubscribe(chatRoomId: number): void {
    const subscription = this.subscriptions.get(chatRoomId);

    if (subscription) {
      try {
        subscription.unsubscribe();
        this.subscriptions.delete(chatRoomId);
        this.messageHandlers.delete(chatRoomId);
        console.log(`[WebSocket] 채팅방 ${chatRoomId} 구독 해제 완료`);
      } catch (error) {
        console.error(`[WebSocket] 채팅방 ${chatRoomId} 구독 해제 실패:`, error);
      }
    }
  }

  /**
   * 메시지 전송
   * @param chatRoomId 채팅방 ID
   * @param content 메시지 내용
   */
  sendMessage(chatRoomId: number, content: string): void {
    if (!this.client?.connected) {
      console.error('[WebSocket] 연결되지 않았습니다. 메시지를 전송할 수 없습니다.');
      throw new Error('WebSocket이 연결되지 않았습니다.');
    }

    try {
      // 백엔드 전송 경로: /pub/chat/{chatRoomId}/send
      const destination = `/pub/chat/${chatRoomId}/send`;

      // 메시지 페이로드 (백엔드 SendMessageRequest와 일치)
      const payload: SendMessagePayload = { content };

      // 메시지 전송
      this.client.publish({
        destination,
        body: JSON.stringify(payload),
      });

      console.log(`[WebSocket] 메시지 전송 완료 (채팅방 ${chatRoomId}):`, content);
    } catch (error) {
      console.error('[WebSocket] 메시지 전송 실패:', error);
      throw error;
    }
  }

  /**
   * 현재 연결 상태 반환
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
   * 이벤트 리스너 등록
   * @param listeners 이벤트 리스너
   */
  setEventListeners(listeners: WebSocketEventListeners): void {
    this.eventListeners = { ...this.eventListeners, ...listeners };
  }

  /**
   * 특정 채팅방의 구독 여부 확인
   * @param chatRoomId 채팅방 ID
   */
  isSubscribed(chatRoomId: number): boolean {
    return this.subscriptions.has(chatRoomId);
  }
}

// 싱글톤 인스턴스 생성 및 export
export const webSocketService = new WebSocketService();
