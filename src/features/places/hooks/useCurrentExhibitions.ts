import { useQuery } from '@tanstack/react-query'

import { fetchCurrentExhibitions } from '../../../services/api/culturalEvents'

// 전시 목록은 분 단위로 바뀌지 않으니 30분 캐시면 충분하다 (섹션 34).
const STALE_TIME_MS = 30 * 60_000

export function useCurrentExhibitions() {
  return useQuery({
    queryKey: ['cultural-exhibitions'],
    queryFn: () => fetchCurrentExhibitions(new Date()),
    staleTime: STALE_TIME_MS,
  })
}
