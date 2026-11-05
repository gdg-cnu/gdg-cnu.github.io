import type { Author } from './posts';

/** 프로필 이미지: avatar가 없으면 GitHub 프로필 이미지를 사용합니다. */
export function avatarUrl(author: Author, size = 96): string {
  return author.data.avatar ?? `https://github.com/${author.data.github}.png?size=${size}`;
}

export function authorUrl(author: Author): string {
  return `/authors/${author.id}/`;
}
