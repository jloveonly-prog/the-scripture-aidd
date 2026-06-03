// TASK-006: 홈 화면 뷰
// 연결 REQ: REQ-001 (QR 스캔), REQ-002 (결과 표시), REQ-003 (홈페이지)
// 연결 UC: UC-001, UC-002
// 단일 책임: QR 스캐너 UI + Alpine.js 렌더링 만

import type { FC } from 'hono/jsx'
import Layout from '../layout.js'

const HomeView: FC = () => {
  return (
    <Layout title="QR 코드 게시판 — 홈">
      <div class="space-y-6">
        {/* 페이지 제목 */}
        <div class="text-center">
          <h1 class="text-2xl font-bold text-gray-900">QR 코드 스캐너</h1>
          <p class="mt-1 text-sm text-gray-500">카메라를 QR 코드에 가져다 대세요</p>
        </div>

        {/* Alpine.js QR 스캐너 컴포넌트 - REQ-001, REQ-002 */}
        <div
          x-data={`{
            scanning: false,
            result: '',
            resultType: '',
            error: '',
            videoStream: null,
            animationId: null,

            async startCamera() {
              this.error = ''
              this.result = ''
              try {
                const stream = await navigator.mediaDevices.getUserMedia({
                  video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
                })
                this.videoStream = stream
                const video = this.$refs.video
                video.srcObject = stream
                await video.play()
                this.scanning = true
                this.scanLoop()
              } catch (err) {
                if (err.name === 'NotAllowedError') {
                  this.error = '카메라 접근 권한이 필요합니다. 브라우저 설정에서 카메라 권한을 허용해주세요.'
                } else if (err.name === 'NotFoundError') {
                  this.error = '카메라를 찾을 수 없습니다. 카메라가 연결되어 있는지 확인해주세요.'
                } else {
                  this.error = '카메라 초기화에 실패했습니다: ' + err.message
                }
              }
            },

            scanLoop() {
              const video = this.$refs.video
              const canvas = this.$refs.canvas
              if (!canvas || !video) return
              const ctx = canvas.getContext('2d')
              canvas.width = video.videoWidth || 640
              canvas.height = video.videoHeight || 480

              const detect = () => {
                if (!this.scanning) return
                if (video.readyState === video.HAVE_ENOUGH_DATA) {
                  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
                  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
                  try {
                    const code = new BarcodeDetector({ formats: ['qr_code'] })
                    code.detect(this.$refs.video).then(codes => {
                      if (codes.length > 0) {
                        const raw = codes[0].rawValue
                        this.result = raw
                        this.resultType = raw.startsWith('http://') || raw.startsWith('https://') ? 'url' : 'text'
                      }
                    }).catch(() => {})
                  } catch(e) {}
                }
                this.animationId = requestAnimationFrame(detect)
              }
              this.animationId = requestAnimationFrame(detect)
            },

            stopCamera() {
              this.scanning = false
              if (this.animationId) cancelAnimationFrame(this.animationId)
              if (this.videoStream) {
                this.videoStream.getTracks().forEach(t => t.stop())
                this.videoStream = null
              }
            },

            isUrl(str) {
              return str.startsWith('http://') || str.startsWith('https://')
            }
          }`}
          x-init="startCamera()"
          x-on:beforedestroy="stopCamera()"
          class="bg-white rounded-xl shadow-md overflow-hidden"
        >
          {/* 스캐너 영역 */}
          <div class="relative bg-gray-900 flex items-center justify-center" style="min-height: 300px;">
            {/* 로딩 상태 */}
            <div x-show="!scanning && !error" class="text-white text-center py-16">
              <div class="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-3"></div>
              <p class="text-sm text-gray-300">카메라를 불러오는 중...</p>
            </div>

            {/* 에러 상태 */}
            <div
              x-show="error"
              role="alert"
              aria-live="polite"
              class="text-center px-6 py-12"
            >
              <div class="text-4xl mb-3">⚠️</div>
              <p class="text-red-400 text-sm" x-text="error"></p>
            </div>

            {/* 카메라 뷰파인더 */}
            <video
              x-ref="video"
              x-show="scanning"
              class="w-full max-w-lg"
              style="max-height: 360px; object-fit: cover;"
              muted
              playsinline
              aria-label="QR 코드 스캔 카메라 화면"
            ></video>

            {/* 스캔 오버레이 모서리 */}
            <div x-show="scanning" class="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div class="relative w-48 h-48">
                <div class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-400 rounded-tl-sm"></div>
                <div class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-400 rounded-tr-sm"></div>
                <div class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-400 rounded-bl-sm"></div>
                <div class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-400 rounded-br-sm"></div>
              </div>
            </div>
          </div>

          {/* 숨겨진 캔버스 (QR 디코딩용) */}
          <canvas x-ref="canvas" class="hidden"></canvas>

          {/* 스캔 결과 영역 - REQ-002 */}
          <div class="p-5">
            {/* 결과 없음 */}
            <div x-show="!result && scanning && !error" class="text-center text-gray-500 text-sm py-2">
              💡 QR 코드를 카메라에 가져다 대세요
            </div>

            {/* 결과 있음 */}
            <div x-show="result" class="space-y-3">
              <div class="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                <span>✅</span>
                <span>QR 코드 인식 성공!</span>
              </div>
              <div class="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p class="text-xs text-gray-500 mb-1">스캔 결과</p>
                {/* URL인 경우 링크로 표시 */}
                <a
                  x-show="isUrl(result)"
                  x-bind:href="result"
                  target="_blank"
                  rel="noopener noreferrer"
                  x-text="result"
                  class="text-indigo-600 hover:text-indigo-700 underline text-sm break-all"
                  aria-label="스캔된 URL 링크"
                ></a>
                {/* 텍스트인 경우 텍스트로 표시 */}
                <p
                  x-show="!isUrl(result)"
                  x-text="result"
                  class="text-gray-800 text-sm break-all"
                ></p>
              </div>
              {/* 다시 스캔 */}
              <button
                x-on:click="result = ''"
                class="text-xs text-gray-500 hover:text-indigo-600 underline"
              >
                다시 스캔하기
              </button>
            </div>
          </div>
        </div>

        {/* 게시판 바로가기 */}
        <div class="text-center">
          <a
            href="/board"
            class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm shadow-sm"
          >
            📋 게시판 보기
          </a>
        </div>
      </div>
    </Layout>
  )
}

export default HomeView
