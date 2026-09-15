# 숨은 명소 지도 앱 — 바이브 코딩 프로젝트 프롬프트

## 1. 프로젝트 개요

3040 사용자를 주요 타깃으로 하는 **숨은 명소 발견 지도 웹앱**을 만든다.

### 서비스 한 줄 정의

> 유명한 곳을 보여주는 지도에서, **지금 가기 좋은 곳을 찾아주는 지도**

대표 명소 자체를 추천하는 것이 아니라, 사용자가 선택한 대표 명소 주변에서 다음 조건을 만족하는 장소를 찾아 추천한다.

- 사람이 상대적으로 적다.
- 뷰와 분위기가 좋다.
- 산책하거나 머물기 좋다.
- 접근성이 좋다.
- 현재 시간/요일/날씨에 방문하기 좋다.
- 실제 사용자 평가가 좋다.

예시:

`여의도 한강공원 → 주변 500m~1.5km → 숨은 장소 후보 → 혼잡도/뷰/접근성/시간/날씨/사용자 취향 분석 → 추천`

---

# 2. 개발 목표

단순한 지도 API 데모가 아니라 다음 경험을 제공하는 것을 목표로 한다.

1. 현재 위치 또는 선택한 지역을 기준으로 탐색
2. 대표 명소 확인
3. 대표 명소 주변의 숨은 장소 발견
4. 현재 혼잡도 확인
5. 장소가 왜 추천되는지 이해
6. 저장
7. 방문 후 평가
8. 사용자 취향에 맞는 장소 추천

초기 MVP는 **서울의 한강 주변**을 중심으로 구현한다.

---

# 3. 권장 기술 스택

## Frontend

- React
- TypeScript
- Vite
- React Router
- Zustand
- TanStack Query
- Tailwind CSS 또는 CSS Modules
- ESLint
- Prettier

## 지도

- Kakao Map SDK 또는 Naver Map SDK
- 지도 마커/클러스터
- 현재 위치
- 장소 좌표
- 장소 상세 이동
- 길찾기 연결

초기 MVP에서는 지도 SDK를 하나만 선택한다.

## Backend

MVP 단계에서는 Supabase를 권장한다.

- Supabase Auth
- PostgreSQL
- Row Level Security
- Storage
- REST API / Supabase Client

이유:

- 별도의 서버를 처음부터 구축하지 않아도 된다.
- 회원가입/로그인 구현이 쉽다.
- PostgreSQL 기반이라 장소/혼잡도/리뷰 데이터 모델링이 편하다.
- 추후 별도 API 서버로 확장하기 쉽다.

## 외부 데이터

실제 운영 단계에서는 다음 데이터를 연동할 수 있도록 구조를 만든다.

- 서울시 생활인구
- 서울시 실시간 도시데이터
- 유동인구
- 날씨
- 지도/장소 데이터
- 대중교통
- 주차
- 행사/이벤트

MVP에서는 실제 API를 모두 연결하지 않고 **Mock 데이터로 먼저 UI와 비즈니스 로직을 완성한다.**

---

# 4. 중요 개발 원칙

## 4.1 먼저 UI를 만들고 나중에 API를 연결할 수 있는 구조

컴포넌트가 API에 직접 의존하지 않도록 한다.

잘못된 구조:

```tsx
PlaceCard.tsx
→ Supabase 직접 호출
→ 데이터 가공
→ UI 출력
```

권장 구조:

```text
API / Mock
   ↓
Repository / Service
   ↓
TanStack Query
   ↓
View Model
   ↓
Component
```

Mock 데이터와 실제 API를 쉽게 교체할 수 있어야 한다.

---

# 5. 프로젝트 폴더 구조

다음 구조를 기본으로 사용한다.

