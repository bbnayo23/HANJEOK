import { MOCK_LANDMARKS } from '../../mocks/landmarks'
import type { Landmark } from '../../types/landmark'

// GET /places 계열 참조 데이터에 대응한다 (섹션 28). 실제 API가 준비되면
// 이 함수 내부만 바꾸면 된다 (섹션 4.1).
export function fetchLandmarks(): Promise<Landmark[]> {
  return Promise.resolve(MOCK_LANDMARKS)
}
