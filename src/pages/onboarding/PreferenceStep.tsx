import { PREFERENCE_OPTIONS } from '../../constants/onboarding'
import { Button } from '../../components/common/Button'
import { Chip } from '../../components/common/Chip'
import type { Preference } from '../../types/user'

type PreferenceStepProps = {
  selected: Preference[]
  onToggle: (preference: Preference) => void
  onNext: () => void
}

export function PreferenceStep({ selected, onToggle, onNext }: PreferenceStepProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-ink">어떤 곳을 좋아하세요?</h1>
      <p className="text-ink-muted">고른 취향은 추천 점수에 반영돼요. 여러 개 선택할 수 있어요.</p>
      <div className="flex flex-wrap gap-2">
        {PREFERENCE_OPTIONS.map((option) => (
          <Chip
            key={option.id}
            selected={selected.includes(option.id)}
            onClick={() => onToggle(option.id)}
          >
            {option.label}
          </Chip>
        ))}
      </div>
      <Button onClick={onNext} disabled={selected.length === 0} className="mt-4 self-start">
        다음
      </Button>
    </div>
  )
}
