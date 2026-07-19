import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('src/content');
const forbidden = [
  /\bsk-[A-Za-z0-9]{20,}\b/g,
  /\bgh[pousr]_[A-Za-z0-9]{20,}\b/g,
  /(?:password|пароль|api[_ -]?key|токен)\s*[:=]\s*\S+/gi
];

const files = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    if (entry.isFile() && /\.(md|mdx)$/.test(entry.name)) files.push(full);
  }
}
walk(root);

const errors = [];
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  if (!content.startsWith('---')) errors.push(`${file}: отсутствует frontmatter`);
  for (const pattern of forbidden) {
    pattern.lastIndex = 0;
    if (pattern.test(content)) errors.push(`${file}: найден возможный секрет`);
  }
  if (/evidenceStatus:\s*requires-verification/.test(content) &&
      !/draft:\s*true/.test(content)) {
    errors.push(`${file}: requires-verification допускается только при draft: true`);
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Проверено материалов: ${files.length}`);
