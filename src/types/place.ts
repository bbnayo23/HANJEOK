// 숨은 장소 데이터 모델 (섹션 10). 홈의 1차 필터(섹션 22)와 값 범위를 맞춘다.
export type PlaceCategory =
  | 'walk'
  | 'view'
  | 'nature'
  | 'cafe'
  | 'food'
  | 'sunset'
  | 'nightview'

export type Place = {
  id: string
  name: string
  latitude: number
  longitude: number
  category: PlaceCategory
  description: string
  nearbyLandmarkId?: string
  distanceFromLandmark?: number
  scores: {
    quiet: number
    view: number
    accessibility: number
    stay: number
    userRating: number
  }
  facilities: {
    parking: boolean
    restroom: boolean
    bench: boolean
    cafeNearby: boolean
  }
  bestTime?: {
    start: string
    end: string
  }
  // 영업시간 ('HH:MM'). 확인된 곳만 채운다 — 모르면 undefined로 두고, 닫혔다고
  // 단정하지 않는다. 문 닫은 시간에 혼잡도를 보여주지 않기 위해 필요하다.
  openingHours?: {
    open: string
    close: string
  }
  photos: string[]
  reviewCount: number
}
