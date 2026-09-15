import { useMutation } from '@tanstack/react-query'

import { fetchRoute, type TravelMode } from '../services/map/directions'
import type { Coordinates } from '../utils/geo'

type DirectionsVariables = {
  from: Coordinates
  to: Coordinates
  mode: TravelMode
}

// 클릭했을 때만 조회한다 (섹션 34: 과도한 API 호출 방지). 카드마다 자동으로
// 조회하지 않고, 사용자가 "길찾기"를 누른 장소만 계산한다.
export function useDirections() {
  return useMutation({
    mutationFn: ({ from, to, mode }: DirectionsVariables) => fetchRoute(from, to, mode),
  })
}
