const copy = {
  kk: { welcome: 'Qol AI-ға қош келдіңіз! Интерфейс тілін таңдаңыз:', menu: 'Қажетті бөлімді таңдаңыз:', open: 'Qol AI ашу', help: 'Көмек', language: 'Тілді өзгерту', helpText: 'Мәтінді енгізіңіз немесе дайын мысалды таңдаңыз, содан кейін «Бейне жасау» батырмасын басыңыз.' },
  ru: { welcome: 'Добро пожаловать в Qol AI! Выберите язык интерфейса:', menu: 'Выберите нужный раздел:', open: 'Открыть Qol AI', help: 'Помощь', language: 'Сменить язык', helpText: 'Введите текст или выберите готовый пример, затем нажмите «Создать видео».' },
  en: { welcome: 'Welcome to Qol AI! Choose the interface language:', menu: 'Choose a section:', open: 'Open Qol AI', help: 'Help', language: 'Change language', helpText: 'Enter text or choose an example, then tap “Create video”.' }
};

const languageKeyboard = { inline_keyboard: [[
  { text: '🇰🇿 Қазақша', callback_data: 'lang:kk' },
  { text: '🇷🇺 Русский', callback_data: 'lang:ru' },
  { text: '🇬🇧 English', callback_data: 'lang:en' }
]] };

const localizedUrl = (base, lang) => `${base.replace(/\/$/, '')}/?lang=${encodeURIComponent(lang)}`;
const mainKeyboard = (base, lang) => ({ inline_keyboard: [
  [{ text: `✦ ${copy[lang].open}`, web_app: { url: localizedUrl(base, lang) } }],
  [{ text: `❓ ${copy[lang].help}`, callback_data: 'menu:help' }, { text: `🌐 ${copy[lang].language}`, callback_data: 'menu:language' }]
] });

async function telegram(env, method, body = {}) {
  const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });
  const result = await response.json();
  if (!result.ok) throw new Error(`${method}: ${result.description || 'Telegram API error'}`);
  return result.result;
}

async function getLanguage(env, userId) {
  return (await env.LANGUAGE_PREFS.get(String(userId))) || 'kk';
}

async function setPersonalMenu(env, chatId, lang) {
  return telegram(env, 'setChatMenuButton', {
    chat_id: chatId,
    menu_button: { type: 'web_app', text: copy[lang].open, web_app: { url: localizedUrl(env.WEB_APP_URL, lang) } }
  });
}

async function showLanguage(env, chatId, userId) {
  const lang = await getLanguage(env, userId);
  await setPersonalMenu(env, chatId, lang);
  return telegram(env, 'sendMessage', { chat_id: chatId, text: copy[lang].welcome, reply_markup: languageKeyboard });
}

async function showMainMenu(env, chatId, userId) {
  const lang = await getLanguage(env, userId);
  await setPersonalMenu(env, chatId, lang);
  return telegram(env, 'sendMessage', { chat_id: chatId, text: copy[lang].menu, reply_markup: mainKeyboard(env.WEB_APP_URL, lang) });
}

async function handleUpdate(env, update) {
  const message = update.message;
  const callback = update.callback_query;
  if (message?.chat?.id) {
    const chatId = message.chat.id;
    const userId = message.from?.id || chatId;
    const text = message.text || '';
    if (/^\/(start|language)(?:@\w+)?(?:\s|$)/i.test(text)) return showLanguage(env, chatId, userId);
    if (/^\/(app|menu)(?:@\w+)?(?:\s|$)/i.test(text)) return showMainMenu(env, chatId, userId);
    if (/^\/help(?:@\w+)?(?:\s|$)/i.test(text)) {
      const lang = await getLanguage(env, userId);
      return telegram(env, 'sendMessage', { chat_id: chatId, text: copy[lang].helpText, reply_markup: mainKeyboard(env.WEB_APP_URL, lang) });
    }
  }
  if (callback?.message?.chat?.id) {
    const chatId = callback.message.chat.id;
    const userId = callback.from?.id || chatId;
    const data = callback.data || '';
    await telegram(env, 'answerCallbackQuery', { callback_query_id: callback.id });
    if (data.startsWith('lang:')) {
      const lang = data.slice(5);
      if (!copy[lang]) return;
      await env.LANGUAGE_PREFS.put(String(userId), lang);
      await setPersonalMenu(env, chatId, lang);
      return telegram(env, 'editMessageText', { chat_id: chatId, message_id: callback.message.message_id, text: copy[lang].menu, reply_markup: mainKeyboard(env.WEB_APP_URL, lang) });
    }
    const lang = await getLanguage(env, userId);
    if (data === 'menu:language') return showLanguage(env, chatId, userId);
    if (data === 'menu:help') return telegram(env, 'sendMessage', { chat_id: chatId, text: copy[lang].helpText, reply_markup: mainKeyboard(env.WEB_APP_URL, lang) });
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (request.method === 'GET' && url.pathname === '/health') return Response.json({ ok: true, service: 'qol-ai-bot' });
    if (request.method === 'POST' && url.pathname === '/setup') {
      if (!env.SETUP_KEY || request.headers.get('Authorization') !== `Bearer ${env.SETUP_KEY}`) return new Response('Unauthorized', { status: 401 });
      const workerBase = `${url.protocol}//${url.host}`;
      const webhook = await telegram(env, 'setWebhook', {
        url: `${workerBase}/telegram`,
        ip_address: env.WEBHOOK_IP,
        secret_token: env.WEBHOOK_SECRET,
        allowed_updates: ['message', 'callback_query'],
        drop_pending_updates: false
      });
      await telegram(env, 'setMyCommands', { commands: [
        { command: 'start', description: 'Qol AI іске қосу' },
        { command: 'menu', description: 'Негізгі мәзір' },
        { command: 'app', description: 'Qol AI ашу' },
        { command: 'language', description: 'Тілді өзгерту' },
        { command: 'help', description: 'Көмек' }
      ] });
      return Response.json({ ok: Boolean(webhook) });
    }
    if (request.method !== 'POST' || url.pathname !== '/telegram') return new Response('Not found', { status: 404 });
    if (!env.WEBHOOK_SECRET || request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== env.WEBHOOK_SECRET) return new Response('Unauthorized', { status: 401 });
    const update = await request.json();
    ctx.waitUntil(handleUpdate(env, update).catch(error => console.error(error)));
    return new Response('OK');
  }
};
