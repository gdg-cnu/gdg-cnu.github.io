import { POST_TYPE_KEYS, type PostType } from '@/site.config';
import { getCollection, getEntries, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;
export type Author = CollectionEntry<'authors'>;

/**
 * 공개된 글 목록 (최신순)
 * 개발 서버에서는 draft 글도 보여주고, 배포 빌드에서는 제외합니다.
 */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getPostAuthors(post: Post): Promise<Author[]> {
  return getEntries(post.data.author);
}

/** 태그 → URL 조각. 대소문자·공백 차이를 없애 "React"와 "react"를 같은 태그로 묶습니다. */
export function tagSlug(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\p{Letter}\p{Number}.+#-]/gu, '')
    .replace(/-+/g, '-');
}

export interface TagInfo {
  slug: string;
  /** 가장 먼저 쓰인 표기를 대표 이름으로 사용합니다. */
  name: string;
  count: number;
}

export function collectTags(posts: Post[]): TagInfo[] {
  const map = new Map<string, TagInfo>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      const slug = tagSlug(tag);
      const info = map.get(slug);
      if (info) info.count += 1;
      else map.set(slug, { slug, name: tag, count: 1 });
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'ko'));
}

/** 글 종류별 개수 (POST_TYPES 순서대로, 0개인 종류도 포함) */
export function countByType(posts: Post[]): Record<PostType, number> {
  const counts = Object.fromEntries(POST_TYPE_KEYS.map((key) => [key, 0])) as Record<PostType, number>;
  for (const post of posts) counts[post.data.type] += 1;
  return counts;
}

export function typeUrl(type: PostType): string {
  return `/types/${type}/`;
}
