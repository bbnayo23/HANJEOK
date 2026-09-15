export type Coordinates = {
  latitude: number
  longitude: number
}

const EARTH_RADIUS_METERS = 6371000

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180
}

// 두 좌표 사이의 실제 거리 (Haversine). 내 위치 ↔ 명소/장소 거리를 계산할 때 쓴다.
export function haversineDistanceMeters(from: Coordinates, to: Coordinates): number {
  const deltaLat = toRadians(to.latitude - from.latitude)
  const deltaLng = toRadians(to.longitude - from.longitude)

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(from.latitude)) * Math.cos(toRadians(to.latitude)) * Math.sin(deltaLng / 2) ** 2

  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(a))
}

// 성인 평균 도보 속도를 대략 80m/분으로 잡고 "도보 n분" 문구를 만든다 (섹션 8, 17).
const WALK_METERS_PER_MINUTE = 80

export function toWalkingMinutes(distanceMeters: number): number {
  return Math.max(1, Math.round(distanceMeters / WALK_METERS_PER_MINUTE))
}

export function formatDistanceMeters(distanceMeters: number): string {
  if (distanceMeters < 1000) return `${Math.round(distanceMeters)}m`
  return `${(distanceMeters / 1000).toFixed(1)}km`
}

export function formatDurationSeconds(durationSeconds: number): string {
  const minutes = Math.max(1, Math.round(durationSeconds / 60))
  if (minutes < 60) return `${minutes}분`
  return `${Math.floor(minutes / 60)}시간 ${minutes % 60}분`
}
