import { useQuery } from '@tanstack/react-query'

import { LANDMARK_CITYDATA_AREA } from '../../../constants/cityCongestion'
import { fetchCityCongestion } from '../../../services/api/cityCongestion'

// 선택된 명소가 citydata에 매칭된 경우에만 실제 서울시 실시간 데이터를
// 가져온다. 매칭이 없으면 그냥 비활성 상태로 둔다 (없는 지역을 지어내 조회하지
// 않는다).
export function useCityCongestion(landmarkId: string | undefined) {
  const areaName = landmarkId ? LANDMARK_CITYDATA_AREA[landmarkId] : undefined

  return useQuery({
    queryKey: ['city-congestion', areaName],
    queryFn: () => fetchCityCongestion(areaName as string),
    enabled: Boolean(areaName),
    refetchInterval: 60_000,
  })
}
