/* ============================================================
   main.js · 入口
   全部原生 ES module，无依赖。
   ============================================================ */
import { initTheme, currentTheme } from './theme.js';
import { initReveal } from './reveal.js';
import { initHold } from './hold.js';
import { initScrub, onScrub, refreshScrub } from './scroll.js';
import { initDisk } from './disk.js';
import { buildGrid, buildEmpty, buildMini, initLens } from './grid.js';

const $ = s => document.querySelector(s);
const clamp = v => v < 0 ? 0 : v > 1 ? 1 : v;
const mqMobile = window.matchMedia('(max-width: 900px)');
const mqPortrait = window.matchMedia('(max-aspect-ratio: 1/1)');

/* ---------- 进入视口才播一次入场 ---------- */
function runOnView(el) {
  if (!el) return;
  if (!('IntersectionObserver' in window)) { el.classList.add('run'); return; }
  const io = new IntersectionObserver(entries => {
    for (const en of entries) {
      if (en.isIntersecting) { en.target.classList.add('run'); io.disconnect(); }
    }
  }, { threshold: 0.15 });
  io.observe(el);
}

/* ---------- 屏 1：首屏截图随当前主题换图 ---------- */
const heroShot = $('#heroShot');
const SHOTS = { fog: 'assets/home.png', ikb: 'assets/home-ikb.png', ink: 'assets/home-ink.png' };
function syncHeroShot() {
  const t = currentTheme();
  if (heroShot && !heroShot.src.endsWith(SHOTS[t])) heroShot.src = SHOTS[t];
}
new MutationObserver(syncHeroShot).observe(document.documentElement, {
  attributes: true, attributeFilter: ['data-theme'],
});
syncHeroShot();

/* 底纹指针微光：格子线随鼠标稍稍提亮，仅此而已 */
const gridbg = $('#gridbg');
if (gridbg && !mqMobile.matches) {
  let gbraf = 0;
  addEventListener('pointermove', e => {
    if (e.pointerType === 'touch' || gbraf) return;
    gbraf = requestAnimationFrame(() => {
      gbraf = 0;
      /* hero 滚出视口就不再重绘蒙版 */
      if (gridbg.getBoundingClientRect().bottom <= 0) return;
      gridbg.style.setProperty('--mx', e.clientX + 'px');
      gridbg.style.setProperty('--my', e.clientY + 'px');
    });
  });
}

/* ---------- 屏 2：演示区 ---------- */
const demo = $('#demo'), gmap = $('#gmap');
const cells = buildGrid(gmap);
initLens(gmap, $('#gtip'));
/* 格子的波浪入场不在加载时放——等演示区钉住第一帧，由 disk.js 触发 .run */

/* 减动效的静态前后对比：同一格图画两遍，清后把蓝格换成腾出态、白格换成链接标记 */
buildMini($('#rmBefore'), 11, 18, [
  'ssssssssssssssssss', 'ssssssssssssssssss', 'ssssssssssssssssss',
  'ssssssssssssssssss', 'ssssssssssssssssss', 'ssssssssssssssssss',
  'sssstttttttttttttt', 'tttttttttttttttttt', 'ttttcccccccccccccc',
  'bbbbbbbccccfffffff', '...........ffffmmm',
]);
buildMini($('#rmAfter'), 11, 18, [
  'ssssssssssssssssss', 'ssssssssssssssssss', 'ssssssssssssssssss',
  'ssssssssssssssssss', 'ssssssssssssssssss', 'ssssssssssssssssss',
  'sssstttttttttttttt', 'tttttttttttttttttt', 'ttttCCCCCCCCCCCCCC',
  'bbbbbbbCCCCfffffff', '...........ffffMMM',
]);

/* ---------- 屏 4：功能卡片堆叠，被盖住的变暗缩小 ---------- */
const fcards = [...document.querySelectorAll('.fcard')];
const cardLast = fcards.map(() => ({}));
function driveCards() {
  if (mqMobile.matches) return;
  for (let i = 0; i < fcards.length - 1; i++) {
    const r = fcards[i].getBoundingClientRect();
    const n = fcards[i + 1].getBoundingClientRect();
    const dim = clamp((r.bottom - n.top) / r.height * 1.1);
    const cs = (1 - dim * .045).toFixed(4), cb = (1 - dim * .38).toFixed(4);
    /* 值没变就不写——setProperty 每帧命中 6 卡 ×2 也是无效的样式失效 */
    if (cardLast[i].cs !== cs) { cardLast[i].cs = cs; fcards[i].style.setProperty('--cs', cs); }
    if (cardLast[i].cb !== cb) { cardLast[i].cb = cb; fcards[i].style.setProperty('--cb', cb); }
  }
}

