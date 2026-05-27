import type { FC } from 'hono/jsx'
import { Layout } from '../layout'
import type { Post } from '../../db'

interface BoardFormProps {
  post?: Post
  error?: string
}

export const BoardForm: FC<BoardFormProps> = ({ post, error }) => {
  const isEdit = !!post
  const action = isEdit ? `/board/${post!.id}/edit` : '/board'

  return (
    <Layout title={isEdit ? '게시글 수정 — QR 게시판' : '글쓰기 — QR 게시판'}>
      <div class="mb-6">
        <a
          href={isEdit ? `/board/${post!.id}` : '/board'}
          class="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
        >
          ← {isEdit ? '상세로 돌아가기' : '목록으로'}
        </a>
      </div>

      <div class="glass rounded-2xl p-8 max-w-2xl">
        <h1 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          {isEdit ? '✏️ 게시글 수정' : '📝 새 글 작성'}
        </h1>

        {error && (
          <div class="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
            <span>❌</span> {error}
          </div>
        )}

        <form method="post" action={action} class="space-y-5">
          <div>
            <label
              for="title"
              class="block text-sm font-medium text-slate-300 mb-2"
            >
              제목 <span class="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={post?.title ?? ''}
              required
              maxlength={200}
              placeholder="제목을 입력하세요"
              class="w-full px-4 py-3 rounded-xl text-sm placeholder-slate-500 focus:ring-0"
            />
          </div>

          <div>
            <label
              for="content"
              class="block text-sm font-medium text-slate-300 mb-2"
            >
              내용 <span class="text-red-400">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={10}
              placeholder="내용을 입력하세요"
              class="w-full px-4 py-3 rounded-xl text-sm placeholder-slate-500 focus:ring-0 resize-y"
            >
              {post?.content ?? ''}
            </textarea>
          </div>

          <div class="flex gap-3 pt-2">
            <button
              type="submit"
              class="btn-primary text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
            >
              {isEdit ? '✅ 수정 완료' : '📤 게시하기'}
            </button>
            <a
              href={isEdit ? `/board/${post!.id}` : '/board'}
              class="px-6 py-3 rounded-xl border border-white/20 text-slate-300 hover:text-white hover:border-white/40 transition-all font-semibold"
            >
              취소
            </a>
          </div>
        </form>
      </div>
    </Layout>
  )
}
