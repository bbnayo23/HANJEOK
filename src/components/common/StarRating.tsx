const STAR_COUNT = 5

type StarRatingProps = {
  rating: number
  className?: string
}

// 점수를 별점으로 표시한다. 색상만으로 전달하지 않도록 숫자를 항상 함께
// 보여준다 (섹션 33).
export function StarRating({ rating, className = '' }: StarRatingProps) {
  return (
    <div
      className={`flex items-center gap-1 ${className}`}
      role="img"
      aria-label={`5점 만점에 ${rating.toFixed(1)}점`}
    >
      <span className="flex" aria-hidden="true">
        {Array.from({ length: STAR_COUNT }, (_, index) => {
          const fillRatio = Math.min(1, Math.max(0, rating - index))
          return (
            <span key={index} className="relative inline-block leading-none text-line">
              ★
              {fillRatio > 0 && (
                <span
                  className="absolute inset-0 overflow-hidden text-primary"
                  style={{ width: `${fillRatio * 100}%` }}
                >
                  ★
                </span>
              )}
            </span>
          )
        })}
      </span>
      <span className="text-sm font-semibold text-ink">{rating.toFixed(1)}</span>
    </div>
  )
}
