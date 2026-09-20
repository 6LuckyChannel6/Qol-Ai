const DEMO_PHRASE = 'Сабақ кестесін қайдан көре аламын?';
const VIDEO_LIBRARY = [
  { phrase: DEMO_PHRASE, src: 'assets/video.mp4', filename: 'qol-ai-sabak-kestesi.mp4' },
  { phrase: 'Менің шәкіртақым неге түспеді?', src: 'assets/22.mov', filename: 'qol-ai-shakirtaky.mov' },
  { phrase: 'Жеке куәлігімді жоғалтып алдым, не істеуім керек?', src: 'assets/33.mp4', filename: 'qol-ai-zheke-kualik.mp4' },
  { phrase: 'Подскажите, когда начинаются экзамены?', src: 'assets/44.mp4', filename: 'qol-ai-ekzameny.mp4' },
  { phrase: 'Мне нужно получить справку с места учёбы.', src: 'assets/55.mp4', filename: 'qol-ai-spravka.mp4' },
  { phrase: 'Я хочу узнать статус своего заявления.', src: 'assets/66.mp4', filename: 'qol-ai-status-zayavleniya.mp4' }
  ,{ phrase: 'How can I register for university courses?', src: 'assets/88.mp4', filename: 'qol-ai-course-registration.mp4' }
  ,{ phrase: 'I want to join a student organization.', src: 'assets/99.mp4', filename: 'qol-ai-student-organization.mp4' }
];

const normalizePhrase = value => value.trim().toLocaleLowerCase().replace(/[.!?]+$/u, '').trim();

const telegram = window.Telegram?.WebApp?.initData ? window.Telegram.WebApp : null;
if (telegram) {
  telegram.ready();
  telegram.expand();
  document.documentElement.classList.add('telegram-mini-app');
  if (telegram.colorScheme) document.documentElement.dataset.theme = telegram.colorScheme;
}

