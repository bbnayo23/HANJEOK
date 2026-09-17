// 대표 명소 (섹션 11). MVP는 서울 인근으로 한정한다 (섹션 2).
export type Landmark = {
  id: string
  name: string
  latitude: number
  longitude: number
  category: string
  // 서울시 문화행사 API가 자치구 단위로 조회되므로 함께 들고 있는다.
  district: string
}
