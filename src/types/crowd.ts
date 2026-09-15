// 장소별 현재 혼잡도 (섹션 12). 고정값이 아니라 시점마다 달라지는 데이터라
// timestamp를 함께 둔다.
export type CrowdLevel = 'low' | 'medium' | 'high'

export type CrowdData = {
  placeId: string
  timestamp: string
  population: number
  crowdLevel: CrowdLevel
  comparedToAverage?: number
}

// 시간대별 혼잡도 패턴 (섹션 13). 실제 센서 데이터 없이도 "지금 몇 시인지"에
// 따라 CrowdData를 매번 새로 계산해서 실시간처럼 보이게 한다 (resolveCrowd).
export type CrowdPattern = {
  placeId: string
  weekdayMorning: number
  weekdayAfternoon: number
  weekdayEvening: number
  weekendMorning: number
  weekendAfternoon: number
  weekendEvening: number
}
