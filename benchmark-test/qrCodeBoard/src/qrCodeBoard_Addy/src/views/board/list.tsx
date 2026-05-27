import type { FC } from 'hono/jsx'
import { Layout } from '../layout'
import type { Post } from '../../db'

interface BoardListProps {
  posts: Post[]
}

export const BoardList: FC<BoardListProps> = ({ posts }) => {
  return (
    <Layout title="게시판 — QR 게시판">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white mb-1">게시판</h1>
          <p class="text-slate-400 text-sm">총 {posts.length}개의 게시글</p>
        </div>
        <a
          href="/board/new"
          class="btn-primary text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2"
        >
          <span>✏️</span> 글쓰기
        </a>
      </div>

      {posts.length === 0 ? (
        <div class="text-center py-24 glass rounded-2xl">
          <div class="text-6xl mb-4">📭</div>
          <p class="text-slate-400 text-lg mb-2">아직 게시글이 없습니다</p>
          <p class="text-slate-500 text-sm mb-6">첫 번째 글을 작성해보세요!</p>
          <a href="/board/new" class="btn-primary text-white px-6 py-3 rounded-xl font-semibold">
            첫 글 작성하기
          </a>
        </div>
      ) : (
        <div class="space-y-3">
          {posts.map((post) => (
            <article class="card rounded-2xl p-5 group">
              <a href={`/board/${post.id}`} class="block">
                <div class="flex items-start justify-between gap-4">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-xs text-indigo-400 font-mono">#{post.id}</span>
                    </div>
                    <h2 class="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors truncate">
                      {post.title}
                    </h2>
                    <p class="text-slate-400 text-sm mt-1 line-clamp-2">
                      {post.content.length > 100 ? post.content.slice(0, 100) + '...' : post.content}
                    </p>
                  </div>
                  <div class="text-right shrink-0">
                    <p class="text-xs text-slate-500">{post.created_at.slice(0, 10)}</p>
                    <span class="text-slate-600 group-hover:text-indigo-400 transition-colors text-lg">→</span>
                  </div>
                </div>
              </a>
            </article>
          ))}
        </div>
      )}
    </Layout>
  )
}
