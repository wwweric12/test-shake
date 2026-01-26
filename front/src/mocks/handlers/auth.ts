import { http, HttpResponse } from 'msw';

import { BASE_URL } from '@/constants/api';

export const authHandlers = [
  // Google/Kakao OAuth Redirect (Just for completeness, usually handled by browser)
  http.get(`${BASE_URL}/oauth2/authorization/kakao`, () => {
    return HttpResponse.json({
      accessToken: 'mock-access-token-12345',
      dsti: null,
    });
  }),

  // Reissue
  http.post(`${BASE_URL}/user/reissue`, () => {
    return HttpResponse.json({
      accessToken: 'mock-reissued-token-99999',
    });
  }),

  // Logout
  http.post(`${BASE_URL}/user/logout`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
];
