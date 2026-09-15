import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet'

import type { Route } from '../../services/map/directions'
import type { Landmark } from '../../types/landmark'
import type { Recommendation } from '../../types/recommendation'
import type { Coordinates } from '../../utils/geo'

// 실제 OpenStreetMap 타일 위에 대표 명소·추천 장소·내 위치를 정확한 좌표로
// 표시한다 (섹션 9). API 키가 필요 없는 무료 지도라 지금 바로 붙일 수 있고,
// 나중에 카카오맵/네이버지도로 교체할 때는 이 컴포넌트만 바꾸면 된다.
// 마커에는 장소명보다 추천 점수를 우선 표시한다.
function scoreMarkerIcon(score: number, active: boolean) {
  const background = active ? '#2f6e51' : '#ffffff'
  const color = active ? '#ffffff' : '#2f6e51'
  return L.divIcon({
    className: '',
    html: `<span style="display:inline-flex;align-items:center;justify-content:center;min-width:28px;height:28px;padding:0 6px;border-radius:9999px;background:${background};color:${color};font-size:12px;font-weight:600;box-shadow:0 1px 3px rgba(0,0,0,0.25);border:1px solid #2f6e51;">${score}</span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

function landmarkMarkerIcon(name: string) {
  return L.divIcon({
    className: '',
    html: `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><span style="width:12px;height:12px;border-radius:9999px;background:#2f6e51;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3);"></span><span style="background:#ffffff;color:#1f2421;font-size:11px;font-weight:600;padding:2px 6px;border-radius:9999px;box-shadow:0 1px 3px rgba(0,0,0,0.2);white-space:nowrap;">${name}</span></div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })
}

const USER_MARKER_ICON = L.divIcon({
  className: '',
  html: `<span style="display:block;width:14px;height:14px;border-radius:9999px;background:#2563eb;border:3px solid white;box-shadow:0 0 0 4px rgba(37,99,235,0.25);"></span>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

// landmark/장소/내 위치가 바뀔 때마다 전부 보이도록 지도 범위를 다시 맞춘다.
function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap()

  useEffect(() => {
    if (points.length === 0) return
    if (points.length === 1) {
      map.setView(points[0], 15)
      return
    }
    map.fitBounds(points, { padding: [32, 32] })
  }, [map, points])

  return null
}

type MapViewProps = {
  landmark: Landmark
  recommendations: Recommendation[]
  userCoords: Coordinates | null
  activePlaceId?: string
  route?: Route | null
}

export function MapView({ landmark, recommendations, userCoords, activePlaceId, route }: MapViewProps) {
  const points: [number, number][] = [
    [landmark.latitude, landmark.longitude],
    ...recommendations.map(
      (recommendation) => [recommendation.place.latitude, recommendation.place.longitude] as [number, number],
    ),
    ...(userCoords ? [[userCoords.latitude, userCoords.longitude] as [number, number]] : []),
  ]

  return (
    <div className="h-72 overflow-hidden rounded-lg border border-line">
      <MapContainer
        center={[landmark.latitude, landmark.longitude]}
        zoom={15}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, tiles by Humanitarian OSM Team'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        <FitBounds points={points} />
        <Marker position={[landmark.latitude, landmark.longitude]} icon={landmarkMarkerIcon(landmark.name)} />
        {recommendations.map((recommendation) => (
          <Marker
            key={recommendation.place.id}
            position={[recommendation.place.latitude, recommendation.place.longitude]}
            icon={scoreMarkerIcon(recommendation.score, recommendation.place.id === activePlaceId)}
          />
        ))}
        {userCoords && <Marker position={[userCoords.latitude, userCoords.longitude]} icon={USER_MARKER_ICON} />}
        {route && route.path.length > 1 && (
          <Polyline
            positions={route.path.map((point) => [point.latitude, point.longitude])}
            color="#2563eb"
            weight={4}
          />
        )}
      </MapContainer>
    </div>
  )
}
