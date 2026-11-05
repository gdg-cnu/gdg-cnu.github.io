/**
 * 사이트 전역 설정
 *
 * 외부 서비스(giscus 댓글, 스티비 뉴스레터) 설정값도 모두 여기에 있습니다.
 * 비밀값이 아니므로 PR로 수정해도 괜찮습니다.
 * 값이 비어 있으면 해당 기능은 화면에서 숨겨지거나 "준비 중"으로 표시되고, 빌드는 그대로 통과합니다.
 */

export const SITE = {
  /** 브라우저 탭, OG, RSS 등에 쓰이는 사이트 이름 */
  title: 'GDG on Campus CNU 기술 블로그',
  /** 헤더 워드마크 */
  brand: 'GDG on Campus CNU',
  brandSub: 'Tech Blog',
  description:
    '전남대학교 GDG on Campus 부원들이 배우고 만든 것을 기록하는 기술 블로그이자 뉴스레터입니다.',
  /** 홈 히어로 */
  heroTitle: 'GDG on Campus CNU',
  heroTagline: '함께 배우고, 만든 것을 나눕니다.',
  topics: ['WEB', 'MOBILE', 'AI', 'CLOUD'],
  /** 배포 주소 (astro.config.mjs의 site와 같아야 합니다) */
  url: 'https://gdg-cnu.github.io',
  lang: 'ko',
  locale: 'ko-KR',
  timeZone: 'Asia/Seoul',
  /** 목록 페이지당 글 수 */
  postsPerPage: 10,
  /** 홈 "최근 글"에 보여줄 글 수 */
  homePostCount: 6,
} as const;

export const NAV: { label: string; href: string }[] = [
  { label: '글', href: '/posts/' },
  { label: '태그', href: '/tags/' },
  { label: '멤버', href: '/authors/' },
];

export const SOCIAL = {
  github: 'https://github.com/gdg-cnu',
  /** GDG 커뮤니티 페이지 등. 비워 두면 표시하지 않습니다. */
  community: '',
  instagram: '',
} as const;

/**
 * giscus 댓글 설정
 * https://giscus.app 에서 레포와 카테고리를 선택하면 아래 값들을 확인할 수 있습니다.
 * repoId 또는 categoryId가 비어 있으면 댓글 영역에 "준비 중" 안내가 표시됩니다.
 */
export const GISCUS = {
  repo: 'gdg-cnu/gdg-cnu.github.io',
  repoId: '',
  category: 'Comments',
  categoryId: '',
  /** 글 URL 경로로 Discussion을 매칭합니다. */
  mapping: 'pathname',
  strict: '1',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'top',
  lang: 'ko',
} as const;

/**
 * 스티비 뉴스레터 구독 설정
 *
 * - subscribeUrl: 스티비 "구독 페이지" 주소 (예: https://page.stibee.com/subscriptions/12345)
 *   값이 있으면 구독 폼에 이메일을 입력하고 버튼을 누를 때 이 페이지가 새 탭으로 열립니다.
 * 비워 두면 구독 박스에 "준비 중" 안내가 표시됩니다.
 */
export const NEWSLETTER = {
  provider: 'stibee',
  subscribeUrl: '',
  title: 'GDG CNU 뉴스레터',
  description: '새 글과 동아리 소식을 메일로 받아보세요. 스팸 없이, 글이 올라올 때만 보내드려요.',
} as const;
