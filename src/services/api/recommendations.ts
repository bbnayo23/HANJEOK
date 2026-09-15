import { buildRecommendations } from '../../mocks/recommendations'
import type { Recommendation } from '../../types/recommendation'

// GET /recommendations (섹션 28)에 대응한다. 실제 API가 준비되면 이 함수
// 내부만 fetch 호출로 바꾸면 되고, 호출하는 쪽(훅/컴포넌트)은 그대로 둔다 (섹션 4.1).
// now를 매번 새로 넘겨서 혼잡도가 시간에 따라 달라지는 것처럼 보이게 한다.
export function fetchRecommendations(): Promise<Recommendation[]> {
  return Promise.resolve(buildRecommendations(new Date()))
}
