import type { APIRoute, GetStaticPaths } from 'astro';
import { getPostAuthors, getPublishedPosts, type Post } from '@/utils/posts';
import { formatDate } from '@/utils/date';
import { renderOgImage } from '@/utils/og';

// /og/<글 slug>.png
export const getStaticPaths = (async () => {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ post: Post }> = async ({ props }) => {
  const { post } = props;
  const authors = await getPostAuthors(post);
  const png = await renderOgImage({
    title: post.data.title,
    subtitle: post.data.tags.map((tag) => `#${tag}`).join('  '),
    meta: `${authors.map((author) => author.data.name).join(', ')} · ${formatDate(post.data.date)}`,
  });
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
