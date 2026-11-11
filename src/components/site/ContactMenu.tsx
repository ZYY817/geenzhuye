"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { SYSTEM_METRICS } from "@/data/archive";
import { UI, type Lang } from "@/data/i18n";
import { SwapText } from "@/components/site/Kinetic";
import { EASE_SILK, EASE_EXIT } from "./motion";

/* ============================================================================
 * 联系入口 (Contact Menu) —— 顶栏唯一联系入口
 * ----------------------------------------------------------------------------
 * 全站联系方式收敛于此：微信/邮箱一键复制，B站/抖音/GitHub 外链直达。
 * 点开轻量浮层，点击外部或 Esc 关闭。顶栏向下展开；页脚以整句为触发器、向上展开。
 * 浮层条目 30ms 错峰落入，复制成功用强调色反馈。
 * ==========================================================================*/

export function ContactMenu({
  lang = "zh", placement = "down", trigger, triggerClassName,
}: {
  lang?: Lang; placement?: "down" | "up";
  trigger?: (open: boolean) => React.ReactNode; triggerClassName?: string;
}) {
  const T = UI[lang];
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<"wechat" | "email" | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const copy = (which: "wechat" | "email", value: string) => {
    navigator.clipboard?.writeText(value).catch(() => {});
    setCopied(which);
    window.setTimeout(() => setCopied(null), 2000);
  };

  const up = placement === "up";
  const S = SYSTEM_METRICS.socials;
  const links = [
    { label: "Bilibili", href: S.bilibili },
    { label: lang === "zh" ? "抖音" : "Douyin", href: S.douyin },
    { label: "GitHub", href: S.github },
  ];

  const item = reduced
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : { hidden: { opacity: 0, y: up ? 4 : -4 }, show: { opacity: 1, y: 0, transition: { duration: 0.24, ease: EASE_SILK } } };

  const rowCls =
    "w-full flex items-center justify-between gap-6 px-3 py-2 text-left font-mono text-xs text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-950/[0.04] dark:hover:bg-white/[0.05] transition-colors cursor-pointer";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={triggerClassName ?? "hover:text-black dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1"}
      >
        {trigger ? trigger(open) : <span className="hover:underline underline-offset-4"><SwapText text={T.contact} /></span>}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            variants={{
              hidden: reduced ? { opacity: 0 } : { opacity: 0, y: up ? 6 : -6, scale: 0.97 },
              show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.26, ease: EASE_SILK, staggerChildren: reduced ? 0 : 0.03, delayChildren: 0.04 } },
              exit: reduced ? { opacity: 0, transition: { duration: 0.12 } } : { opacity: 0, y: up ? 4 : -4, scale: 0.98, transition: { duration: 0.16, ease: EASE_EXIT } },
            }}
            initial="hidden"
            animate="show"
            exit="exit"
            style={{ transformOrigin: up ? "left bottom" : "right top" }}
            className={`absolute z-50 ${up ? "left-0 bottom-[calc(100%+14px)]" : "right-0 top-[calc(100%+10px)]"} w-56 py-1.5 bg-white dark:bg-[#101013] shadow-[0_16px_48px_-12px_rgba(0,0,0,0.22)] dark:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.6)]`}
          >
            <motion.button variants={item} role="menuitem" type="button" onClick={() => copy("wechat", S.wechat)} className={rowCls}>
              <span>{T.wechat}</span>
              <span className="flex items-center gap-1.5 text-neutral-400">
                {copied === "wechat" ? (
                  <>
                    <span className="text-accent">{T.copied}</span>
                    <Check className="w-3 h-3 text-accent" />
                  </>
                ) : (
                  <>
                    <span>{S.wechat}</span>
                    <Copy className="w-3 h-3 opacity-50" />
                  </>
                )}
              </span>
            </motion.button>
            <motion.button variants={item} role="menuitem" type="button" onClick={() => copy("email", S.email)} className={rowCls}>
              <span>{T.email}</span>
              <span className="flex items-center gap-1.5 text-neutral-400">
                {copied === "email" ? (
                  <>
                    <span className="text-accent">{T.copied}</span>
                    <Check className="w-3 h-3 text-accent" />
                  </>
                ) : (
                  <Copy className="w-3 h-3 opacity-50" />
                )}
              </span>
            </motion.button>
            {links.map((l) => (
              <motion.a variants={item} role="menuitem" key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className={rowCls}>
                <span>{l.label}</span>
                <ArrowUpRight className="w-3 h-3 text-neutral-400" />
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
