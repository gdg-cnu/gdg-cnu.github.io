import { SITE } from '@/site.config';

export interface PageInfo {
  current: number;
  last: number;
  total: number;
  /** 목록의 첫 페이지 주소 (예: /posts/, /tags/astro/) */
  base: string;
}

export interface PageChunk<T> {
  /** [...page] rest 파라미터 값: 1페이지는 undefined, 나머지는 "page/2" 형태 */
  param: string | undefined;
  items: T[];
  info: PageInfo;
}

/**
 * 목록을 페이지 단위로 나눕니다.
 * 1페이지는 base(/posts/), 2페이지부터는 base + page/N/ (/posts/page/2/) 주소를 씁니다.
 */
export function paginate<T>(items: T[], base: string, perPage: number = SITE.postsPerPage): PageChunk<T>[] {
  const last = Math.max(1, Math.ceil(items.length / perPage));
  return Array.from({ length: last }, (_, index) => {
    const current = index + 1;
    return {
      param: current === 1 ? undefined : `page/${current}`,
      items: items.slice(index * perPage, current * perPage),
      info: { current, last, total: items.length, base },
    };
  });
}

export function pageUrl(base: string, page: number): string {
  return page <= 1 ? base : `${base}page/${page}/`;
}
