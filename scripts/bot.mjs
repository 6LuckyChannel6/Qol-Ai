import { createTelegramApi, getConfig, loadLocalEnv } from './telegram-api.mjs';
import { createLanguageStore } from './language-store.mjs';

await loadLocalEnv();
const { token, webAppUrl } = getConfig();
const api = createTelegramApi(token);
const userLanguages = await createLanguageStore();
let offset = 0;

const copy = {
  kk: { welcome:'Qol AI-ға қош келдіңіз! Интерфейс тілін таңдаңыз:',menu:'Қажетті бөлімді таңдаңыз:',open:'Qol AI ашу',help:'Көмек',language:'Тілді өзгерту',helpText:'Мәтінді енгізіп, «Бейне жасау» батырмасын басыңыз. Дайын бейнені қайталап көруге немесе жүктеуге болады.'},
  ru: { welcome:'Добро пожаловать в Qol AI! Выберите язык интерфейса:',menu:'Выберите нужный раздел:',open:'Открыть Qol AI',help:'Помощь',language:'Сменить язык',helpText:'Введите текст и нажмите «Создать видео». Готовый ролик можно повторно воспроизвести или скачать.'},
  en: { welcome:'Welcome to Qol AI! Choose the interface language:',menu:'Choose a section:',open:'Open Qol AI',help:'Help',language:'Change language',helpText:'Enter text and tap “Create video”. You can replay or download the generated video.'}
};

const languageKeyboard={inline_keyboard:[[{text:'🇰🇿 Қазақша',callback_data:'lang:kk'},{text:'🇷🇺 Русский',callback_data:'lang:ru'},{text:'🇬🇧 English',callback_data:'lang:en'}]]};
const localizedUrl=lang=>`${webAppUrl}/?lang=${encodeURIComponent(lang)}`;
function mainKeyboard(lang){const t=copy[lang];return{inline_keyboard:[[{text:`✦ ${t.open}`,web_app:{url:localizedUrl(lang)}}],[{text:`❓ ${t.help}`,callback_data:'menu:help'},{text:`🌐 ${t.language}`,callback_data:'menu:language'}]]}}
async function setPersonalMenu(chatId,lang='kk'){await api('setChatMenuButton',{chat_id:chatId,menu_button:{type:'web_app',text:copy[lang].open,web_app:{url:localizedUrl(lang)}}})}
async function showLanguage(chatId){const lang=userLanguages.get(chatId);await setPersonalMenu(chatId,lang);await api('sendMessage',{chat_id:chatId,text:copy[lang].welcome,reply_markup:languageKeyboard})}
async function showMainMenu(chatId,lang){await setPersonalMenu(chatId,lang);await api('sendMessage',{chat_id:chatId,text:copy[lang].menu,reply_markup:mainKeyboard(lang)})}

await api('deleteWebhook',{drop_pending_updates:false});
console.log('Qol AI bot is running. Press Ctrl+C to stop.');

while(true){try{const updates=await api('getUpdates',{offset,timeout:30,allowed_updates:['message','callback_query']});for(const update of updates){offset=update.update_id+1;const message=update.message;const callback=update.callback_query;
  if(message?.chat?.id){const chatId=message.chat.id;const text=message.text||'';if(/^\/(start|language)(?:@\w+)?(?:\s|$)/i.test(text))await showLanguage(chatId);else if(/^\/(app|menu)(?:@\w+)?(?:\s|$)/i.test(text))await showMainMenu(chatId,userLanguages.get(chatId));else if(/^\/help(?:@\w+)?(?:\s|$)/i.test(text)){const lang=userLanguages.get(chatId);await api('sendMessage',{chat_id:chatId,text:copy[lang].helpText,reply_markup:mainKeyboard(lang)})}}
  if(callback?.message?.chat?.id){const chatId=callback.message.chat.id;const data=callback.data||'';await api('answerCallbackQuery',{callback_query_id:callback.id});if(data.startsWith('lang:')){const lang=data.slice(5);if(!copy[lang])continue;await userLanguages.set(chatId,lang);await api('editMessageText',{chat_id:chatId,message_id:callback.message.message_id,text:copy[lang].menu,reply_markup:mainKeyboard(lang)});await setPersonalMenu(chatId,lang)}else{const lang=userLanguages.get(chatId);if(data==='menu:language')await showLanguage(chatId);if(data==='menu:help')await api('sendMessage',{chat_id:chatId,text:copy[lang].helpText,reply_markup:mainKeyboard(lang)})}}
}}catch(error){console.error(error.message);await new Promise(resolve=>setTimeout(resolve,2000))}}
