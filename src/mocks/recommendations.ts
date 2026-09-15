import type { Recommendation } from '../types/recommendation'
import { toWalkingMinutes } from '../utils/geo'
import { resolveCrowd } from '../utils/crowd'
import { MOCK_CROWD_PATTERNS } from './crowd'
import { MOCK_LANDMARKS } from './landmarks'
import { MOCK_PLACES } from './places'

// score/reason은 Phase 3(섹션 14 calculateRecommendationScore)이 실제 계산으로
// 대체하기 전까지 쓰는 목 값이다. 점수만 보여주지 않고 이유를 함께 전달한다 (섹션 38).
const RECOMMENDATION_DETAILS: { placeId: string; score: number; reason: string }[] = [
  {
    placeId: 'place-yeouido-walk',
    score: 91,
    reason: '지금 사람이 많지 않고 걷기 좋은 시간이에요.',
  },
  {
    placeId: 'place-yeouido-sunset',
    score: 87,
    reason: '노을이 물 위에 비치는 시간대라 뷰가 가장 좋아요.',
  },
  {
    placeId: 'place-yeouido-cafe',
    score: 79,
    reason: '자리가 여유 있고 강이 보이는 창가 좌석이 비어 있어요.',
  },
  {
    placeId: 'place-banpo-cafe',
    score: 82,
    reason: '분수 인파와 떨어져 있어 조용히 쉬기 좋아요.',
  },
  {
    placeId: 'place-banpo-nightview',
    score: 84,
    reason: '야경이 좋은 시간이지만 지금은 평소보다 붐벼요.',
  },
  {
    placeId: 'place-mangwon-nature',
    score: 90,
    reason: '평소보다 훨씬 한적하고 습지 산책로가 여유로워요.',
  },
  {
    placeId: 'place-mangwon-walk',
    score: 80,
    reason: '그늘이 있어 걷기 좋고 사람이 적어요.',
  },
  {
    placeId: 'place-ttukseom-view',
    score: 85,
    reason: '시야가 트여 있고 지금 시간대 혼잡도가 보통이에요.',
  },
  {
    placeId: 'place-ttukseom-sunset',
    score: 88,
    reason: '노을 보기 좋은 시간이고 사람은 많지 않아요.',
  },
  {
    placeId: 'place-jamsil-nightview',
    score: 86,
    reason: '야경은 좋지만 지금은 사람이 조금 몰려 있어요.',
  },
  {
    placeId: 'place-jamsil-walk',
    score: 78,
    reason: '평지라 걷기 편하고 지금 한적해요.',
  },
  {
    placeId: 'place-gyeongbokgung-walk',
    score: 84,
    reason: '경복궁 정문 인파와 떨어져 있어 사진 찍기도 걷기도 좋아요.',
  },
  {
    placeId: 'place-bukchon-view',
    score: 86,
    reason: '포토존보다 한적하고 지붕선이 한눈에 보이는 시간이에요.',
  },
  {
    placeId: 'place-ikseondong-cafe',
    score: 79,
    reason: '메인 골목보다 줄이 짧고 지금 자리가 여유 있어요.',
  },
  {
    placeId: 'place-seongsu-cafe',
    score: 83,
    reason: '카페거리 대로변보다 한적하고 원두 향이 좋은 시간이에요.',
  },
  {
    placeId: 'place-hongdae-walk',
    score: 76,
    reason: '번화가 소음에서 벗어나 조용히 걷기 좋아요.',
  },
  {
    placeId: 'place-yeonnamdong-cafe',
    score: 82,
    reason: '숲길 메인 라인보다 한적하고 정원이 예쁜 시간이에요.',
  },
  {
    placeId: 'place-itaewon-sunset',
    score: 88,
    reason: '노을 보기 좋은 시간이라 데이트 코스로도 좋아요.',
  },
  {
    placeId: 'place-itaewon-nightview',
    score: 85,
    reason: '남산과 도심 야경이 동시에 보이고 아직 사람이 적어요.',
  },
  {
    placeId: 'place-namsan-view',
    score: 84,
    reason: '전망대 줄을 서지 않고도 비슷한 뷰를 볼 수 있는 시간이에요.',
  },
  {
    placeId: 'place-namsan-nightview',
    score: 89,
    reason: '야경 보기 좋은 시간이고 케이블카 인파와는 떨어져 있어요.',
  },
  {
    placeId: 'place-seoulforest-nature',
    score: 88,
    reason: '메인 광장보다 한적하고 지금 산책하기 좋은 시간이에요.',
  },
  {
    placeId: 'place-insadong-walk',
    score: 81,
    reason: '쇼핑거리보다 한적하고 갤러리 구경하기 좋은 시간이에요.',
  },
]

function toDistanceLabel(landmarkName: string, distanceFromLandmark: number) {
  return `${landmarkName}에서 도보 ${toWalkingMinutes(distanceFromLandmark)}분`
}

// 실제 센서 데이터 없이도 호출 시점(now)에 따라 혼잡도가 달라지도록 매번 새로
// 계산한다 (섹션 12, 13). fetchRecommendations가 이 함수를 호출 때마다
// new Date()를 넘기므로, 새로고침하거나 시간이 지나면 값이 바뀐다.
export function buildRecommendations(now: Date): Recommendation[] {
  return RECOMMENDATION_DETAILS.map((detail) => {
    const place = MOCK_PLACES.find((item) => item.id === detail.placeId)
    if (!place) throw new Error(`place not found: ${detail.placeId}`)

    const landmark = MOCK_LANDMARKS.find((item) => item.id === place.nearbyLandmarkId)
    if (!landmark) throw new Error(`landmark not found: ${place.nearbyLandmarkId}`)

    const pattern = MOCK_CROWD_PATTERNS.find((item) => item.placeId === place.id)
    if (!pattern) throw new Error(`crowd pattern not found: ${place.id}`)

    return {
      place,
      landmark,
      crowd: resolveCrowd(pattern, now),
      score: detail.score,
      distanceLabel: toDistanceLabel(landmark.name, place.distanceFromLandmark ?? 0),
      reason: detail.reason,
    }
  })
}
