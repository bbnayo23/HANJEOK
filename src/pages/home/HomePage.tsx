import { useNavigate } from 'react-router-dom'

import { Button } from '../../components/common/Button'
import { AGE_GROUP_OPTIONS, PREFERENCE_OPTIONS } from '../../constants/onboarding'
import { useUserStore } from '../../store/userStore'

// 홈 화면은 다음 단계에서 만든다. 지금은 온보딩이 실제로 유저를 저장하는지
// 눈으로 확인할 수 있는 자리만 둔다.
export function HomePage() {
  const navigate = useNavigate()
  const user = useUserStore((state) => state.user)
  const logout = useUserStore((state) => state.logout)

  if (!user) return null

  const ageGroupLabel = AGE_GROUP_OPTIONS.find((option) => option.id === user.ageGroup)?.label
  const preferenceLabels = user.preferences
    .map((preference) => PREFERENCE_OPTIONS.find((option) => option.id === preference)?.label)
    .filter(Boolean)
    .join(', ')

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-background px-6 text-center">
      <p className="text-ink-muted">홈 화면 준비 중</p>
      <p className="text-sm text-ink-muted">
        {ageGroupLabel} · {preferenceLabels || '선택한 취향 없음'}
      </p>
      <Button
        variant="secondary"
        onClick={() => {
          logout()
          navigate('/onboarding', { replace: true })
        }}
      >
        온보딩 다시 하기
      </Button>
    </main>
  )
}
