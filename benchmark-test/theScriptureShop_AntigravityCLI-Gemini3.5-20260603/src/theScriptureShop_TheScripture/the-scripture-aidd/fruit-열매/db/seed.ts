import { db } from './client.js';

// Seed data for the 10 Bibles (REQ-001 / TBL-001)
const seedBibles = [
  {
    translation_name: 'King James Version (KJV)',
    cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400',
    description: '1611년에 발행된 영문 성경의 고전이며 번역의 권위와 역사적 가치가 높은 성경입니다.'
  },
  {
    translation_name: 'New International Version (NIV)',
    cover_image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400',
    description: '가장 널리 읽히는 현대적이고 대중적인 영어 번역 성경입니다.'
  },
  {
    translation_name: 'English Standard Version (ESV)',
    cover_image: 'https://images.unsplash.com/photo-1474932430478-367db26836c1?q=80&w=400',
    description: '원문의 문자적 의미를 최대한 보존하면서 현대적인 언어로 번역한 직역 성경입니다.'
  },
  {
    translation_name: '개역개정 (Korean Revised Version)',
    cover_image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=400',
    description: '한국 교회의 예배용 공식 성경으로 가장 많이 보급된 번역본입니다.'
  },
  {
    translation_name: '히브리어 구약성경 (Westminster Leningrad Codex)',
    cover_image: 'https://images.unsplash.com/photo-1455642305367-68834a1da7ab?q=80&w=400',
    description: '구약 성경의 원어인 히브리어 본문으로 학술 연구 및 묵상용 성서입니다.'
  },
  {
    translation_name: '헬라어 신약성경 (Novum Testamentum Graece)',
    cover_image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=400',
    description: '신약 성경의 원어인 고대 헬라어(코이네)로 기록된 신약 본문 성서입니다.'
  },
  {
    translation_name: 'Latin Vulgate (라틴어 불가타)',
    cover_image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=400',
    description: '교부 제롬이 라틴어로 완역하여 가톨릭 교회의 공인 텍스트가 된 성서입니다.'
  },
  {
    translation_name: '개역한글 (Korean Version)',
    cover_image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=400',
    description: '고풍스러운 한글 문체와 깊이 있는 번역으로 중장년층에게 사랑받는 성경입니다.'
  },
  {
    translation_name: 'New American Standard Bible (NASB)',
    cover_image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=400',
    description: '원문 직역을 원칙으로 하여 성경 공부와 연구에 널리 활용되는 성경입니다.'
  },
  {
    translation_name: '70인역 헬라어 구약성경 (Septuagint LXX)',
    cover_image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=400',
    description: '구약 히브리어 성경을 고대 헬라어로 최초 번역한 역사적인 성서입니다.'
  }
];

export function seedDb() {
  const row = db.prepare('SELECT count(*) as count FROM bibles').get() as { count: number };
  if (row.count === 0) {
    const insert = db.prepare(`
      INSERT INTO bibles (translation_name, cover_image, description)
      VALUES (?, ?, ?)
    `);

    db.exec('BEGIN TRANSACTION');
    try {
      for (const bible of seedBibles) {
        insert.run(bible.translation_name, bible.cover_image, bible.description);
      }
      db.exec('COMMIT');
    } catch (e) {
      db.exec('ROLLBACK');
      throw e;
    }
  }
}
