import { create } from 'zustand'

// 선택 지역(대표 명소) (섹션 27 "선택 지역"). 홈과 지도 화면이 함께 쓸 상태라
// 처음부터 Zustand에 둔다.
type ExploreState = {
  selectedLandmarkId: string | null
  setSelectedLandmarkId: (landmarkId: string) => void
}

export const useExploreStore = create<ExploreState>()((set) => ({
  selectedLandmarkId: null,
  setSelectedLandmarkId: (landmarkId) => set({ selectedLandmarkId: landmarkId }),
}))
