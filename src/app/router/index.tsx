import { createBrowserRouter, redirect } from 'react-router-dom'

import { HomePage } from '../../pages/home/HomePage'
import { OnboardingPage } from '../../pages/onboarding/OnboardingPage'
import { PlaceDetailPage } from '../../pages/place/PlaceDetailPage'
import { useUserStore } from '../../store/userStore'

// 온보딩(취향 선택)을 아직 안 끝냈으면 온보딩으로 보낸다.
const requireUser = () => (useUserStore.getState().user ? null : redirect('/onboarding'))

export const router = createBrowserRouter([
  {
    path: '/',
    loader: requireUser,
    element: <HomePage />,
  },
  {
    path: '/place/:placeId',
    loader: requireUser,
    element: <PlaceDetailPage />,
  },
  {
    path: '/onboarding',
    element: <OnboardingPage />,
  },
])