```text
src/
├── app/
│   ├── router/
│   ├── providers/
│   └── store/
│
├── pages/
│   ├── onboarding/
│   ├── home/
│   ├── explore/
│   ├── place/
│   ├── saved/
│   └── my/
│
├── components/
│   ├── common/
│   ├── map/
│   ├── place/
│   ├── filter/
│   └── review/
│
├── features/
│   ├── auth/
│   ├── recommendation/
│   ├── places/
│   ├── crowd/
│   ├── saved/
│   └── reviews/
│
├── services/
│   ├── api/
│   ├── map/
│   └── external/
│
├── hooks/
├── store/
├── types/
├── constants/
├── utils/
├── mocks/
└── styles/
```

페이지/컴포넌트/비즈니스 로직을 분리한다.

---

# 6. 화면 구조

## 6.1 온보딩

### 화면

```text
서비스 소개
↓
본인확인/회원가입
↓
취향 선택
↓
위치 권한
↓
홈
```

### 취향 선택

사용자가 좋아하는 장소를 선택한다.

```text
조용한 곳
자연
멋진 뷰
산책
카페
사진
노을
야경
데이트
혼자 가기
```

이 데이터를 추천 알고리즘에 활용한다.

---

# 7. 인증 설계

사용자의 연령대가 서비스 타깃과 맞는지 확인하기 위해 본인확인/연령 확인 구조를 고려한다.

중요:

- 생년월일을 불필요하게 UI 전반에 노출하지 않는다.
- 실제 운영에서는 개인정보 최소 수집 원칙을 따른다.
- 본인확인이 필요한 경우 인증 결과에서 필요한 연령대 정보만 활용하는 구조를 고려한다.
- MVP에서는 실제 본인인증 연동 대신 Mock 인증을 사용한다.

Mock 사용자 예:

```ts
{
  id: "user-001",
  ageGroup: "30s",
  preferences: [
    "quiet",
    "view",
    "walk",
    "sunset"
  ]
}
```

---

# 8. 홈 화면

홈 화면이 서비스의 핵심이다.

## 구성

```text
상단
현재 지역 / 검색

취향 필터
전체 / 산책 / 뷰 / 자연 / 카페 / 노을 / 야경

지도

숨은 장소 마커

하단 추천 카드
```

예:

```text
오늘 가기 좋은 곳

🌿 한강 숨은 산책길

숨은 명소 91점

현재 혼잡도
낮음

여의도 한강공원에서 도보 8분

평소보다 31% 한적해요.
```

---

# 9. 지도 화면

지도는 단순히 장소를 표시하는 용도가 아니다.

다음 관계를 보여준다.

```text
대표 명소
    ↓
주변 숨은 장소
    ↓
현재 혼잡도
    ↓
추천 점수
```

예:

```text
             🌿 91

       🔵 여의도 한강공원

   🌿 87

                   🌿 84
```

### 지도 마커

마커에는 장소명보다 추천 점수를 우선 표시한다.

```text
91
87
84
```

색상은 혼잡도에 따라 구분할 수 있다.

단, 색상만으로 상태를 전달하지 말고 텍스트/아이콘을 함께 사용한다.

---

# 10. 장소 데이터 모델

```ts
type Place = {
  id: string;
  name: string;

  latitude: number;
  longitude: number;

  category: PlaceCategory;

  description: string;

  nearbyLandmarkId?: string;
  distanceFromLandmark?: number;

  scores: {
    quiet: number;
    view: number;
    accessibility: number;
    stay: number;
    userRating: number;
  };

  facilities: {
    parking: boolean;
    restroom: boolean;
    bench: boolean;
    cafeNearby: boolean;
  };

  bestTime?: {
    start: string;
    end: string;
  };

  photos: string[];

  reviewCount: number;
};
```

---

# 11. 대표 명소 데이터

```ts
type Landmark = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: string;
};
```

예:

```text
여의도 한강공원
반포 한강공원
망원 한강공원
잠원 한강공원
뚝섬 한강공원
잠실 한강공원
이촌 한강공원
난지 한강공원
선유도
광나루 한강공원
```

