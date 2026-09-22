import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

import seoulApiHandler from './api/seoul/[...path].ts'

// 배포(Vercel)에서는 api/ 아래 서버리스 함수가 /api/seoul 요청을 받는다. 개발
// 서버에는 그런 게 없으므로 같은 핸들러를 미들웨어로 붙여 동작을 맞춘다.
const seoulApiDevProxy: Plugin = {
  name: 'seoul-api-dev-proxy',
  configureServer(server) {
    server.middlewares.use('/api/seoul', seoulApiHandler)
  },
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 인증키는 서버 전용이다. VITE_ 접두사를 쓰면 클라이언트 번들에 박히므로 쓰지 않고,
  // 개발 서버에서만 .env.local 값을 process.env로 옮겨 프록시 핸들러가 읽게 한다.
  const { SEOUL_CITYDATA_KEY } = loadEnv(mode, process.cwd(), '')
  if (SEOUL_CITYDATA_KEY) process.env.SEOUL_CITYDATA_KEY = SEOUL_CITYDATA_KEY

  return {
    plugins: [react(), tailwindcss(), seoulApiDevProxy],
    optimizeDeps: {
      include: ['react-leaflet', '@react-leaflet/core', 'leaflet'],
    },
  }
})
