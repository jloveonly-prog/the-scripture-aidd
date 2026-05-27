import type { FC } from 'hono/jsx'
import { Layout } from './layout'

export const HomePage: FC = () => {
  return (
    <Layout title="홈 — QR 게시판">
      <div class="text-center mb-10">
        <h1 class="text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          QR 코드 스캐너
        </h1>
        <p class="text-slate-400">카메라로 QR 코드를 스캔하거나 이미지를 업로드하세요</p>
      </div>

      <div
        x-data={`{
          scanning: false,
          result: '',
          error: '',
          scanner: null,
          startScan() {
            this.error = '';
            this.result = '';
            this.scanning = true;
            this.$nextTick(() => {
              this.scanner = new Html5Qrcode('reader');
              this.scanner.start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                (decodedText) => {
                  this.result = decodedText;
                  this.stopScan();
                },
                () => {}
              ).catch(err => {
                this.error = '카메라 접근 실패: ' + err;
                this.scanning = false;
              });
            });
          },
          stopScan() {
            if (this.scanner) {
              this.scanner.stop().then(() => {
                this.scanner.clear();
                this.scanner = null;
              }).catch(() => {});
            }
            this.scanning = false;
          },
          onFileChange(e) {
            const file = e.target.files[0];
            if (!file) return;
            this.result = '';
            this.error = '';
            const scanner = new Html5Qrcode('reader-file');
            scanner.scanFile(file, true).then(text => {
              this.result = text;
            }).catch(() => {
              this.error = 'QR 코드를 인식하지 못했습니다.';
            });
          }
        }`}
        class="max-w-2xl mx-auto"
      >
        {/* 스캐너 영역 */}
        <div class="glass rounded-2xl p-6 mb-6">
          <div class="flex gap-3 justify-center mb-6">
            <button
              x-show="!scanning"
              x-on:click="startScan()"
              class="btn-primary text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
            >
              <span>📷</span> 카메라 스캔
            </button>
            <button
              x-show="scanning"
              x-on:click="stopScan()"
              class="btn-danger text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
            >
              <span>⏹</span> 스캔 중지
            </button>
          </div>

          {/* 카메라 뷰파인더 */}
          <div
            id="reader"
            x-show="scanning"
            class="rounded-xl overflow-hidden border border-indigo-500/30 max-w-sm mx-auto"
          />

          {/* 파일 업로드 */}
          <div x-show="!scanning" class="text-center">
            <p class="text-slate-400 text-sm mb-3">또는 이미지 파일로 스캔</p>
            <label class="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-slate-300 hover:border-indigo-400 hover:text-white transition-all text-sm">
              <span>🖼️</span> 이미지 업로드
              <input
                type="file"
                accept="image/*"
                x-on:change="onFileChange($event)"
                class="hidden"
              />
            </label>
          </div>
          {/* 숨겨진 파일 스캔용 div */}
          <div id="reader-file" class="hidden" />
        </div>

        {/* 결과 표시 */}
        <div
          x-show="result"
          class="glass rounded-2xl p-6 mb-6 border border-green-500/30"
          x-transition
        >
          <div class="flex items-center gap-2 mb-3">
            <span class="text-green-400 text-xl">✅</span>
            <h2 class="text-lg font-semibold text-green-400">QR 코드 인식 성공!</h2>
          </div>
          <div class="bg-black/30 rounded-xl p-4 break-all font-mono text-sm text-slate-200 mb-4" x-text="result" />
          <div class="flex gap-3 flex-wrap">
            <a
              x-bind:href="result"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary text-white text-sm px-4 py-2 rounded-lg font-medium"
            >
              🔗 링크 열기
            </a>
            <button
              x-on:click="navigator.clipboard.writeText(result).then(() => alert('복사됨!'))"
              class="px-4 py-2 rounded-lg border border-white/20 text-slate-300 hover:text-white text-sm transition-all"
            >
              📋 복사
            </button>
            <button
              x-on:click="result = ''; error = ''"
              class="px-4 py-2 rounded-lg border border-white/20 text-slate-400 hover:text-white text-sm transition-all"
            >
              🔄 초기화
            </button>
          </div>
        </div>

        {/* 오류 표시 */}
        <div
          x-show="error"
          class="glass rounded-2xl p-4 border border-red-500/30"
          x-transition
        >
          <p class="text-red-400 text-sm flex items-center gap-2">
            <span>❌</span> <span x-text="error" />
          </p>
        </div>

        {/* 안내 */}
        <div class="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: '📷', title: '카메라 스캔', desc: '실시간으로 QR 코드를 스캔합니다' },
            { icon: '🖼️', title: '이미지 업로드', desc: '저장된 QR 이미지를 업로드합니다' },
            { icon: '🔗', title: '바로 이동', desc: '스캔 결과 링크를 바로 열 수 있습니다' },
          ].map(item => (
            <div class="card rounded-xl p-4 text-center">
              <div class="text-3xl mb-2">{item.icon}</div>
              <h3 class="font-semibold text-white text-sm mb-1">{item.title}</h3>
              <p class="text-slate-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
