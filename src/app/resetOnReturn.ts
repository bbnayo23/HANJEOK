// 앱을 백그라운드로 보냈다가 한참 뒤에 다시 열면, 보던 상세 페이지나 골라둔 지역이
// 그대로 떠 있는 대신 홈부터 새로 시작한다.
//
// 페이지를 통째로 새로고침하는 이유: 라우트와 스토어만 되돌려도 각 화면의 로컬
// state(취향 필터, 길찾기 경로)와 캐시된 실시간 데이터가 남는다. 새로고침하면 앱을
// 처음 켠 것과 완전히 같은 상태가 되고, 로딩 화면도 다시 보여서 "다시 켰다"는
// 느낌이 난다. 온보딩 정보는 localStorage에 있으므로 그대로 유지된다.
//
// 유예 시간을 두는 이유: 장소 상세에서 네이버 지도로 나갔다 돌아오는 흐름이 있어서,
// 잠깐 나갔다 온 것까지 초기화하면 보던 장소를 잃는다.
const RESET_AFTER_HIDDEN_MS = 3 * 60 * 1000

export function startResetOnReturn(): void {
  let hiddenAt: number | null = null

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      hiddenAt = Date.now()
      return
    }

    const awayForMs = hiddenAt === null ? 0 : Date.now() - hiddenAt
    hiddenAt = null
    if (awayForMs >= RESET_AFTER_HIDDEN_MS) window.location.reload()
  })
}
