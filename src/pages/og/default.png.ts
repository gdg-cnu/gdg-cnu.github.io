import type { APIRoute } from 'astro';
import { SITE } from '@/site.config';
import { renderOgImage } from '@/utils/og';

// 글이 아닌 페이지(홈, 목록 등)에서 쓰는 기본 OG 이미지
export const GET: APIRoute = async () => {
  const png = await renderOgImage({
    title: SITE.title,
    subtitle: SITE.heroTagline,
    meta: SITE.topics.join(' · '),
  });
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
