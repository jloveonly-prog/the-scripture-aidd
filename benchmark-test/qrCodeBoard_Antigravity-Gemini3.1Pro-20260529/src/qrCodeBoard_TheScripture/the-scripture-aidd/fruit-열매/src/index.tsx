import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { html } from 'hono/html'
import { insertScan, getScans } from './db'

const app = new Hono()

// 공통 레이아웃
const Layout = (props: { children: any }) => html`
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QR Code Board</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/htmx.org@1.9.12"></script>
  <script src="https://unpkg.com/alpinejs@3.14.0/dist/cdn.min.js" defer></script>
</head>
<body class="bg-gray-100 text-gray-800 font-sans min-h-screen">
  <header class="bg-blue-600 text-white p-4">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-2xl font-bold">QR 스캐너</h1>
      <nav>
        <a href="/" class="mr-4 hover:underline">홈</a>
        <a href="/board" class="hover:underline">게시판</a>
      </nav>
    </div>
  </header>
  <main class="container mx-auto p-4 mt-4">
    ${props.children}
  </main>
</body>
</html>
`

// API-001: 메인 화면 렌더링 (FR-001, FR-002)
app.get('/', (c) => {
  return c.html(
    <Layout>
      <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md" x-data="qrScanner()">
        <h2 class="text-xl font-bold mb-4">카메라 스캔</h2>
        <div id="reader" class="w-full mb-4"></div>
        <div id="scan-result-container">
          {/* 스캔 결과 표시 영역 */}
        </div>
        
        <script src="https://unpkg.com/html5-qrcode"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          document.addEventListener('alpine:init', () => {
            Alpine.data('qrScanner', () => ({
              init() {
                const html5QrcodeScanner = new Html5QrcodeScanner(
                  "reader", { fps: 10, qrbox: 250 }, false);
                
                html5QrcodeScanner.render((decodedText, decodedResult) => {
                  html5QrcodeScanner.clear();
                  
                  // HTMX로 POST 요청
                  htmx.ajax('POST', '/api/scan', {
                    values: { content: decodedText },
                    target: '#scan-result-container'
                  });
                });
              }
            }));
          });
        `}}></script>
      </div>
    </Layout>
  )
})

// API-002: 게시판 화면 렌더링 (FR-004)
app.get('/board', (c) => {
  try {
    const scans = getScans()
    return c.html(
      <Layout>
        <h2 class="text-2xl font-bold mb-6 text-center">스캔 게시판</h2>
        <div class="max-w-2xl mx-auto space-y-4">
          {scans.length === 0 ? (
            <p class="text-center text-gray-500">스캔된 내역이 없습니다.</p>
          ) : (
            scans.map(scan => (
              <div class="bg-white p-4 rounded shadow">
                <p class="text-lg">{scan.content}</p>
                <p class="text-sm text-gray-400 mt-2">{scan.scanned_at}</p>
              </div>
            ))
          )}
        </div>
      </Layout>
    )
  } catch (err) {
    console.error(err)
    return c.text("Internal Server Error", 500)
  }
})

// API-003: 스캔 결과 저장 (FR-003)
app.post('/api/scan', async (c) => {
  try {
    const body = await c.req.parseBody()
    const content = body.content as string
    
    if (!content || content.trim().length === 0) {
      return c.html(<div class="text-red-500">내용이 비어있습니다.</div>, 400)
    }

    insertScan(content)
    
    return c.html(
      <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
        <strong class="font-bold">성공!</strong>
        <span class="block sm:inline"> 성공적으로 스캔 및 저장되었습니다.</span>
        <p class="mt-2 text-gray-800">내용: {content}</p>
        <button class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onclick="window.location.reload()">
          다시 스캔하기
        </button>
      </div>
    )
  } catch (err) {
    console.error(err)
    return c.html(<div class="text-red-500">서버 오류가 발생했습니다.</div>, 500)
  }
})

// 테스트 시 서버를 띄우지 않도록 하기 위한 코드 (export default app 처리)
if (process.env.NODE_ENV !== 'test') {
  serve({
    fetch: app.fetch,
    port: 4000
  }, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  })
}

export default app
