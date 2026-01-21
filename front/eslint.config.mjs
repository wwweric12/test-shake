import { defineConfig } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettierConfig from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

const eslintConfig = defineConfig([
  // 1. Next.js 기본 규칙
  ...nextVitals,
  ...nextTs,

  // 2. Prettier 설정
  prettierConfig,

  // 3. 커스텀 규칙 및 플러그인 설정
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // (선택) console.log 남아있으면 경고 띄우기
      'no-console': 'warn',

      // ✅ 임포트 자동 정렬 규칙
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // 1. 리액트, 넥스트 등 외부 라이브러리 (react...)
            ['^react', '^next', '^[a-z]'],
            // 2. 프로젝트 내부 경로 (@/...)
            ['^@/'],
            // 3. 상위 경로 (../)
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // 4. 같은 경로 (./)
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // 5. 스타일 파일 (.css)
            ['^.+\\.?(css)$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },

  // 4. 검사 제외 파일 설정
  {
    ignores: ['.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },
]);

export default eslintConfig;
