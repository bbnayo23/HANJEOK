import { Button } from '../../components/common/Button'

type IntroStepProps = {
  onNext: () => void
}

export function IntroStep({ onNext }: IntroStepProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-medium text-primary">HANJEOK</p>
      <h1 className="text-2xl font-semibold text-ink">지금 가기 좋은 곳을 찾아주는 지도</h1>
      <p className="text-ink-muted">
        유명한 대표 명소 대신, 그 주변에서 상대적으로 한적하고 방문 가치가 높은 장소를 찾아
        추천해드려요.
      </p>
      <Button onClick={onNext} className="mt-4 self-start">
        시작하기
      </Button>
    </div>
  )
}
