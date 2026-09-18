import type { CrowdLevel } from '../types/crowd'
import type { Recommendation } from '../types/recommendation'

// 지역이 붐빌수록 한적한 곳을 더 세게 끌어올린다. 한산한 시간대에는 원래
// 점수(매체 언급 기반)를 거의 그대로 쓰고, 붐빌 때는 혼잡도 감점이 커져서
// 같은 지역이라도 순서가 뒤집힌다.
const AREA_PENALTY: Record<CrowdLevel, number> = {
  low: 0.1,
  medium: 0.25,
  high: 0.4,
}

// 홈 목록 정렬 기준 (섹션 14 혼잡도 가중치). 고정 점수만으로 정렬하면 지역과
// 취향이 같을 때 항상 같은 가게가 같은 순서로 나오므로, 지금 얼마나 붐비는지를
// 빼서 순위를 매긴다.
//
// areaLevel은 서울시 citydata가 매칭된 지역에서만 들어오는 실제 실시간 인구
// 혼잡도다. 매칭이 없는 지역은 'medium'으로 두고 장소별 시간대 패턴만 반영한다
// (없는 데이터를 지어내지 않되, 최소한 시간대에 따라서는 달라지도록).
export function liveScore(recommendation: Recommendation, areaLevel?: CrowdLevel): number {
  return recommendation.score - recommendation.crowd.population * AREA_PENALTY[areaLevel ?? 'medium']
}
