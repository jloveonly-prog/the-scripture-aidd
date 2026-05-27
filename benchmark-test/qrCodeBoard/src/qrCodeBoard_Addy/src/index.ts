import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { homeRouter } from './routes/home'
import { boardRouter } from './routes/board'

const app = new Hono()

// 라우트 마운트
app.route('/', homeRouter)
app.route('/board', boardRouter)

// 404 핸들러
app.notFound((c) => {
  return c.html(
    `<!DOCTYPE html>
    <html lang="ko">
    <head><meta charset="UTF-8"><title>404 Not Found</title>
    <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body style="background:#0f0f1a;color:#e2e8f0;font-family:system-ui" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="text-8xl mb-4">🔍</div>
        <h1 class="text-4xl font-bold mb-2">404</h1>
        <p class="text-slate-400 mb-6">페이지를 찾을 수 없습니다</p>
        <a href="/" style="background:linear-gradient(135deg,#6366f1,#8b5cf6)" class="text-white px-6 py-3 rounded-xl font-semibold">홈으로</a>
      </div>
    </body></html>`,
    404
  )
})

const PORT = 3001

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`\n🚀 QR 게시판이 실행 중입니다!`)
  console.log(`   → http://localhost:${info.port}`)
  console.log(`   → http://localhost:${info.port}/board\n`)
})
