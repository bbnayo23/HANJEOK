// citydata(서울시 실시간 도시데이터)의 지역명은 정확히 일치해야 동작한다.
// 실제로 존재하는지 확인되지 않은 지역명은 추측해서 넣지 않는다 — 검증된
// 것만 이 표에 추가한다. (경복궁 ↔ 광화문·덕수궁은 바로 옆이라 매칭하고
// 실제 sample 키로 동작을 확인함, 2026-09-16.)
export const LANDMARK_CITYDATA_AREA: Partial<Record<string, string>> = {
  'landmark-gyeongbokgung': '광화문·덕수궁',
}
