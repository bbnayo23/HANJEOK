import type { IncomingMessage, ServerResponse } from 'node:http'

// 서울 열린데이터광장 오픈 API 프록시.
//
// 이 API는 HTTPS를 지원하지 않는다. 로컬 개발(http://localhost)에서는 브라우저가
// 봐주지만, 앱을 HTTPS로 배포하면 mixed content로 전부 막힌다. 그래서 브라우저는
// 같은 도메인의 이 함수를 부르고, 서버가 대신 HTTP로 호출해 결과만 돌려준다.
// 인증키도 여기서만 붙으므로 클라이언트 번들에 노출되지 않는다.
//
// 개발 서버에서는 vite.config.ts가 이 핸들러를 /api/seoul 미들웨어로 그대로 쓴다
// (Vercel의 (req, res) 시그니처와 connect 미들웨어 시그니처가 같다). 덕분에 개발과
// 배포가 같은 코드를 탄다.
const API_ORIGIN = 'http://openapi.seoul.go.kr:8088'

// 인증키가 없으면 공식 문서의 sample 키로 떨어진다. sample 키는 한 번에 5건까지만
// 주고 그보다 많이 요청하면 에러가 나므로, 요청 범위를 5건으로 줄여준다.
const SAMPLE_KEY = 'sample'
const SAMPLE_MAX_ROWS = 5

// 경로 형식: /{인증키}/{타입}/{서비스}/{시작}/{끝}/{인자...}
// 브라우저가 보내는 경로에는 인증키가 빠져 있으므로 여기서 끼워 넣는다.
const TYPE_INDEX = 1
const START_INDEX = 3
const END_INDEX = 4

// 프록시가 중계할 경로인지 확인하고 상류 URL을 만든다. 형식에 맞지 않으면 null —
// 이 함수가 아무 경로나 그대로 흘려보내면 열린 프록시가 된다.
export function buildUpstreamUrl(requestPath: string, key: string | undefined): string | null {
  // 배포에서는 /api/seoul/json/... 으로, 개발 서버에서는 접두사가 잘린 /json/... 으로
  // 들어온다. 양쪽 다 받아 같은 결과를 낸다.
  const path = (requestPath.split('?')[0] ?? '').replace(/^\/api\/seoul/, '')
  const segments = path.split('/')
  if (segments[TYPE_INDEX] !== 'json') return null
  if (!segments[START_INDEX] || !segments[END_INDEX]) return null

  if (!key) {
    const end = Number(segments[END_INDEX])
    if (!Number.isFinite(end)) return null
    if (end > SAMPLE_MAX_ROWS) segments[END_INDEX] = String(SAMPLE_MAX_ROWS)
  }

  return `${API_ORIGIN}/${key ?? SAMPLE_KEY}${segments.join('/')}`
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const url = buildUpstreamUrl(req.url ?? '', process.env.SEOUL_CITYDATA_KEY)
  res.setHeader('content-type', 'application/json; charset=utf-8')

  if (!url) {
    res.statusCode = 400
    res.end(JSON.stringify({ error: 'unsupported path' }))
    return
  }

  try {
    const upstream = await fetch(url)
    const body = await upstream.text()
    res.statusCode = upstream.status
    // 실시간 데이터라 길게 캐시하면 안 되지만, 같은 지역을 연달아 볼 때 상류 API를
    // 반복 호출하지 않을 만큼은 둔다.
    res.setHeader('cache-control', 'public, max-age=60')
    res.end(body)
  } catch {
    res.statusCode = 502
    res.end(JSON.stringify({ error: 'upstream unavailable' }))
  }
}
