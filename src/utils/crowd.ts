import type { CrowdData, CrowdLevel, CrowdPattern } from '../types/crowd'
import type { Place } from '../types/place'

const LOW_THRESHOLD = 35
const MEDIUM_THRESHOLD = 65

// 패턴은 아침/낮/저녁 세 칸뿐이라 실질적으로 06:00~23:00만 덮는다. 그 밖의
// 시간(심야)은 근거가 되는 값이 아예 없으므로 저녁 값을 재사용하지 않는다 —
// 예전에는 새벽 4시가 저녁 7시와 같은 혼잡도로 나왔다.
const PATTERN_START_HOUR = 6
const PATTERN_END_HOUR = 23

function toMinutes(time: string): number {
  const [hour, minute] = time.split(':').map(Number)
  return hour * 60 + minute
}

// 영업시간을 모르는 곳은 판단을 미루고 열려 있다고 본다 (닫혔다고 단정해
// 숨기면, 확인 안 된 곳이 전부 사라진다).
export function isOpenNow(place: Pick<Place, 'openingHours'>, now: Date): boolean {
  const hours = place.openingHours
  if (!hours) return true

  const minutes = now.getHours() * 60 + now.getMinutes()
  const open = toMinutes(hours.open)
  const close = toMinutes(hours.close)
  // 자정을 넘겨 영업하는 곳은 close가 24:00을 넘는 값으로 들어온다 (예: 26:00).
  return close > 24 * 60
    ? minutes >= open || minutes < close - 24 * 60
    : minutes >= open && minutes < close
}

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
export function resolveCrowd(
  pattern: CrowdPattern,
  now: Date,
  place?: Pick<Place, 'openingHours'>,
): CrowdData | null {
  const day = now.getDay()
  const hour = now.getHours()

  // 패턴이 덮지 않는 시간대이거나 문을 닫은 동안에는 혼잡도를 만들어내지 않는다.
  if (hour < PATTERN_START_HOUR || hour >= PATTERN_END_HOUR) return null
  if (place && !isOpenNow(place, now)) return null
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
