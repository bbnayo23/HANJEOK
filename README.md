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

## 현재 상태 — Phase 1 (프로젝트 초기화)

- Vite + React + TS 스캐폴드, ESLint/Prettier, 라우터·Provider 뼈대,
  Tailwind v4 `@theme` 기반 디자인 토큰(`src/styles/index.css`)만 구성됨.
- 온보딩/홈/지도/추천 로직 등은 아직 없음 (다음 단계에서 진행).

폴더 구조와 각 단계 계획은 프로젝트 스펙 문서를 따른다.
