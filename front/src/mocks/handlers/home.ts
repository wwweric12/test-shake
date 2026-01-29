import { http, HttpResponse } from 'msw';

import { BASE_URL } from '@/constants/api';
import { HomeSummaryResponse } from '@/types/home';

export const homeHandlers = [
  http.get(`${BASE_URL}/home/summary`, () => {
    const mockSummary: HomeSummaryResponse = {
      nickname: '싸피테스트',
      dsti: 'EDAU',
      profileImageUrl: '',
      totalUnreadMessages: 5,
      totalLikeCount: 12,
      others: {
        profileImageUrl: ['https://picsum.photos/100', ''],
        dsti: ['EDAU', 'PDAR'],
      },
      remainingSwipes: 10,
    };
    return HttpResponse.json(mockSummary);
  }),
];
