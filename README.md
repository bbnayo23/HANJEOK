# HANJEOK

숨은 명소 발견 지도 웹앱. 유명한 대표 명소가 아니라 그 주변에서 상대적으로
한적하고 방문 가치가 높은 장소를 찾아 추천한다.

## 스택

React + TypeScript + Vite / React Router / Zustand (클라이언트 상태) /
TanStack Query (서버 상태) / Tailwind CSS v4

## 개발

```bash
npm install
npm run dev      # 개발 서버
npm run lint      # eslint
npm run format    # prettier
npm run build     # 타입체크 + 빌드
```

서울시 오픈 API 인증키는 `.env.local.example`을 `.env.local`로 복사해 채운다.

## 현재 상태 — Phase 2 (Mock 기반 UI, 온보딩 → 홈) + 지도/위치 일부 선행

- Phase 1: Vite + React + TS 스캐폴드, ESLint/Prettier, 라우터·Provider 뼈대,
  Tailwind v4 `@theme` 기반 디자인 토큰(`src/styles/index.css`), 공통 컴포넌트
  (Button/Chip/Badge/Card).
- Phase 2: 온보딩(소개 → 연령대 → 취향 선택 → 위치 권한) 완료.
  홈 화면(지역/명소 선택 → 취향 필터 → 지도 → 추천 카드)을 서울 전역 명소
  Mock 데이터(`src/mocks/`, 한강공원 5곳 + 경복궁·북촌·성수동 등 14곳,
  숨은 장소 23곳)로 구현함. 추천 점수는 아직 Mock 값(Phase 3에서 실제 계산으로
  교체 예정)이지만, 혼잡도는 시간대 패턴 기반으로 매번 다시 계산해 실시간처럼
  보이게 함.
- 지도/위치는 원래 계획(Phase 4)보다 앞서 일부 구현: 브라우저 Geolocation으로
  실제 내 위치를 받아 Leaflet + OpenStreetMap 지도에 정확한 좌표로 표시하고,
  무료 OSRM 라우팅으로 내 위치 → 장소까지 실제 도보 경로/거리/시간을 계산해
  지도에 그려준다(API 키 불필요). 카카오맵/네이버지도 등 실제 지도 SDK와
  서울시 실시간 공공데이터 연동은 아직 안 함 — API 키가 필요해 보류 중.
- 남은 것: 장소 상세 페이지, 저장, 리뷰, 추천 점수 실제 계산, 실제 지도
  SDK/공공데이터 연동(키 발급 시).

폴더 구조와 각 단계 계획은 [프로젝트 스펙 문서](docs/SPEC.md)를 따른다.

## 배포 (Vercel)

정적 번들(`dist/`) + 서버리스 함수 하나(`api/seoul/[...path].ts`)로 이루어진다.

**서울시 오픈 API 프록시가 필요한 이유** — citydata·문화행사 API는 HTTPS를
지원하지 않아서, 앱을 HTTPS로 올리면 브라우저가 mixed content로 전부 막는다.
그래서 브라우저는 같은 도메인의 `/api/seoul/...`을 부르고 서버가 대신 HTTP로
호출한다. 인증키도 이 함수에서만 붙으므로 클라이언트 번들에 노출되지 않는다.
개발 서버에서는 `vite.config.ts`가 **같은 핸들러**를 미들웨어로 붙여 동작을 맞춘다.

1. https://vercel.com 에 GitHub 계정으로 로그인 → **Add New → Project** →
   이 저장소 import. 프레임워크는 Vite로 자동 인식된다.
2. **Environment Variables**에 `SEOUL_CITYDATA_KEY` = 발급받은 일반 인증키 추가
   (Production/Preview/Development 모두 체크). 키가 없어도 배포는 되지만
   실시간 혼잡도는 표시되지 않고 전시는 5건까지만 나온다.
3. Deploy. 이후 `main`에 push하면 자동 재배포된다.

`vercel.json`은 두 가지를 한다 — 함수 리전을 서울(`icn1`)로 고정하고,
`/place/:id` 같은 경로로 직접 들어와도 404가 나지 않게 SPA fallback을 건다.

## 폰에서 앱처럼 쓰기 (PWA)

배포된 주소를 폰 브라우저로 열고 홈 화면에 추가하면 주소창 없는 전체화면으로 뜬다.

- **아이폰**: Safari로 열고 → 공유 버튼 → "홈 화면에 추가". (Chrome 말고 Safari여야 한다)
- **안드로이드**: Chrome으로 열면 설치 배너가 뜬다. 안 뜨면 ⋮ → "앱 설치".

위치 권한은 HTTPS에서만 동작하므로, 개발 서버를 LAN IP로 열어 쓰는 방식으로는
내 위치 기능이 동작하지 않는다.
