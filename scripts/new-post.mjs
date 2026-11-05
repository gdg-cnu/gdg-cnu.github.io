#!/usr/bin/env node
/**
 * 새 글 만들기: npm run new:post
 *
 * 질문에 답하면 src/content/posts/<slug>/index.md(x) 파일을 템플릿으로 만들어 줍니다.
 * 외부 패키지 없이 Node.js 기본 기능만 사용합니다.
 */
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const postsDir = path.join(root, 'src/content/posts');
const authorsDir = path.join(root, 'src/content/authors');
const templatePath = path.join(root, 'templates/post.md');

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** 글 종류 (src/site.config.ts의 POST_TYPES와 같게 유지) */
const POST_TYPES = [
  { key: 'tech', label: '기술', hint: '개념 정리, 튜토리얼, 트러블슈팅' },
  { key: 'project', label: '프로젝트', hint: '만든 것 소개, 개발기, 케이스 스터디' },
  { key: 'retro', label: '회고', hint: '회고, 에세이, 성장 이야기' },
  { key: 'news', label: '소식', hint: '행사·세미나 후기, 동아리 공지' },
];

/** 영문·숫자만 남겨 slug 후보를 만듭니다. 한글 제목이면 빈 문자열이 될 수 있습니다. */
function suggestSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/[\s-]+/g, '-');
}

/** 오늘 날짜 (한국 시간, YYYY-MM-DD) */
function today() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(new Date());
}

async function listAuthors() {
  if (!existsSync(authorsDir)) return [];
  const files = await readdir(authorsDir);
  return files.filter((file) => /\.ya?ml$/.test(file)).map((file) => file.replace(/\.ya?ml$/, ''));
}

/** git 설정의 이름/이메일이 작성자 ID와 같으면 기본값으로 씁니다. */
function guessAuthor(authors) {
  const candidates = [];
  for (const key of ['github.user', 'user.name', 'user.email']) {
    try {
      candidates.push(execSync(`git config ${key}`, { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim());
    } catch {
      // 설정이 없으면 무시합니다.
    }
  }
  const lower = candidates.map((value) => value.toLowerCase().split('@')[0]);
  return authors.find((id) => lower.includes(id.toLowerCase())) ?? (authors.length === 1 ? authors[0] : '');
}

const yamlString = (value) => JSON.stringify(value);

/**
 * 한 줄씩 질문하고 답을 받습니다.
 * 입력을 큐에 쌓아 두기 때문에 터미널 입력과 파이프 입력(테스트용) 모두 동작합니다.
 */
function createPrompter() {
  const rl = createInterface({ input: process.stdin, terminal: false });
  const lines = [];
  const waiters = [];
  let closed = false;
  rl.on('line', (line) => {
    const waiter = waiters.shift();
    if (waiter) waiter(line);
    else lines.push(line);
  });
  rl.on('close', () => {
    closed = true;
    while (waiters.length) waiters.shift()(null);
  });

  const ask = async (question, fallback = '') => {
    const hint = fallback ? ` (${fallback})` : '';
    process.stdout.write(`${question}${hint}: `);
    const line = await new Promise((resolve) => {
      if (lines.length) resolve(lines.shift());
      else if (closed) resolve(null);
      else waiters.push(resolve);
    });
    if (line === null) {
      if (fallback) return fallback;
      throw new Error('입력이 끝나서 글을 만들지 못했어요.');
    }
    if (!process.stdin.isTTY) process.stdout.write(`${line}\n`);
    return line.trim() || fallback;
  };

  return { ask, close: () => rl.close() };
}

async function main() {
  const { ask, close } = createPrompter();

  console.log('\n📝 새 글을 만듭니다. 나중에 파일에서 언제든 고칠 수 있어요.\n');

  let title = '';
  while (!title) title = await ask('제목');

  let slug = '';
  const suggested = suggestSlug(title);
  while (true) {
    slug = await ask('URL slug (영문 소문자·숫자·하이픈, 예: react-server-components)', suggested);
    if (!SLUG_PATTERN.test(slug)) {
      console.log('  ⚠️  영문 소문자, 숫자, 하이픈(-)만 쓸 수 있어요.');
      continue;
    }
    if (existsSync(path.join(postsDir, slug))) {
      console.log(`  ⚠️  "${slug}" 글이 이미 있어요. 다른 slug를 입력해 주세요.`);
      continue;
    }
    break;
  }

  const authors = await listAuthors();
  let author = '';
  while (!author) {
    author = await ask(`작성자 GitHub ID [등록됨: ${authors.join(', ') || '없음'}]`, guessAuthor(authors));
  }
  if (!authors.includes(author)) {
    console.log(
      `  ⚠️  "${author}" 작성자가 아직 등록되지 않았어요.\n` +
        `      src/content/authors/${author}.yaml 파일을 만들어야 빌드가 통과합니다. (CONTRIBUTING.md 참고)`,
    );
  }

  const description = await ask('한 줄 설명 (목록과 검색 결과에 보여요)', `${title}에 대해 정리합니다.`);

  console.log(POST_TYPES.map((t, i) => `  ${i + 1}. ${t.label} — ${t.hint}`).join('\n'));
  let type;
  while (!type) {
    const answer = (await ask('글 종류 번호', '1')).toLowerCase();
    type = POST_TYPES[Number(answer) - 1] ?? POST_TYPES.find((t) => t.key === answer || t.label === answer);
    if (!type) console.log('  ⚠️  1~4 중에서 골라 주세요.');
  }
  const tags = (await ask('태그 (쉼표로 구분, 예: React, 프론트엔드)'))
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
  const useMdx = (await ask('MDX로 만들까요? 컴포넌트를 쓸 때만 필요해요 (y/N)', 'N')).toLowerCase().startsWith('y');

  close();

  let template = await readFile(templatePath, 'utf8');
  // MDX는 HTML 주석(<!-- -->)을 쓸 수 없어서 JSX 주석으로 바꿉니다.
  if (useMdx) template = template.replace('<!--', '{/*').replace('-->', '*/}');
  const content = template
    .replace('{{title}}', yamlString(title))
    .replace('{{description}}', yamlString(description))
    .replace('{{date}}', today())
    .replace('{{author}}', author)
    .replace('{{type}}', type.key)
    .replace('{{tags}}', tags.length ? tags.map((tag) => `  - ${yamlString(tag)}`).join('\n') : '  - 기타');

  const dir = path.join(postsDir, slug);
  const file = path.join(dir, useMdx ? 'index.mdx' : 'index.md');
  await mkdir(dir, { recursive: true });
  await writeFile(file, content, 'utf8');

  console.log(`
✅ 글 파일을 만들었어요: ${path.relative(root, file)}

다음 단계
  1. git switch -c post/${slug}
  2. npm run dev  →  http://localhost:4321/posts/${slug}/
  3. 글을 다 쓰면 커밋하고 PR을 올려 주세요. (CONTRIBUTING.md 참고)
`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