---

# 12. 혼잡도 데이터

혼잡도는 고정 값이 아니라 시간에 따라 달라지는 데이터다.

```ts
type CrowdData = {
  placeId: string;
  timestamp: string;

  population: number;

  crowdLevel: "low" | "medium" | "high";

  comparedToAverage?: number;
};
```

화면에서는 다음과 같이 표현한다.

```text
현재 혼잡도
낮음

평소보다 31% 한적해요.
```

또는

```text
현재 혼잡도
높음

평소보다 42% 붐벼요.
```

---

# 13. 시간대별 혼잡도

장소마다 다음 패턴을 저장할 수 있도록 한다.

```ts
type CrowdPattern = {
  placeId: string;

  weekdayMorning: number;
  weekdayAfternoon: number;
  weekdayEvening: number;

  weekendMorning: number;
  weekendAfternoon: number;
  weekendEvening: number;
};
```

실제 운영에서는 공공데이터를 기반으로 계산한다.

---

# 14. 추천 점수

추천 점수는 다음 구조로 시작한다.

```text
숨은 명소 점수
=
한적함 30%
+
뷰 25%
+
사용자 취향 20%
+
접근성 10%
+
현재 날씨 5%
+
시간대 적합성 5%
+
사용자 평가 5%
```

코드에서는 점수 계산을 UI에서 하지 않는다.

```ts
calculateRecommendationScore(place, context)
```

형태의 별도 순수 함수로 만든다.

예:

```ts
type RecommendationContext = {
  userPreferences: string[];
  currentCrowdScore: number;
  weatherScore: number;
  timeScore: number;
};
```

---

# 15. 추천 알고리즘의 핵심

추천 과정:

```text
현재 위치
↓
주변 대표 명소 탐색
↓
대표 명소 반경 500m~1.5km 탐색
↓
숨은 장소 후보
↓
혼잡도 필터
↓
뷰/시설/접근성 평가
↓
날씨/시간 적용
↓
사용자 취향 적용
↓
추천 점수 계산
↓
TOP 장소 노출
```

---

# 16. 중요한 서비스 규칙

## 16.1 너무 유명해진 장소는 추천 점수를 낮춘다.

서비스의 목적은 유명한 장소를 만드는 것이 아니라 숨은 장소를 발견하는 것이다.

따라서:

```text
조회 증가
↓
저장 증가
↓
방문 증가
↓
혼잡도 증가
↓
한적함 점수 감소
↓
추천 순위 하락
```

구조를 고려한다.

---

# 17. 장소 상세 화면

상세 화면은 "왜 이 장소를 추천하는지" 설명해야 한다.

### 구성

```text
사진

장소명

숨은 명소 점수 91

현재 상태
- 혼잡도 낮음
- 날씨 좋음
- 노을 보기 좋음

장소 설명

한적함 ★★★★★
뷰 ★★★★☆
산책 ★★★★★

추천 시간
16:30 ~ 19:30

접근
여의도 한강공원에서 도보 8분

시설
주차 / 화장실 / 벤치

사용자 리뷰

[저장]
[길찾기]
```

---

# 18. 장소 상세에서 반드시 보여줄 정보

단순한 별점보다 실제 방문 판단에 도움이 되는 정보를 우선한다.

```text
현재 혼잡도
평소 대비 혼잡도
추천 시간
도보 시간
주차
화장실
벤치
날씨
일몰
사용자 평가
```

---

# 19. 리뷰/방문 인증

방문 후 간단한 평가를 받는다.

```text
이 장소 어땠나요?

한적했어요
생각보다 붐볐어요

뷰가 좋았어요
다시 방문하고 싶어요
```

세부 평가:

```text
한적함
뷰
분위기
사진
산책
```

리뷰 데이터:

