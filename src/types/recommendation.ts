import type { CrowdData } from './crowd'
import type { Landmark } from './landmark'
import type { Place } from './place'

// GET /recommendations 응답에 대응하는 뷰 모델 (섹션 21, 28). score/reason은
// Phase 3의 calculateRecommendationScore(섹션 14)가 실제 계산으로 대체하기
// 전까지 쓰는 값이다.
export type Recommendation = {
  place: Place
  landmark: Landmark
  // 혼잡도 패턴이 덮지 않는 시간대(심야)이거나 영업시간 밖이면 null이다.
  // 없는 데이터를 지어내 보여주지 않는다.
  crowd: CrowdData | null
  // 영업시간을 알고 있고 지금 닫혀 있을 때만 true. 모르면 false다.
  closedNow: boolean
  score: number
  distanceLabel: string
  reason: string
}
