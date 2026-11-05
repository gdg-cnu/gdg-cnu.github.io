import type { APIRoute, GetStaticPaths } from 'astro';
import { getPublishedNewsletters, type Newsletter } from '@/utils/posts';
import { formatDate } from '@/utils/date';
import { renderOgImage } from '@/utils/og';

// /og/newsletter/<회차>.png
export const getStaticPaths = (async () => {
  const issues = await getPublishedNewsletters();
  return issues.map((issue) => ({ params: { issue: String(issue.data.issue) }, props: { issue } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ issue: Newsletter }> = async ({ props }) => {
  const { issue } = props;
  const png = await renderOgImage({
    title: issue.data.title,
    subtitle: `뉴스레터 #${issue.data.issue}`,
    meta: formatDate(issue.data.date),
  });
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
