import { AGE_GROUP_OPTIONS } from '../../constants/onboarding'
import { Button } from '../../components/common/Button'
import { Chip } from '../../components/common/Chip'
import type { AgeGroup } from '../../types/user'

// 실제 본인인증 대신 Mock으로 연령대만 선택한다 (섹션 7). 생년월일 등
// 개인정보는 애초에 수집하지 않는다.
type AgeGroupStepProps = {
  value: AgeGroup | null
  onSelect: (ageGroup: AgeGroup) => void
  onNext: () => void
}

export function AgeGroupStep({ value, onSelect, onNext }: AgeGroupStepProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-ink">연령대를 알려주세요</h1>
      <p className="text-ink-muted">서비스 타깃에 맞는 장소를 추천하기 위해서만 사용해요.</p>
      <div className="flex flex-wrap gap-2">
        {AGE_GROUP_OPTIONS.map((option) => (
          <Chip key={option.id} selected={value === option.id} onClick={() => onSelect(option.id)}>
            {option.label}
          </Chip>
        ))}
      </div>
      <Button onClick={onNext} disabled={value === null} className="mt-4 self-start">
        다음
      </Button>
    </div>
  )
}
