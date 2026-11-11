"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

type VTDoc = Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> } };

/* 深浅色切换：以按钮为圆心，新主题以圆形扩散覆盖整页（View Transitions API）。
 * 不支持的浏览器或减弱动态时直接切换。 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    return () => window.cancelAnimationFrame(raf);
  }, []);

  const apply = (nextDark: boolean) => {
    setIsDark(nextDark);
    domApply(nextDark);
  };

  /* 只动 DOM：切换类名 + 持久化，不触发 React 渲染 */
  const domApply = (nextDark: boolean) => {
    document.documentElement.classList.toggle("dark", nextDark);
    try {
      localStorage.setItem("zhiyu-theme", nextDark ? "dark" : "light");
    } catch {}
  };

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    /* 以根类名为准（图标状态延迟到扩散结束后才更新，连点也不会反向） */
    const nextDark = !document.documentElement.classList.contains("dark");
    const doc = document as VTDoc;
    if (!doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply(nextDark);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || rect.left + rect.width / 2;
    const y = e.clientY || rect.top + rect.height / 2;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const root = document.documentElement;
    root.classList.add("theme-switching");
    /* 快照回调里不做 React 渲染（flushSync 会让起始帧更卡）：
     * 只切换根类名；图标等扩散结束后再以自身旋转动画换出 */
    const vt = doc.startViewTransition(() => domApply(nextDark));
    vt.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 600, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" }
      );
    });
    vt.finished.then(() => setIsDark(nextDark)).finally(() => root.classList.remove("theme-switching"));
  };

  // SSR 兜底占位，避免布局跳跃
  if (isDark === null) {
    return <div className={`w-6 h-6 ${className}`} />;
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? "切换为浅色模式" : "切换为深色模式"}
      title={isDark ? "切换为浅色模式" : "切换为深色模式"}
      className={`p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors duration-200 cursor-pointer flex items-center justify-center ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "sun" : "moon"}
          initial={{ rotate: -60, opacity: 0, scale: 0.7 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 60, opacity: 0, scale: 0.7, transition: { duration: 0.12 } }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex"
        >
          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
