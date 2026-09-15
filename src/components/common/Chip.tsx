import type { ButtonHTMLAttributes } from 'react'

// 취향 선택(온보딩)의 다중 선택 태그, 홈의 단일 선택 필터 탭에 공용으로 쓴다.
type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  selected: boolean
}

export function Chip({ selected, type = 'button', className = '', ...props }: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        selected
          ? 'border-primary bg-primary text-white'
          : 'border-line bg-surface text-ink hover:bg-background'
      } ${className}`}
      {...props}
    />
  )
}
