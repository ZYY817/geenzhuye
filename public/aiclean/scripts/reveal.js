/* ============================================================
   reveal.js · IntersectionObserver 入场
   IO 回调只切 class，真正的位移/透明全部在 CSS 里。
   减动效或无 IO 时：元素本就没有隐藏态，直接可见。
   ============================================================ */

export function initReveal() {
  const els = document.querySelectorAll('[data-rv]');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    for (const en of entries) {
      if (en.isIntersecting) {
        en.target.classList.add('is-in');
        io.unobserve(en.target);      // 只进一次
      }
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  els.forEach(el => io.observe(el));
}