```ts
type PlaceReview = {
  id: string;
  placeId: string;
  userId: string;

  quietScore: number;
  viewScore: number;
  atmosphereScore: number;

  comment?: string;

  createdAt: string;
};
```

---

# 20. 저장 기능

사용자가 장소를 저장할 수 있어야 한다.

```ts
type SavedPlace = {
  userId: string;
  placeId: string;
  createdAt: string;
};
```

저장 화면:

```text
내가 저장한 장소

🌿 한강 숨은 산책길
🌅 노을 뷰 포인트
☕ 조용한 카페
```

---

# 21. 추천 카드 UI

카드에는 정보를 많이 넣지 않는다.

우선순위:

1. 장소 사진
2. 장소명
3. 숨은 명소 점수
4. 현재 혼잡도
5. 대표 명소와의 거리
6. 추천 이유

예:

```text
┌──────────────────────┐
│       장소 사진        │
│                      │
├──────────────────────┤
│ 🌿 한강 숨은 산책길    │
│                      │
│ 숨은 명소 91점         │
│                      │
│ 🟢 지금 한적해요       │
│ 여의도에서 도보 8분     │
│                      │
│ 노을을 보기 좋은 장소   │
└──────────────────────┘
```

---

# 22. 필터

필터는 너무 복잡하게 만들지 않는다.

### 1차

```text
전체
산책
뷰
자연
카페
노을
야경
```

### 2차

```text
지금 한적한 곳
주차 가능한 곳
도보 10분 이내
데이트
혼자 가기
```

---

# 23. 위치 권한

위치 권한은 최초 진입 시 바로 강제하지 않는다.

권장:

```text
서비스 소개
↓
취향 선택
↓
"내 주변 숨은 장소를 찾아볼까요?"
↓
위치 권한 요청
```

위치 권한을 거부해도 서비스를 사용할 수 있도록 한다.

```text
지역 선택
```

기능으로 대체한다.

---

# 24. 반응형

모바일 우선으로 설계한다.

주요 브레이크포인트:

```text
Mobile
≤ 767px

Tablet
768px ~ 1023px

Desktop
≥ 1024px
```

지도 서비스이므로 모바일에서는 지도 + Bottom Sheet 패턴을 적극적으로 사용한다.

Desktop에서는:

```text
┌──────────────┬─────────────────────┐
│ 장소 리스트   │                     │
│              │        지도          │
│ 장소 카드     │                     │
│              │                     │
└──────────────┴─────────────────────┘
```

구조를 고려한다.

---

# 25. 디자인 방향

3040 사용자를 대상으로 하므로 지나치게 캐주얼한 여행 앱 스타일을 피한다.

### 키워드

- 차분함
- 신뢰감
- 여유
- 자연
- 세련됨
- 정보가 명확함
- 사진 중심
- 과도한 장식 배제

### UI 원칙

- 카드 모서리를 지나치게 둥글게 만들지 않는다.
- 큰 텍스트와 충분한 여백을 사용한다.
- 지도 위 UI는 최소화한다.
- 정보 계층을 명확하게 한다.
- 추천 이유를 짧고 명확하게 전달한다.
- 아이콘만으로 의미를 전달하지 않는다.

---

# 26. 디자인 토큰

초기부터 디자인 토큰을 사용한다.

```ts
colors
typography
spacing
radius
shadow
zIndex
```

예:

```text
spacing:
4
8
12
16
20
24
32
40
48

radius:
8
12
16
20
```

색상은 의미 기반으로 관리한다.

```text
background
surface
textPrimary
textSecondary
border
primary
success
warning
danger
```

---

# 27. 상태 관리

Zustand에는 전역적으로 필요한 상태만 저장한다.

예:

```text
현재 사용자
선택 지역
선택 필터
지도 상태
저장 상태
```

서버 데이터는 Zustand에 넣지 않는다.

서버 데이터는 TanStack Query로 관리한다.

```text
TanStack Query
→ places
→ crowd
→ reviews
→ recommendations

Zustand
→ user preferences
→ selected filters
→ map UI state
```

