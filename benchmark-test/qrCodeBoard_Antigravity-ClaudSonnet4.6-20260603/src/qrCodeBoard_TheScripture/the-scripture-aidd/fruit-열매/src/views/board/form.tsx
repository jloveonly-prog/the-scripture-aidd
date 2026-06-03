// TASK-008: 게시글 작성 폼 뷰
// 연결 REQ: REQ-005 (게시판 글 작성)
// 연결 UC: UC-005
// 단일 책임: 작성 폼 렌더링 만

import type { FC } from 'hono/jsx'
import Layout from '../layout.js'

interface BoardFormProps {
  error?: string
  title?: string
  content?: string
}

const BoardForm: FC<BoardFormProps> = ({ error, title = '', content = '' }) => {
  return (
    <Layout title="새 게시글 작성 — QR 코드 게시판">
      <div class="space-y-6">
        {/* 페이지 제목 */}
        <h1 class="text-2xl font-bold text-gray-900">새 게시글 작성</h1>

        {/* 에러 메시지 - 방어 깊이 1~2번째 층 이후 서버 에러 표시 */}
        {error && (
          <div
            role="alert"
            aria-live="polite"
            class="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex items-center gap-2"
          >
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* 작성 폼 */}
        <form
          method="post"
          action="/board"
          class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5"
        >
          {/* 제목 입력 - 방어 깊이 1번째 층 (클라이언트: required) */}
          <div>
            <label
              for="title"
              class="block text-sm font-medium text-gray-700 mb-1.5"
            >
              제목 <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              required
              maxlength={200}
              placeholder="제목을 입력하세요"
              class="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          {/* 내용 입력 - 방어 깊이 1번째 층 (클라이언트: required) */}
          <div>
            <label
              for="content"
              class="block text-sm font-medium text-gray-700 mb-1.5"
            >
              내용 <span class="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={10}
              placeholder="내용을 입력하세요"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
            >
              {content}
            </textarea>
          </div>

          {/* 버튼 그룹 */}
          <div class="flex items-center justify-end gap-3 pt-2">
            <a
              href="/board"
              class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </a>
            <button
              type="submit"
              id="btn-submit-post"
              class="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              등록하기
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default BoardForm
