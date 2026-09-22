// citydata(서울시 실시간 도시데이터)의 지역명은 정확히 일치해야 동작한다.
// 실제로 존재하는지 확인되지 않은 지역명은 추측해서 넣지 않는다 — 검증된
// 것만 이 표에 추가한다.
//
// 아래 24개는 발급받은 인증키로 citydata 엔드포인트를 직접 호출해 응답이
// 오는 것을 확인한 이름이다 (2026-09-18). 이름이 목록에 없으면 API가 조용히
// ERROR-500을 주므로, 매핑을 추가할 때는 반드시 호출해서 확인한다.
//
// 선유도공원은 서울시 주요 121장소 목록에 없어 매핑하지 않는다. 매핑이 없는
// 명소는 useCityCongestion이 비활성 상태로 두고, 장소별 시간대 패턴만 쓴다.
//
// 주의: 경복궁을 실제 지역명 '경복궁'으로 바꾸면서, 인증키 없이 동작하던 sample
// 키 경로('광화문·덕수궁')에 걸리는 명소가 없어졌다. 이제 실시간 혼잡도를 보려면
// 인증키가 있어야 한다 — 개발은 .env.local의 SEOUL_CITYDATA_KEY, 배포는 Vercel
// 환경변수에 넣는다 (없으면 뱃지만 안 보이고 나머지는 정상 동작).
export const LANDMARK_CITYDATA_AREA: Partial<Record<string, string>> = {
  'landmark-yeouido': '여의도',
  'landmark-banpo': '반포한강공원',
  'landmark-mangwon': '망원한강공원',
  'landmark-ttukseom': '뚝섬한강공원',
  'landmark-jamsil': '잠실한강공원',
  'landmark-yanghwa': '양화한강공원',
  'landmark-nanji': '난지한강공원',
  'landmark-ichon': '이촌한강공원',
  'landmark-jamwon': '잠원한강공원',
  'landmark-gwangnaru': '광나루한강공원',
  'landmark-gyeongbokgung': '경복궁',
  'landmark-bukchon': '북촌한옥마을',
  'landmark-ikseondong': '익선동',
  'landmark-seongsu': '성수카페거리',
  'landmark-hongdae': '홍대입구역(2호선)',
  'landmark-yeonnamdong': '연남동',
  'landmark-itaewon': '이태원 관광특구',
  'landmark-namsan': '남산공원',
  'landmark-seoulforest': '서울숲공원',
  'landmark-insadong': '인사동',
  'landmark-anyangcheon': '안양천',
  'landmark-sindorim': '신도림역',
  'landmark-gurodigital': '구로디지털단지역',
  'landmark-gasandigital': '가산디지털단지역',
}
