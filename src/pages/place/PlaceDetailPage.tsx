import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { StarRating } from '../../components/common/StarRating'
import { MapView } from '../../components/map/MapView'
import { CATEGORY_EMOJI } from '../../constants/home'
import { useRecommendation } from '../../features/recommendation/hooks/useRecommendations'
import { useDirections } from '../../hooks/useDirections'
import type { TravelMode } from '../../services/map/directions'
import type { CrowdData, CrowdLevel } from '../../types/crowd'
import { useLocationStore } from '../../store/locationStore'
import { naverMapSearchUrl } from '../../utils/externalLinks'
import { formatDistanceMeters, formatDurationSeconds } from '../../utils/geo'
import { toStarRating } from '../../utils/rating'

const CROWD_LABEL: Record<CrowdLevel, { text: string; tone: 'success' | 'warning' | 'danger' }> = {
  low: { text: '혼잡도 낮음', tone: 'success' },
  medium: { text: '혼잡도 보통', tone: 'warning' },
  high: { text: '혼잡도 높음', tone: 'danger' },
}

const TRAVEL_MODE_LABEL: Record<TravelMode, string> = {
  walking: '도보',
  cycling: '자전거',
  driving: '자동차',
}

// 평소 대비 혼잡도를 문장으로 (섹션 12). 값이 없거나 거의 평소 수준이면
// 억지로 문구를 만들지 않는다.
function comparedToAverageText(crowd: CrowdData): string | null {
  const diff = crowd.comparedToAverage
  if (diff === undefined || Math.abs(diff) < 5) return null
  return diff < 0 ? `평소보다 ${Math.abs(diff)}% 한적해요.` : `평소보다 ${diff}% 붐벼요.`
}

// 세부 점수 (섹션 17). scores는 공개된 소개글에서 언급된 특징을 반영한
// 추정치라, 그 사실을 화면에도 적어둔다.
const SCORE_ROWS: { key: 'quiet' | 'view' | 'accessibility' | 'stay'; label: string }[] = [
  { key: 'quiet', label: '한적함' },
  { key: 'view', label: '뷰' },
  { key: 'accessibility', label: '접근성' },
  { key: 'stay', label: '머물기' },
]

export function PlaceDetailPage() {
  const { placeId } = useParams()
  const navigate = useNavigate()
  const coords = useLocationStore((state) => state.coords)
  const directions = useDirections()
  const [travelMode, setTravelMode] = useState<TravelMode | null>(null)

  const { data: recommendation, isLoading } = useRecommendation(placeId)

  if (isLoading) {
    return (
      <main className="min-h-dvh bg-background px-4 py-6">
        <p className="text-sm text-ink-muted">불러오는 중...</p>
      </main>
    )
  }

  if (!recommendation) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-background px-4">
        <p className="text-ink-muted">장소를 찾을 수 없어요.</p>
        <Button variant="secondary" onClick={() => navigate('/')}>
          홈으로
        </Button>
      </main>
    )
  }

  const { place, landmark, crowd, score, distanceLabel, reason } = recommendation
  const crowdInfo = CROWD_LABEL[crowd.crowdLevel]
  const comparedText = comparedToAverageText(crowd)

  const handleDirections = (mode: TravelMode) => {
    setTravelMode(mode)
    if (!coords) return
    directions.mutate({
      from: coords,
      to: { latitude: place.latitude, longitude: place.longitude },
      mode,
    })
  }

  return (
    <main className="min-h-dvh bg-background pb-12">
      <div className="mx-auto w-full max-w-md">
        <div className="flex items-center gap-2 px-4 py-3">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            뒤로
          </Button>
        </div>

        <div className="flex h-44 items-center justify-center bg-surface text-5xl" aria-hidden="true">
          {CATEGORY_EMOJI[place.category]}
        </div>

        <div className="flex flex-col gap-4 px-4 pt-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-semibold text-ink">{place.name}</h1>
            <StarRating rating={toStarRating(score)} />
            <p className="text-sm text-ink-muted">{place.description}</p>
            {/* 영업시간·메뉴·최신 리뷰는 우리가 갖고 있지 않으니 네이버 지도로 연결한다. */}
            <a
              href={naverMapSearchUrl(place, landmark)}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start rounded-md border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              네이버에서 영업시간·리뷰 보기
            </a>
          </div>

          <Card className="flex flex-col gap-2 p-4">
            <h2 className="text-sm font-semibold text-ink">현재 상태</h2>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={crowdInfo.tone}>{crowdInfo.text}</Badge>
              {comparedText && <span className="text-sm text-ink-muted">{comparedText}</span>}
            </div>
            <p className="text-sm text-ink-muted">{reason}</p>
          </Card>

          <Card className="flex flex-col gap-2 p-4">
            <h2 className="text-sm font-semibold text-ink">세부 점수</h2>
            {SCORE_ROWS.map((row) => (
              <div key={row.key} className="flex items-center justify-between gap-3">
                <span className="text-sm text-ink-muted">{row.label}</span>
                <StarRating rating={toStarRating(place.scores[row.key])} />
              </div>
            ))}
            <p className="text-xs text-ink-muted">
              세부 점수는 공개된 소개글에서 언급된 특징을 반영한 추정치예요.
            </p>
          </Card>

          {place.bestTime && (
            <Card className="flex flex-col gap-1 p-4">
              <h2 className="text-sm font-semibold text-ink">추천 시간</h2>
              <p className="text-sm text-ink-muted">
                {place.bestTime.start} ~ {place.bestTime.end}
              </p>
            </Card>
          )}

          <Card className="flex flex-col gap-3 p-4">
            <h2 className="text-sm font-semibold text-ink">가는 방법</h2>
            <p className="text-sm text-ink-muted">{distanceLabel}</p>

            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => handleDirections('walking')}>
                길찾기 (도보)
              </Button>
              <Button variant="secondary" onClick={() => handleDirections('cycling')}>
                길찾기 (자전거)
              </Button>
            </div>

            {travelMode && !coords && (
              <p className="text-xs text-ink-muted">위치 권한을 허용하면 실제 거리를 계산해드려요.</p>
            )}
            {travelMode && directions.isPending && (
              <p className="text-xs text-ink-muted">길찾기 조회 중...</p>
            )}
            {travelMode && directions.isError && (
              <p className="text-xs text-danger">경로를 불러오지 못했어요.</p>
            )}
            {travelMode && directions.data && (
              <p className="text-xs text-primary">
                내 위치에서 {TRAVEL_MODE_LABEL[travelMode]}{' '}
                {formatDurationSeconds(directions.data.durationSeconds)} ·{' '}
                {formatDistanceMeters(directions.data.distanceMeters)}
              </p>
            )}
          </Card>

          <MapView
            landmark={landmark}
            recommendations={[recommendation]}
            userCoords={coords}
            selectedPlaceId={place.id}
            route={directions.data ?? null}
          />
        </div>
      </div>
    </main>
  )
}
