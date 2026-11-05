import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { SITE } from '@/site.config';
import { getPostAuthors, getPublishedPosts } from '@/utils/posts';

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: APIRoute = async (context) => {
  const posts = await getPublishedPosts();
  const items = await Promise.all(
    posts.map(async (post) => {
      const authors = await getPostAuthors(post);
      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.date,
        link: `/posts/${post.id}/`,
        categories: post.data.tags,
        customData: authors
          .map((author) => `<dc:creator>${escapeXml(author.data.name)}</dc:creator>`)
          .join(''),
      };
    }),
  );

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items,
    xmlns: { dc: 'http://purl.org/dc/elements/1.1/' },
    customData: `<language>${SITE.lang}</language>`,
    trailingSlash: true,
  });
};
