import type { CrowdData, CrowdLevel, CrowdPattern } from '../types/crowd'

const LOW_THRESHOLD = 35
const MEDIUM_THRESHOLD = 65

function toCrowdLevel(value: number): CrowdLevel {
  if (value < LOW_THRESHOLD) return 'low'
  if (value < MEDIUM_THRESHOLD) return 'medium'
  return 'high'
}

function averageOf(pattern: CrowdPattern) {
  const values = [
    pattern.weekdayMorning,
    pattern.weekdayAfternoon,
    pattern.weekdayEvening,
    pattern.weekendMorning,
    pattern.weekendAfternoon,
    pattern.weekendEvening,
  ]
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

// 실제 센서 없이 "지금이 평일/주말 중 언제인지"로 패턴에서 값을 골라 혼잡도를
// 계산한다 (섹션 12, 13). 호출 시점의 Date를 넘기면 매번 다른 결과가 나오므로
// 새로고침하거나 시간이 지나면 값이 바뀐다 (실시간 센서 없이 실시간처럼 보이게).
export function resolveCrowd(pattern: CrowdPattern, now: Date): CrowdData {
  const day = now.getDay()
  const hour = now.getHours()
  const isWeekend = day === 0 || day === 6
  const isMorning = hour >= 6 && hour < 11
  const isAfternoon = hour >= 11 && hour < 17

  const population = isWeekend
    ? isMorning
      ? pattern.weekendMorning
      : isAfternoon
        ? pattern.weekendAfternoon
        : pattern.weekendEvening
    : isMorning
      ? pattern.weekdayMorning
      : isAfternoon
        ? pattern.weekdayAfternoon
        : pattern.weekdayEvening

  const average = averageOf(pattern)
  const comparedToAverage = average === 0 ? 0 : Math.round(((population - average) / average) * 100)

  return {
    placeId: pattern.placeId,
    timestamp: now.toISOString(),
    population,
    crowdLevel: toCrowdLevel(population),
    comparedToAverage,
  }
}
