import { create } from 'zustand'

import type { Coordinates } from '../utils/geo'

// 내 위치 (섹션 27 "현재 위치"). 온보딩 LocationStep에서 한 번 요청해 저장하고,
// 홈/지도에서 지도 중심과 거리 계산의 기준으로 쓴다. 기기 상태라 persist하지
// 않는다 — 세션마다 새로 물어본다.
type LocationStatus = 'idle' | 'granted' | 'denied' | 'unsupported'

type LocationState = {
  coords: Coordinates | null
  status: LocationStatus
  setCoords: (coords: Coordinates) => void
  setStatus: (status: LocationStatus) => void
}

export const useLocationStore = create<LocationState>()((set) => ({
  coords: null,
  status: 'idle',
  setCoords: (coords) => set({ coords, status: 'granted' }),
  setStatus: (status) => set({ status }),
}))
