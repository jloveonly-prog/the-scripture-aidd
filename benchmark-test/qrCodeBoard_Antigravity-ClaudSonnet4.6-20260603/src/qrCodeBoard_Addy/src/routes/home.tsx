// src/routes/home.tsx
// 홈 페이지 — QR 스캐너 UI
// html5-qrcode Source: https://github.com/mebjas/html5-qrcode

/** @jsxImportSource hono/jsx */
import { Hono } from 'hono';
import { Layout } from '../views/layout.js';

const home = new Hono();

home.get('/', (c) => {
  return c.html(
    <Layout title="QR 스캐너 — QR 게시판">
      <div class="space-y-8">
        {/* 헤더 */}
        <div class="text-center">
          <h1 class="text-3xl font-bold text-white mb-2">📷 QR 코드 스캐너</h1>
          <p class="text-gray-400">카메라로 QR 코드를 스캔하면 자동으로 게시판에 저장됩니다</p>
        </div>

        {/* 스캐너 영역 — Alpine.js로 상태 관리 */}
        <div
          x-data={`{
            scanning: false,
            result: null,
            resultType: 'text',
            error: null,
            saved: false,
            scanner: null,

            async startScan() {
              this.result = null;
              this.error = null;
              this.saved = false;
              this.scanning = true;

              await this.$nextTick();

              // html5-qrcode 초기화
              // Source: https://scanapp.org/html5-qrcode-docs/docs/intro
              this.scanner = new Html5Qrcode('qr-reader');
              try {
                await this.scanner.start(
                  { facingMode: 'environment' },
                  { fps: 10, qrbox: { width: 250, height: 250 } },
                  (decodedText) => {
                    this.onScanSuccess(decodedText);
                  },
                  undefined
                );
              } catch (err) {
                this.error = '카메라를 시작할 수 없습니다. 권한을 허용해주세요.';
                this.scanning = false;
              }
            },

            async stopScan() {
              if (this.scanner) {
                try { await this.scanner.stop(); } catch {}
                this.scanner = null;
              }
              this.scanning = false;
            },

            async onScanSuccess(text) {
              await this.stopScan();
              this.result = text;
              this.resultType = /^https?:\\/\\//.test(text) ? 'url' : 'text';
              await this.saveToBoard(text);
            },

            async saveToBoard(content) {
              try {
                const res = await fetch('/api/posts', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ content })
                });
                if (res.ok) {
                  this.saved = true;
                } else {
                  this.error = '게시판 저장에 실패했습니다.';
                }
              } catch {
                this.error = '서버 연결 오류가 발생했습니다.';
              }
            },

            reset() {
              this.result = null;
              this.error = null;
              this.saved = false;
              this.scanning = false;
            }
          }`}
          class="space-y-6"
        >
          {/* 스캐너 뷰파인더 */}
          <div class="relative">
            <div
              id="qr-reader"
              class="scanner-box bg-gray-900 mx-auto"
              style="max-width: 400px; min-height: 300px;"
              x-show="scanning"
            ></div>

            {/* 스캔 전 플레이스홀더 */}
            <div
              x-show="!scanning && !result"
              class="scanner-box bg-gray-900 mx-auto flex items-center justify-center"
              style="max-width: 400px; min-height: 300px;"
            >
              <div class="text-center p-8 space-y-4">
                <div class="text-6xl">📱</div>
                <p class="text-gray-400 text-sm">
                  아래 버튼을 눌러<br />QR 코드 스캔을 시작하세요
                </p>
              </div>
            </div>

            {/* 스캔 결과 표시 */}
            <div
              x-show="result"
              x-cloak
              class="scanner-box bg-gray-900 mx-auto p-6 space-y-4"
              style="max-width: 400px;"
            >
              <div class="flex items-center gap-2 text-green-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="font-semibold">스캔 성공!</span>
              </div>

              {/* URL인 경우 링크, 아닌 경우 텍스트로 표시 */}
              <div class="bg-gray-800 rounded-lg p-4 break-all">
                <template x-if="resultType === 'url'">
                  <div>
                    <p class="text-xs text-gray-500 mb-1">URL</p>
                    <a
                      x-bind:href="result"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-indigo-400 hover:text-indigo-300 underline text-sm"
                      x-text="result"
                    ></a>
                  </div>
                </template>
                <template x-if="resultType !== 'url'">
                  <div>
                    <p class="text-xs text-gray-500 mb-1">텍스트</p>
                    <p class="text-gray-200 text-sm" x-text="result"></p>
                  </div>
                </template>
              </div>

              {/* 저장 상태 */}
              <div x-show="saved" class="flex items-center gap-2 text-green-400 text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                게시판에 저장되었습니다!
              </div>
            </div>
          </div>

          {/* 에러 메시지 */}
          <div
            x-show="error"
            x-cloak
            class="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-400 text-sm text-center"
            x-text="error"
          ></div>

          {/* 컨트롤 버튼 */}
          <div class="flex gap-3 justify-center">
            <button
              x-show="!scanning"
              x-on:click="startScan()"
              id="btn-start-scan"
              class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/25"
            >
              📷 스캔 시작
            </button>

            <button
              x-show="scanning"
              x-cloak
              x-on:click="stopScan()"
              id="btn-stop-scan"
              class="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all duration-200"
            >
              ⏹ 스캔 중지
            </button>

            <button
              x-show="result"
              x-cloak
              x-on:click="reset()"
              id="btn-reset-scan"
              class="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-semibold transition-all duration-200"
            >
              🔄 다시 스캔
            </button>

            <a
              x-show="saved"
              x-cloak
              href="/board"
              id="btn-go-board"
              class="px-6 py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all duration-200"
            >
              📋 게시판 보기
            </a>
          </div>

          {/* 사용 안내 */}
          <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-3">
            <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wide">사용 방법</h2>
            <ol class="space-y-2 text-sm text-gray-400">
              <li class="flex gap-2"><span class="text-indigo-400 font-bold">1.</span> 스캔 시작 버튼을 누르고 카메라 권한을 허용하세요</li>
              <li class="flex gap-2"><span class="text-indigo-400 font-bold">2.</span> QR 코드를 카메라에 비추세요</li>
              <li class="flex gap-2"><span class="text-indigo-400 font-bold">3.</span> 스캔된 결과가 자동으로 게시판에 저장됩니다</li>
            </ol>
            <p class="text-xs text-gray-600 mt-2">
              ⚠️ 카메라 기능은 localhost 또는 HTTPS 환경에서만 동작합니다
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
});

export default home;
