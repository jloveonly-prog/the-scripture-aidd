// TASK-007: 게시판 목록 뷰
// 연결 REQ: REQ-004 (게시판 글 목록 조회)
// 연결 UC: UC-003
// 단일 책임: 게시글 목록 렌더링 만

import type { FC } from 'hono/jsx'
import type { PostRow } from '../../db/index.js'
import Layout from '../layout.js'

interface BoardListProps {
  posts: PostRow[]
}

const BoardList: FC<BoardListProps> = ({ posts }) => {
  return (
    <Layout title="게시판 — QR 코드 게시판">
      <div class="space-y-6">
        {/* 페이지 헤더 */}
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900">게시판</h1>
          <a
            href="/board/new"
            id="btn-new-post"
            class="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm shadow-sm"
          >
            <span>+</span>
            <span>글 작성</span>
          </a>
        </div>

        {/* 게시글 목록 */}
        {posts.length === 0 ? (
          /* 빈 상태 (Empty State) */
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div class="text-5xl mb-4">📭</div>
            <p class="text-gray-500 font-medium">등록된 게시글이 없습니다.</p>
            <p class="text-sm text-gray-400 mt-1">첫 번째 게시글을 작성해보세요!</p>
            <a
              href="/board/new"
              class="mt-4 inline-block text-indigo-600 hover:text-indigo-700 text-sm underline"
            >
              글 작성하기
            </a>
          </div>
        ) : (
          <div class="space-y-3" id="post-list">
            {posts.map((post) => (
              <a
                key={post.id}
                href={`/board/${post.id}`}
                class="block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all p-5 group"
                aria-label={`게시글: ${post.title}`}
              >
                <div class="flex items-start gap-3">
                  <span class="text-xl mt-0.5">📄</span>
                  <div class="flex-1 min-w-0">
                    <p class="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                      {post.title}
                    </p>
                    <p class="text-xs text-gray-400 mt-1">
                      {post.created_at}
                    </p>
                  </div>
                  <span class="text-gray-300 group-hover:text-indigo-400 transition-colors text-lg">›</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default BoardList
