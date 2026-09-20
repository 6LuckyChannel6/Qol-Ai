import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

// Outside dist: rebuilding the website must not erase user preferences.
export async function createLanguageStore(file = new URL('../data/user-languages.json', import.meta.url)) {
  let entries = {};
  try {
    entries = JSON.parse(await readFile(file, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const valid = value => ['kk', 'ru', 'en'].includes(value);
  const languages = new Map(Object.entries(entries).filter(([, value]) => valid(value)));
  return {
    get(id) { return languages.get(String(id)) || 'kk'; },
    async set(id, language) {
      if (!valid(language)) throw new Error('Unsupported language');
      const next = new Map(languages).set(String(id), language);
      const path = file instanceof URL ? (await import('node:url')).fileURLToPath(file) : file;
      await mkdir(dirname(path), { recursive: true });
      await writeFile(`${path}.tmp`, JSON.stringify(Object.fromEntries(next)), { mode: 0o600 });
      await rename(`${path}.tmp`, path);
      languages.set(String(id), language);
    }
  };
}
