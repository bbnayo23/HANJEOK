import type { Place } from '../types/place'
import type { Preference } from '../types/user'

// 온보딩에서 고른 취향(섹션 6.1)을 실제 추천에 반영한다. Phase 3의 추천 점수
// 계산(섹션 14, 취향 20%)이 들어오기 전까지 쓰는 단순 규칙이다.
//
// PlaceCategory 값은 Preference의 부분집합이라 카테고리는 그대로 비교하고,
// 'quiet'는 카테고리가 아니라 한적함 점수로 판단한다.
const QUIET_SCORE_THRESHOLD = 80

export function matchesPreference(place: Place, preferences: Preference[]): boolean {
  if (preferences.includes(place.category)) return true
  return preferences.includes('quiet') && place.scores.quiet >= QUIET_SCORE_THRESHOLD
}
