import { http, HttpResponse } from 'msw';

import { BASE_URL } from '@/constants/api';
import {
  CheckNicknameRequest,
  DstiResponse, // ApiResponse 대신 구체적인 Response 타입을 활용
  UserInfo,
  UserProfileRequest,
} from '@/types/user';

// 1. Mock 데이터 정의 (UserInfo 기반)
const MOCK_USER_INFO: UserInfo = {
  userId: 1,
  nickname: '싸피테스트',
  profileImageUrl: 'https://picsum.photos/200',
  experience: true,
  career: 'employed',
  dsti: 'NONE',
  positions: [1, 2],
  techSkills: [1, 2, 3],
  networks: [1],
  githubId: 'mock-github-id',
  selfIntro: '안녕하세요!',
  matchingPercent: 100,
};

export const userHandlers = [
  // 유저 정보 조회
  http.get(`${BASE_URL}/user/info`, () => {
    return HttpResponse.json({
      statusCode: 200,
      message: 'OK',
      data: MOCK_USER_INFO,
    });
  }),

  // 회원가입 프로필 등록 (image_26ab57.png 에러 해결)
  http.post(`${BASE_URL}/user/info`, async ({ request }) => {
    // ✅ 타입을 명시적으로 단언하여 스프레드 연산자 에러 해결
    const body = (await request.json()) as UserProfileRequest;

    return HttpResponse.json(
      {
        statusCode: 201,
        message: 'Created',
        data: {
          ...MOCK_USER_INFO,
          ...body, // 이제 에러가 발생하지 않습니다.
          nickname: '새로운회원',
        },
      },
      { status: 201 },
    );
  }),

  // 닉네임 중복 확인 (hooks 명세 반영)
  http.post(`${BASE_URL}/user/nickname`, async ({ request }) => {
    const { nickname } = (await request.json()) as CheckNicknameRequest;

    if (nickname === '중복') {
      return HttpResponse.json(
        { statusCode: 409, message: '이미 사용 중인 닉네임입니다.', data: null },
        { status: 409 },
      );
    }

    return HttpResponse.json({
      statusCode: 200,
      message: 'OK',
      data: null, // CheckNicknameResponse(ApiEmptyResponse) 기준
    });
  }),

  // DSTI 제출
  http.post(`${BASE_URL}/user/dsti`, () => {
    const response: DstiResponse = {
      statusCode: 200,
      message: 'OK',
      data: { dsti: 'PDAR' },
    };
    return HttpResponse.json(response);
  }),

  // 유저 카드 리스트
  http.get(`${BASE_URL}/user/card`, () => {
    return HttpResponse.json({
      statusCode: 200,
      message: 'OK',
      data: {
        cards: [
          { user: MOCK_USER_INFO },
          { user: { ...MOCK_USER_INFO, userId: 2, nickname: '다른유저' } },
        ],
      },
    });
  }),

  // 개별 필드 업데이트 핸들러
  ...['experience', 'career', 'github', 'self-intro', 'tech-skills', 'position', 'networks'].map(
    (path) =>
      http.put(`${BASE_URL}/user/${path}`, () =>
        HttpResponse.json({
          statusCode: 200,
          message: 'OK',
          data: null,
        }),
      ),
  ),
];
