// src/routes/home.js — 홈페이지 라우트
// QR 코드 생성: https://www.npmjs.com/package/qrcode
const { Hono } = require('hono');
const QRCode = require('qrcode');
const { homeView } = require('../views/home');

const homeRouter = new Hono();

/**
 * GET / — 홈페이지
 * QR 코드에 현재 서버 URL을 인코딩하여 표시
 */
homeRouter.get('/', async (c) => {
  // 서버 URL 결정 (Host 헤더 우선)
  const host = c.req.header('host') || 'localhost:3000';
  const protocol = c.req.header('x-forwarded-proto') || 'http';
  const serverUrl = `${protocol}://${host}`;

  // QR 코드를 SVG 문자열로 생성
  // Source: https://www.npmjs.com/package/qrcode#tostringstext-options-cb
  const qrCodeSvg = await QRCode.toString(serverUrl, {
    type: 'svg',
    width: 280,
    margin: 1,
    color: {
      dark: '#312e81',  // indigo-900
      light: '#ffffff',
    },
  });

  const html = homeView({ qrCodeSvg, serverUrl });
  return c.html(html);
});

module.exports = { homeRouter };
