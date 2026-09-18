import type { Recommendation } from '../types/recommendation'
import { haversineDistanceMeters, toWalkingMinutes } from '../utils/geo'
import { resolveCrowd } from '../utils/crowd'
import { MOCK_CROWD_PATTERNS } from './crowd'
import { MOCK_LANDMARKS } from './landmarks'
import { MOCK_PLACES } from './places'

// 이 거리 안이면 명소 부지 안에 있는 것으로 본다.
const INSIDE_LANDMARK_METERS = 150

// score/reason은 Phase 3(섹션 14 calculateRecommendationScore)이 실제 계산으로
// 대체하기 전까지 쓰는 값이다. 점수만 보여주지 않고 이유를 함께 전달한다 (섹션 38).
//
// 주의: score는 네이버/구글의 검증된 평점이 아니다. 공개된 매거진·블로그에서
// 얼마나 일관되게 추천되는지를 기준으로 매긴 값이며, UI에서는 5점 만점 별점으로
// 환산해 보여준다.
const RECOMMENDATION_DETAILS: { placeId: string; score: number; reason: string }[] = [
  {
    placeId: 'place-yeouido-cafe',
    score: 88,
    reason: '한강뷰에 숲뷰까지 같이 보이고, 혼자 책 읽기 좋은 자리가 많아요.',
  },
  {
    placeId: 'place-banpo-cafe',
    score: 84,
    reason: '분수 보러 몰린 인파에서 한 발 떨어져 앉을 수 있어요.',
  },
  {
    placeId: 'place-jamwon-cafe',
    score: 90,
    reason: '한강 위에 떠 있는 듯한 자리라 노을 시간에 특히 좋아요.',
  },
  {
    placeId: 'place-mangwon-cafe',
    score: 86,
    reason: '망원 주택가 골목이라 카페거리 대로변보다 훨씬 조용해요.',
  },
  {
    placeId: 'place-yanghwa-cafe',
    score: 85,
    reason: '간판이 작아 모르면 지나치는 3층 카페, 지금도 자리가 여유로워요.',
  },
  {
    placeId: 'place-hongdae-cafe',
    score: 83,
    reason: '홍대 번화가 소음에서 벗어나 테라스에 앉기 좋아요.',
  },
  {
    placeId: 'place-yeonnamdong-cafe',
    score: 85,
    reason: '숲길 메인 라인보다 한적하고, 층마다 분위기가 달라요.',
  },
  {
    placeId: 'place-seongsu-cafe',
    score: 87,
    reason: '성수 뒷골목에 숨어 있어 대로변 웨이팅 없이 커피를 마실 수 있어요.',
  },
  {
    placeId: 'place-seongsu-cafe2',
    score: 86,
    reason: '골목 안쪽이라 조용하고, 디저트가 특히 좋다는 평이 많아요.',
  },
  {
    placeId: 'place-seoulforest-cafe',
    score: 89,
    reason: '숲을 보면서 스페셜티 커피를 마실 수 있는 자리예요.',
  },
  {
    placeId: 'place-seoulforest-bakery',
    score: 88,
    reason: '메인 광장에서 한 블록 벗어나 있어 붐빔이 덜해요.',
  },
  {
    placeId: 'place-itaewon-view',
    score: 87,
    reason: '신흥시장 안쪽이라 이태원 대로보다 조용하고, 창 밖 전망이 시원해요.',
  },
  {
    placeId: 'place-namsan-cafe',
    score: 85,
    reason: '소월로 오르막 중간이라 남산 관광 인파와 동선이 겹치지 않아요.',
  },
  {
    placeId: 'place-namsan-view',
    score: 86,
    reason: '케이블카 줄과 떨어져서 남산타워 뷰를 볼 수 있어요.',
  },
  {
    placeId: 'place-gyeongbokgung-view',
    score: 88,
    reason: '경복궁 정문 인파를 피해 루프탑에서 기와지붕을 내려다볼 수 있어요.',
  },
  {
    placeId: 'place-ikseondong-tea',
    score: 87,
    reason: '익선동이 핫플이 되기 전부터 자리를 지켜온 찻집이에요.',
  },
  {
    placeId: 'place-bukchon-cafe',
    score: 85,
    reason: '한옥마을 포토존 인파에서 벗어나 테라스에 앉기 좋아요.',
  },
  {
    placeId: 'place-seonyudo-cafe',
    score: 84,
    reason: '커피 마시고 바로 선유도공원을 산책하기 좋은 위치예요.',
  },
  {
    placeId: 'place-nanji-cafe',
    score: 84,
    reason: '난지 선상카페라 강 위에서 노을을 보며 쉴 수 있어요.',
  },
  {
    placeId: 'place-jamsil-cafe',
    score: 84,
    reason: '석촌호수 산책로 옆이라 롯데월드 인파에서 비켜나 있어요.',
  },
  {
    placeId: 'place-gwangnaru-cafe',
    score: 85,
    reason: '천호 골목 3층이라 조용하고, 분위기가 특히 좋다는 평이 많아요.',
  },
  {
    placeId: 'place-gwangnaru-cafe2',
    score: 86,
    reason: '커피 애호가들 사이에서 알려진 골목 스페셜티 카페예요.',
  },
  {
    placeId: 'place-anyangcheon-bakery',
    score: 85,
    reason: '빵을 사서 바로 안양천 산책로로 걸어나가기 좋아요.',
  },
  {
    placeId: 'place-ttukseom-cafe',
    score: 85,
    reason: '한강공원 매점 인파에서 벗어나 골목에서 조용히 쉴 수 있어요.',
  },
  {
    placeId: 'place-mangwon-bakery',
    score: 86,
    reason: '빵이 갓 나오는 시간대라 향이 좋고, 망원시장 쪽보다 한적해요.',
  },
  {
    placeId: 'place-seongsu-cafe3',
    score: 87,
    reason: '마당이 있어 카페거리 한복판보다 훨씬 여유롭게 앉아 있을 수 있어요.',
  },
  {
    placeId: 'place-itaewon-rooftop',
    score: 86,
    reason: '이태원 대로 대신 언덕 위 루프탑에서 조용히 뷰를 볼 수 있어요.',
  },
  {
    placeId: 'place-seoulforest-nightview',
    score: 88,
    reason: '남산·63빌딩 같은 유명 야경 명소보다 한적하게 한강 야경을 볼 수 있어요.',
  },
  {
    placeId: 'place-insadong-walk',
    score: 87,
    reason: '인사동 쇼핑거리 인파에서 벗어나 성곽길을 따라 조용히 걷기 좋아요.',
  },
  {
    placeId: 'place-sindorim-cafe',
    score: 84,
    reason: '신도림 대로변 프랜차이즈와 달리 조용히 앉아 있을 수 있어요.',
  },
  {
    placeId: 'place-sindorim-coffee',
    score: 74,
    reason: '역 앞 프랜차이즈 대신 골목 안 개인 로스터리예요. 아직 다녀와 확인하진 못했어요.',
  },
  {
    placeId: 'place-sindorim-gyudon',
    score: 72,
    reason: '혼자 한 그릇 먹고 나오기 좋은 자리예요. 점심시간은 붐빌 수 있어요.',
  },
  {
    placeId: 'place-guro-coffee',
    score: 72,
    reason: '단지 커피는 대부분 체인인데, 여긴 골목 안 개인 카페예요.',
  },
  {
    placeId: 'place-guro-hansik',
    score: 72,
    reason: '역 앞 체인 밀집 구간에서 한 블록 들어간 한식당이에요.',
  },
  {
    placeId: 'place-gasan-coffee',
    score: 72,
    reason: '지식산업센터 1층 프랜차이즈를 피해 걸어갈 만한 개인 커피집이에요.',
  },
  {
    placeId: 'place-gasan-katsu',
    score: 74,
    reason: '단지 한복판 점심 줄에서 조금 비켜난 위치라 대기가 덜해요.',
  },
]

