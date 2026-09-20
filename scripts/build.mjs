import { cp, mkdir, rm } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const file of ['index.html', 'styles.css', 'app.js']) {
  await cp(`src/${file}`, `dist/${file}`);
}
await cp('src/assets', 'dist/assets', { recursive: true });
console.log('Built static site into dist/');
