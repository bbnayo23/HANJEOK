import type { PlaceCategory } from '../types/place'

// 홈 1차 필터 (섹션 22). '전체'는 실제 카테고리가 아니라 필터 UI에서만 쓰는 값이다.
export type HomeFilter = 'all' | PlaceCategory

export const HOME_FILTER_OPTIONS: { id: HomeFilter; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'walk', label: '산책' },
  { id: 'view', label: '뷰' },
  { id: 'nature', label: '자연' },
  { id: 'cafe', label: '카페' },
  { id: 'food', label: '맛집' },
  { id: 'sunset', label: '노을' },
  { id: 'nightview', label: '야경' },
]

// 사진(photos)이 아직 없는 목데이터용 대체 표시. 실제 사진이 들어오면
// PlaceCard에서 photos[0]을 우선 사용하도록 바꾼다.
export const CATEGORY_EMOJI: Record<PlaceCategory, string> = {
  walk: '🌿',
  view: '🌇',
  nature: '🍃',
  cafe: '☕',
  food: '🍚',
  sunset: '🌅',
  nightview: '🌃',
}
