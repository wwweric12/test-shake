import { http, HttpResponse } from 'msw';

import { BASE_URL } from '@/constants/api';

export const authHandlers = [
  // Reissue
  http.post(`${BASE_URL}/user/reissue`, () => {
    return HttpResponse.json({
      statusCode: 200,
      message: 'OK',
      data: {
        accessToken: 'mock-reissued-token-99999',
      },
    });
  }),

  // Logout
  http.post(`${BASE_URL}/user/logout`, () => {
    return HttpResponse.json({
      statusCode: 200,
      message: 'OK',
      data: null,
    });
  }),
];
