import type { CrowdLevel } from '../../types/crowd'

// 서울 열린데이터광장 "서울시 실시간 도시데이터"(citydata) API — 서울 주요
// 120여 곳 한정으로 실제 실시간 인구 혼잡도를 제공한다 (Mock이 아니다).
// 주의: 이 엔드포인트는 HTTPS를 지원하지 않는다. 로컬 개발(http://localhost)
// 에서는 문제없지만, 앱을 HTTPS로 배포하면 브라우저가 mixed content로 막는다 —
// 그때는 서버 프록시가 필요하다 (Phase 5 이후).
const API_HOST = 'http://openapi.seoul.go.kr:8088'

// 인증키 없이도 "광화문·덕수궁" 한 곳만은 공식 문서의 sample 키로 조회된다는
// 것을 확인했다. 다른 지역명은 실제 인증키가 있어야 한다.
const SAMPLE_ONLY_AREA_NAME = '광화문·덕수궁'

const CONGEST_LEVEL_MAP: Record<string, CrowdLevel> = {
  여유: 'low',
  보통: 'medium',
  '약간 붐빔': 'high',
  붐빔: 'high',
}

export type CityCongestion = {
  areaName: string
  level: CrowdLevel
  message: string
  populationMin: number
  populationMax: number
  updatedAt: string
}

type CityDataResponse = {
  RESULT?: { 'RESULT.CODE': string }
  CITYDATA?: {
    AREA_NM: string
    LIVE_PPLTN_STTS?: {
      AREA_CONGEST_LVL: string
      AREA_CONGEST_MSG: string
      AREA_PPLTN_MIN: string
      AREA_PPLTN_MAX: string
      PPLTN_TIME: string
    }[]
  }
}

function resolveApiKey(areaName: string): string | null {
  const configuredKey = import.meta.env.VITE_SEOUL_CITYDATA_KEY as string | undefined
  if (configuredKey) return configuredKey
  return areaName === SAMPLE_ONLY_AREA_NAME ? 'sample' : null
}

// areaName은 citydata가 정의한 지역명 문자열과 정확히 같아야 한다 (예:
// "광화문·덕수궁"). 임의로 지어낸 이름을 넣으면 실패한다 — 실제로 그 이름이
// citydata의 목록에 있는지 확인된 곳에만 이 함수를 쓴다.
export async function fetchCityCongestion(areaName: string): Promise<CityCongestion | null> {
  const key = resolveApiKey(areaName)
  if (!key) return null

  const url = `${API_HOST}/${key}/json/citydata/1/5/${encodeURIComponent(areaName)}`

  const response = await fetch(url)
  if (!response.ok) return null

  const data = (await response.json()) as CityDataResponse
  const stats = data.CITYDATA?.LIVE_PPLTN_STTS?.[0]
  if (!stats) return null

  return {
    areaName,
    level: CONGEST_LEVEL_MAP[stats.AREA_CONGEST_LVL] ?? 'medium',
    message: stats.AREA_CONGEST_MSG,
    populationMin: Number(stats.AREA_PPLTN_MIN),
    populationMax: Number(stats.AREA_PPLTN_MAX),
    updatedAt: stats.PPLTN_TIME,
  }
}
