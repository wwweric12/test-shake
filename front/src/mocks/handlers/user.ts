import { http, HttpResponse } from 'msw';

import { BASE_URL } from '@/constants/api';
import { UserCardsResponse, UserProfile } from '@/types/user';

const MOCK_USER_PROFILE: UserProfile = {
  nickname: '싸피테스트',
  profileImageUrl: 'https://picsum.photos/200',
  experience: true,
  career: 'employed',
  dsti: 'PDAR',
  positions: [1, 2],
  techSkills: [1, 2],
  networks: [1, 2],
  githubId: 'mock-github-id',
  selfIntro: '안녕하세요! 프론트엔드 개발자입니다.',
};

const MOCK_USER_CARDS: UserCardsResponse = {
  statusCode: 200,
  message: 'OK',
  data: {
    cards: [
      { user: { ...MOCK_USER_PROFILE, nickname: '카드유저1' } },
      { user: { ...MOCK_USER_PROFILE, nickname: '카드유저2', career: 'job_seeking' } },
    ],
  },
};

export const userHandlers = [
  // Get User Info
  http.get(`${BASE_URL}/user/info`, () => {
    return HttpResponse.json({
      statusCode: 200,
      message: 'OK',
      data: MOCK_USER_PROFILE,
    });
  }),

  // Register User Profile
  http.post(`${BASE_URL}/user/info`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(
      {
        statusCode: 201,
        message: 'Created',
        data: body,
      },
      { status: 201 },
    );
  }),

  // Check Nickname
  http.post(`${BASE_URL}/user/nickname`, async ({ request }) => {
    const { nickname } = (await request.json()) as { nickname: string };
    const isAvailable = nickname !== '중복된닉네임';
    if (isAvailable) {
      return HttpResponse.json({
        statusCode: 200,
        message: 'OK',
        data: { possible: isAvailable },
      });
    } else {
      return HttpResponse.error();
    }
  }),

  // Submit DSTI
  http.post(`${BASE_URL}/user/dsti`, () => {
    return HttpResponse.json({
      statusCode: 200,
      message: 'OK',
      data: { dsti: 'PDAR' },
    });
  }),

  // Get User Cards
  http.get(`${BASE_URL}/user/card`, () => {
    return HttpResponse.json(MOCK_USER_CARDS);
  }),

  // Update Individual Fields using PUT
  http.put(`${BASE_URL}/user/experience`, () =>
    HttpResponse.json({ statusCode: 200, message: 'OK', data: null }),
  ),
  http.put(`${BASE_URL}/user/career`, () =>
    HttpResponse.json({ statusCode: 200, message: 'OK', data: null }),
  ),
  http.put(`${BASE_URL}/user/github`, () =>
    HttpResponse.json({ statusCode: 200, message: 'OK', data: null }),
  ),
  http.put(`${BASE_URL}/user/self-intro`, () =>
    HttpResponse.json({ statusCode: 200, message: 'OK', data: null }),
  ),
  http.put(`${BASE_URL}/user/tech-skills`, () =>
    HttpResponse.json({ statusCode: 200, message: 'OK', data: null }),
  ),
  http.put(`${BASE_URL}/user/position`, () =>
    HttpResponse.json({ statusCode: 200, message: 'OK', data: null }),
  ),
  http.put(`${BASE_URL}/user/networks`, () =>
    HttpResponse.json({ statusCode: 200, message: 'OK', data: null }),
  ),
];
