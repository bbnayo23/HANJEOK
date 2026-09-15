import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { User } from '../types/user'

// 전역으로 필요한 건 "현재 사용자"뿐이다 (섹션 27). 온보딩 위저드 진행 중의
// 임시 선택값은 OnboardingPage의 로컬 state로 두고, 끝났을 때만 여기에 login한다.
type UserState = {
  user: User | null
  login: (user: User) => void
  logout: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    { name: 'hanjeok-user' },
  ),
)
