import type { Coordinates } from '../../utils/geo'

export type GeolocationFailure = 'denied' | 'unsupported'

// 브라우저 Geolocation API를 얇게 감싼다. 이 함수는 저장소(store)를 모르고,
// 호출하는 쪽(LocationStep, HomePage)이 결과를 locationStore에 반영한다.
export function getCurrentLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('unsupported' satisfies GeolocationFailure))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude })
      },
      () => {
        reject(new Error('denied' satisfies GeolocationFailure))
      },
    )
  })
}
