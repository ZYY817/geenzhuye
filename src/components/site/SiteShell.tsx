"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { SwapText } from "@/components/site/Kinetic";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { ContactMenu } from "@/components/site/ContactMenu";
import { LocalClock } from "@/components/site/LocalClock";
import { LangToggle } from "@/components/site/LangToggle";
import { useLang } from "@/components/site/lang";
import { LAST_UPDATED } from "@/data/archive";
import { UI } from "@/data/i18n";
import { EASE_SILK } from "@/components/site/motion";

/* ============================================================================
 * 全站外壳 (Site Shell) —— 顶栏 / 颗粒 / 页脚 / 语言，首页与关于页共用。
 * ----------------------------------------------------------------------------
 * 顶栏与页脚固定在页面两侧边缘：首页索引态、详情态、关于页共用同一几何，
 * 任何切换中位移为零。
 * ==========================================================================*/

function NavLink({ href, label, current }: { href: string; label: string; current: boolean }) {
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={`cursor-pointer transition-colors ${
        current
          ? "text-neutral-950 dark:text-white"
          : "text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
      }`}
    >
      <SwapText text={label} />
    </Link>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useLang();
  const T = UI[lang];
  const pathname = usePathname();

  // 挂载信标：layout 内联兜底脚本以此判断 React 是否已接管 DOM
  useEffect(() => {
    document.documentElement.dataset.appMounted = "true";
    document.documentElement.classList.remove("reveal-fallback");
  }, []);

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#09090b] text-[#18181b] dark:text-[#fafafa] selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black font-sans relative overflow-x-clip transition-colors duration-300">
      <div className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md dark:bg-[#09090b]/85">
        <motion.header
          data-fallback-reveal
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_SILK }}
          className="w-full max-w-[1440px] mx-auto h-[72px] sm:h-[88px] px-5 sm:px-6 flex items-center justify-between"
        >
          {/* 左侧身份标识：点击回首页 */}
          <Link href="/" className="group flex shrink-0 items-center gap-2 whitespace-nowrap font-mono text-sm tracking-wider text-neutral-900 dark:text-white font-normal cursor-pointer" aria-label="智宇 · 首页">
            <Image
              src="/yuqi/logo.png"
              alt="智宇徽记"
              width={20}
              height={20}
              className="dark:invert transition-all duration-300"
              priority
            />
            <span>智宇</span>
            <span className="hidden sm:inline text-neutral-500 dark:text-neutral-400 text-xs font-normal">/ ZYY817</span>
          </Link>

          {/* 右侧：导航 + 联系 + 语言/深浅色切换 */}
          <nav className="flex items-center gap-3.5 sm:gap-6 font-mono text-xs text-neutral-500 dark:text-neutral-400" aria-label="主导航">
            <NavLink href="/" label={T.navArchive} current={pathname === "/"} />
            <NavLink href="/about" label={T.navAbout} current={pathname === "/about"} />
            <span aria-hidden className="hidden sm:block w-3 h-px bg-neutral-300 dark:bg-neutral-600" />
            <ContactMenu lang={lang} />
            <LangToggle lang={lang} onToggle={() => setLang(lang === "zh" ? "en" : "zh")} />
            <ThemeToggle />
          </nav>
        </motion.header>
      </div>

      <SmoothScroll />
      <div aria-hidden className="grain-overlay pointer-events-none fixed inset-0 z-[60] opacity-[0.035] dark:opacity-[0.05]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "160px 160px" }} />

      {children}

      {/* ============================================================== */}
      {/* 尾声：元信息行                                                   */}
      {/* ============================================================== */}
      <footer className="w-full max-w-[1440px] mx-auto px-5 sm:px-6 pt-14 sm:pt-16 pb-8">
        <div className="flex flex-col sm:flex-row justify-between gap-3 font-mono text-xs text-neutral-500 dark:text-neutral-400">
          <span>© {LAST_UPDATED.slice(0, 4)} 智宇 · ZYY817</span>
          <span className="flex items-baseline gap-5">
            <LocalClock city={T.city} />
            <span>{T.updated} {LAST_UPDATED}</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
