/**
 * GDG 로고의 꺾쇠(< >)를 SVG로 다시 그린 도형 정보
 *
 * 꺾쇠 하나는 둥근 막대(pill) 두 개로 이루어집니다.
 * - < : 빨강(위) + 파랑(아래), 파랑이 앞
 * - > : 노랑(아래) + 초록(위), 초록이 앞
 * 색은 global.css의 --gdg-* 변수, 테두리는 --bracket-stroke 를 씁니다.
 */

export const PILL = { x: -47.5, y: -18, width: 95, height: 36, rx: 18 } as const;

/** 꺾쇠 하나를 담는 viewBox (테두리 두께까지 포함) */
export const BRACKET_VIEWBOX = '-6 -10 132 140';

/** 로고 전체(< >)를 담는 viewBox. 오른쪽 꺾쇠는 RIGHT_OFFSET 만큼 옮겨 그립니다. */
export const RIGHT_OFFSET = 120;
export const MARK_VIEWBOX = `-6 -10 ${RIGHT_OFFSET + 132} 140`;

export interface Pill {
  fill: string;
  transform: string;
}

/** 그리는 순서대로 (뒤 → 앞) */
export const LEFT_PILLS: Pill[] = [
  { fill: 'var(--gdg-red)', transform: 'translate(60 35) rotate(-38)' },
  { fill: 'var(--gdg-blue)', transform: 'translate(60 85) rotate(38)' },
];

export const RIGHT_PILLS: Pill[] = [
  { fill: 'var(--gdg-yellow)', transform: 'translate(60 85) rotate(-38)' },
  { fill: 'var(--gdg-green)', transform: 'translate(60 35) rotate(38)' },
];
