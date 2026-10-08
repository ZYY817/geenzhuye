"use client";

import React, { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/* ============================================================================
 * 开场打字机 (Hero Typewriter) — StrictMode 安全 · 全生命周期绝不重播
 * ----------------------------------------------------------------------------
 * 1. 定时器全部由 effect 持有并在 cleanup 中统一取消 —— StrictMode 下第二次
 *    挂载干净地重新启动，生产环境单次运行。
 * 2. 模块级 heroCompletionCache：任何发生在打字完成之后的真实重挂载
 *    (Fast Refresh / Activity) 直接渲染完成态文本，绝不可能重打一遍。
 * 3. 拟人节奏：随机击键间隔 + 标点停顿 + 420ms 蓄力起手。
 * 4. 双轨无障碍：sr-only 完整文本供读屏器，视觉层 aria-hidden。
 * 5. 光标退役：打字完成后停留片刻随即熄灭，全屏归于神圣静止。
 * ==========================================================================*/

const HERO_LINE_1 = "见字如面，我是智宇。";
const HERO_LINE_2 = "过往所作皆有回响，当下所谋正步步前行。";

let heroCompletionCache = false;

export function HeroTypewriter({ onReady }: { onReady?: () => void }) {
  const reduced = useReducedMotion();
  const cached = heroCompletionCache;
  const [count1, setCount1] = useState(cached ? HERO_LINE_1.length : 0);
  const [count2, setCount2] = useState(cached ? HERO_LINE_2.length : 0);
  const [phase, setPhase] = useState<0 | 1 | 2>(cached ? 2 : 0); // 0=敲第一行 1=敲第二行 2=完成
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

    // 拟人击键：基础 24–54ms 随机抖动，标点处自然停顿换气
    const keystrokeDelay = (ch: string) =>
      24 + Math.random() * 30 + (/[，。、；！？…]/.test(ch) ? 170 : /[「」『』—]/.test(ch) ? 90 : 0);

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

    // 蓄力起手：0.42s 静止凝视后落下第一笔
    later(() => {
      typeLine(HERO_LINE_1, setCount1, () => {
        setPhase(1);
        later(() => {
          typeLine(HERO_LINE_2, setCount2, () => {
            setPhase(2);
            heroCompletionCache = true;
            // 全文定格后呼吸 260ms，顺滑引出下方作品长卷
            later(() => onReadyRef.current?.(), 260);
          });
        }, 210);
      });
    }, 420);

    return () => timers.forEach(window.clearTimeout);
  }, [reduced]);

  const cursorCls =
    "inline-block w-[2px] h-[0.85em] bg-white align-baseline transition-opacity duration-700";

  return (
    <div className="space-y-3">
      {/* 核心第一句：内敛纯白 */}
      <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-light tracking-tight text-white leading-snug">
        <span className="sr-only">{HERO_LINE_1}</span>
        <span id="hero-line-1" aria-hidden="true">{HERO_LINE_1.slice(0, count1)}</span>
        {phase === 0 && (
          <span
            aria-hidden="true"
            data-motion-decoration
            className={`${cursorCls} ml-2 shadow-[0_0_8px_rgba(255,255,255,0.8)]`}
          />
        )}
      </h1>

      {/* 核心第二句：温润灰白 */}
      <div className="text-base sm:text-lg text-neutral-400 font-light leading-relaxed min-h-[1.9rem]">
        <span className="sr-only">{HERO_LINE_2}</span>
        <span id="hero-line-2" aria-hidden="true">{HERO_LINE_2.slice(0, count2)}</span>
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
    </div>
  );
}
