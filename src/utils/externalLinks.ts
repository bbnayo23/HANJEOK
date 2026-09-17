import type { Landmark } from '../types/landmark'
import type { Place } from '../types/place'

// 우리가 가진 정보(별점·혼잡도·거리)는 추정치라서, 영업시간·메뉴·최신 리뷰처럼
// 확인이 필요한 건 네이버 지도에서 바로 보게 연결한다.
export function naverMapSearchUrl(place: Place, landmark: Landmark): string {
  // 명소 이름의 괄호 부분(예: "안양천 (오목교)")은 검색어로는 방해가 된다.
  const areaHint = landmark.name.replace(/\s*\(.*\)\s*/g, '').trim()
  return `https://map.naver.com/p/search/${encodeURIComponent(`${place.name} ${areaHint}`)}`
}
