import { http, HttpResponse } from 'msw';

import { BASE_URL } from '@/constants/api';
import { HomeSummaryResponse } from '@/types/home';

export const homeHandlers = [
  http.get(`${BASE_URL}/home/summary`, () => {
    const mockSummary: HomeSummaryResponse = {
      nickname: '싸피테스트',
      dsti: 'I S J T',
      totalUnreadMessages: 5,
      totalLikeCount: 12,
      recentLikeImages: ['https://picsum.photos/100', 'https://picsum.photos/101'],
      remainingSwipes: 10,
    };
    return HttpResponse.json(mockSummary);
  }),
];
