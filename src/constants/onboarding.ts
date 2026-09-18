import type { AgeGroup, Preference } from '../types/user'

export const AGE_GROUP_OPTIONS: { id: AgeGroup; label: string }[] = [
  { id: '10s', label: '10대' },
  { id: '20s', label: '20대' },
  { id: '30s', label: '30대' },
  { id: '40s', label: '40대' },
  { id: '50s', label: '50대 이상' },
]

// 온보딩 취향 선택 (섹션 6.1). 추천 알고리즘의 사용자 취향 가중치에 그대로 쓰인다.
export const PREFERENCE_OPTIONS: { id: Preference; label: string }[] = [
  { id: 'quiet', label: '조용한 곳' },
  { id: 'nature', label: '자연' },
  { id: 'view', label: '멋진 뷰' },
  { id: 'walk', label: '산책' },
  { id: 'cafe', label: '카페' },
  { id: 'food', label: '맛집' },
  { id: 'photo', label: '사진' },
  { id: 'sunset', label: '노을' },
  { id: 'nightview', label: '야경' },
  { id: 'date', label: '데이트' },
  { id: 'solo', label: '혼자 가기' },
]
