/* ============================================================
   i18n.js · 中 / EN 切换
   HTML 里成对的 .zh/.en 元素由 CSS 按 <html lang> 显隐；
   JS 动态文案用 L()/pick() 在取用处解析。
   选择存 localStorage（?lang=en 也可临时指定），
   切换时发 'aiclean:lang' 事件让演示区重取文案。
   ============================================================ */

export const isEn = () => document.documentElement.lang === 'en';

/* 动态文案：写用处 L('中文', 'English') */
export const L = (zh, en) => isEn() ? en : zh;

/* 双语文案块：{ zh: [...], en: [...] } → 当前语言那份 */
export const pick = o => isEn() ? o.en : o.zh;

const TITLE = {
  zh: 'AIClean · 面向 AI 应用的 C 盘清理工具',
  en: 'AIClean · C: drive cleaner built for AI apps',
};
const DESC = {
  zh: 'AIClean 扫描整盘占用，把 C 盘画成 198 个格子：缓存按住清理，各家 AI 应用的对话记录、模型文件原路径迁往其他盘。免费，开源，不联网。Windows 10/11 64 位，单文件 4.5 MB。',
  en: 'AIClean scans your whole C: drive and draws it as 198 cells: hold to clean caches, migrate AI chat history and model files to another drive in place. Free, open source, fully offline. Windows 10/11 64-bit, single 4.5 MB file.',
};

export function initLang() {
  const btns = [...document.querySelectorAll('[data-lang-set]')];
  const meta = document.querySelector('meta[name="description"]');
  const sync = () => {
    const en = isEn();
    document.title = en ? TITLE.en : TITLE.zh;
    if (meta) meta.setAttribute('content', en ? DESC.en : DESC.zh);
    btns.forEach(b => b.setAttribute('aria-pressed', String((b.dataset.langSet === 'en') === en)));
  };
  btns.forEach(b => b.addEventListener('click', () => {
    const l = b.dataset.langSet === 'en' ? 'en' : 'zh-CN';
    if (document.documentElement.lang === l) return;
    document.documentElement.lang = l;
    try { localStorage.setItem('aiclean-site-lang', l); } catch (e) {}
    sync();
    document.dispatchEvent(new CustomEvent('aiclean:lang'));
  }));
  sync();
}
