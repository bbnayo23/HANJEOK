import { useQuery } from '@tanstack/react-query'

import { fetchLandmarks } from '../../../services/api/landmarks'

export function useLandmarks() {
  return useQuery({
    queryKey: ['landmarks'],
    queryFn: fetchLandmarks,
  })
}
