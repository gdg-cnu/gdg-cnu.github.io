import { readFile } from 'node:fs/promises';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { SITE } from '@/site.config';

/**
 * 빌드할 때 OG 이미지(1200×630 PNG)를 만듭니다.
 * satori로 HTML/CSS 구조를 SVG로 그린 뒤 resvg로 PNG로 변환합니다.
 */

const WIDTH = 1200;
const HEIGHT = 630;
const root = process.cwd();
const fontDir = path.join(root, 'node_modules/pretendard/dist/public/static');

type Node = { type: string; props: Record<string, unknown> & { style?: Record<string, unknown> } };

const h = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): Node => ({
  type,
  props: { style, children, ...extra },
});

let assets: Promise<{ fonts: Parameters<typeof satori>[1]['fonts']; logo: string }> | undefined;

function loadAssets() {
  assets ??= (async () => {
    const [bold, medium, logo] = await Promise.all([
      readFile(path.join(fontDir, 'Pretendard-Bold.otf')),
      readFile(path.join(fontDir, 'Pretendard-Medium.otf')),
      readFile(path.join(root, 'src/assets/brand/gdg-cnu-logo.png')),
    ]);
    return {
      fonts: [
        { name: 'Pretendard', data: bold, weight: 700 as const, style: 'normal' as const },
        { name: 'Pretendard', data: medium, weight: 500 as const, style: 'normal' as const },
      ],
      logo: `data:image/png;base64,${logo.toString('base64')}`,
    };
  })();
  return assets;
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

export interface OgOptions {
  title: string;
  /** 제목 아래 보조 문구 (태그, 설명 등) */
  subtitle?: string;
  /** 하단 왼쪽 문구 (작성자 · 날짜) */
  meta?: string;
}

export async function renderOgImage({ title, subtitle, meta }: OgOptions): Promise<Uint8Array<ArrayBuffer>> {
  const { fonts, logo } = await loadAssets();
  const titleSize = title.length > 40 ? 54 : 64;

  const tree = h(
    'div',
    {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#faf9f6',
      fontFamily: 'Pretendard',
      color: '#24231f',
    },
    [
      h(
        'div',
        { display: 'flex', flexDirection: 'column', flex: 1, padding: '64px 80px 48px' },
        [
          h('img', { height: 52, width: 52 * (879 / 124) }, undefined, { src: logo }),
          h(
            'div',
            { display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' },
            [
              h(
                'div',
                {
                  fontSize: titleSize,
                  fontWeight: 700,
                  lineHeight: 1.3,
                  letterSpacing: '-0.02em',
                  wordBreak: 'keep-all',
                },
                truncate(title, 70),
              ),
              subtitle
                ? h(
                    'div',
                    { marginTop: 24, fontSize: 28, fontWeight: 500, color: '#66635b', wordBreak: 'keep-all' },
                    truncate(subtitle, 60),
                  )
                : h('div', {}, ''),
            ],
          ),
          h(
            'div',
            { display: 'flex', justifyContent: 'space-between', fontSize: 24, fontWeight: 500, color: '#8e8a81' },
            [h('div', {}, meta ?? ''), h('div', {}, new URL(SITE.url).host)],
          ),
        ],
      ),
      h('div', { display: 'flex', height: 12 }, [
        h('div', { flex: 1, backgroundColor: '#4285f4' }),
        h('div', { flex: 1, backgroundColor: '#ea4335' }),
        h('div', { flex: 1, backgroundColor: '#fbbc04' }),
        h('div', { flex: 1, backgroundColor: '#34a853' }),
      ]),
    ],
  );

  const svg = await satori(tree as Parameters<typeof satori>[0], { width: WIDTH, height: HEIGHT, fonts });
  // Response 본문으로 바로 쓸 수 있도록 ArrayBuffer 기반 Uint8Array로 복사합니다.
  return new Uint8Array(new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } }).render().asPng());
}
