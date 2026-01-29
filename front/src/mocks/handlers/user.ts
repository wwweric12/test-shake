import { http, HttpResponse } from 'msw';

import { BASE_URL } from '@/constants/api';
import { UserCardsResponse, UserProfile } from '@/types/user';

const MOCK_USER_PROFILE: UserProfile = {
  nickname: '싸피테스트',
  profileImageUrl: 'https://picsum.photos/200',
  experience: true,
  career: 'employed',
  dsti: 'PDAR',
  positions: ['frontend_developer', 'backend_developer'],
  techSkills: ['react', 'typescript', 'java', 'spring_framework'],
  networks: ['coffee_chat', 'study_group'],
  githubId: 'mock-github-id',
  selfIntro: '안녕하세요! 프론트엔드 개발자입니다.',
};

const MOCK_USER_CARDS: UserCardsResponse = {
  cards: [
    { user: { ...MOCK_USER_PROFILE, nickname: '카드유저1' } },
    { user: { ...MOCK_USER_PROFILE, nickname: '카드유저2', career: 'job_seeking' } },
  ],
};

export const userHandlers = [
  // Get User Info
  http.get(`${BASE_URL}/user/info`, () => {
    return HttpResponse.json(MOCK_USER_PROFILE);
  }),

  // Register User Profile
  http.post(`${BASE_URL}/user/info`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(body, { status: 201 });
  }),

  // Check Nickname
  http.post(`${BASE_URL}/user/nickname`, async ({ request }) => {
    const { nickname } = (await request.json()) as { nickname: string };
    const isAvailable = nickname !== '중복된닉네임';
    if (isAvailable) {
      return HttpResponse.json({ status: 200 });
    } else {
      return HttpResponse.error();
    }
  }),

  // Submit DSTI
  http.post(`${BASE_URL}/user/dsti`, () => {
    return HttpResponse.json({ dsti: 'EBWU' });
  }),

  // Get User Cards
  http.get(`${BASE_URL}/user/card`, () => {
    return HttpResponse.json(MOCK_USER_CARDS);
  }),

  // Update Individual Fields using PUT
  http.put(`${BASE_URL}/user/experience`, () => new HttpResponse(null, { status: 200 })),
  http.put(`${BASE_URL}/user/career`, () => new HttpResponse(null, { status: 200 })),
  http.put(`${BASE_URL}/user/github`, () => new HttpResponse(null, { status: 200 })),
  http.put(`${BASE_URL}/user/self-intro`, () => new HttpResponse(null, { status: 200 })),
  http.put(`${BASE_URL}/user/tech-skills`, () => new HttpResponse(null, { status: 200 })),
  http.put(`${BASE_URL}/user/position`, () => new HttpResponse(null, { status: 200 })),
  http.put(`${BASE_URL}/user/networks`, () => new HttpResponse(null, { status: 200 })),
];
