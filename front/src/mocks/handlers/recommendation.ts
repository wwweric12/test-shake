import { http, HttpResponse } from 'msw';

import { BASE_URL } from '@/constants/api';
import { CandidateResponse } from '@/types/recommendation';
import { UserProfile } from '@/types/user';

const MOCK_CANDIDATE: UserProfile = {
  nickname: '추천후보1',
  profileImageUrl: 'https://picsum.photos/401',
  experience: true,
  career: 'student',
  dsti: 'PDAR',
  positions: ['mobile_app_developer', 'backend_developer', 'data_ai_engineer'],
  techSkills: ['swift_language', 'kotlin', 'flutter', 'react_native', 'python'],
  networks: ['study_group', 'coffee_chat', 'side_project'],
  githubId: 'candidate-github',
  selfIntro:
    '열심히 하겠습니다. 열심히 하겠습니다.열심히 하겠습니다. 열심히 하겠습니다.열심히 하겠습니다. 열심히 하겠습니다.열심히 하겠습니다. 열심히 하겠습니다.열심히 하겠습니다. 열심히 하겠습니다.열심히 하겠습니다. 열심히 하겠습니다.열심히 하겠습니다. 열심히 하겠습니다.열심히 하겠습니다. 열심히 하겠습니다.열심히 하겠습니다. 열심히 하겠습니다.열심히 하겠습니다. 열심히 하겠습니다.열심히 하겠습니다. 열심히 하겠습니다.열심히 하겠습니다. 열심히 하겠습니다.열심히 하겠습니다. 열심히 하겠습니다.',
};

const TOTAL_LIMIT = 20;
let totalFetched = 0;

export const recommendationHandlers = [
  // Candidates
  http.get(`${BASE_URL}/recommendation/candidates`, ({ request }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit')) || 6;

    if (totalFetched >= TOTAL_LIMIT) {
      return HttpResponse.json({
        statusCode: 200,
        message: 'No more candidates available',
        data: {
          exposureId: Date.now(),
          cards: [],
        },
      });
    }

    const fetchCount = Math.min(limit, TOTAL_LIMIT - totalFetched);
    const newCards = Array.from({ length: fetchCount }, (_, i) => ({
      user: {
        ...MOCK_CANDIDATE,
        nickname: `추천후보${totalFetched + i + 1}`,
        githubId: `candidate-github-${totalFetched + i + 1}`,
        profileImageUrl: `https://picsum.photos/400?random=${totalFetched + i + 1}`,
      },
    }));

    totalFetched += fetchCount;

    const response: CandidateResponse = {
      statusCode: 200,
      message: 'OK',
      data: {
        exposureId: Date.now(),
        cards: newCards,
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
    totalFetched = 0;
    return HttpResponse.json({ statusCode: 200, message: 'OK' });
  }),
];
