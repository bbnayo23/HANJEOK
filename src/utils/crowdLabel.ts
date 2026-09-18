import type { Recommendation } from '../types/recommendation'

type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger'

// 장소 혼잡도는 실측이 아니라 시간대 패턴에서 뽑은 추정치다 (mocks/crowd.ts).
// "지금 붐벼요"라고 쓰면 측정한 값처럼 읽히므로 "~한 편"으로 적는다. 실제
// 실시간 인구는 지역 단위 citydata 뱃지("서울시 실시간")에만 붙는다.
const ESTIMATE_LABEL: Record<string, { text: string; tone: BadgeTone }> = {
  low: { text: '한적한 편이에요', tone: 'success' },
  medium: { text: '보통이에요', tone: 'warning' },
  high: { text: '붐비는 편이에요', tone: 'danger' },
}

// 보여줄 게 없으면 null을 준다 — 문 닫은 시간이나 심야에 혼잡도를 지어내지
// 않기 위해서다 (utils/crowd.ts resolveCrowd가 그때 null을 준다).
export function crowdBadge(
  recommendation: Recommendation,
): { text: string; tone: BadgeTone } | null {
  if (recommendation.closedNow) return { text: '지금은 영업시간이 아니에요', tone: 'neutral' }
  if (!recommendation.crowd) return null
  return ESTIMATE_LABEL[recommendation.crowd.crowdLevel]
}
