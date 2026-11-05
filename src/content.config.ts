import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * 작성자: src/content/authors/<GitHub ID>.yaml
 * 파일 이름(확장자 제외)이 곧 작성자 ID이며, 글 frontmatter의 author 값으로 사용합니다.
 */
const authors = defineCollection({
  loader: glob({ pattern: '*.{yaml,yml}', base: './src/content/authors' }),
  schema: z.object({
    name: z.string().min(1),
    github: z.string().min(1),
    /** 비워 두면 https://github.com/<github>.png 를 사용합니다. */
    avatar: z.url().optional(),
    /** 한 줄 소개 */
    bio: z.string().optional(),
    /** 예: "2기 Web 파트", "Organizer" */
    role: z.string().optional(),
    links: z
      .object({
        website: z.url().optional(),
        linkedin: z.url().optional(),
        email: z.email().optional(),
      })
      .optional(),
  }),
});

/**
 * 글: src/content/posts/<slug>/index.md(x)
 * 폴더 이름이 URL이 됩니다. → /posts/<slug>/
 */
const posts = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/posts',
    // "<slug>/index.md" 와 "<slug>.md" 모두 "<slug>"를 ID로 사용합니다.
    generateId: ({ entry }) => entry.replace(/(\/index)?\.mdx?$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1).max(120),
      description: z.string().min(1),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      /** 작성자 ID 하나 또는 여러 명(공동 작성) */
      author: z
        .union([reference('authors'), z.array(reference('authors')).min(1)])
        .transform((value) => (Array.isArray(value) ? value : [value])),
      tags: z.array(z.string().trim().min(1)).default([]),
      /** 글 폴더 안의 이미지 경로 (예: ./cover.png) */
      thumbnail: image().optional(),
      thumbnailAlt: z.string().optional(),
      /** true면 로컬 개발 서버에서만 보이고 배포에서는 제외됩니다. */
      draft: z.boolean().default(false),
    }),
});

export const collections = { authors, posts };
