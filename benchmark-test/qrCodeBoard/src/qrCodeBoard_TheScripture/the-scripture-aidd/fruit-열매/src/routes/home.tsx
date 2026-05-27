// 홈페이지 라우트 — SCR-001, API-001
// REQ-001: QR 코드 스캔 및 결과 표시
// REQ-002: 홈페이지
// FR-001: QR 코드 스캔 (html5-qrcode, 클라이언트 전용)
// FR-002: QR 결과 표시
// FR-003: 홈페이지 (QR 스캔 + 게시판 네비게이션)
import { Hono } from 'hono';
import { Layout } from '../components/layout';

const home = new Hono();

// API-001: GET / — 홈페이지 (QR 스캔 포함)
home.get('/', (c) => {
  try {
    return c.html(
      <Layout title="홈">
        {/* Hero Section — UC-002 홈페이지 접속 */}
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-indigo-800 mb-2">QR 코드를 스캔하세요</h1>
          <p class="text-slate-500">카메라로 QR 코드를 비추면 내용이 자동으로 인식됩니다</p>
        </div>

        {/* QR Scanner Area — UC-001, FR-001 */}
        <div
          x-data={`{
            scanning: false,
            result: '',
            error: '',
            scanner: null,

            async startScan() {
              this.error = '';
              this.result = '';
              try {
                const { Html5Qrcode } = await import('https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js');
                this.scanner = new Html5Qrcode('qr-reader');
                this.scanning = true;
                await this.scanner.start(
                  { facingMode: 'environment' },
                  { fps: 10, qrbox: { width: 250, height: 250 } },
                  (text) => {
                    this.result = text;
                    this.stopScan();
                  },
                  () => {}
                );
              } catch (err) {
                this.error = '카메라 접근 권한이 필요합니다. 브라우저 설정을 확인해주세요.';
                this.scanning = false;
              }
            },

            async stopScan() {
              if (this.scanner) {
                try {
                  await this.scanner.stop();
                } catch(e) {}
                this.scanning = false;
              }
            }
          }`}
          class="max-w-lg mx-auto"
        >
          {/* 카메라 뷰파인더 */}
          <div class="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden mb-4">
            <div id="qr-reader" class="w-full" style="min-height: 300px;">
              <div x-show="!scanning && !result" class="flex flex-col items-center justify-center h-72 text-slate-400">
                <svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                <p class="text-sm">QR 코드를 스캔하려면 아래 버튼을 클릭하세요</p>
              </div>
            </div>
          </div>

          {/* 스캔 버튼 — UC-001 Step 1 */}
          <div class="text-center mb-6">
            <button
              x-show="!scanning"
              x-on:click="startScan()"
              class="btn-primary px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg focus-ring"
              aria-label="QR 코드 스캔 시작"
            >
              📷 스캔 시작
            </button>
            <button
              x-show="scanning"
              x-on:click="stopScan()"
              class="btn-danger px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 shadow-md focus-ring"
              aria-label="QR 코드 스캔 중지"
            >
              ⏹ 스캔 중지
            </button>
          </div>

          {/* 에러 메시지 — UC-001 E1, E3 */}
          <div x-show="error" x-cloak class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p class="text-red-700 text-sm" x-text="error"></p>
          </div>

          {/* 스캔 결과 — FR-002 */}
          <div x-show="result" x-cloak class="bg-emerald-50 border border-emerald-200 rounded-xl p-6 shadow-sm">
            <h2 class="text-lg font-semibold text-emerald-800 mb-2">📋 스캔 결과</h2>
            <div class="bg-white rounded-lg p-4 border border-emerald-100">
              {/* URL인 경우 클릭 가능한 링크로 표시 — UC-001 7a */}
              <template x-if="result.startsWith('http://') || result.startsWith('https://')">
                <a x-bind:href="result" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:text-indigo-800 underline break-all" x-text="result"></a>
              </template>
              <template x-if="!result.startsWith('http://') && !result.startsWith('https://')">
                <p class="text-slate-700 break-all" x-text="result"></p>
              </template>
            </div>
            <button x-on:click="result = ''" class="mt-3 text-sm text-slate-500 hover:text-slate-700 transition-colors">
              ✕ 결과 닫기
            </button>
          </div>
        </div>

        {/* 게시판 바로가기 — UC-002 네비게이션 */}
        <div class="mt-12 text-center">
          <a href="/board" class="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-6 py-4 shadow-sm hover:shadow-md transition-all duration-200 no-underline text-slate-700 hover:text-indigo-700">
            <span class="text-2xl">📋</span>
            <div class="text-left">
              <p class="font-semibold">게시판으로 이동</p>
              <p class="text-sm text-slate-500">글을 작성하고 관리하세요</p>
            </div>
          </a>
        </div>

        {/* html5-qrcode 라이브러리 로드 */}
        <script src="https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js"></script>
        <script>{`
          // Alpine.js에서 html5-qrcode 사용을 위한 전역 참조 재설정
          document.addEventListener('alpine:init', () => {
            Alpine.data('qrScanner', () => ({
              scanning: false,
              result: '',
              error: '',
              scanner: null,

              async startScan() {
                this.error = '';
                this.result = '';
                try {
                  this.scanner = new Html5Qrcode('qr-reader');
                  this.scanning = true;
                  await this.scanner.start(
                    { facingMode: 'environment' },
                    { fps: 10, qrbox: { width: 250, height: 250 } },
                    (decodedText) => {
                      this.result = decodedText;
                      this.stopScan();
                    },
                    (errorMessage) => {}
                  );
                } catch (err) {
                  this.error = '카메라 접근 권한이 필요합니다. 브라우저 설정을 확인해주세요.';
                  this.scanning = false;
                }
              },

              async stopScan() {
                if (this.scanner) {
                  try { await this.scanner.stop(); } catch(e) {}
                  this.scanning = false;
                }
              }
            }));
          });
        `}</script>
      </Layout>
    );
  } catch (err) {
    console.error('[ERROR] Home page:', err);
    return c.html(
      <Layout title="오류">
        <div class="text-center py-12">
          <h1 class="text-2xl font-bold text-red-600">서버 오류가 발생했습니다</h1>
          <p class="text-slate-500 mt-2">잠시 후 다시 시도해주세요</p>
        </div>
      </Layout>,
      500
    );
  }
});

export default home;
