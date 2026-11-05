<p align="center">
  <img src="src/assets/brand/gdg-cnu-logo.png" alt="Google Developer Group Chonnam National University" width="420" />
</p>

<h1 align="center">GDG on Campus CNU 기술 블로그</h1>

<p align="center">
  전남대학교 GDG on Campus 부원들이 배우고 만든 것을 기록하는 기술 블로그이자 뉴스레터입니다.<br />
  <a href="https://gdg-cnu.github.io">https://gdg-cnu.github.io</a>
</p>

---

## 특징

- **마크다운으로 글쓰기**: `src/content/posts/<slug>/index.md(x)` 파일 하나가 글 하나입니다.
- **PR 기반 발행**: 브랜치 → PR → 리뷰 → 머지하면 GitHub Actions가 자동으로 빌드하고 배포합니다.
- **빌드 단계 검증**: frontmatter 누락, 등록되지 않은 작성자 같은 실수는 PR 체크에서 걸러집니다.
- **기술 블로그 기본기**: 코드 하이라이팅, 목차, 예상 읽기 시간, 태그·작성자별 목록, 페이지네이션
- **검색**: [Pagefind](https://pagefind.app) 기반 정적 검색 (서버 없음)
- **뉴스레터·댓글**: RSS 피드, 스티비 구독 박스, giscus(GitHub Discussions) 댓글
- **기본 품질**: 한국어 UI, 반응형, 다크 모드, SEO 메타태그, 글별 OG 이미지 자동 생성, sitemap

## 기술 스택

| 영역 | 사용 기술 |
| --- | --- |
| 정적 사이트 생성 | [Astro](https://astro.build) 7, MDX, 콘텐츠 컬렉션 |
| 코드 하이라이팅 | [Expressive Code](https://expressive-code.com) |
| 검색 | [Pagefind](https://pagefind.app) |
| OG 이미지 | [satori](https://github.com/vercel/satori) + [resvg](https://github.com/yisibl/resvg-js) |
| 폰트 | [Pretendard](https://github.com/orioncactus/pretendard) |
| 댓글 / 뉴스레터 | [giscus](https://giscus.app) / [스티비](https://stibee.com) |
| 배포 | GitHub Actions → GitHub Pages |

## 로컬에서 실행하기

[Node.js](https://nodejs.org) 22.23 이상이 필요합니다. 레포에 `.nvmrc`가 있어서 nvm을 쓴다면 아래처럼 맞출 수 있어요.

```bash
nvm install   # .nvmrc의 Node 24 설치 (처음 한 번)
nvm use
npm install
npm run dev   # http://localhost:4321
```

### 명령어

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행. 글을 고치면 바로 반영되고, `draft: true` 글도 보입니다. |
| `npm run new:post` | 질문에 답하면 새 글 파일을 만들어 줍니다. |
| `npm run build` | `dist/`에 사이트를 빌드하고 검색 인덱스를 만듭니다. |
| `npm run preview` | 빌드 결과를 로컬에서 확인합니다. **검색은 빌드 후 여기서만 동작해요.** |
| `npm run check` | 타입과 콘텐츠 스키마를 검사합니다. |

## 프로젝트 구조

```text
.
├── .github/
│   ├── workflows/deploy.yml      # main 머지 → 빌드 → GitHub Pages 배포
│   ├── workflows/pr-check.yml    # PR마다 검사·빌드
│   └── PULL_REQUEST_TEMPLATE.md
├── public/                       # 파비콘 등 그대로 복사되는 파일
├── scripts/new-post.mjs          # npm run new:post
├── templates/post.md             # 새 글 템플릿
└── src/
    ├── site.config.ts            # ⭐ 사이트 정보, 메뉴, giscus, 스티비 설정
    ├── content.config.ts         # 글·작성자 frontmatter 스키마
    ├── content/
    │   ├── posts/<slug>/         # 글 (index.md 또는 index.mdx + 이미지)
    │   └── authors/<github-id>.yaml  # 작성자 정보
    ├── components/               # UI 컴포넌트 (mdx/: 글에서 쓰는 컴포넌트)
    ├── layouts/                  # 기본 레이아웃, 글 레이아웃
    ├── pages/                    # 라우트 (/, /posts, /tags, /authors, /search, /rss.xml, /og ...)
    ├── styles/global.css         # 디자인 토큰, 본문 타이포그래피, 다크 모드
    └── utils/                    # 글 조회·태그·읽기 시간·날짜·페이지네이션·OG 이미지
```

## 설정

대부분의 설정은 [`src/site.config.ts`](src/site.config.ts) 한 파일에 있습니다.

- **사이트 정보**: 이름, 소개 문구, 홈 히어로, 페이지당 글 수
- **giscus 댓글**: `GISCUS.repoId`, `GISCUS.categoryId`를 채우면 댓글이 켜집니다. ([giscus.app](https://giscus.app)에서 확인)
- **스티비 뉴스레터**: `NEWSLETTER.subscribeUrl`에 구독 페이지 주소를 넣거나, `src/components/newsletter/stibee-embed.html`에 스티비 구독 폼 HTML 코드를 붙여넣으세요.

값이 비어 있으면 해당 기능은 "준비 중"으로 표시되고, 빌드는 그대로 통과합니다.

## 배포

`main` 브랜치에 머지되면 [`deploy.yml`](.github/workflows/deploy.yml)이 자동으로 실행되어 1~2분 안에 https://gdg-cnu.github.io 에 반영됩니다. Actions 탭에서 `Deploy` 워크플로를 수동으로 실행할 수도 있습니다.

## 기여하기

글을 쓰거나 기능을 고치고 싶다면 [CONTRIBUTING.md](CONTRIBUTING.md)를 먼저 읽어 주세요.

- 처음이라면: 작성자 등록 → `npm run new:post` → PR
- 브랜치 이름: 글은 `post/<slug>`, 기능은 `feat/<기능>`

## 저작권

- 글: 각 글의 저작권은 작성자에게 있습니다.
- 사이트 코드: 라이선스는 아직 정하지 않았습니다. 정해지면 `LICENSE` 파일로 추가합니다.
- Google Developer Groups 로고와 명칭은 Google의 상표입니다.