---

# 28. API 설계

실제 API 연결을 고려해 다음 형태로 추상화한다.

```text
GET /places
GET /places/:id
GET /places/:id/crowd
GET /places/:id/reviews

GET /recommendations
POST /places/:id/save
DELETE /places/:id/save

POST /places/:id/reviews
```

MVP에서는 Mock Service를 사용한다.

---

# 29. Mock 데이터

개발 초기에 충분한 Mock 데이터를 만든다.

최소:

- 대표 명소 10개
- 숨은 장소 30~50개
- 시간대별 혼잡도
- 장소 사진
- 리뷰
- 사용자 취향
- 날씨
- 추천 결과

특히 실제 서비스처럼 보이도록 장소마다 데이터가 조금씩 다르게 구성한다.

모든 장소의 점수를 동일하게 만들지 않는다.

---

# 30. 개발 단계

## Phase 1 — 프로젝트 초기화

- Vite + React + TypeScript
- ESLint
- Prettier
- Router
- 기본 디자인 토큰
- 폴더 구조

## Phase 2 — Mock 기반 UI

순서:

```text
온보딩
↓
홈
↓
지도
↓
장소 카드
↓
장소 상세
↓
저장
↓
리뷰
```

## Phase 3 — 비즈니스 로직

- 추천 점수
- 혼잡도
- 시간대
- 거리
- 취향 반영

## Phase 4 — 지도 API

- 지도 표시
- 마커
- 현재 위치
- 장소 선택
- 길찾기

## Phase 5 — Supabase

- Auth
- DB
- 사용자
- 장소
- 리뷰
- 저장

## Phase 6 — 외부 데이터

- 생활인구
- 유동인구
- 날씨
- 행사
- 교통

---

# 31. 바이브 코딩 진행 규칙

AI에게 한 번에 전체 서비스를 만들라고 하지 않는다.

다음 순서로 작업한다.

```text
1. 프로젝트 구조 생성
2. 디자인 토큰 생성
3. 공통 컴포넌트 생성
4. 온보딩
5. 홈
6. 지도
7. 장소 카드
8. 상세
9. 저장
10. 리뷰
11. 추천 로직
12. API
13. 인증
```

각 단계가 완료된 후 다음 단계로 진행한다.

---

# 32. AI 코딩 규칙

다음 규칙을 반드시 지킨다.

### React

- 함수형 컴포넌트 사용
- Hooks 사용
- 불필요한 useEffect 사용 금지
- 컴포넌트 내부에 복잡한 비즈니스 로직 작성 금지
- 재사용 가능한 UI는 components로 분리

### TypeScript

- `any` 사용 금지
- 타입을 명확하게 정의
- API 응답 타입 정의
- Union Type 적극 활용

### 상태관리

- 서버 데이터는 TanStack Query
- 클라이언트 UI 상태는 Zustand
- props drilling이 심하면 구조 개선

### 코드

- 한 파일이 지나치게 커지지 않게 한다.
- 컴포넌트는 역할별로 분리한다.
- 중복 코드를 만들지 않는다.
- Magic Number를 직접 작성하지 않는다.
- 상수는 constants로 분리한다.

---

# 33. 접근성

반드시 고려한다.

- 버튼은 button 사용
- 링크는 a 사용
- 이미지 alt 제공
- 키보드 접근 가능
- focus 상태 제공
- 색상만으로 상태 표현 금지
- 충분한 텍스트 대비
- aria-label이 필요한 아이콘 버튼 제공

---

# 34. 성능

지도 앱 특성상 성능을 중요하게 본다.

- 지도 마커 과도한 렌더링 방지
- 장소 리스트 virtualization 검토
- 이미지 lazy loading
- React.memo는 필요한 곳에서만 사용
- TanStack Query caching 활용
- 지도 이동 시 API 과도한 호출 방지
- debounce 적용
- 불필요한 전역 상태 업데이트 방지

