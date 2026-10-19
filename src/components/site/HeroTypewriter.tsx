"use client";

import React, { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowUpRight, Copy, Check, MessageSquare } from "lucide-react";
import { SYSTEM_METRICS } from "@/data/archive";

/* ============================================================================
 * 开场打字机 (Hero Typewriter) — 智宇专属自述
 * ----------------------------------------------------------------------------
 * 1. 原生拟人打字手感：随机击键 + 标点停顿 + 光标呼吸退出。
 * 2. 状态安全：StrictMode / 路由切换 / 缓存状态绝不重复打字。
 * 3. 敲击完成后轻柔浮现快捷入口（微信快速复制 / B站 / 抖音 / GitHub / 邮箱）。
 * ==========================================================================*/

const HERO_LINE_1 = "Hello，我是智宇。";
const HERO_LINE_2 = "把我懂的经验和思考，借助 AI 去帮到更多的人。";

let heroCompletionCache = false;

export function HeroTypewriter({ onReady }: { onReady?: () => void }) {
  const reduced = useReducedMotion();
  const cached = heroCompletionCache;
  const [count1, setCount1] = useState(cached ? HERO_LINE_1.length : 0);
  const [count2, setCount2] = useState(cached ? HERO_LINE_2.length : 0);
  const [phase, setPhase] = useState<0 | 1 | 2>(cached ? 2 : 0); // 0=敲第一行 1=敲第二行 2=完成
  const [copiedWechat, setCopiedWechat] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
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
    const later = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms));
    };

    if (reduced) {
      later(() => {
        setCount1(HERO_LINE_1.length);
        setCount2(HERO_LINE_2.length);
        setPhase(2);
        heroCompletionCache = true;
        onReadyRef.current?.();
      }, 0);
      return () => timers.forEach(window.clearTimeout);
    }

    // 拟人击键：基础 22–45ms，标点处自然换气停顿
    const keystrokeDelay = (ch: string) =>
      22 + Math.random() * 25 + (/[，。、；！？…]/.test(ch) ? 160 : 0);

    const typeLine = (line: string, set: (n: number) => void, done: () => void) => {
      const step = (idx: number) => {
        set(idx);
        if (idx >= line.length) {
          done();
          return;
        }
        later(() => step(idx + 1), keystrokeDelay(line[idx]));
      };
      step(0);
    };

    // 0.28s 静止后落笔第一行
    later(() => {
      typeLine(HERO_LINE_1, setCount1, () => {
        setPhase(1);
        later(() => {
          typeLine(HERO_LINE_2, setCount2, () => {
            setPhase(2);
            heroCompletionCache = true;
            later(() => onReadyRef.current?.(), 220);
          });
        }, 180);
      });
    }, 280);

    return () => timers.forEach(window.clearTimeout);
  }, [reduced]);

  const copyWechat = () => {
    const wx = SYSTEM_METRICS.socials.wechat || "zhiyuydyh";
    navigator.clipboard?.writeText(wx).catch(() => {});
    setCopiedWechat(true);
    window.setTimeout(() => setCopiedWechat(false), 2200);
  };

  const copyEmail = () => {
    navigator.clipboard?.writeText(SYSTEM_METRICS.socials.email).catch(() => {});
    setCopiedEmail(true);
    window.setTimeout(() => setCopiedEmail(false), 2200);
  };

  const cursorCls =
    "inline-block w-[2px] h-[0.85em] bg-white align-baseline transition-opacity duration-700";

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* 核心第一句：内敛纯白 */}
      <h1 className="text-2xl sm:text-[1.85rem] font-light tracking-tight text-white leading-snug">
        <span className="sr-only">{HERO_LINE_1}</span>
        <span id="hero-line-1" aria-hidden="true">
          {HERO_LINE_1.slice(0, count1)}
        </span>
        {phase === 0 && (
          <span
            aria-hidden="true"
            data-motion-decoration
            className={`${cursorCls} ml-2 shadow-[0_0_8px_rgba(255,255,255,0.8)]`}
          />
        )}
      </h1>

      {/* 核心第二句：温润灰白 */}
      <div className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed min-h-[1.75rem]">
        <span className="sr-only">{HERO_LINE_2}</span>
        <span id="hero-line-2" aria-hidden="true">
          {HERO_LINE_2.slice(0, count2)}
        </span>
        {phase >= 1 && (
          <span
            aria-hidden="true"
            data-motion-decoration
            className={`${cursorCls} w-[1.5px] ml-1.5 bg-neutral-300 ${
              phase === 2 ? "opacity-0 delay-700" : "opacity-100"
            }`}
          />
        )}
      </div>

      {/* 快捷联系与入口行：微信快速复制 / B站 / 抖音 / GitHub / 邮箱 */}
      <div
        className={`pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3 font-mono text-xs transition-opacity duration-700 ${
          phase === 2 ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* 微信快速复制 */}
        <button
          onClick={copyWechat}
          type="button"
          className="px-3.5 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 hover:border-neutral-700 hover:text-white text-neutral-300 transition-all flex items-center gap-1.5 cursor-pointer group shadow-sm"
        >
          {copiedWechat ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">已复制微信: {SYSTEM_METRICS.socials.wechat}</span>
            </>
          ) : (
            <>
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400/80 group-hover:text-emerald-400 transition-colors" />
              <span>微信：{SYSTEM_METRICS.socials.wechat}</span>
              <Copy className="w-3 h-3 opacity-40 group-hover:opacity-90 transition-opacity" />
            </>
          )}
        </button>

        {/* B站 */}
        <a
          href={SYSTEM_METRICS.socials.bilibili}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 hover:border-neutral-700 hover:text-white text-neutral-300 transition-all flex items-center gap-1.5 shadow-sm group"
        >
          <span>📺</span>
          <span>B站：{SYSTEM_METRICS.socials.bilibiliHandle || "智宇丶817"}</span>
          <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>

        {/* 抖音 */}
        <a
          href={SYSTEM_METRICS.socials.douyin}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 hover:border-neutral-700 hover:text-white text-neutral-300 transition-all flex items-center gap-1.5 shadow-sm group"
        >
          <span>🎵</span>
          <span>抖音：{SYSTEM_METRICS.socials.douyinId || "35071658"}</span>
          <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>

        {/* GitHub */}
        <a
          href={SYSTEM_METRICS.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 hover:border-neutral-700 hover:text-white text-neutral-300 transition-all flex items-center gap-1.5 shadow-sm group"
        >
          <span>🐙</span>
          <span>GitHub</span>
          <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>

        {/* 邮箱 */}
        <button
          onClick={copyEmail}
          type="button"
          className="px-3.5 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 hover:border-neutral-700 hover:text-white text-neutral-300 transition-all flex items-center gap-1.5 cursor-pointer group shadow-sm"
        >
          {copiedEmail ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">已复制邮箱</span>
            </>
          ) : (
            <>
              <span>✉️</span>
              <span>邮箱</span>
              <Copy className="w-3 h-3 opacity-40 group-hover:opacity-90 transition-opacity" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
