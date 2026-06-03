// TASK-004: 게시판 라우트 (JSX 지원 - .tsx)
// 연결 REQ: REQ-004 (목록), REQ-005 (작성), REQ-006 (상세)
// 연결 API: API-002~005
// 단일 책임: GET/POST /board, GET /board/new, GET /board/:id HTTP 처리만

import { Hono } from 'hono'
import { getAllPosts, getPostById, createPost } from '../db/index.js'
import BoardList from '../views/board/list.js'
import BoardForm from '../views/board/form.js'
import BoardDetail from '../views/board/detail.js'

const boardRouter = new Hono()

// API-002: GET /board — 게시판 글 목록 (REQ-004)
boardRouter.get('/', async (c) => {
  try {
    const posts = getAllPosts()  // REQ-004: 최신순 조회
    return c.html(<BoardList posts={posts} />)
  } catch (err) {
    console.error('[GET /board] DB 에러:', err)
    return c.html(<BoardList posts={[]} />, 500)
  }
})

// API-003: GET /board/new — 게시글 작성 폼 (REQ-005)
// ⚠️ /board/:id 보다 먼저 등록해야 "new"가 id로 매칭되지 않음
boardRouter.get('/new', (c) => {
  try {
    return c.html(<BoardForm />)
  } catch (err) {
    console.error('[GET /board/new] 에러:', err)
    return c.text('Internal Server Error', 500)
  }
})

// API-004: POST /board — 게시글 저장 (REQ-005)
boardRouter.post('/', async (c) => {
  try {
    const body = await c.req.parseBody()

    // 방어 깊이 2번째 층: 서버 입력값 검증
    const title = String(body['title'] ?? '').trim()
    const content = String(body['content'] ?? '').trim()

    if (!title || !content) {
      return c.html(
        <BoardForm
          error="제목과 내용을 모두 입력해주세요."
          title={title}
          content={content}
        />,
        400
      )
    }

    // DB 저장 (방어 깊이 3번째 층은 DB CHECK 제약)
    createPost(title, content)  // REQ-005

    // 성공 → 목록으로 리다이렉트 (302)
    return c.redirect('/board', 302)
  } catch (err) {
    console.error('[POST /board] 에러:', err)
    return c.html(
      <BoardForm error="저장에 실패했습니다. 다시 시도해주세요." />,
      500
    )
  }
})

// API-005: GET /board/:id — 게시글 상세 조회 (REQ-006)
boardRouter.get('/:id', (c) => {
  try {
    const idStr = c.req.param('id')
    const id = parseInt(idStr, 10)

    if (isNaN(id) || id <= 0) {
      return c.html(
        <div class="p-8 text-center">
          <h1 class="text-xl font-bold text-gray-800">잘못된 요청입니다.</h1>
          <a href="/board" class="text-indigo-600 underline mt-2 inline-block">목록으로 돌아가기</a>
        </div>,
        400
      )
    }

    const post = getPostById(id)  // REQ-006

    if (!post) {
      // 404: 게시글 없음
      return c.html(
        <div class="p-8 text-center">
          <h1 class="text-xl font-bold text-gray-800">게시글을 찾을 수 없습니다.</h1>
          <a href="/board" class="text-indigo-600 underline mt-2 inline-block">목록으로 돌아가기</a>
        </div>,
        404
      )
    }

    return c.html(<BoardDetail post={post} />)
  } catch (err) {
    console.error('[GET /board/:id] 에러:', err)
    return c.text('Internal Server Error', 500)
  }
})

export default boardRouter
