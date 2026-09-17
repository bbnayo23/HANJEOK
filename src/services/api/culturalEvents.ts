// 서울시 문화행사 정보 API (culturalEventInfo). 서울 전역 전시·공연·축제를
// 제공하며, 우리가 지어낸 데이터가 아니라 서울시가 관리하는 실제 행사 목록이다.
//
// 주의 사항:
//  - citydata와 마찬가지로 HTTPS를 지원하지 않는다 (배포 시 프록시 필요).
//  - 인증키가 없으면 sample 키로 최대 5건만 조회된다. 실제 키를 넣으면 더 받는다.
//  - 상업 팝업스토어는 이 API에 없다 (서울시가 등록·관리하는 문화행사만 포함).
//  - 경로의 날짜 파라미터는 분류를 함께 넘길 때만 동작하고, 그마저도 "그 날짜에
//    진행 중"을 정확히 보장하지 않는다. 그래서 시작/종료일로 한 번 더 거른다.
const API_HOST = 'http://openapi.seoul.go.kr:8088'
const SAMPLE_MAX_ROWS = 5
const MAX_ROWS = 100
const EXHIBITION_CATEGORY = '전시/미술'

export type CulturalEvent = {
  id: string
  title: string
  category: string
  district: string
  place: string
  period: string
  isFree: boolean
  linkUrl: string
}

type CulturalEventRow = {
  CODENAME: string
  GUNAME: string
  TITLE: string
  DATE: string
  PLACE: string
  HMPG_ADDR: string
  IS_FREE: string
  STRTDATE: string
  END_DATE: string
}

type CulturalEventResponse = {
  culturalEventInfo?: {
    RESULT?: { CODE: string }
    row?: CulturalEventRow[]
  }
}

function resolveApiKey(): { key: string; maxRows: number } {
  const configuredKey = import.meta.env.VITE_SEOUL_CITYDATA_KEY
  return configuredKey
    ? { key: configuredKey, maxRows: MAX_ROWS }
    : { key: 'sample', maxRows: SAMPLE_MAX_ROWS }
}

function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function isRunningNow(row: CulturalEventRow, now: Date): boolean {
  const start = new Date(row.STRTDATE)
  const end = new Date(row.END_DATE)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false
  // 종료일은 그날 하루를 포함한다.
  end.setHours(23, 59, 59, 999)
  return start <= now && now <= end
}

// 오늘 실제로 진행 중인 전시만 돌려준다. 자치구 필터는 호출하는 쪽에서 한다
// (샘플 키로는 5건뿐이라 구 단위로 거르면 대부분 0건이 되기 때문).
export async function fetchCurrentExhibitions(now: Date): Promise<CulturalEvent[]> {
  const { key, maxRows } = resolveApiKey()
  const category = encodeURIComponent(EXHIBITION_CATEGORY)
  const url = `${API_HOST}/${key}/json/culturalEventInfo/1/${maxRows}/${category}//${toIsoDate(now)}`

  const response = await fetch(url)
  if (!response.ok) return []

  const data = (await response.json()) as CulturalEventResponse
  const rows = data.culturalEventInfo?.row
  if (!rows) return []

  return rows
    .filter((row) => isRunningNow(row, now))
    .map((row) => ({
      id: row.HMPG_ADDR,
      title: row.TITLE,
      category: row.CODENAME,
      district: row.GUNAME,
      place: row.PLACE,
      period: row.DATE,
      isFree: row.IS_FREE === '무료',
      linkUrl: row.HMPG_ADDR,
    }))
}
