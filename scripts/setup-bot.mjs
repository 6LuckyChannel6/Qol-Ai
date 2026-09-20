import { createTelegramApi, getConfig, loadLocalEnv } from './telegram-api.mjs';

await loadLocalEnv();
const { token, webAppUrl } = getConfig();
const api = createTelegramApi(token);

const bot = await api('getMe');
await api('setMyCommands', {
  commands: [
    { command: 'start', description: 'Открыть Qol AI' },
    { command: 'menu', description: 'Главное меню' },
    { command: 'app', description: 'Запустить приложение' },
    { command: 'language', description: 'Выбрать язык' },
    { command: 'help', description: 'Помощь' }
  ]
});
await api('setChatMenuButton', {
  menu_button: { type: 'web_app', text: 'Открыть Qol AI', web_app: { url: webAppUrl } }
});

console.log(`Configured @${bot.username} with ${webAppUrl}`);
