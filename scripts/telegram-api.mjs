import { readFile } from 'node:fs/promises';

export async function loadLocalEnv() {
  try {
    const source = await readFile('.env', 'utf8');
    for (const line of source.split(/\r?\n/)) {
      const match = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
      if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

export function getConfig() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const webAppUrl = process.env.WEB_APP_URL;
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN is missing. Copy .env.example to .env and add the token.');
  if (!webAppUrl || !/^https:\/\//i.test(webAppUrl)) throw new Error('WEB_APP_URL must be a public HTTPS URL.');
  return { token, webAppUrl: webAppUrl.replace(/\/$/, '') };
}

export function createTelegramApi(token) {
  return async function telegramApi(method, body = {}) {
    const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const result = await response.json();
    if (!result.ok) throw new Error(`${method}: ${result.description || 'Telegram API error'}`);
    return result.result;
  };
}
