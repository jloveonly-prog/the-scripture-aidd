// TASK-009: 게시글 상세 뷰
// 연결 REQ: REQ-006 (게시판 글 상세 조회)
// 연결 UC: UC-004
// 단일 책임: 게시글 상세 렌더링 만

import type { FC } from 'hono/jsx'
import type { Post } from '../../db/index.js'
import Layout from '../layout.js'

interface BoardDetailProps {
  post: Post
}

const BoardDetail: FC<BoardDetailProps> = ({ post }) => {
  return (
    <Layout title={`${post.title} — QR 코드 게시판`}>
      <div class="space-y-6">
        {/* 목록으로 링크 */}
        <a
          href="/board"
          class="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors group"
          aria-label="게시판 목록으로 돌아가기"
        >
          <span class="group-hover:-translate-x-0.5 transition-transform">←</span>
          <span>목록으로</span>
        </a>

        {/* 게시글 카드 */}
        <article class="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* 게시글 헤더 */}
          <div class="px-6 py-5 border-b border-gray-100">
            <h1 class="text-xl font-bold text-gray-900 leading-relaxed">
              {post.title}
            </h1>
            <p class="text-xs text-gray-400 mt-2">
              작성일: {post.created_at}
            </p>
          </div>

          {/* 게시글 내용 (줄바꿈 보존: whitespace-pre-wrap) */}
          <div class="px-6 py-5">
            <p
              class="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap"
              id="post-content"
            >
              {post.content}
            </p>
          </div>
        </article>

        {/* 목록으로 버튼 */}
        <div>
          <a
            href="/board"
            class="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 border border-gray-300 hover:border-indigo-300 px-4 py-2 rounded-lg transition-colors"
          >
            ← 목록으로 돌아가기
          </a>
        </div>
      </div>
    </Layout>
  )
}

export default BoardDetail
