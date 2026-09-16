import { Badge } from '../common/Badge'
import { Button } from '../common/Button'
import { Card } from '../common/Card'
import { StarRating } from '../common/StarRating'
import { CATEGORY_EMOJI } from '../../constants/home'
import type { TravelMode } from '../../services/map/directions'
import type { CrowdLevel } from '../../types/crowd'
import type { Recommendation } from '../../types/recommendation'
import { formatDistanceMeters, formatDurationSeconds } from '../../utils/geo'
import { toStarRating } from '../../utils/rating'

// 추천 카드 UI (섹션 21). 정보를 많이 넣지 않고 사진/이름/점수/혼잡도/거리/이유만
// 보여준다. 혼잡도는 색상만이 아니라 항상 텍스트로도 전달한다 (섹션 33).
const CROWD_LABEL: Record<CrowdLevel, { text: string; tone: 'success' | 'warning' | 'danger' }> = {
  low: { text: '지금 한적해요', tone: 'success' },
  medium: { text: '보통이에요', tone: 'warning' },
  high: { text: '지금 붐벼요', tone: 'danger' },
}

const TRAVEL_MODE_LABEL: Record<TravelMode, string> = {
  walking: '도보',
  cycling: '자전거',
  driving: '자동차',
}

// 내 위치 → 이 장소까지의 실제 길찾기 상태 (섹션 17 [길찾기]). 카드마다 자동
// 조회하지 않고, "길찾기"를 누른 카드에 대해서만 부모(HomePage)가 계산해 넘긴다.
export type DirectionsInfo =
  | { kind: 'no-location' }
  | { kind: 'pending' }
  | { kind: 'error'; message: string }
  | { kind: 'success'; mode: TravelMode; distanceMeters: number; durationSeconds: number }

type PlaceCardProps = {
  recommendation: Recommendation
  selected?: boolean
  onSelect: () => void
  onShowDirections: (mode: TravelMode) => void
  directionsInfo?: DirectionsInfo
}

function DirectionsResult({ info }: { info: DirectionsInfo }) {
  if (info.kind === 'no-location') {
    return <p className="text-xs text-ink-muted">위치 권한을 허용하면 실제 거리를 계산해드려요.</p>
  }
  if (info.kind === 'pending') {
    return <p className="text-xs text-ink-muted">길찾기 조회 중...</p>
  }
  if (info.kind === 'error') {
    return <p className="text-xs text-danger">{info.message}</p>
  }
  return (
    <p className="text-xs text-primary">
      내 위치에서 {TRAVEL_MODE_LABEL[info.mode]} {formatDurationSeconds(info.durationSeconds)} ·{' '}
      {formatDistanceMeters(info.distanceMeters)}
    </p>
  )
}

export function PlaceCard({
  recommendation,
  selected = false,
  onSelect,
  onShowDirections,
  directionsInfo,
}: PlaceCardProps) {
  const { place, crowd, score, distanceLabel, reason } = recommendation
  const crowdInfo = CROWD_LABEL[crowd.crowdLevel]

  // 카드 자체를 누르면 지도에서 선택되게 한다. 내부에 길찾기 버튼이 있어
  // <button>으로 감쌀 수 없으므로(버튼 안 버튼은 유효하지 않음) role/tabIndex로
  // 키보드 접근을 보장한다 (섹션 33).
  return (
    <Card
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return
        event.preventDefault()
        onSelect()
      }}
      className={`cursor-pointer overflow-hidden text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        selected ? 'border-primary ring-1 ring-primary' : ''
      }`}
    >
      <div
        className="flex h-32 items-center justify-center bg-background text-4xl"
        aria-hidden="true"
      >
        {CATEGORY_EMOJI[place.category]}
      </div>
      <div className="flex flex-col gap-2 p-4">
        <h3 className="font-semibold text-ink">{place.name}</h3>
        <StarRating rating={toStarRating(score)} />
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={crowdInfo.tone}>{crowdInfo.text}</Badge>
          <span className="text-xs text-ink-muted">{distanceLabel}</span>
        </div>
        <p className="text-sm text-ink-muted">{reason}</p>

        <div className="mt-1 flex flex-col gap-1.5">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={(event) => {
                event.stopPropagation()
                onShowDirections('walking')
              }}
            >
              길찾기 (도보)
            </Button>
            <Button
              variant="secondary"
              onClick={(event) => {
                event.stopPropagation()
                onShowDirections('cycling')
              }}
            >
              길찾기 (자전거)
            </Button>
          </div>
          {directionsInfo && <DirectionsResult info={directionsInfo} />}
        </div>
      </div>
    </Card>
  )
}
