// 숨은 장소 데이터 모델 (섹션 10). 홈의 1차 필터(섹션 22)와 값 범위를 맞춘다.
export type PlaceCategory = 'walk' | 'view' | 'nature' | 'cafe' | 'sunset' | 'nightview'

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
  photos: string[]
  reviewCount: number
}
