// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';

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
});
