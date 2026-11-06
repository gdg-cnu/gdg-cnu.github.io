// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';
import fs from 'node:fs';
import path from 'node:path';

/**
 * 개발 서버에서도 검색을 쓸 수 있게 해 주는 플러그인
 * 검색 인덱스(dist/pagefind)는 `npm run build` 때만 만들어지므로,
 * 개발 서버(`npm run dev`)는 마지막으로 빌드한 인덱스를 /pagefind/ 주소로 그대로 내려줍니다.
 * 배포 빌드에는 영향이 없습니다.
 * @returns {import('vite').Plugin}
 */
function pagefindInDev() {
  const root = path.resolve('dist/pagefind');
  /** @type {Record<string, string>} */
  const types = { '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.wasm': 'application/wasm' };
  return {
    name: 'pagefind-in-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/pagefind', (req, res, next) => {
        const file = path.join(root, decodeURIComponent((req.url ?? '/').split('?')[0]));
        if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return next();
        res.setHeader('Content-Type', types[path.extname(file)] ?? 'application/octet-stream');
        fs.createReadStream(file).pipe(res);
      });
    },
  };
}

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: 'https://gdg-cnu.github.io',
  trailingSlash: 'always',
  integrations: [
    // expressiveCode는 mdx보다 먼저 와야 MDX 안의 코드 블록에도 적용됩니다.
    expressiveCode({
      themes: ['github-light', 'github-dark'],
      // 사이트 다크 모드 토글(html[data-theme])과 코드 블록 테마를 맞춥니다.
      useDarkModeMediaQuery: false,
      themeCssSelector: (theme) => `[data-theme='${theme.type}']`,
      styleOverrides: {
        borderRadius: '0.5rem',
        codeFontFamily:
          "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        codeFontSize: '0.875rem',
        uiFontFamily: "'Pretendard Variable', Pretendard, system-ui, sans-serif",
      },
      defaultProps: {
        wrap: false,
      },
    }),
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/search/'),
    }),
  ],
  vite: {
    plugins: [pagefindInDev()],
  },
});
