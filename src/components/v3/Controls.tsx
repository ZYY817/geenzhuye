"use client";

/* ============================================================================
 * 右上角的语言 / 深浅色控件：发丝线胶囊「中 / EN | ☾」（SPEC_V3_MINIMAL §11.1）
 * ----------------------------------------------------------------------------
 * 深浅色：以点击位置为圆心圆形扩散（View Transitions API），沿用旧版 ThemeToggle 的做法；
 * 主题类名由 layout.tsx 的首帧脚本设置，这里只读 / 写 <html class="dark">。
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

function setDark(next: boolean) {
  document.documentElement.classList.toggle("dark", next);
  // 浏览器地址栏颜色跟随用户的选择，而不只跟随系统
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", next ? "#121211" : "#fbfaf8"));
  try { localStorage.setItem("zhiyu-theme", next ? "dark" : "light"); } catch {}
}

export function Controls({ className = "", lang, onLang }: { className?: string; lang: "zh" | "en"; onLang: (l: "zh" | "en") => void }) {
  const dark = useDark();
  const en = lang === "en";

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next = !document.documentElement.classList.contains("dark");
    const doc = document as VTDoc;
    if (!doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDark(next);
      return;
    }
    const r0 = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || r0.left + r0.width / 2;
    const y = e.clientY || r0.top + r0.height / 2;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const root = document.documentElement;
    root.classList.add("theme-switching");
    pauseScroll();
    const vt = doc.startViewTransition(() => setDark(next));
    vt.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 600, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
    vt.finished.finally(() => { root.classList.remove("theme-switching"); resumeScroll(); });
  };

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

  // 一枚发丝线胶囊：语言（两个都显示，当前的是墨色）| 主题图标——一眼看出是控件（SPEC §11.1）
  return (
    <span className={`flex items-center rounded-full border border-[var(--line2)] text-[13px] leading-none ${className}`}>
      <button type="button" data-lang-btn aria-label={langLabel} onClick={() => onLang(en ? "zh" : "en")}
        className="v3-hit cursor-pointer rounded-l-full py-[7px] pl-3 pr-2.5">{seg}</button>
      <span aria-hidden className="h-3.5 w-px bg-[var(--line2)]" />
      <button type="button" aria-label={themeLabel} title={themeLabel} onClick={toggleTheme}
        className="v3-hit cursor-pointer rounded-r-full py-[6px] pl-2.5 pr-3 text-[var(--ink3)] hover:text-[var(--ink)]"><Icon className="h-[14px] w-[14px]" strokeWidth={1.6} /></button>
    </span>
  );
}
