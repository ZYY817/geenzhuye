"use client";

import { useEffect } from "react";
import Lenis from "lenis";

let instance: Lenis | null = null;

/* 截图式过渡（主题圆形扩散）期间暂停惯性滚动：旧画面是冻结快照，新画面不能在里面继续滑 */
export function pauseScroll() { instance?.stop(); }
export function resumeScroll() { instance?.start(); }

/* 视图切换时瞬移滚动位置：Lenis 接管时走它的 immediate，避免被惯性拉回 */
export function jumpTo(y: number) {
  if (instance) {
    instance.resize(); // 视图刚换过，先按新内容重新量一次可滚动高度
    instance.scrollTo(y, { immediate: true, force: true });
  }
  else window.scrollTo(0, y);
}

/* 全站惯性滚动：滚轮输入转成缓动曲线（Lenis），松手后页面滑行减速。
 * prefers-reduced-motion 时不接管；内部滚动容器用 data-lenis-prevent 豁免。 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, touchMultiplier: 1.4 });
    instance = lenis;
    let raf = 0;
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    /* <html> 设了 h-full，高度不随内容变；Lenis 自带的尺寸监听看不到页面变长变短
       （首页 ⇄ 详情切换、图片和视频加载完）。直接监听 body 的尺寸，一变就让它重新量 */
    const ro = new ResizeObserver(() => lenis.resize());
    ro.observe(document.body);
    return () => { ro.disconnect(); cancelAnimationFrame(raf); lenis.destroy(); instance = null; };
  }, []);
  return null;
}
