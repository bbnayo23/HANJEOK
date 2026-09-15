import { useState } from 'react'

import { Button } from '../../components/common/Button'
import { Chip } from '../../components/common/Chip'
import { MapView } from '../../components/map/MapView'
import { PlaceCard, type DirectionsInfo } from '../../components/place/PlaceCard'
import { HOME_FILTER_OPTIONS, type HomeFilter } from '../../constants/home'
import { useLandmarks } from '../../features/places/hooks/useLandmarks'
import { useRecommendations } from '../../features/recommendation/hooks/useRecommendations'
import { useDirections } from '../../hooks/useDirections'
import { getCurrentLocation } from '../../services/map/geolocation'
import { useExploreStore } from '../../store/exploreStore'
import { useLocationStore } from '../../store/locationStore'
import { useUserStore } from '../../store/userStore'
import type { Landmark } from '../../types/landmark'
import type { Recommendation } from '../../types/recommendation'
import { haversineDistanceMeters } from '../../utils/geo'

function findNearestLandmark(landmarks: Landmark[], coords: { latitude: number; longitude: number }) {
  return landmarks.reduce<Landmark | null>((nearest, landmark) => {
    if (!nearest) return landmark
    const isCloser = haversineDistanceMeters(coords, landmark) < haversineDistanceMeters(coords, nearest)
    return isCloser ? landmark : nearest
  }, null)
}

// 홈 화면 구성: 지역(명소) 선택 → 취향 필터 → 지도 → 추천 카드 (섹션 8).
// 한강뿐 아니라 서울 전역의 명소를 다루므로, 지역 선택이 곧 "선택 지역"
// 상태(섹션 27)이고 exploreStore에 둔다.
export function HomePage() {
  const user = useUserStore((state) => state.user)
  const [filter, setFilter] = useState<HomeFilter>('all')
  const [directionsPlaceId, setDirectionsPlaceId] = useState<string | null>(null)

  const coords = useLocationStore((state) => state.coords)
  const locationStatus = useLocationStore((state) => state.status)
  const setCoords = useLocationStore((state) => state.setCoords)
  const setLocationStatus = useLocationStore((state) => state.setStatus)

  const selectedLandmarkId = useExploreStore((state) => state.selectedLandmarkId)
  const setSelectedLandmarkId = useExploreStore((state) => state.setSelectedLandmarkId)

  const { data: landmarks = [] } = useLandmarks()
  const { data: recommendations, isLoading } = useRecommendations()
  const directions = useDirections()

  // 명시적으로 선택한 지역이 없으면 내 위치에서 가장 가까운 명소, 위치가
  // 없으면 첫 번째 명소를 기본값으로 쓴다 (거부해도 이용 가능해야 함 — 섹션 23).
  const defaultLandmark = (coords ? findNearestLandmark(landmarks, coords) : landmarks[0]) ?? landmarks[0]
  const selectedLandmark = landmarks.find((landmark) => landmark.id === selectedLandmarkId) ?? defaultLandmark

  if (!user) return null

  const handleRequestLocation = () => {
    getCurrentLocation()
      .then(setCoords)
      .catch((error: Error) => setLocationStatus(error.message === 'unsupported' ? 'unsupported' : 'denied'))
  }

  const filtered = (recommendations ?? []).filter(
    (recommendation) =>
      recommendation.landmark.id === selectedLandmark?.id &&
      (filter === 'all' || recommendation.place.category === filter),
  )

  const handleShowDirections = (recommendation: Recommendation) => {
    setDirectionsPlaceId(recommendation.place.id)
    if (!coords) return
    directions.mutate({
      from: coords,
      to: { latitude: recommendation.place.latitude, longitude: recommendation.place.longitude },
      mode: 'walking',
    })
  }

  const directionsInfoFor = (placeId: string): DirectionsInfo | undefined => {
    if (placeId !== directionsPlaceId) return undefined
    if (!coords) return { kind: 'no-location' }
    if (directions.isPending) return { kind: 'pending' }
    if (directions.isError) return { kind: 'error', message: '경로를 불러오지 못했어요.' }
    if (directions.data) {
      return {
        kind: 'success',
        distanceMeters: directions.data.distanceMeters,
        durationSeconds: directions.data.durationSeconds,
      }
    }
    return undefined
  }

  const activeRoute = directionsPlaceId && directions.data ? directions.data : null

  return (
    <main className="min-h-dvh bg-background px-4 pb-12 pt-6">
      <div className="mx-auto flex w-full max-w-md flex-col gap-4">
        <header className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-ink-muted">현재 지역</p>
            <h1 className="text-lg font-semibold text-ink">{selectedLandmark?.name ?? '불러오는 중...'}</h1>
          </div>
          {locationStatus === 'idle' && (
            <Button variant="secondary" onClick={handleRequestLocation} className="shrink-0">
              내 위치 사용하기
            </Button>
          )}
          {locationStatus === 'denied' && (
            <p className="max-w-[9rem] text-right text-xs text-ink-muted">
              위치 권한이 없어 명소 기준으로 보여드려요.
            </p>
          )}
        </header>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {landmarks.map((landmark) => (
            <Chip
              key={landmark.id}
              selected={landmark.id === selectedLandmark?.id}
              onClick={() => setSelectedLandmarkId(landmark.id)}
              className="shrink-0"
            >
              {landmark.name}
            </Chip>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {HOME_FILTER_OPTIONS.map((option) => (
            <Chip
              key={option.id}
              selected={filter === option.id}
              onClick={() => setFilter(option.id)}
              className="shrink-0"
            >
              {option.label}
            </Chip>
          ))}
        </div>

        {selectedLandmark && (
          <MapView
            landmark={selectedLandmark}
            recommendations={filtered}
            userCoords={coords}
            activePlaceId={directionsPlaceId ?? undefined}
            route={activeRoute}
          />
        )}

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-ink">오늘 가기 좋은 곳</h2>

          {isLoading && <p className="text-sm text-ink-muted">추천 장소를 불러오는 중...</p>}

          {!isLoading && filtered.length === 0 && (
            <p className="text-sm text-ink-muted">조건에 맞는 장소가 아직 없어요.</p>
          )}

          <div className="flex flex-col gap-3">
            {filtered.map((recommendation) => (
              <PlaceCard
                key={recommendation.place.id}
                recommendation={recommendation}
                onShowDirections={() => handleShowDirections(recommendation)}
                directionsInfo={directionsInfoFor(recommendation.place.id)}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
