import type { CrowdLevel } from '../../types/crowd'

// 서울 열린데이터광장 "서울시 실시간 도시데이터"(citydata) API — 서울 주요
// 120여 곳 한정으로 실제 실시간 인구 혼잡도를 제공한다 (Mock이 아니다).
//
// 이 엔드포인트는 HTTPS를 지원하지 않아서 HTTPS로 배포하면 브라우저가 mixed
// content로 막는다. 그래서 브라우저에서 직접 부르지 않고 같은 도메인의 프록시
// (api/seoul)를 거친다. 인증키도 프록시가 붙이므로 여기서는 다루지 않는다.
const PROXY_PATH = '/api/seoul/json/citydata'

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

// areaName은 citydata가 정의한 지역명 문자열과 정확히 같아야 한다 (예:
// "광화문·덕수궁"). 임의로 지어낸 이름을 넣으면 실패한다 — 실제로 그 이름이
// citydata의 목록에 있는지 확인된 곳에만 이 함수를 쓴다.
//
// 인증키가 없거나 응답이 요청한 지역이 아니면 null을 돌려준다 (혼잡도 뱃지만
// 안 보이고 나머지는 정상 동작).
export async function fetchCityCongestion(areaName: string): Promise<CityCongestion | null> {
  const response = await fetch(`${PROXY_PATH}/1/5/${encodeURIComponent(areaName)}`)
  if (!response.ok) return null

  const data = (await response.json()) as CityDataResponse

  // 서버에 인증키가 없으면 sample 키로 떨어지는데, sample 키는 어떤 지역을 요청하든
  // '광화문·덕수궁' 데이터를 돌려준다. 다른 지역의 수치를 이 지역인 척 보여주지
  // 않도록, 응답의 지역명이 요청한 지역과 같을 때만 쓴다.
  if (data.CITYDATA?.AREA_NM !== areaName) return null

  const stats = data.CITYDATA.LIVE_PPLTN_STTS?.[0]
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
