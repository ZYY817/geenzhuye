/* ============================================================
   theme.js · 主题切换
   优先级：?theme= URL 参数 > localStorage > 默认 ink。
   有 startViewTransition 就做根节点快照过渡，没有就直接切。
   ============================================================ */

const KEY = 'aiclean-site-theme';
const THEMES = ['fog', 'ikb', 'ink'];
const root = document.documentElement;

function mark(theme) {
  document.querySelectorAll('[data-theme-set]').forEach(b =>
    b.setAttribute('aria-pressed', String(b.dataset.themeSet === theme)));
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = { fog: '#ECEEEA', ikb: '#0B2FC2', ink: '#121516' }[theme];
}

export function currentTheme() {
  const t = root.dataset.theme;
  return THEMES.includes(t) ? t : 'ink';
}

export function setTheme(theme, { persist = true } = {}) {
  if (!THEMES.includes(theme)) return;
  const apply = () => {
    root.dataset.theme = theme;
    if (persist) { try { localStorage.setItem(KEY, theme); } catch (e) {} }
    mark(theme);
  };
  // 渐进增强：支持则用视图过渡做整页平滑换肤
  if (document.startViewTransition) {
    document.startViewTransition(apply);
  } else {
    apply();
  }
}

export function initTheme() {
  mark(currentTheme());
  document.querySelectorAll('[data-theme-set]').forEach(b =>
    b.addEventListener('click', () => setTheme(b.dataset.themeSet)));
}
