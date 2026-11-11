"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { EASE_SILK } from "@/components/site/motion";
import type { Lang } from "@/data/i18n";

/* 语言切换：标签纵向翻滚交换（split-flap 感），EASE_SILK 出场、快退离场 */
export function LangToggle({ lang, onToggle }: { lang: Lang; onToggle: () => void }) {
  const reduced = useReducedMotion();
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={lang === "zh" ? "Switch to English" : "切换到中文"}
      className="relative overflow-hidden font-mono text-xs text-neutral-500 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer px-1 h-[1.4em] leading-[1.4em]"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={lang}
          initial={reduced ? { opacity: 0 } : { y: "110%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={reduced ? { opacity: 0, transition: { duration: 0.12 } } : { y: "-110%", opacity: 0, transition: { duration: 0.18, ease: [0.64, 0, 0.78, 0] } }}
          transition={{ duration: 0.35, ease: EASE_SILK }}
          className="inline-block"
        >
          {lang === "zh" ? "EN" : "中"}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