/* 卡片追光：--mx/--my 写到被悬停的那张卡上，CSS 只负责亮边框环和内光斑 */
const fstack = $('.feats__stack');
if (fstack && !mqMobile.matches) {
  let fcraf = 0;
  fstack.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch' || fcraf) return;
    const c = e.target.closest('.fcard');
    if (!c) return;
    fcraf = requestAnimationFrame(() => {
      fcraf = 0;
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - r.left).toFixed(0) + 'px');
      c.style.setProperty('--my', (e.clientY - r.top).toFixed(0) + 'px');
    });
  });
}

/* 卡 1 的画面：缩小的格子地图 */
const cardmap = $('#cardmap');
if (cardmap) buildMini(cardmap, 3, 20, [
  'ssssssssssssssssssss',
  'ssscccsssmmssstttsss',
  'ssssssfffbssssss....',
]);

/* ---------- 屏 6：主题圆形擦色 + 截图倾角 ---------- */
const faces = $('#themes'), fstage = faces.querySelector('.faces__stage');
if (!mqMobile.matches) {
  const wins = [...faces.querySelectorAll('.win')];
  let raf = 0;
  faces.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    const cx = innerWidth / 2, cy = innerHeight / 2;
    const ry = ((e.clientX - cx) / cx) * 4, rx = -((e.clientY - cy) / cy) * 4;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      wins.forEach(w => { w.style.setProperty('--rx', rx.toFixed(2) + 'deg'); w.style.setProperty('--ry', ry.toFixed(2) + 'deg'); });
    });
  });
  faces.addEventListener('pointerleave', () =>
    wins.forEach(w => { w.style.removeProperty('--rx'); w.style.removeProperty('--ry'); }));
}

/* ---------- 屏 7：安全列表，滚到屏幕中间的高亮 ---------- */
const sitems = [...document.querySelectorAll('.safe__item')];
function driveSafe() {
  const mid = innerHeight / 2;
  let best = 0, bd = Infinity;
  sitems.forEach((el, i) => {
    const r = el.getBoundingClientRect();
    const d = Math.abs(r.top + r.height / 2 - mid);
    if (d < bd) { bd = d; best = i; }
  });
  sitems.forEach((el, i) => el.classList.toggle('is-lit', i === best));
}

/* ---------- 屏 8：下载格背景，按住时向按钮收拢点亮 ---------- */
const dlgrid = $('#dlgrid'), holdbtn = $('#holdbtn');
const dlcells = buildEmpty(dlgrid);
runOnView(dlgrid);
let dlorder = null;
holdbtn.addEventListener('holdprogress', e => {
  if (!dlorder) {
    const g = dlgrid.getBoundingClientRect(), b = holdbtn.getBoundingClientRect();
    const bx = b.left + b.width / 2 - g.left, by = b.top + b.height / 2 - g.top;
    dlorder = dlcells
      .map(c => [c, Math.hypot(c.offsetLeft + c.offsetWidth / 2 - bx,
                               c.offsetTop + c.offsetHeight / 2 - by)])
      .sort((a, b) => b[1] - a[1])
      .map(x => x[0]);
  }
  const n = Math.round(e.detail * dlorder.length);
  dlorder.forEach((c, i) => c.classList.toggle('on', i < n));
});
window.addEventListener('resize', () => { dlorder = null; });

/* ---------- 滚动进度 ---------- */
initScrub();
onScrub(demo, initDisk(demo, cells));
onScrub(faces, p => {
  // 两次圆形擦色（2 屏滚动距离内）：.2–.48 雾白→克莱因蓝，.55–.85 克莱因蓝→夜墨
  fstage.style.setProperty('--w1', clamp((p - .2) / .28).toFixed(4));
  fstage.style.setProperty('--w2', clamp((p - .55) / .3).toFixed(4));
});
refreshScrub();

/* 正常滚动的两处驱动，挂在 scroll 上，不劫持滚轮 */
let tick = 0;
addEventListener('scroll', () => {
  if (tick) return;
  tick = requestAnimationFrame(() => { tick = 0; driveCards(); driveSafe(); });
}, { passive: true });
driveCards();
driveSafe();

/* 横竖屏切换：格子折行变了，重算滚动区间 */
mqPortrait.addEventListener('change', refreshScrub);

/* ---------- 导航：离开页面顶部后切毛玻璃 ---------- */
const sentinel = $('.sentinel'), nav = $('#nav');
if ('IntersectionObserver' in window) {
  new IntersectionObserver(([en]) => {
    nav.classList.toggle('nav--glass', !en.isIntersecting);
  }, { threshold: 0 }).observe(sentinel);
}

initTheme();
initReveal();
initHold();

/* ---------- 锚点重校：区块高度是 JS 算的，脚本跑完后再锚一次 ---------- */
if (location.hash) {
  const t = document.querySelector(location.hash);
  if (t) requestAnimationFrame(() => t.scrollIntoView({ behavior: 'instant', block: 'start' }));
}
