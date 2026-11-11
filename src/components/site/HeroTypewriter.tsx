"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ARCHIVE_PROJECTS } from "@/data/archive";
import { EN_PROJECTS, type Lang } from "@/data/i18n";
import { EASE_SILK, EASE_EXIT } from "@/components/site/motion";

/* ============================================================================
 * 开场 (Hero) — 智宇专属自述
 * ----------------------------------------------------------------------------
 * 时间线（首访，自首帧起）：
 *   0.20s  第一行开始击键（26–48ms/字，标点 +160ms）
 *   ≈1.05s 第一行落定 → onReady（身份行、数据、索引依此编排）
 *   1.05s  第二行逐字升起（12ms/字错峰，0.6s）——不再打字：
 *          两行都打字时第二行要到 3.9s 才完，招聘方 10 秒扫读里太慢
 * 回访（缓存命中）：不重播，直接 onReady。
 * ==========================================================================*/

const HERO_LINES = {
  zh: ["Hello，我是智宇。", { pre: "把经验做成", post: "，帮到更多的人。" }],
  en: ["Hello, I'm Zhiyu.", { pre: "Turning experience into", post: " — helping more people." }],
} as const;

let heroCompletionCache = false;
export const isHeroDone = () => heroCompletionCache;

/* ---------------------------------------------------------------------------
 * 词槽 (Word Slot) —— 第二行自述里的活目录：每 ~2.2s 翻一个作品名，
 * 蓝色、可点击直达详情。一句话看完，等于翻完了整个档案。
 * -------------------------------------------------------------------------*/
const SLOT_MS = 2200;

function WordSlot({ lang, onPick }: { lang: Lang; onPick?: (id: string) => void }) {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % ARCHIVE_PROJECTS.length), SLOT_MS);
    return () => window.clearInterval(t);
  }, [reduced]);
  const p = ARCHIVE_PROJECTS[i];
  const title = (lang === "en" ? EN_PROJECTS[p.id]?.title : undefined) ?? p.title;
  return (
    <button
      type="button"
      onClick={() => onPick?.(p.id)}
      title={title}
      className="group mx-[0.15em] inline-flex cursor-pointer overflow-hidden align-baseline font-semibold text-accent underline decoration-accent/40 underline-offset-[5px] transition-colors hover:decoration-accent"
    >
      <motion.span layout="position" transition={{ layout: { duration: 0.3, ease: EASE_SILK } }} className="inline-flex">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={title}
            initial={reduced ? { opacity: 0 } : { y: "72%", opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 0.32, ease: EASE_SILK } }}
            exit={reduced ? { opacity: 0, transition: { duration: 0.12 } } : { y: "-72%", opacity: 0, transition: { duration: 0.18, ease: EASE_EXIT } }}
            className="inline-block whitespace-nowrap"
          >
            {title}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </button>
  );
}

export function HeroTypewriter({ onReady, lang = "zh", onPick }: { onReady?: () => void; lang?: Lang; onPick?: (id: string) => void }) {
  const [HERO_LINE_1, LINE_2] = HERO_LINES[lang];
  const reduced = useReducedMotion();
  const [cached] = useState(() => heroCompletionCache);
  const [count, setCount] = useState(cached ? HERO_LINE_1.length : 0);
  const [done, setDone] = useState(cached);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    if (heroCompletionCache) {
      onReadyRef.current?.();
      return;
    }
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => { timers.push(window.setTimeout(fn, ms)); };
    const finish = () => {
      setCount(HERO_LINE_1.length);
      setDone(true);
      heroCompletionCache = true;
      onReadyRef.current?.();
    };
    if (reduced) {
      later(finish, 0);
      return () => timers.forEach(window.clearTimeout);
    }
    const keystrokeDelay = (ch: string) => 26 + Math.random() * 22 + (/[，。、,.]/.test(ch) ? 160 : 0);
    const step = (idx: number) => {
      setCount(idx);
      if (idx >= HERO_LINE_1.length) { later(finish, 60); return; }
      later(() => step(idx + 1), keystrokeDelay(HERO_LINE_1[idx]));
    };
    later(() => step(0), 200);
    return () => timers.forEach(window.clearTimeout);
  }, [reduced, HERO_LINE_1]);

  return (
    <div className="space-y-4 sm:space-y-5">
      <h1 className="text-3xl sm:text-5xl font-medium tracking-[-0.02em] text-neutral-950 dark:text-white leading-snug [text-wrap:balance]">
        <span className="sr-only">{HERO_LINE_1}</span>
        <span id="hero-line-1" aria-hidden="true">
          {done ? HERO_LINE_1 : HERO_LINE_1.slice(0, count)}
        </span>
        <span
          aria-hidden="true"
          data-motion-decoration
          className={`ml-2 inline-block h-[0.82em] w-[3px] translate-y-[0.06em] bg-accent align-baseline transition-opacity duration-500 ${
            done ? "opacity-0" : "animate-[caret-blink_1.1s_step-end_infinite]"
          }`}
        />
      </h1>

      <div className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 font-normal leading-relaxed min-h-[1.75rem] [text-wrap:pretty]">
        {cached || done ? (
          <span>
            {LINE_2.pre}
            <WordSlot lang={lang} onPick={onPick} />
            {LINE_2.post}
          </span>
        ) : (
          <span className="sr-only">{`${LINE_2.pre}…${LINE_2.post}`}</span>
        )}
      </div>
    </div>
  );
}
