import type { Coordinates } from '../../utils/geo'

// 무료 공개 라우팅 서비스 (OSRM, OpenStreetMap Germany 운영). API 키가 필요
// 없어 지금 바로 붙일 수 있고, 나중에 카카오/네이버 길찾기 API로 교체할 때는
// 이 파일만 바꾸면 된다 (섹션 4.1, services/map).
const ROUTING_HOST = 'https://routing.openstreetmap.de'

export type TravelMode = 'walking' | 'driving'

const PROFILE_PATH: Record<TravelMode, string> = {
  walking: 'routed-foot/route/v1/foot',
  driving: 'routed-car/route/v1/driving',
}

export type Route = {
  distanceMeters: number
  durationSeconds: number
  path: Coordinates[]
}

type OsrmResponse = {
  code: string
  routes: {
    distance: number
    duration: number
    geometry: { coordinates: [number, number][] }
  }[]
}

export async function fetchRoute(
  from: Coordinates,
  to: Coordinates,
  mode: TravelMode,
): Promise<Route> {
  const coordinates = `${from.longitude},${from.latitude};${to.longitude},${to.latitude}`
  const url = `${ROUTING_HOST}/${PROFILE_PATH[mode]}/${coordinates}?overview=full&geometries=geojson`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`길찾기 요청에 실패했어요 (${response.status})`)
  }

  const data = (await response.json()) as OsrmResponse
  const route = data.routes[0]
  if (data.code !== 'Ok' || !route) {
    throw new Error('길찾기 경로를 찾지 못했어요.')
  }

  return {
    distanceMeters: route.distance,
    durationSeconds: route.duration,
    path: route.geometry.coordinates.map(([longitude, latitude]) => ({ latitude, longitude })),
  }
}