// 실제 센서 데이터 없이도 호출 시점(now)에 따라 혼잡도가 달라지도록 매번 새로
// 계산한다 (섹션 12, 13). fetchRecommendations가 이 함수를 호출할 때마다
// new Date()를 넘기므로, 새로고침하거나 시간이 지나면 값이 바뀐다.
export function buildRecommendations(now: Date): Recommendation[] {
  return RECOMMENDATION_DETAILS.map((detail) => {
    const place = MOCK_PLACES.find((item) => item.id === detail.placeId)
    if (!place) throw new Error(`place not found: ${detail.placeId}`)

    const landmark = MOCK_LANDMARKS.find((item) => item.id === place.nearbyLandmarkId)
    if (!landmark) throw new Error(`landmark not found: ${place.nearbyLandmarkId}`)

    const pattern = MOCK_CROWD_PATTERNS.find((item) => item.placeId === place.id)
    if (!pattern) throw new Error(`crowd pattern not found: ${place.id}`)

    // 거리는 실제 좌표에서 계산한다 — 손으로 적어 넣은 값을 쓰지 않는다.
    // 명소 부지 안에 있는 곳(한강공원 안 카페 등)은 "도보 1분"이라고 하면
    // 어색하므로 다르게 표시한다.
    const distanceMeters = haversineDistanceMeters(place, landmark)
    const distanceLabel =
      distanceMeters < INSIDE_LANDMARK_METERS
        ? `${landmark.name} 안에 있어요`
        : `${landmark.name}에서 도보 ${toWalkingMinutes(distanceMeters)}분`

    return {
      place,
      landmark,
      crowd: resolveCrowd(pattern, now),
      score: detail.score,
      distanceLabel,
      reason: detail.reason,
    }
  })
}
