/**
 * 홈페이지 화면
 * 연결 REQ: REQ-001, FR-001, SCR-001
 * 단일 책임: 홈페이지 UI 렌더링
 */
import type { FC } from 'hono/jsx';

export const HomePage: FC = () => {
  return (
    <div class="flex flex-col items-center justify-center min-h-[60vh]">
      <div class="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center max-w-lg w-full">
        <div class="text-6xl mb-6">📱</div>
        <h1 class="text-3xl font-bold text-slate-800 mb-3">
          QR Code Board
        </h1>
        <p class="text-slate-500 mb-8 leading-relaxed">
          QR 코드를 스캔하여 접속한 게시판입니다.<br />
          자유롭게 글을 작성하고 공유하세요.
        </p>
        <a
          href="/board"
          class="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
        >
          게시판 바로가기
          <span class="text-lg">→</span>
        </a>
      </div>
    </div>
  );
};
