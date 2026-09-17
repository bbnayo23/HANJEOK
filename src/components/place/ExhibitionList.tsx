import { Badge } from '../common/Badge'
import { Card } from '../common/Card'
import type { CulturalEvent } from '../../services/api/culturalEvents'

type ExhibitionListProps = {
  exhibitions: CulturalEvent[]
  district: string
}

// 서울시 문화행사 API에서 받아온 "지금 진행 중인 전시"를 보여준다.
// 선택한 지역(자치구)에 있는 게 있으면 그것만, 없으면 서울 전체를 보여주고
// 무엇을 보여주는지 제목에 분명히 적는다.
export function ExhibitionList({ exhibitions, district }: ExhibitionListProps) {
  if (exhibitions.length === 0) return null

  const inDistrict = exhibitions.filter((exhibition) => exhibition.district === district)
  const shown = inDistrict.length > 0 ? inDistrict : exhibitions
  const title = inDistrict.length > 0 ? `${district}에서 지금 하는 전시` : '서울에서 지금 하는 전시'

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      <div className="flex flex-col gap-2">
        {shown.map((exhibition) => (
          <Card key={exhibition.id} className="flex flex-col gap-1 p-3">
            <a
              href={exhibition.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-ink underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {exhibition.title}
            </a>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={exhibition.isFree ? 'success' : 'neutral'}>
                {exhibition.isFree ? '무료' : '유료'}
              </Badge>
              <span className="text-xs text-ink-muted">{exhibition.district}</span>
              <span className="text-xs text-ink-muted">{exhibition.place}</span>
            </div>
            <p className="text-xs text-ink-muted">{exhibition.period}</p>
          </Card>
        ))}
      </div>
      <p className="text-xs text-ink-muted">서울시 문화행사 정보 기준이에요.</p>
    </section>
  )
}
