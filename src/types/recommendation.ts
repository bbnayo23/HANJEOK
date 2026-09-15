import type { CrowdData } from './crowd'
import type { Landmark } from './landmark'
import type { Place } from './place'

// GET /recommendations 응답에 대응하는 뷰 모델 (섹션 21, 28). score/reason은
// Phase 3의 calculateRecommendationScore(섹션 14)가 실제 계산으로 대체하기
// 전까지 쓰는 값이다.
export type Recommendation = {
  place: Place
  landmark: Landmark
  crowd: CrowdData
  score: number
  distanceLabel: string
  reason: string
}
