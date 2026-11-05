# 기여 가이드

GDG on Campus CNU 기술 블로그에 관심을 가져 주셔서 고마워요! 이 문서는 **글을 쓰는 방법**과 **기능을 고치는 방법**을 정리합니다.

- [한눈에 보기](#한눈에-보기)
- [준비하기](#준비하기)
- [브랜치 규칙](#브랜치-규칙)
- [작성자 등록하기 (처음 한 번)](#작성자-등록하기-처음-한-번)
- [글 쓰기](#글-쓰기)
- [뉴스레터 발행하기](#뉴스레터-발행하기)
- [PR 올리기](#pr-올리기)
- [리뷰 가이드](#리뷰-가이드)
- [기능 개발하기](#기능-개발하기)

## 한눈에 보기

```text
브랜치 만들기 → (처음이면) 작성자 등록 → npm run new:post → 글 쓰기 → npm run dev로 확인
→ 커밋 & 푸시 → PR → PR Check 통과 + 리뷰 승인 → main 머지 → 자동 배포 (1~2분)
```

## 준비하기

1. **Node.js 22.23 이상**이 필요합니다. nvm을 쓴다면 레포 폴더에서 `nvm install && nvm use`.
2. 레포를 클론하고 패키지를 설치합니다.

   ```bash
   git clone https://github.com/gdg-cnu/gdg-cnu.github.io.git
   cd gdg-cnu.github.io
   npm install
   ```

3. 동아리 Organization 멤버라면 레포에 바로 브랜치를 만들 수 있어요. 멤버가 아니라면 Fork한 뒤 PR을 올려 주세요.

## 브랜치 규칙

`main`에는 직접 푸시하지 않고, 항상 브랜치를 만들어 PR로 합칩니다.

| 종류 | 브랜치 이름 | 예시 |
| --- | --- | --- |
| 새 글, 글 수정 | `post/<글-slug>` | `post/react-server-components` |
| 새 기능 | `feat/<기능>` | `feat/series-navigation` |
| 버그 수정 | `fix/<내용>` | `fix/toc-scroll-offset` |
| 문서 | `docs/<내용>` | `docs/contributing-images` |
| 설정·의존성 | `chore/<내용>` | `chore/update-astro` |

- 영문 소문자와 하이픈(`-`)만 써 주세요. 글 브랜치는 글의 slug(폴더 이름)와 맞추면 찾기 쉬워요.
- 브랜치 하나에는 글 하나(또는 기능 하나)만 담아 주세요.

```bash
git switch main
git pull
git switch -c post/react-server-components
```

## 작성자 등록하기 (처음 한 번)

글을 처음 쓴다면 `src/content/authors/<GitHub ID>.yaml` 파일을 만들어 주세요. **파일 이름이 곧 작성자 ID**이고, 글의 `author` 값으로 씁니다.

```yaml title="src/content/authors/octocat.yaml"
name: 홍길동            # 필수: 화면에 보일 이름
github: octocat         # 필수: GitHub ID
bio: 프론트엔드와 접근성에 관심이 많아요.   # 선택: 한 줄 소개
role: 2기 Web 파트      # 선택: 기수, 파트, 역할
# avatar: https://...   # 선택: 비워 두면 GitHub 프로필 이미지를 사용
# links:                # 선택
#   website: https://example.com
#   linkedin: https://www.linkedin.com/in/...
#   email: you@example.com
```

등록하면 `/authors/<GitHub ID>/` 페이지가 생기고, 멤버 목록에도 보여요. 작성자 등록은 첫 글 PR에 함께 넣어도 됩니다.

## 글 쓰기

### 1. 글 파일 만들기

```bash
npm run new:post
```

제목, slug, 작성자, 설명, 태그를 물어본 뒤 `src/content/posts/<slug>/index.md`를 만들어 줍니다. 직접 만들고 싶다면 [`templates/post.md`](templates/post.md)를 복사해서 같은 위치에 두면 돼요.

```text
src/content/posts/
└── react-server-components/     ← 폴더 이름(slug)이 URL이 됩니다 → /posts/react-server-components/
    ├── index.md                 ← 글 본문 (컴포넌트를 쓰려면 index.mdx)
    ├── cover.png                ← 썸네일 (선택)
    └── diagram.png              ← 본문 이미지
```

- slug는 **영문 소문자, 숫자, 하이픈**만 씁니다. 한 번 배포된 slug는 바꾸지 않는 게 좋아요(링크가 깨집니다).

### 2. frontmatter

```yaml
---
title: React Server Components 톺아보기
description: 서버 컴포넌트가 무엇을 해결하는지, 클라이언트 컴포넌트와 어떻게 나뉘는지 정리합니다.
date: 2026-11-05
author: octocat
type: tech
tags:
  - React
  - 프론트엔드
thumbnail: ./cover.png
thumbnailAlt: 서버와 클라이언트 컴포넌트를 나눈 다이어그램
draft: false
---
```

| 필드 | 필수 | 설명 |
| --- | --- | --- |
| `title` | ✅ | 글 제목 (120자 이하) |
| `description` | ✅ | 한두 문장 요약. 목록, 검색 결과, SNS 미리보기, RSS에 쓰여요. |
| `date` | ✅ | 발행일 `YYYY-MM-DD`. 목록은 이 날짜 기준 최신순입니다. |
| `author` | ✅ | 작성자 ID. 공동 작성이면 목록으로 `author: [octocat, hubot]` |
| `type` | | 글 종류: `tech`(기술) · `project`(프로젝트) · `retro`(회고) · `news`(소식). 비우면 `tech` |
| `tags` | | 태그 목록. 대소문자는 구분하지 않아요(`React` = `react`). |
| `updated` | | 크게 고친 날짜. 글 상단에 "수정"으로 표시돼요. |
| `thumbnail` | | 글 폴더 안의 이미지 경로. 목록과 글 상단에 보여요. |
| `thumbnailAlt` | | 썸네일 대체 텍스트 |
| `draft` | | `true`면 로컬에서만 보이고 배포에서 빠져요. 기본값 `false` |

> SNS 미리보기 이미지(OG 이미지)는 제목·태그·작성자로 **자동 생성**되니 따로 만들지 않아도 됩니다.

#### 글 종류 고르기

글 종류는 "어떤 분야인가"가 아니라 **"어떤 성격의 글인가"**예요. 분야(웹, 디자인, 게임, AI …)는 태그로 적어 주세요. 사이트에서는 GDG 4색이 종류를 나타내요.

| `type` | 이름 | 색 | 이런 글 |
| --- | --- | --- | --- |
| `tech` | 기술 | 파랑 | 개념 정리, 튜토리얼, 트러블슈팅. 웹·앱 개발뿐 아니라 AI, 데이터 분석, 게임 엔진, 디자인 시스템도 모두 기술 글이에요. |
| `project` | 프로젝트 | 초록 | 만든 것 소개, 개발기, 디자인 케이스 스터디 |
| `retro` | 회고 | 노랑 | 회고, 에세이, 성장 이야기 |
| `news` | 소식 | 빨강 | 행사·세미나·해커톤 후기, 동아리 공지 |

예를 들어 게임 최적화 팁은 `tech` + `#게임`, 앱 리디자인 과정은 `project` + `#디자인`이에요. 이 블로그는 "개발에 관심 있는 누구나" 쓰는 곳이라, 전공과 상관없이 배운 것을 정리했다면 `tech`로 올려 주세요.

#### 태그 고르는 팁

새 태그를 만들기 전에 [태그 목록](https://gdg-cnu.github.io/tags/)에서 비슷한 태그가 있는지 확인해 주세요. 기술 이름은 공식 표기(`React`, `Kotlin`, `GitHub Actions`)로, 분야는 한글(`프론트엔드`, `회고`, `트러블슈팅`)로 쓰면 깔끔해요.

### 3. 본문 작성

- 본문 제목은 `##`부터 시작해 주세요. `#`(h1)은 frontmatter의 `title`이 씁니다.
- `##`, `###` 제목은 자동으로 **목차**가 돼요.

#### 이미지

이미지는 글 폴더에 넣고 상대 경로로 씁니다. 빌드할 때 자동으로 최적화(WebP 변환, 크기 조절)돼요.

```md
![로그인 흐름 다이어그램](./login-flow.png)
```

- 대체 텍스트(`[ ]` 안)는 꼭 써 주세요.
- 원본은 가로 2000px, 1MB 이하를 권장해요. 스크린샷은 PNG, 사진은 JPG가 좋아요.

#### 코드 블록

[Expressive Code](https://expressive-code.com/key-features/syntax-highlighting/)를 써서 아래 기능을 지원합니다.

````md
```ts title="src/utils/date.ts" {3-4}
export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',   // 3~4번 줄 강조
    month: 'long',
  }).format(date);
}
```

```diff lang="js"
- const answer = 41;
+ const answer = 42;
```

```js del={1} ins={2}
console.log('old');
console.log('new');
```
````

- `title="파일명"`: 코드 블록 위에 파일 이름 탭
- `{2-4}`: 줄 강조, `ins={..}` / `del={..}`: 추가·삭제 줄 표시
- 터미널 명령은 ` ```bash ` 로 쓰면 터미널 모양으로 보여요.

#### MDX와 컴포넌트

컴포넌트를 쓰고 싶다면 파일을 `index.mdx`로 만드세요. `Callout`은 import 없이 바로 쓸 수 있어요.

```mdx
<Callout type="tip" title="알아두면 좋아요">
  `type`은 note(기본), tip, warning, danger 중 하나예요.
</Callout>
```

> MDX에서는 HTML 주석(`<!-- -->`) 대신 `{/* 주석 */}`을 써야 해요.

### 4. 로컬에서 확인

```bash
npm run dev
```

http://localhost:4321/posts/<slug>/ 에서 바로 확인할 수 있어요. 저장하면 자동으로 새로고침됩니다.

- 검색은 빌드 결과에서만 동작해요: `npm run build && npm run preview`
- PR을 올리기 전에 `npm run build`가 통과하는지 확인하면 PR Check에서 실패할 일이 없어요.

## 뉴스레터 발행하기

뉴스레터는 글 종류가 아니라 **회차로 쌓이는 별도 코너**예요(`/newsletter/`). 스티비로 보낸 회차를 블로그에도 같은 내용으로 남겨 두면, 구독하지 않은 사람도 지난 호를 볼 수 있어요. 보통 운영진이 발행해요.

1. `src/content/newsletters/<회차>.md` 파일을 만들어요. 파일 이름이 주소가 돼요 → `/newsletter/3/`

   ```yaml
   ---
   issue: 3
   title: 11월 셋째 주 소식
   description: 이번 호에 실린 글과 다음 세미나 안내
   date: 2026-11-20
   draft: false
   ---
   ```

2. 본문에는 이번 호에 실린 글 링크(`/posts/<slug>/`)와 동아리 소식을 정리해요.
3. 모집 공고나 행사 안내처럼 바로 알려야 하는 내용은 뉴스레터를 기다리지 말고 `type: news`(소식) 글로 먼저 올리고, 다음 호에서 다시 소개해 주세요.
4. 브랜치는 `post/newsletter-<회차>`, 커밋은 `post: 뉴스레터 #3`을 권장해요.

## PR 올리기

1. **커밋**: 메시지는 `종류: 내용` 형식을 권장해요.

   ```bash
   git add src/content/posts/react-server-components src/content/authors/octocat.yaml
   git commit -m "post: React Server Components 톺아보기"
   git push -u origin post/react-server-components
   ```

   | 종류 | 용도 |
   | --- | --- |
   | `post` | 새 글, 글 수정 |
   | `feat` / `fix` | 기능 추가 / 버그 수정 |
   | `docs` / `chore` / `ci` | 문서 / 설정·의존성 / 워크플로 |

2. **PR 만들기**: GitHub에서 `main`을 대상으로 PR을 열면 템플릿이 자동으로 채워져요. 체크리스트를 확인해 주세요.
3. **PR Check**: 자동으로 `npm run check`와 `npm run build`가 돌아요. 실패하면 Actions 로그에서 원인을 확인하세요. 흔한 원인은 아래와 같아요.
   - `Invalid content reference ... in collection "authors"` → 작성자 ID 오타 또는 작성자 파일 누락
   - `data does not match collection schema` + `description: Required` 등 → frontmatter 필드 누락이나 형식 오류 (날짜는 `YYYY-MM-DD`)
   - `[ImageNotFound] Could not find requested image` → 이미지 경로 오타
   - **로컬에선 되는데 PR Check만 실패**한다면 파일 이름 대소문자를 확인하세요. macOS·Windows는 `Cover.png`와 `cover.png`를 같은 파일로 보지만, PR Check가 도는 Linux는 구분합니다.
4. **리뷰**: 최소 1명의 승인이 필요해요. 리뷰 코멘트를 반영하면 같은 브랜치에 커밋을 추가로 푸시하면 됩니다.
5. **머지**: 승인과 PR Check가 끝나면 **Squash and merge**로 합쳐 주세요. 머지되면 1~2분 뒤 사이트에 반영돼요.

## 리뷰 가이드

글 리뷰는 "틀린 곳 찾기"보다 **읽는 사람 입장에서 함께 다듬는 과정**이에요.

- **정확성**: 기술적으로 틀리거나 오해할 만한 설명이 없는지
- **구성**: 제목과 설명이 내용을 잘 요약하는지, 흐름이 자연스러운지
- **표기**: 맞춤법, 코드 블록 언어 지정, 이미지 대체 텍스트
- **안전**: API 키, 개인정보, 사내·외부 비공개 정보, 출처 없는 이미지가 없는지
- 제안은 GitHub의 **Suggest changes** 기능을 쓰면 작성자가 바로 반영할 수 있어요.

## 기능 개발하기

- `feat/<기능>` 브랜치에서 작업하고, PR 전에 `npm run check`와 `npm run build`를 확인해 주세요.
- 화면이 바뀌면 PR에 라이트·다크 모드 스크린샷과 모바일 화면을 첨부해 주세요.
- 사이트 설정은 [`src/site.config.ts`](src/site.config.ts), 디자인 토큰(색·폰트·간격)은 [`src/styles/global.css`](src/styles/global.css)에 있어요.
- GDG 브랜드 컬러(파랑·빨강·노랑·초록)는 포인트로만 써 주세요. 본문과 배경은 무채색 계열을 유지합니다.
- 새 패키지를 추가할 때는 PR 설명에 이유를 적어 주세요.

궁금한 점은 [Issues](https://github.com/gdg-cnu/gdg-cnu.github.io/issues)나 동아리 채널에 남겨 주세요. 🙌
