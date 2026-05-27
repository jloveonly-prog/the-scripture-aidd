import type { FC } from 'hono/jsx'
import { Layout } from '../layout'
import type { Post } from '../../db'

interface BoardDetailProps {
  post: Post
}

export const BoardDetail: FC<BoardDetailProps> = ({ post }) => {
  return (
    <Layout title={`${post.title} — QR 게시판`}>
      {/* 뒤로가기 */}
      <div class="mb-6">
        <a
          href="/board"
          class="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
        >
          ← 목록으로
        </a>
      </div>

      <article class="glass rounded-2xl p-8">
        {/* 헤더 */}
        <header class="mb-6 pb-6 border-b border-white/10">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-xs text-indigo-400 font-mono bg-indigo-500/10 px-2 py-1 rounded-md">
              #{post.id}
            </span>
          </div>
          <h1 class="text-2xl font-bold text-white mb-3">{post.title}</h1>
          <div class="flex gap-4 text-xs text-slate-500">
            <span>작성: {post.created_at}</span>
            {post.updated_at !== post.created_at && (
              <span>수정: {post.updated_at}</span>
            )}
          </div>
        </header>

        {/* 본문 */}
        <div class="prose prose-invert max-w-none">
          <div class="text-slate-200 leading-relaxed whitespace-pre-wrap text-base">
            {post.content}
          </div>
        </div>

        {/* 액션 버튼 */}
        <footer class="mt-8 pt-6 border-t border-white/10 flex gap-3">
          <a
            href={`/board/${post.id}/edit`}
            class="btn-primary text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2"
          >
            ✏️ 수정
          </a>
          <form method="post" action={`/board/${post.id}/delete`} onsubmit="return confirm('정말 삭제하시겠습니까?')">
            <button
              type="submit"
              class="btn-danger text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2"
            >
              🗑️ 삭제
            </button>
          </form>
          <a
            href="/board"
            class="px-5 py-2.5 rounded-xl border border-white/20 text-slate-300 hover:text-white hover:border-white/40 transition-all font-semibold"
          >
            목록
          </a>
        </footer>
      </article>
    </Layout>
  )
}
