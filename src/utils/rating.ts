// 추천 점수(0~100)를 별점(0~5, 0.5 단위)으로 변환한다. UI에는 항상 이 별점을
// 보여주고, 0~100 원점수는 내부 계산에만 쓴다.
export function toStarRating(score: number): number {
  const clamped = Math.min(100, Math.max(0, score))
  return Math.round((clamped / 20) * 2) / 2
}
