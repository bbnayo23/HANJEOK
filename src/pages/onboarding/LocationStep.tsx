import { Button } from '../../components/common/Button'
import { getCurrentLocation } from '../../services/map/geolocation'
import { useLocationStore } from '../../store/locationStore'

// 위치 권한은 여기서 한 번만 요청한다. 허용/거부/미지원 어떤 경우든
// 서비스 이용을 막지 않고 홈으로 넘어간다 (섹션 23). 실제 좌표는 locationStore에
// 저장해서 홈/지도에서 지도 중심과 거리 계산에 쓴다.
type LocationStepProps = {
  onFinish: () => void
}

export function LocationStep({ onFinish }: LocationStepProps) {
  const setCoords = useLocationStore((state) => state.setCoords)
  const setStatus = useLocationStore((state) => state.setStatus)

  const requestLocation = () => {
    getCurrentLocation()
      .then(setCoords)
      .catch((error: Error) => setStatus(error.message === 'unsupported' ? 'unsupported' : 'denied'))
      .finally(onFinish)
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-ink">내 주변 숨은 장소를 찾아볼까요?</h1>
      <p className="text-ink-muted">
        위치 권한을 허용하면 지금 계신 곳 근처부터 추천해드려요. 거부해도 지역을 직접 선택해서
        이용할 수 있어요.
      </p>
      <div className="mt-4 flex gap-2">
        <Button onClick={requestLocation}>위치 권한 허용</Button>
        <Button variant="secondary" onClick={onFinish}>
          나중에 할게요
        </Button>
      </div>
    </div>
  )
}