const translations = {
  ru:{navStudio:'Студия',navHow:'Как это работает',navImpact:'Возможности',eyebrow:'ИИ, который говорит руками',heroLine1:'Текст становится',heroLine2:'понятным.',heroText:'Превращайте любые слова в естественное видео на языке жестов — за несколько секунд.',tryNow:'Попробовать сейчас',watchDemo:'Как это работает',trustTitle:'2 000+ людей',trustText:'уже общаются без барьеров',natural:'Естественные жесты',caption:'«Добро пожаловать в мир без барьеров»',studioTitle:'Создайте своё видео',studioText:'Введите текст — остальное сделает искусственный интеллект.',yourText:'Ваш текст',example:'Вставить пример',placeholder:'Напишите фразу, которую нужно перевести на язык жестов…',generate:'Создать видео',previewTitle:'Ваше видео появится здесь',previewText:'Введите текст и нажмите «Создать видео»',processing:'ИИ переводит текст в жесты…',replay:'Повторить',download:'Скачать MP4',howTitle:'От мысли до жеста',step1Title:'Введите текст',step1Text:'Любая фраза, объявление или целая история.',step2Title:'ИИ поймёт смысл',step2Text:'Не дословный перевод, а естественная речь.',step3Title:'Получите видео',step3Text:'Готово к публикации, уроку или сообщению.',impactLine1:'Один текст.',impactLine2:'Тысячи понятых.',impactText:'Делайте образование и повседневное общение доступнее для каждого.',startFree:'Начать',stat1:'быстрее обычной записи',stat2:'доступно без переводчика',stat3:'языка интерфейса',footerText:'Технология, которая делает мир понятнее.',footerReady:'Готовы говорить без барьеров?',createVideo:'Создать видео ↗',madeWith:'Сделано с заботой о доступности',toastText:'Видео готово!',sample:DEMO_PHRASE},
  kk:{navStudio:'Студия',navHow:'Қалай жұмыс істейді',navImpact:'Мүмкіндіктер',eyebrow:'Қолмен сөйлейтін ЖИ',heroLine1:'Мәтін түсінікті',heroLine2:'болады.',heroText:'Кез келген сөзді бірнеше секундта ым тіліндегі табиғи бейнеге айналдырыңыз.',tryNow:'Қазір байқап көру',watchDemo:'Қалай жұмыс істейді',trustTitle:'2 000+ адам',trustText:'кедергісіз тілдесіп жүр',natural:'Табиғи қимылдар',caption:'«Кедергісіз әлемге қош келдіңіз»',studioTitle:'Бейнеңізді жасаңыз',studioText:'Мәтінді енгізіңіз — қалғанын жасанды интеллект орындайды.',yourText:'Сіздің мәтініңіз',example:'Мысал қою',placeholder:'Ым тіліне аударылатын сөйлемді жазыңыз…',signLanguage:'Ым тілі',format:'Пішім',generate:'Бейне жасау',previewTitle:'Бейнеңіз осында пайда болады',previewText:'Мәтін енгізіп, «Бейне жасау» түймесін басыңыз',processing:'ЖИ мәтінді ым тіліне аударуда…',replay:'Қайталау',download:'MP4 жүктеу',howTitle:'Ойдан қимылға дейін',step1Title:'Мәтін енгізіңіз',step1Text:'Кез келген сөйлем, хабарландыру немесе тұтас оқиға.',step2Title:'ЖИ мағынаны түсінеді',step2Text:'Сөзбе-сөз емес, табиғи аударма.',step3Title:'Бейнені алыңыз',step3Text:'Жариялауға, сабаққа немесе хабарламаға дайын.',impactLine1:'Бір мәтін.',impactLine2:'Мыңдаған түсіністік.',impactText:'Білім, бизнес және күнделікті қарым-қатынасты баршаға қолжетімді етіңіз.',startFree:'Тегін бастау',stat1:'әдеттегі түсірілімнен жылдам',stat2:'аудармашысыз қолжетімді',stat3:'интерфейс тілі',footerText:'Әлемді түсініктірек ететін технология.',footerReady:'Кедергісіз сөйлесуге дайынсыз ба?',createVideo:'Бейне жасау ↗',madeWith:'Қолжетімділікке қамқорлықпен жасалған',toastText:'Бейне дайын!',sample:DEMO_PHRASE},
  en:{navStudio:'Studio',navHow:'How it works',navImpact:'Features',eyebrow:'AI that speaks with hands',heroLine1:'Text becomes',heroLine2:'understood.',heroText:'Turn any words into natural sign language video in just a few seconds.',tryNow:'Try it now',watchDemo:'See how it works',trustTitle:'2,000+ people',trustText:'already communicate without barriers',natural:'Natural gestures',caption:'“Welcome to a world without barriers”',studioTitle:'Create your video',studioText:'Enter your text — artificial intelligence will do the rest.',yourText:'Your text',example:'Insert example',placeholder:'Write a phrase to translate into sign language…',signLanguage:'Sign language',format:'Format',generate:'Create video',previewTitle:'Your video will appear here',previewText:'Enter text and click “Create video”',processing:'AI is translating text into signs…',replay:'Replay',download:'Download MP4',howTitle:'From thought to gesture',step1Title:'Enter text',step1Text:'Any phrase, announcement or a whole story.',step2Title:'AI understands meaning',step2Text:'A natural translation, not word-for-word.',step3Title:'Get your video',step3Text:'Ready for publishing, lessons or messages.',impactLine1:'One text.',impactLine2:'Thousands understood.',impactText:'Make education, business and everyday communication more accessible to everyone.',startFree:'Start for free',stat1:'faster than conventional recording',stat2:'available without an interpreter',stat3:'interface languages',footerText:'Technology that makes the world easier to understand.',footerReady:'Ready to speak without barriers?',createVideo:'Create video ↗',madeWith:'Made with accessibility in mind',toastText:'Video is ready!',sample:DEMO_PHRASE}
};

