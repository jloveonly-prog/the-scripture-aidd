import { Hono } from 'hono'
import { postRepo } from '../db'
import { BoardList } from '../views/board/list'
import { BoardDetail } from '../views/board/detail'
import { BoardForm } from '../views/board/form'

export const boardRouter = new Hono()

// 게시판 목록
boardRouter.get('/', (c) => {
  const posts = postRepo.findAll()
  return c.html(<BoardList posts={posts} />)
})

// 새 글 작성 폼
boardRouter.get('/new', (c) => {
  return c.html(<BoardForm />)
})

// 글 작성 처리
boardRouter.post('/', async (c) => {
  const body = await c.req.parseBody()
  const title = String(body.title ?? '').trim()
  const content = String(body.content ?? '').trim()

  if (!title || !content) {
    return c.html(<BoardForm error="제목과 내용을 모두 입력해주세요." />)
  }

  const post = postRepo.create(title, content)
  return c.redirect(`/board/${post.id}`)
})

// 게시글 상세
boardRouter.get('/:id', (c) => {
  const id = Number(c.req.param('id'))
  if (isNaN(id)) return c.redirect('/board')

  const post = postRepo.findById(id)
  if (!post) {
    return c.html(
      <div style="text-align:center;padding:4rem;color:#e2e8f0">
        <h1>게시글을 찾을 수 없습니다</h1>
        <a href="/board">목록으로</a>
      </div>,
      404
    )
  }
  return c.html(<BoardDetail post={post} />)
})

// 게시글 수정 폼
boardRouter.get('/:id/edit', (c) => {
  const id = Number(c.req.param('id'))
  if (isNaN(id)) return c.redirect('/board')

  const post = postRepo.findById(id)
  if (!post) return c.redirect('/board')

  return c.html(<BoardForm post={post} />)
})

// 게시글 수정 처리
boardRouter.post('/:id/edit', async (c) => {
  const id = Number(c.req.param('id'))
  if (isNaN(id)) return c.redirect('/board')

  const body = await c.req.parseBody()
  const title = String(body.title ?? '').trim()
  const content = String(body.content ?? '').trim()

  const post = postRepo.findById(id)
  if (!post) return c.redirect('/board')

  if (!title || !content) {
    return c.html(<BoardForm post={post} error="제목과 내용을 모두 입력해주세요." />)
  }

  postRepo.update(id, title, content)
  return c.redirect(`/board/${id}`)
})

// 게시글 삭제
boardRouter.post('/:id/delete', (c) => {
  const id = Number(c.req.param('id'))
  if (!isNaN(id)) {
    postRepo.delete(id)
  }
  return c.redirect('/board')
})
