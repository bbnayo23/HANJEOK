import { useQuery } from '@tanstack/react-query'

import { fetchRecommendation, fetchRecommendations } from '../../../services/api/recommendations'

// 1분마다 다시 계산해서 혼잡도가 "실시간"으로 바뀌는 것처럼 보이게 한다.
// 실제 API로 바뀌어도 이 간격 자체는 유효하다 (섹션 34: 과도한 호출은 피한다).
const REFRESH_INTERVAL_MS = 60_000

export function useRecommendations() {
  return useQuery({
    queryKey: ['recommendations'],
    queryFn: fetchRecommendations,
    refetchInterval: REFRESH_INTERVAL_MS,
  })
}

export function useRecommendation(placeId: string | undefined) {
  return useQuery({
    queryKey: ['recommendation', placeId],
    queryFn: () => fetchRecommendation(placeId as string),
    enabled: Boolean(placeId),
    refetchInterval: REFRESH_INTERVAL_MS,
  })
}
