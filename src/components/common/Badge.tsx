import type { HTMLAttributes } from 'react'

// 혼잡도/점수 표시용 텍스트 배지. 색상만으로 상태를 전달하지 않도록
// 항상 텍스트(children)를 함께 넣어서 쓴다 (섹션 9, 33).
type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone
}

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: 'bg-background text-ink-muted',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
}

export function Badge({ tone = 'neutral', className = '', ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${TONE_CLASSES[tone]} ${className}`}
      {...props}
    />
  )
}
