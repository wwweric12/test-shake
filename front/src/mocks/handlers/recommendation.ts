import { http, HttpResponse } from 'msw';

import { BASE_URL } from '@/constants/api';
import { ActionResponse, CandidateResponse } from '@/types/recommendation';
import { UserInfo } from '@/types/user';

// --- 전역 상태 모킹 ---
let totalFetched = 0;
let swipeCount = 0;
let surveyStatus: 'BEFORE_SURVEY' | 'AFTER_SURVEY' = 'BEFORE_SURVEY';
let currentMetaType = ''; // 가중치 타입은 핸들러 외부 상단에 선언
const SURVEY_TRIGGER_COUNT = 20;

const MOCK_CANDIDATE: UserInfo = {
  userId: 1,
  nickname: '추천후보',
  profileImageUrl: 'https://picsum.photos/400',
  experience: true,
  career: 'freelancer',
  dsti: 'PDAR',
  matchingPercent: 89.6,
  positions: [6, 2, 3],
  techSkills: [19, 30, 44, 45, 46],
  networks: [2],
  githubId: 'candidate-github',
  selfIntro: '열심히 하겠습니다. 모킹 데이터입니다.',
};

export const recommendationHandlers = [
  // 1. 후보자 조회 (Candidates)
  http.get(`${BASE_URL}/recommendation/candidates`, ({ request }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit')) || 6;

    // 설문 전 20개 제한
    if (surveyStatus === 'BEFORE_SURVEY' && totalFetched >= SURVEY_TRIGGER_COUNT) {
      return HttpResponse.json({
        statusCode: 200,
        message: 'Survey required',
        data: { exposureId: null, cards: [], dailyLimit: 30, remainingSwipes: 0 },
      });
    }

    // 🎯 fetchCount 정의 추가: 남은 한도를 넘지 않게 계산
    const currentMax = surveyStatus === 'BEFORE_SURVEY' ? 20 : 30;
    const fetchCount = Math.min(limit, currentMax - totalFetched);

    const newCards = Array.from({ length: fetchCount }, (_, i) => ({
      ...MOCK_CANDIDATE,
      userId: totalFetched + i + 1,
      // 가중치 반영 여부를 닉네임으로 확인
      nickname: currentMetaType
        ? `[${currentMetaType} 반영] 후보${totalFetched + i + 1}`
        : `일반 추천 후보${totalFetched + i + 1}`,
      profileImageUrl: `https://picsum.photos/400?random=${totalFetched + i + 1}`,
    }));

    totalFetched += fetchCount; // limit이 아니라 실제 가져온 수만큼 더하기

    return HttpResponse.json<CandidateResponse>({
      statusCode: 200,
      message: 'OK',
      data: {
        exposureId: Date.now(),
        dailyLimit: 30,
        remainingSwipes: Math.max(0, currentMax - totalFetched),
        cards: newCards,
      },
    });
  }),

  // 2. 스와이프 액션
  http.post(`${BASE_URL}/recommendation/actions`, () => {
    swipeCount++;
    return HttpResponse.json<ActionResponse>({
      statusCode: 200,
      message: 'OK',
      data: { extraSurveyStatus: surveyStatus },
    });
  }),

  // 3. 설문 제출
  http.post(`${BASE_URL}/recommendation/survey`, async ({ request }) => {
    const { isSatisfied, metaInfoType } = (await request.json()) as {
      isSatisfied: boolean;
      metaInfoType?: string;
    };

    surveyStatus = 'AFTER_SURVEY';
    if (!isSatisfied && metaInfoType) {
      currentMetaType = metaInfoType;
    } else {
      currentMetaType = ''; // 만족함 선택 시 가중치 초기화
    }

    return HttpResponse.json({ statusCode: 200, message: 'OK' });
  }),

  // 4. 초기화 (Reset)
  http.post(`${BASE_URL}/recommendation/preferences/reset`, () => {
    totalFetched = 0;
    swipeCount = 0;
    surveyStatus = 'BEFORE_SURVEY';
    currentMetaType = '';
    return HttpResponse.json({ statusCode: 200, message: 'OK' });
  }),
];
