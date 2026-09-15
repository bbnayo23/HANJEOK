import { createBrowserRouter, redirect } from 'react-router-dom'

import { HomePage } from '../../pages/home/HomePage'
import { OnboardingPage } from '../../pages/onboarding/OnboardingPage'
import { useUserStore } from '../../store/userStore'

export const router = createBrowserRouter([
  {
    path: '/',
    // 온보딩(취향 선택)을 아직 안 끝냈으면 홈 대신 온보딩으로 보낸다.
    loader: () => (useUserStore.getState().user ? null : redirect('/onboarding')),
    element: <HomePage />,
  },
  {
    path: '/onboarding',
    element: <OnboardingPage />,
  },
])
