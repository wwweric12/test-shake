import { http, HttpResponse } from 'msw';

import { BASE_URL } from '@/constants/api';
import { CandidateResponse } from '@/types/recommendation';
import { UserProfile } from '@/types/user';

const MOCK_CANDIDATE: UserProfile = {
  nickname: '추천후보1',
  profileImageUrl: 'https://picsum.photos/401',
  experience: false,
  career: 'student',
  dsti: 'I S J T',
  positions: ['mobile_app_developer'],
  techSkills: ['swift_language', 'kotlin'],
  networks: ['study_group'],
  githubId: 'candidate-github',
  selfIntro: '열심히 하겠습니다.',
};

export const recommendationHandlers = [
  // Candidates
  http.get(`${BASE_URL}/recommendation/candidates`, () => {
    const response: CandidateResponse = {
      statusCode: 200,
      message: 'OK',
      data: {
        exposureId: 999,
        cards: [{ user: MOCK_CANDIDATE }, { user: { ...MOCK_CANDIDATE, nickname: '추천후보2' } }],
      },
    };
    return HttpResponse.json(response);
  }),

  // Action (Like)
  http.post(`${BASE_URL}/recommendation/actions`, () => {
    return HttpResponse.json({ statusCode: 200, message: 'OK' });
  }),

  // Reset
  http.post(`${BASE_URL}/recommendation/preferences/reset`, () => {
    return HttpResponse.json({ statusCode: 200, message: 'OK' });
  }),
];