---

# 35. 보안

다음 정보를 프론트 코드에 하드코딩하지 않는다.

```text
API Secret
Private Key
Service Role Key
Database Secret
```

환경 변수:

```text
.env.local
```

공개 가능한 키와 비공개 키를 구분한다.

Supabase 사용 시 RLS를 반드시 고려한다.

---

# 36. 개인정보

개인정보는 최소한으로 관리한다.

특히:

- 생년월일
- 위치정보
- 방문 기록

등은 실제 서비스 단계에서 보관 목적과 범위를 명확히 한다.

개발 단계에서는 Mock 사용자 데이터를 사용한다.

---

# 37. 장소 데이터 품질

숨은 명소는 단순히 "사람이 적은 장소"가 아니다.

반드시 다음을 종합한다.

```text
한적함
+
뷰
+
접근성
+
체류환경
+
시간
+
날씨
+
사용자 평가
```

따라서 추천 알고리즘을 수정할 때 UI 컴포넌트가 영향을 받지 않도록 분리한다.

---

# 38. 중요한 UX 문구

추천 결과는 점수만 보여주지 않는다.

나쁜 예:

```text
추천점수 91
```

좋은 예:

```text
91점
지금 가기 좋아요.

현재 사람이 많지 않고
노을을 보기 좋은 시간이에요.
```

사용자가 **왜 추천받았는지** 이해할 수 있어야 한다.

---

# 39. 숨은 명소 보호

실제 운영에서는 정확한 좌표를 무조건 공개하지 않는 방식을 검토한다.

예:

```text
여의도 한강공원에서 도보 8분
```

사용자가 길찾기를 실행할 때 정확한 위치를 제공한다.

단, 공공장소나 공개되어야 하는 장소는 장소 성격에 따라 다르게 처리한다.

---

# 40. 최종 서비스 구조

```text
                사용자
                  │
          ┌───────┴───────┐
          │               │
       취향정보          현재 위치
          │               │
          └───────┬───────┘
                  ↓
             대표 명소 탐색
                  ↓
            주변 장소 후보
                  ↓
        ┌─────────┼─────────┐
        ↓         ↓         ↓
      혼잡도     장소정보    날씨
        │         │         │
        └─────────┼─────────┘
                  ↓
              추천 엔진
                  ↓
             추천 점수 계산
                  ↓
             숨은 명소 TOP N
                  ↓
           지도 + 장소 카드
                  ↓
              장소 상세
                  ↓
          저장 / 방문 / 리뷰
                  ↓
             추천 데이터 축적
```

---

# 41. 바이브 코딩 시작용 Master Prompt

아래 프롬프트를 AI 코딩 도구의 초기 프로젝트 지시사항으로 사용한다.

---

너는 시니어 React/TypeScript 프론트엔드 개발자이자 UI/UX 엔지니어다.

나는 3040 사용자를 대상으로 하는 "숨은 명소 발견 지도 서비스"를 React로 개발하려고 한다.

서비스의 핵심은 유명한 관광지를 보여주는 것이 아니라, 사용자가 선택한 대표 명소 주변에서 사람이 상대적으로 적으면서도 뷰, 산책, 분위기, 접근성이 좋은 장소를 찾아주는 것이다.

예를 들어 여의도 한강공원을 선택하면 여의도 한강공원 자체를 추천하는 것이 아니라 주변 500m~1.5km 범위에서 상대적으로 한적하고 방문 가치가 높은 장소를 찾아 추천한다.

## 기술 스택

- React
- TypeScript
- Vite
- React Router
- Zustand
- TanStack Query
- Tailwind CSS 또는 CSS Modules
- Supabase
- Kakao Map SDK 또는 Naver Map SDK
- ESLint
- Prettier

## 개발 방식

처음에는 실제 API를 연결하지 않는다.