Object.assign(translations.kk,{impactText:'Білім мен күнделікті қарым-қатынасты баршаға қолжетімді етіңіз.',startFree:'Бастау'});
Object.assign(translations.en,{impactText:'Make education and everyday communication more accessible to everyone.',startFree:'Start'});
Object.assign(translations.ru,{showcaseText:'Посмотрите трейлер Qol AI и пример того, как проект помогает сделать общение доступнее.',showcaseStatus:'Трейлер готов к просмотру'});
Object.assign(translations.kk,{showcaseText:'Qol AI трейлерін және жобаның қарым-қатынасты қолжетімді етуге қалай көмектесетінін көріңіз.',showcaseStatus:'Трейлер көруге дайын'});
Object.assign(translations.en,{showcaseText:'Watch the Qol AI trailer and see how the project helps make communication more accessible.',showcaseStatus:'Trailer ready to watch'});

Object.assign(translations.ru,{navShowcase:'Видео',showcaseTitle:'Увидеть Qol AI в действии',showcaseText:'Здесь появятся трейлер проекта и настоящий пример перевода текста в язык жестов.',showcaseStatus:'Готовим первый AI-ролик',trailerLabel:'СКОРО',trailerTitle:'Первый трейлер Qol AI'});
Object.assign(translations.kk,{navShowcase:'Бейне',showcaseTitle:'Qol AI жұмысын көріңіз',showcaseText:'Мұнда жоба трейлері және мәтінді ым тіліне аударудың нақты үлгісі пайда болады.',showcaseStatus:'Алғашқы AI-бейнені дайындап жатырмыз',trailerLabel:'ЖАҚЫНДА',trailerTitle:'Qol AI алғашқы трейлері'});
Object.assign(translations.en,{navShowcase:'Video',showcaseTitle:'See Qol AI in action',showcaseText:'The project trailer and a real example of text-to-sign translation will appear here.',showcaseStatus:'Preparing the first AI video',trailerLabel:'COMING SOON',trailerTitle:'The first Qol AI trailer'});
Object.assign(translations.ru,{showcaseText:'Посмотрите трейлер Qol AI и пример того, как проект помогает сделать общение доступнее.',showcaseStatus:'Трейлер готов к просмотру'});
Object.assign(translations.kk,{showcaseText:'Qol AI трейлерін және жобаның қарым-қатынасты қолжетімді етуге қалай көмектесетінін көріңіз.',showcaseStatus:'Трейлер көруге дайын'});
Object.assign(translations.en,{showcaseText:'Watch the Qol AI trailer and see how the project helps make communication more accessible.',showcaseStatus:'Trailer ready to watch'});

Object.assign(translations.ru, { example: 'Примеры' });
Object.assign(translations.kk, { example: 'Мысалдар' });
Object.assign(translations.en, { example: 'Examples' });
const requestedLang = new URLSearchParams(location.search).get('lang');
const savedLang = localStorage.getItem('qolai-lang');
let lang = ['kk','ru','en'].includes(requestedLang) ? requestedLang : (['kk','ru','en'].includes(savedLang) ? savedLang : 'kk');
const html = document.documentElement;
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function setLang(next){lang=next;localStorage.setItem('qolai-lang',lang);html.lang=lang;$$('[data-i18n]').forEach(el=>{const value=translations[lang][el.dataset.i18n];if(value)el.textContent=value});$$('[data-i18n-placeholder]').forEach(el=>el.placeholder=translations[lang][el.dataset.i18nPlaceholder]);$$('[data-lang]').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));document.title=lang==='kk'?'Qol AI — мәтін түсінікті болады':lang==='en'?'Qol AI — text becomes understood':'Qol AI — текст становится понятным'}
$$('[data-lang]').forEach(btn=>btn.addEventListener('click',()=>setLang(btn.dataset.lang)));setLang(lang);

