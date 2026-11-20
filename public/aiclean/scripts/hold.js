/* ============================================================
   hold.js · "按住，下载"按钮
   复刻产品交互：按住 ~650ms 进度填满 → 跳转 Releases；
   中途松手回弹；普通点击不触发（旁边有兜底链接）。
   进度写在 --hold 上（@property 注册），pips 按进度点亮。
   ============================================================ */

export function initHold() {
  const btn = document.getElementById('holdbtn');
  if (!btn) return;

  const url = btn.href;
  const DUR = +btn.dataset.hold || 650;
  const pips = [...btn.querySelectorAll('.holdbtn__pips i')];
  let raf = 0, t0 = 0, done = false;

  const setP = p => {
    btn.style.setProperty('--hold', p.toFixed(3));
    const lit = Math.round(p * pips.length);
    pips.forEach((el, i) => el.classList.toggle('on', i < lit));
    // 下载区背景的格子跟着进度亮（main.js 监听）
    btn.dispatchEvent(new CustomEvent('holdprogress', { detail: p }));
  };

  const tick = now => {
    const p = Math.min((now - t0) / DUR, 1);
    setP(p);
    if (p < 1) { raf = requestAnimationFrame(tick); return; }
    done = true;
    btn.classList.add('is-done');
    location.href = url;          // 按满：跳转 Releases
  };

  const start = e => {
    if (done) return;
    e.preventDefault();           // 按住过程中不发点击、不选中文字
    t0 = performance.now();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(tick);
  };
  const cancel = () => {
    if (done) return;
    cancelAnimationFrame(raf);
    raf = 0;
    // 回弹：清掉进度，transition 负责动画回位
    if (btn.style.getPropertyValue('--hold') !== '0.000') setP(0);
  };

  btn.addEventListener('pointerdown', start);
  btn.addEventListener('pointerup', cancel);
  btn.addEventListener('pointerleave', cancel);
  btn.addEventListener('pointercancel', cancel);
  btn.addEventListener('contextmenu', e => e.preventDefault());
  // 键盘等价：按住 Space / Enter 同样计时
  btn.addEventListener('keydown', e => {
    if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) start(e);
  });
  btn.addEventListener('keyup', cancel);
  // 纯点击兜底交给旁边的明文链接；本钮 click 一律拦掉
  btn.addEventListener('click', e => e.preventDefault());
}
