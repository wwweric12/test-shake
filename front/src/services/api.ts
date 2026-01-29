import { BASE_URL } from '@/constants/api';
// import { getAccessToken } from '@/utils/token';

async function fetchClient<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  const isFormData = options.body instanceof FormData;
  const headers = new Headers(options.headers);

  if (!isFormData) {
    headers.set('Content-Type', 'application/json');
  }

  // const token = getAccessToken();
  // if (token) {
  //   headers.set('Authorization', `Bearer ${token}`);
  // }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || response.statusText || 'API 요청 실패';

      // TOOO: [401] 토큰 만료 시 처리
      if (response.status === 401) {
        throw new Error(`[401] 인증이 만료되었습니다.`);
      }

      throw new Error(`[${response.status}] ${errorMessage}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  } catch (error) {
    // TODO: 에러 추후에 정의
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('알 수 없는 네트워크 오류가 발생했습니다.');
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    fetchClient<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    fetchClient<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    fetchClient<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  patch: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    fetchClient<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    fetchClient<T>(endpoint, { ...options, method: 'DELETE' }),
};
