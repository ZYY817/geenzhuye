"use client";

/* ============================================================================
 * 右上角的语言 / 深浅色 / 配色控件：发丝线胶囊「中 / EN | ☾ | ●●●●●」（SPEC_V3_MINIMAL §11.1）
 * ----------------------------------------------------------------------------
 * 深浅色：以点击位置为圆心圆形扩散（View Transitions API），沿用旧版 ThemeToggle 的做法；
 * 主题类名由 layout.tsx 的首帧脚本设置，这里只读 / 写 <html class="dark">。
 * 配色：五套方案写在 MinimalHome 的 <style> 里（html[data-pal] .v3），这里只管
 * 切换 <html data-pal> 并存 localStorage；首屏脚本在 hydration 前恢复，不闪回原色。
 * ==========================================================================*/

import { useSyncExternalStore } from "react";
import { pauseScroll, resumeScroll } from "@/components/site/SmoothScroll";
import { Moon, Sun } from "lucide-react";

type VTDoc = Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> } };

const subscribeTheme = (fn: () => void) => {
  const mo = new MutationObserver(fn);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => mo.disconnect();
};
const useDark = () =>
  useSyncExternalStore(subscribeTheme, () => document.documentElement.classList.contains("dark"), () => false);

const subscribePal = (fn: () => void) => {
  const mo = new MutationObserver(fn);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-pal"] });
  return () => mo.disconnect();
};
const usePal = () =>
  useSyncExternalStore(subscribePal, () => document.documentElement.dataset.pal || "paper", () => "paper");

/* 配色方案：dot 是标志色渐变（主色 / 点缀色）；bg 用于同步地址栏 meta theme-color。
   点上即是饱和彩色整页，☾ 换同色系更深的版本（paper 例外：浅色=暖纸、深色=暖黑） */
const PALS = [
  { id: "paper", zh: "原色暖纸", en: "Paper", dot: "linear-gradient(135deg,#c2452d 50%,#fbfaf8 50%)", bg: { light: "#fbfaf8", dark: "#121211" } },
  { id: "sky", zh: "天蓝 + 热粉", en: "Sky + hot pink", dot: "linear-gradient(135deg,#0593c6 50%,#d83995 50%)", bg: { light: "#04739e", dark: "#022a3d" } },
  { id: "deep", zh: "深蓝 + 泡泡粉", en: "Deep blue + pink", dot: "linear-gradient(135deg,#09316d 50%,#fd91cc 50%)", bg: { light: "#072553", dark: "#04122e" } },
  { id: "ocean", zh: "科技蓝 + 青柠", en: "Tech blue + lime", dot: "linear-gradient(135deg,#2476da 50%,#daeb20 50%)", bg: { light: "#123e8a", dark: "#07163a" } },
  { id: "sunset", zh: "天蓝 + 琥珀", en: "Sky + amber", dot: "linear-gradient(135deg,#0099ff 50%,#ffc531 50%)", bg: { light: "#0079d6", dark: "#034a85" } },
  { id: "flux", zh: "午夜 + 电蓝橙", en: "Midnight + flux", dot: "linear-gradient(135deg,#fc734d 50%,#02070a 50%)", bg: { light: "#02070a", dark: "#000000" } },
] as const;

function setDark(next: boolean) {
  document.documentElement.classList.toggle("dark", next);
  // 浏览器地址栏颜色跟随用户的选择，而不只跟随系统
  const pal = PALS.find((p) => p.id === (document.documentElement.dataset.pal || "paper")) ?? PALS[0];
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", next ? pal.bg.dark : pal.bg.light));
  try { localStorage.setItem("zhiyu-theme", next ? "dark" : "light"); } catch {}
}

function setPal(id: string) {
  document.documentElement.dataset.pal = id;
  const pal = PALS.find((p) => p.id === id) ?? PALS[0];
  const dark = document.documentElement.classList.contains("dark");
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", dark ? pal.bg.dark : pal.bg.light));
  try { localStorage.setItem("zhiyu-pal", id); } catch {}
}

export function Controls({ className = "", lang, onLang }: { className?: string; lang: "zh" | "en"; onLang: (l: "zh" | "en") => void }) {
  const dark = useDark();
  const pal = usePal();
  const en = lang === "en";

  /* 主题/配色的圆形扩散过渡共用：冻结颜色过渡、锁滚动，结束后恢复 */
  const runTransition = (e: React.MouseEvent<HTMLElement>, apply: () => void) => {
    const doc = document as VTDoc;
    if (!doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { apply(); return; }
    const r0 = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || r0.left + r0.width / 2;
    const y = e.clientY || r0.top + r0.height / 2;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const root = document.documentElement;
    root.classList.add("theme-switching");
    pauseScroll();
    const vt = doc.startViewTransition(apply);
    vt.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 600, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
    vt.finished.finally(() => { root.classList.remove("theme-switching"); resumeScroll(); });
  };

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) =>
    runTransition(e, () => setDark(!document.documentElement.classList.contains("dark")));
  const pickPal = (e: React.MouseEvent<HTMLButtonElement>, id: string) =>
    id === pal ? undefined : runTransition(e, () => setPal(id));

  const langLabel = en ? "切换到中文" : "Switch to English";
  const themeLabel = en ? (dark ? "Switch to light mode" : "Switch to dark mode") : dark ? "切换到浅色" : "切换到深色";
  const Icon = dark ? Sun : Moon;

  // 语言：两个都显示，当前的是墨色——一眼看出是"切换"
  const seg = (
    <>
      <span className={en ? "text-[var(--ink4)]" : "text-[var(--ink)]"}>中</span>
      <span aria-hidden className="mx-1.5 text-[var(--ink6)]">/</span>
      <span className={en ? "text-[var(--ink)]" : "text-[var(--ink4)]"}>EN</span>
    </>
  );

  // 一枚发丝线胶囊：语言（两个都显示，当前的是墨色）| 主题图标 | 配色圆点——一眼看出是控件（SPEC §11.1）
  return (
    <span className={`flex items-center rounded-full border border-[var(--line2)] text-[13px] leading-none ${className}`}>
      <button type="button" data-lang-btn aria-label={langLabel} onClick={() => onLang(en ? "zh" : "en")}
        className="v3-hit cursor-pointer rounded-l-full py-[7px] pl-3 pr-2.5">{seg}</button>
      <span aria-hidden className="h-3.5 w-px bg-[var(--line2)]" />
      <button type="button" aria-label={themeLabel} title={themeLabel} onClick={toggleTheme}
        className="v3-hit cursor-pointer py-[6px] pl-2.5 pr-2.5 text-[var(--ink3)] hover:text-[var(--ink)]"><Icon className="h-[14px] w-[14px]" strokeWidth={1.6} /></button>
      <span aria-hidden className="h-3.5 w-px bg-[var(--line2)]" />
      <span className="flex items-center gap-[5px] rounded-r-full py-[7px] pl-2.5 pr-3" role="group" aria-label={en ? "Color palette" : "配色方案"}>
        {PALS.map((p) => (
          <button key={p.id} type="button" title={en ? p.en : p.zh} aria-label={(en ? "Palette " : "配色：") + (en ? p.en : p.zh)}
            aria-pressed={pal === p.id} onClick={(e) => pickPal(e, p.id)}
            className="v3-hit cursor-pointer rounded-full transition-transform duration-150 hover:scale-125"
            style={{
              width: 10, height: 10, background: p.dot,
              boxShadow: pal === p.id ? "0 0 0 1.5px var(--bg), 0 0 0 2.5px var(--ink)" : "0 0 0 1px var(--line)",
            }} />
        ))}
      </span>
    </span>
  );
}
