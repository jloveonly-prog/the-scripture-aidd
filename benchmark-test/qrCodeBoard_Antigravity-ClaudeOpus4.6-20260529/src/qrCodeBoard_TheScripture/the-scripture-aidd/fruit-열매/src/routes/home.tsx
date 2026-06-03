/**
 * 홈페이지 HTTP 핸들러
 * 연결 REQ: REQ-001, FR-001, API-001
 * 단일 책임: 홈페이지 HTTP 요청 수신/응답 반환
 */
import { Hono } from 'hono';
import { Layout } from '../views/layout.js';
import { HomePage } from '../views/home.js';

const homeRoutes = new Hono();

/** API-001: GET / — 홈페이지 */
homeRoutes.get('/', (c) => {
  return c.html(
    <Layout>
      <HomePage />
    </Layout>
  );
});

export default homeRoutes;
