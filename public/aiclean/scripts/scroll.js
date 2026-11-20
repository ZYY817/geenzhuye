/* ============================================================
   scroll.js · 滚动进度
   给带 data-scrub 的元素算一个 0→1 的进度，写到 --p 上，
   CSS 用 calc() 吃它做位移；需要离散逻辑的再挂回调。

   两种算法：
   - pin ：元素比视口高、里面有 sticky 舞台。进度 = 舞台钉住期间滚过的比例。
   - view：元素穿过视口的比例（从底边露头算 0，到顶边消失算 1），做视差用。
   ============================================================ */

const items = [];
let raf = 0;

const clamp = v => v < 0 ? 0 : v > 1 ? 1 : v;

function update() {
  raf = 0;
  const vh = window.innerHeight;
  for (const it of items) {
    const r = it.el.getBoundingClientRect();
    let p;
    if (it.mode === 'pin') {
      const run = r.height - vh;
      p = run > 0 ? clamp(-r.top / run) : (r.top < 0 ? 1 : 0);
    } else {
      p = clamp((vh - r.top) / (vh + r.height));
    }

    if (Math.abs(p - it.last) < 0.0004) continue;
    it.last = p;
    it.el.style.setProperty('--p', p.toFixed(4));
    for (const fn of it.fns) fn(p);
  }
}

const queue = () => { if (!raf) raf = requestAnimationFrame(update); };

/* 给某个 data-scrub 元素挂回调；立即按当前进度调一次 */
export function onScrub(el, fn) {
  const it = items.find(i => i.el === el);
  if (!it) return;
  it.fns.push(fn);
  fn(it.last < 0 ? 0 : it.last);
}

export function refreshScrub() {
  for (const it of items) it.last = -1;
  queue();
}

export function initScrub() {
  document.querySelectorAll('[data-scrub]').forEach(el =>
    items.push({ el, mode: el.dataset.scrub, last: -1, fns: [] }));
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', refreshScrub);
  update();
}
