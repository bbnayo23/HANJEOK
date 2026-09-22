// 로딩 화면은 index.html이 미리 그려둔다 (번들이 늦게 도착해도 흰 화면이 보이지
// 않도록). 여기서는 앱이 마운트된 뒤 최소 노출 시간을 채우고 지우는 일만 한다.
const MIN_VISIBLE_MS = 1200

// index.html의 #splash transition 시간과 같아야 한다. 이 값이 더 짧으면 페이드가
// 끝나기 전에 요소가 사라져 화면이 툭 끊긴다.
const FADE_MS = 320

export function dismissSplash(): void {
  const splash = document.getElementById('splash')
  if (!splash) return

  // performance.now()는 페이지 로드 시작 기준이라 로딩 화면이 실제로 떠 있던 시간과
  // 같다. 느린 기기에서 번들을 받느라 이미 오래 보였다면 곧바로 사라진다.
  const remaining = Math.max(0, MIN_VISIBLE_MS - performance.now())

  window.setTimeout(() => {
    splash.dataset.leaving = 'true'
    window.setTimeout(() => splash.remove(), FADE_MS)
  }, remaining)
}