Mock 데이터를 기반으로 UI와 비즈니스 로직을 먼저 완성한다.

이후 지도 API → Supabase → 외부 공공데이터 순서로 연결할 수 있도록 architecture를 설계한다.

API 호출은 컴포넌트에서 직접 하지 말고 service/repository 계층으로 분리한다.

서버 상태는 TanStack Query로 관리하고 클라이언트 UI 상태만 Zustand로 관리한다.

## 주요 화면

1. 온보딩
2. 회원가입/본인확인 Mock
3. 취향 선택
4. 홈
5. 지도 탐색
6. 장소 상세
7. 저장 장소
8. 리뷰
9. MY

## 주요 기능

- 현재 위치 기반 탐색
- 지역 선택
- 대표 명소 선택
- 주변 숨은 장소 탐색
- 장소별 혼잡도
- 시간대별 혼잡도
- 추천 점수
- 사용자 취향 기반 추천
- 장소 저장
- 방문 후 평가
- 장소 리뷰
- 길찾기
- 현재 날씨/시간 기반 추천

## 추천 점수

초기에는 다음 기준으로 계산한다.

- 한적함 30%
- 뷰 25%
- 사용자 취향 20%
- 접근성 10%
- 현재 날씨 5%
- 시간대 적합성 5%
- 사용자 평가 5%

추천 점수 계산은 순수 함수로 분리한다.

## 장소 데이터

장소는 다음 정보를 가질 수 있다.

- id
- name
- latitude
- longitude
- category
- description
- nearbyLandmarkId
- distanceFromLandmark
- quietScore
- viewScore
- accessibilityScore
- stayScore
- userRating
- parking
- restroom
- bench
- cafeNearby
- bestTime
- photos
- reviewCount

## UX 방향

3040 사용자를 대상으로 하므로 지나치게 캐주얼하고 장난스러운 여행 앱 스타일을 사용하지 않는다.

차분하고 세련되며 신뢰감 있는 UI를 만든다.

사진과 지도 중심으로 구성하되 정보 계층을 명확하게 한다.

사용자에게 추천 점수만 보여주지 말고 반드시 "왜 추천하는지"를 짧게 설명한다.

예:

"현재 사람이 많지 않고 노을을 보기 좋은 시간이에요."

## 지도 UX

모바일은 지도 + Bottom Sheet 구조를 사용한다.

Desktop은 좌측 장소 리스트 + 우측 지도 구조를 사용한다.

지도 마커에는 장소명보다 추천 점수를 우선 표시한다.

## 개발 순서

1. 프로젝트 구조
2. 디자인 토큰
3. 공통 컴포넌트
4. Mock 데이터
5. 온보딩
6. 홈
7. 지도
8. 장소 카드
9. 장소 상세
10. 저장
11. 리뷰
12. 추천 알고리즘
13. 지도 SDK
14. Supabase
15. 외부 데이터

각 단계가 정상적으로 동작하는 것을 확인한 뒤 다음 단계로 진행한다.

한 번에 전체 코드를 만들지 않는다.

각 단계에서 먼저 구현 계획과 변경 파일을 간단하게 설명하고 코드를 작성한다.

코드 작성 후 타입 오류, lint 오류, import 오류, 사용하지 않는 코드가 없는지 확인한다.

기존 코드가 정상적으로 동작하고 있다면 불필요하게 구조를 변경하지 않는다.

`any` 사용을 금지한다.

복잡한 비즈니스 로직을 UI 컴포넌트에 작성하지 않는다.

재사용 가능한 컴포넌트와 순수 함수를 적극적으로 분리한다.

모바일 UX를 우선한다.

접근성도 기본적으로 고려한다.

최종적으로 실제 서비스로 확장할 수 있는 구조를 목표로 한다.

첫 번째 작업으로 프로젝트 전체 architecture와 폴더 구조를 제안하고, 이후 실제 파일을 단계적으로 생성한다.
