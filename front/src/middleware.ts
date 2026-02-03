import { NextRequest, NextResponse } from 'next/server';

import { USER_ROLE } from '@/constants/auth';
import { parseJwt } from '@/utils/auth';

const PUBLIC_FILE_EXTENSIONS = [
  '.svg',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.ico',
  '.json',
  '.js',
  '.css',
  '.map',
  '.txt',
];

const PUBLIC_PATHS = ['/', '/login'];
const OAUTH_PATH_PREFIX = '/oauth2';

/**
 * 역할 기반 리다이렉트 URL 결정 함수
 */
function getRoleRedirect(
  request: NextRequest,
  role: string | undefined,
  pathname: string,
): NextResponse | null {
  if (role === USER_ROLE.GUEST) {
    if (!pathname.startsWith('/signup')) {
      return NextResponse.redirect(new URL('/signup', request.url));
    }
  } else if (role === USER_ROLE.PRE_USER) {
    if (!pathname.startsWith('/survey/dsti')) {
      return NextResponse.redirect(new URL('/survey/dsti', request.url));
    }
  } else if (role === USER_ROLE.USER) {
    // 로그인된 유저가 로그인/회원가입 페이지 접근 시 홈으로
    if (pathname === '/login' || pathname === '/signup') {
      return NextResponse.redirect(new URL('/home', request.url));
    }
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // PWA 관련 파일 및 정적 파일 건너뛰기
  if (
    PUBLIC_FILE_EXTENSIONS.some((ext) => pathname.endsWith(ext)) ||
    pathname.startsWith('/sw.js') ||
    pathname.startsWith('/workbox-')
  ) {
    return NextResponse.next();
  }

  let accessToken = request.cookies.get('ACCESS_TOKEN')?.value;
  const refreshToken = request.cookies.get('REFRESH_TOKEN')?.value;

  // 갱신된 쿠키 정보를 담을 변수
  let newCookies: string[] = [];

  //  토큰 갱신 로직
  if (!accessToken && refreshToken) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const reissueResponse = await fetch(`${baseUrl}/user/reissue`, {
        method: 'POST',
        headers: {
          Cookie: `REFRESH_TOKEN=${refreshToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (reissueResponse.ok) {
        const setCookieHeaders = reissueResponse.headers.getSetCookie();

        if (setCookieHeaders.length > 0) {
          newCookies = setCookieHeaders;

          setCookieHeaders.forEach((cookieString) => {
            const [keyVal] = cookieString.split(';');
            const [key, value] = keyVal.split('=');
            if (key && value) {
              const cleanedKey = key.trim();
              const cleanedValue = value.trim();

              // Request 쿠키 동기화
              request.cookies.set(cleanedKey, cleanedValue);

              // 갱신된 accessToken 반영
              if (cleanedKey === 'ACCESS_TOKEN') {
                accessToken = cleanedValue;
              }
            }
          });
        }
      } else {
        // 갱신 실패 (만료): 로그인으로 이동
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('ACCESS_TOKEN');
        response.cookies.delete('REFRESH_TOKEN');
        return response;
      }
    } catch {
      // 갱신 에러: 로그인으로 이동
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('ACCESS_TOKEN');
      response.cookies.delete('REFRESH_TOKEN');
      return response;
    }
  }

  let response = NextResponse.next();

  // Role 기반 리다이렉트 처리
  if (accessToken) {
    const payload = parseJwt(accessToken);
    const redirectResponse = getRoleRedirect(request, payload?.role, pathname);

    if (redirectResponse) {
      response = redirectResponse;
    }
  } else {
    // 비로그인 접근 제어
    const isPublicPath = PUBLIC_PATHS.includes(pathname) || pathname.startsWith(OAUTH_PATH_PREFIX);
    if (!isPublicPath) {
      response = NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 쿠키 헤더 전달
  if (newCookies.length > 0) {
    newCookies.forEach((cookieString) => {
      response.headers.append('Set-Cookie', cookieString);
    });
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
