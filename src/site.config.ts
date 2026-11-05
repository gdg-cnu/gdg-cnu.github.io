/**
 * 사이트 전역 설정
 *
 * 외부 서비스(GoatCounter 조회수, 스티비 뉴스레터) 설정값도 모두 여기에 있습니다.
 * 비밀값이 아니므로 PR로 수정해도 괜찮습니다.
 * 값이 비어 있으면 해당 기능은 화면에서 숨겨지거나 "준비 중"으로 표시되고, 빌드는 그대로 통과합니다.
 */

export const SITE = {
  /** 브라우저 탭, OG, RSS 등에 쓰이는 사이트 이름 */
  title: 'GDG on Campus CNU 기술 블로그',
  /** 헤더 워드마크 */
  brand: 'GDG on Campus CNU',
  /** 좁은 화면용 짧은 이름 */
  brandShort: 'GDG CNU',
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
 * 조회수 (GoatCounter)
 *
 * 1. https://www.goatcounter.com 에서 사이트를 만들며 code를 정합니다. (예: gdg-cnu → https://gdg-cnu.goatcounter.com)
 * 2. GoatCounter Settings에서 "Allow adding visitor counts on your website"를 켭니다.
 * 3. 아래 goatcounterCode에 code를 넣으면 방문 집계와 글 조회수 표시가 켜집니다.
 *
 * 비워 두면 집계 스크립트를 넣지 않고 조회수도 표시하지 않습니다.
 * GoatCounter는 쿠키를 쓰지 않아 쿠키 동의 배너가 필요 없습니다.
 * 표시되는 조회수는 GoatCounter 쪽에서 최대 4시간 캐시되어 바로 반영되지 않을 수 있습니다.
 */
export const ANALYTICS = {
  goatcounterCode: '',
} as const;

/**
 * 스티비 뉴스레터 구독 설정
 *
 * 두 가지 방법 중 하나를 쓰면 됩니다. (둘 다 있으면 2번이 우선)
 *
 * 1. subscribeUrl: 스티비 구독 폼의 공유 링크(구독 페이지 주소)
 *    → 구독 박스에 "구독하기" 버튼이 생기고, 누르면 스티비 구독 페이지가 새 탭으로 열립니다.
 *
 * 2. src/components/newsletter/stibee-embed.html 파일에 스티비 구독 폼의 "HTML 코드"를 붙여넣기
 *    → 이메일 입력칸이 블로그 안에 바로 들어갑니다. (개인정보 동의 등 스티비 폼 설정이 그대로 적용)
 *
 * 둘 다 비어 있으면 구독 박스에 "준비 중" 안내와 RSS 링크가 표시됩니다.
 */
export const NEWSLETTER = {
  provider: 'stibee',
  subscribeUrl: '',
  title: 'GDG CNU 뉴스레터',
  description: '새 글과 동아리 소식을 메일로 받아보세요. 스팸 없이, 소식이 있을 때만 보내드려요.',
} as const;