const savedTheme=localStorage.getItem('qolai-theme')||'light';if(!telegram)html.dataset.theme=savedTheme;
if(telegram)telegram.onEvent('themeChanged',()=>{html.dataset.theme=telegram.colorScheme});
const heroVideo=$('.hero-avatar-video');
const heroPlay=$('.mini-play');
heroPlay.addEventListener('click',()=>{if(heroVideo.paused)heroVideo.play().catch(()=>{});else heroVideo.pause()});
function updateHeroControl(){heroPlay.textContent=heroVideo.paused?'▶':'Ⅱ';heroPlay.setAttribute('aria-label',heroVideo.paused?'Play avatar':'Pause avatar')}
heroVideo.addEventListener('play',updateHeroControl);heroVideo.addEventListener('pause',updateHeroControl);updateHeroControl();
heroVideo.addEventListener('timeupdate',()=>{if(heroVideo.duration){$('.track i').style.width=(heroVideo.currentTime/heroVideo.duration*100)+'%';$('.timeline>span').textContent='00:'+String(Math.floor(heroVideo.currentTime)).padStart(2,'0')}});
$('#themeToggle').addEventListener('click',()=>{html.dataset.theme=html.dataset.theme==='dark'?'light':'dark';localStorage.setItem('qolai-theme',html.dataset.theme)});

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.14});$$('.reveal').forEach(el=>observer.observe(el));
addEventListener('scroll',()=>$('.nav-wrap').classList.toggle('scrolled',scrollY>25),{passive:true});
addEventListener('pointermove',e=>{const glow=$('.cursor-glow');glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});

const input=$('#textInput');
input.addEventListener('input',()=>$('#charCount').textContent=input.value.length);
const examplesPanel = $('#examplesPanel');
const sampleBtn = $('#sampleBtn');
function closeExamples() {
  examplesPanel.hidden = true;
  sampleBtn.setAttribute('aria-expanded', 'false');
}
for (const [title, items] of [['Қазақша', VIDEO_LIBRARY.slice(0, 3)], ['Русский', VIDEO_LIBRARY.slice(3, 6)], ['English', VIDEO_LIBRARY.slice(6)]]) {
  const group = document.createElement('section');
  const heading = document.createElement('h3');
  heading.textContent = title;
  group.append(heading);
  for (const item of items) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = item.phrase;
    button.addEventListener('click', () => {
      input.value = item.phrase;
      input.dispatchEvent(new Event('input'));
      closeExamples();
      $('#generateBtn').focus({ preventScroll: true });
    });
    group.append(button);
  }
  examplesPanel.append(group);
}
sampleBtn.addEventListener('click', () => {
  examplesPanel.hidden = !examplesPanel.hidden;
  sampleBtn.setAttribute('aria-expanded', String(!examplesPanel.hidden));
});
examplesPanel.addEventListener('keydown', event => {
  if (event.key === 'Escape') { closeExamples(); sampleBtn.focus(); }
});
function generate(){if(!input.value.trim()){input.focus();input.style.borderColor='var(--orange)';setTimeout(()=>input.style.borderColor='',900);return}const match=VIDEO_LIBRARY.find(item=>normalizePhrase(item.phrase)===normalizePhrase(input.value))||VIDEO_LIBRARY[0];$('#previewEmpty').style.display='none';$('#result').style.display='none';$('#generating').style.display='block';const video=$('#resultVideo');const download=$('#downloadBtn');video.pause();video.src=match.src;video.load();download.href=match.src;download.download=match.filename;let p=0;const bar=$('.progress i');bar.style.width='0';$('#progressText').textContent='0%';const ticker=setInterval(()=>{p=Math.min(100,p+Math.ceil(Math.random()*8));bar.style.width=p+'%';$('#progressText').textContent=p+'%';if(p===100){clearInterval(ticker);setTimeout(()=>{$('#generating').style.display='none';$('#result').style.display='block';$('#resultCaption').textContent=input.value;video.play().catch(()=>{});$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),2600)},350)}},120)}
$('#generateBtn').addEventListener('click',generate);$('#replayBtn').addEventListener('click',()=>{const video=$('#resultVideo');video.currentTime=0;video.play().catch(()=>{})});

$$('.magnetic').forEach(el=>{el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.08}px,${(e.clientY-r.top-r.height/2)*.08}px)`});el.addEventListener('mouseleave',()=>el.style.transform='')});
