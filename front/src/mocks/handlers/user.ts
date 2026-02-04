import { http, HttpResponse } from 'msw';

import { BASE_URL } from '@/constants/api';
import {
  CheckNicknameRequest,
  DstiResponse,
  UpdateProfileImageRequest, // 추가
  UserInfo,
  UserProfileRequest,
} from '@/types/user';

// 🎯 let으로 변경하여 데이터 수정 허용
let MOCK_USER_INFO: UserInfo = {
  userId: 1,
  nickname: '싸피테스트',
  profileImageUrl: 'https://picsum.photos/200',
  experience: true,
  career: 'employed',
  dsti: 'PDAR',
  positions: [1, 2],
  techSkills: [1, 2, 3],
  networks: [1, 2, 3],
  githubId: 'mock-github-id',
  selfIntro: '안녕하세요!',
  matchingPercent: 100,
};

export const userHandlers = [
  // 유저 정보 조회 (항상 현재 MOCK_USER_INFO 반환)
  http.get(`${BASE_URL}/user/info`, () => {
    return HttpResponse.json({
      statusCode: 200,
      message: 'OK',
      data: MOCK_USER_INFO,
    });
  }),

  // 🎯 DB 이미지 URL 업데이트 핸들러
  // 이 부분이 실행되어야 invalidateQueries 시 새로운 이미지가 보입니다.
  http.put(`${BASE_URL}/user/profiles/image-url`, async ({ request }) => {
    const { profileImageUrl } = (await request.json()) as UpdateProfileImageRequest;

    // ✅ 메모리 데이터 갱신
    MOCK_USER_INFO = {
      ...MOCK_USER_INFO,
      profileImageUrl: profileImageUrl,
    };

    return HttpResponse.json({
      statusCode: 200,
      message: 'OK',
      data: null,
    });
  }),

  // 회원가입 프로필 등록
  http.post(`${BASE_URL}/user/info`, async ({ request }) => {
    const body = (await request.json()) as UserProfileRequest;

    // Mock 데이터 업데이트
    MOCK_USER_INFO = { ...MOCK_USER_INFO, ...body };

    return HttpResponse.json(
      {
        statusCode: 201,
        message: 'Created',
        data: MOCK_USER_INFO,
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

  // 🎯 2. 상대방 정보 조회 핸들러 추가 (추가할 코드)
  http.get(`${BASE_URL}/user/info/:userId`, ({ params }) => {
    const { userId } = params;

    // 만약 특정 ID에 따라 다른 데이터를 보고 싶다면 분기 처리 가능
    const otherUser = {
      ...MOCK_USER_INFO,
      userId: Number(userId),
      nickname: `유저${userId}`,
      selfIntro: `안녕하세요, ${userId}번 유저의 자기소개입니다.안녕하세요, ${userId}번 유저의 자기소개입니다.`,
      matchingPercent: 85.5,
    };

    return HttpResponse.json({
      statusCode: 200,
      message: 'OK',
      data: otherUser,
    });
  }),
];
