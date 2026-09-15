import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

// 서버 상태는 전부 TanStack Query가 들고 있는다 (섹션 27). 클라이언트 UI 상태는
// Zustand 스토어를 필요해지는 시점(취향 필터, 지도 상태 등)에 store/ 아래에 추가한다.
const queryClient = new QueryClient()

export function AppProviders({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
