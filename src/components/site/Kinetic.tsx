"use client";

import React, { useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE_SILK, EASE_EXIT } from "@/components/site/motion";
import { useLangFlight } from "@/components/site/LangSwap";

/* ============================================================================
 * 排印动效原语 (Kinetic Type)
 * ----------------------------------------------------------------------------
 * 只动文字本身，不加任何框线装饰：
 *   RollText  —— 悬停时逐字向上翻滚（下层同字接上），split-flap 同族语言
 *   SplitRise —— 逐字自遮罩内升起，方向可控
 *   Odometer  —— 机械里程表：每位数字独立一列滚动到位
 * 按「词」分组（空格切分）保证换行只发生在词间。
 * ==========================================================================*/

const SILK = "cubic-bezier(0.16, 1, 0.3, 1)";
/* 断行单元：中日文逐字可断（行首标点并入前一字），拉丁词整词不断，空白单独保留 */
const tokens = (text: string) =>
  (text.match(/\s+|[\u3000-\u9fff\uff00-\uffef][，。、；：！？）」』,.;:!?)]*|[^\s\u3000-\u9fff\uff00-\uffef]+/g) ?? []);

/* rollClass：翻上来那一层字的颜色，默认强调色；简约首页传 "" 表示与原字同色 */
export function RollText({ text, active, stagger = 16, rollClass = "text-accent" }: { text: string; active: boolean; stagger?: number; rollClass?: string }) {
  /* 换语言推屏重挂载：跳过双层字符 DOM，平铺渲染（悬停翻字在下次渲染恢复） */
  const flight = useLangFlight();
  if (flight) {
    return (
      <span>
        <span className="sr-only">{text}</span>
        <span aria-hidden>{text}</span>
      </span>
    );
  }
  let n = 0;
  return (
    <span>
      <span className="sr-only">{text}</span>
      {tokens(text).map((tok, t) =>
        /^\s+$/.test(tok) ? (
          <span key={t} aria-hidden> </span>
        ) : (
          <span key={t} aria-hidden className="inline-block whitespace-nowrap">
            {Array.from(tok).map((c) => {
              const i = n++;
              return (
                <span key={i} className="relative inline-block overflow-hidden align-bottom">
                  <span
                    className="block transition-transform duration-[520ms] motion-reduce:transition-none"
                    style={{ transform: active ? "translateY(-100%)" : "translateY(0)", transitionDelay: `${i * stagger}ms`, transitionTimingFunction: SILK }}
                  >
                    {c}
                  </span>
                  <span
                    className={`absolute left-0 top-0 block ${rollClass} transition-transform duration-[520ms] motion-reduce:transition-none`}
                    style={{ transform: active ? "translateY(0)" : "translateY(100%)", transitionDelay: `${i * stagger}ms`, transitionTimingFunction: SILK }}
                  >
                    {c}
                  </span>
                </span>
              );
            })}
          </span>
        )
      )}
    </span>
  );
}

export function SplitRise({
  text, direction = 1, delay = 0, stagger = 0.024, duration = 0.7, inView = false, className = "",
}: { text: string; direction?: number; delay?: number; stagger?: number; duration?: number; inView?: boolean; className?: string }) {
  /* 服务端拿不到减弱动态偏好：水合前一律按常规首帧渲染，避免 SSR 与客户端样式不一致 */
  const prefersReduced = useReducedMotion();
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const reduced = mounted && prefersReduced;
  /* 换语言推屏重挂载：整页平移是唯一动效，字符直接成品态，不抢帧 */
  const flight = useLangFlight();
  let n = 0;
  /* 视口检测挂在外层：字符本身被位移到裁切框外，直接观察它们的相交比恒为 0 */
  const variants = {
    hidden: reduced ? { opacity: 0 } : { y: direction > 0 ? "108%" : "-108%" },
    show: (i: number) => ({ y: "0%", opacity: 1, transition: { duration: reduced ? 0.2 : duration, ease: EASE_SILK, delay: delay + i * stagger } }),
  };
  return (
    <motion.span
      className={className}
      initial={flight ? false : "hidden"}
      {...(inView ? { whileInView: "show", viewport: { once: true, amount: 0.3 } } : { animate: "show" })}
    >
      <span className="sr-only">{text}</span>
      {tokens(text).map((tok, t) =>
        /^\s+$/.test(tok) ? (
          <span key={t} aria-hidden> </span>
        ) : (
          <span key={t} aria-hidden className="inline-block whitespace-nowrap">
            {Array.from(tok).map((c) => {
              const i = n++;
              return (
                <span key={i} className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom">
                  <motion.span className="inline-block" variants={variants} custom={i}>
                    {c}
                  </motion.span>
                </span>
              );
            })}
          </span>
        )
      )}
    </motion.span>
  );
}

/* 换词翻转 (Swap Text)：text 变化时旧词向上翻出、新词自下方翻入。
 * 用于语言切换时的小标签（导航/按钮），overflow-hidden 裁切框内原地替换。 */
export function SwapText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <motion.span layout transition={{ layout: { duration: 0.28, ease: EASE_SILK } }} className={`relative inline-flex overflow-hidden align-bottom ${className}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={text}
          initial={{ y: "72%", opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { duration: 0.32, ease: EASE_SILK } }}
          exit={{ y: "-72%", opacity: 0, transition: { duration: 0.16, ease: EASE_EXIT } }}
          className="inline-block will-change-transform"
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}

/* 里程表：value 为最终字符串（如 "100,000+"），run 为 false 时各位停在 0 */
export function Odometer({ value, run, className = "" }: { value: string; run: boolean; className?: string }) {
  /* 换语言推屏重挂载：数字直接落位，不重滚；
     且跳过 30 行/位 的滚柱 DOM（≈700 节点），减轻切换提交帧 */
  const flight = useLangFlight();
  const chars = Array.from(value);
  const digits = chars.filter((c) => /\d/.test(c)).length;
  let d = 0;
  if (flight) {
    return (
      <span className={`inline-flex items-start tabular-nums ${className}`}>
        <span className="sr-only">{value}</span>
        <span aria-hidden>{value}</span>
      </span>
    );
  }
  return (
    <span className={`inline-flex items-start tabular-nums ${className}`}>
      <span className="sr-only">{value}</span>
      {chars.map((c, i) => {
        if (!/\d/.test(c)) return <span key={i} aria-hidden className="inline-block h-[1.15em] whitespace-pre leading-[1.15em]">{c}</span>;
        const order = digits - 1 - d++;
        /* 低位转得多、高位转得少——真实里程表的齿轮比 */
        const target = run ? Number(c) + 10 * Math.max(0, 2 - order) : 0;
        return (
          <span key={i} aria-hidden className="relative inline-block h-[1.15em] overflow-hidden leading-[1.15em]">
            <span
              className="block transition-transform duration-[1600ms] motion-reduce:duration-0"
              style={{
                transform: `translateY(-${target * 1.15}em)`,
                transitionDelay: flight ? "0ms" : `${(digits - 1 - order) * 60}ms`,
                transitionDuration: flight ? "0ms" : undefined,
                transitionTimingFunction: SILK,
              }}
            >
              {Array.from({ length: 30 }, (_, k) => (
                <span key={k} className="block h-[1.15em]">{k % 10}</span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
