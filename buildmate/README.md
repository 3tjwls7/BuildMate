# BuildMate MVP

기능을 입력하면 AI가 구현 조건을 카테고리별로 제안합니다. 사용자가 조건과 세부 정책을 선택하면 API 명세를 생성하고 계정에 저장합니다.

## 로컬 실행

Node.js 20 이상에서 `npm install`, `npm run dev`를 실행합니다. `.env.local`에 다음 값을 설정하세요.

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-4o-mini
```

기존 `.env`의 Supabase 값을 사용할 수도 있습니다. OpenAI 키는 서버에서만 읽습니다.

## Supabase 설정

1. SQL Editor에서 [`supabase/schema.sql`](supabase/schema.sql)을 실행합니다.
2. Authentication > Providers에서 GitHub와 Kakao를 활성화하고 각각의 OAuth Client ID와 Secret을 설정합니다.
3. Authentication > URL Configuration의 Site URL을 앱 주소로, Redirect URLs에 `http://localhost:3000/auth/callback`과 배포 주소의 `/auth/callback`을 추가합니다.
4. GitHub/Kakao 개발자 콘솔의 OAuth callback은 Supabase가 표시하는 callback URL로 설정합니다.

## 흐름

`/login` → `/` → `/design` → `/design/spec` → `/projects` → `/projects/[id]`

API 호출은 로그인 세션이 필요합니다. `POST /api/analyze`, `POST /api/generate-spec`가 OpenAI Responses API의 Structured Outputs를 사용합니다. `GET/POST /api/projects`와 `GET /api/projects/[id]`는 Supabase RLS와 사용자 ID 확인으로 소유한 설계만 처리합니다.

Vercel 배포 시 동일 환경변수를 프로젝트 설정에 추가하고 Supabase Redirect URL에 실제 배포 주소를 등록하세요.
