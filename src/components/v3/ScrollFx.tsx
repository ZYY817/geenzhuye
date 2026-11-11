"use client";

/* ============================================================================
 * 滚动驱动的效果（2026-11-09）
 * ----------------------------------------------------------------------------
 * · LitText：一句话随进度逐字由浅变深（像被读出来）。进度 0..1 由外部给。
 * · ScrollRise：元素进入视口时，随滚动从下方浮上来（位移、透明度跟着滚动走）。
 * 只在宽屏、非减弱动态时启用；否则直接显示成品。
 * ==========================================================================*/

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";

/** 文本里的 "\n" 在宽屏处换行 */
export function LitText({ text, progress, on, className = "" }: { text: string; progress: MotionValue<number>; on: boolean; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const chars = Array.from(text);
  const n = chars.filter((c) => c !== "\n").length;
  useMotionValueEvent(progress, "change", (v) => {
    if (!on) return;
    ref.current?.style.setProperty("--p", String(Math.max(0, Math.min(1, v))));
  });
  useEffect(() => {
    ref.current?.style.setProperty("--p", on ? String(progress.get()) : "1");
  }, [on, progress]);
  let i = 0;
  return (
    <span ref={ref} className={`v3-lit ${className}`} style={{ ["--n" as string]: n, ["--p" as string]: on ? 0 : 1 }}>
      <span className="sr-only">{text.replaceAll("\n", "")}</span>
      <span aria-hidden>
        {chars.map((c, k) =>
          c === "\n" ? (
            <br key={k} className="hidden min-[800px]:block" />
          ) : (
            <span key={k} className="v3-lit-c" style={{ ["--i" as string]: i++ }}>
              {c}
            </span>
          ),
        )}
      </span>
    </span>
  );
}

/** 进入视口时随滚动浮上来；depth 越大位移越大（制造分层视差） */
export function ScrollRise({ children, on, depth = 1, className = "" }: { children: React.ReactNode; on: boolean; depth?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 100%", "start 62%"] });
  const y = useTransform(scrollYProgress, [0, 1], [36 * depth, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.15, 1]);
  return (
    <motion.div ref={ref} className={className} style={on ? { y, opacity } : undefined}>
      {children}
    </motion.div>
  );
}

/** 宽屏且未开减弱动态时才启用滚动效果 */
export function useScrollFxOn(reduced: boolean | null) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(min-width: 960px) and (hover: hover)");
    const set = () => setOn(mq.matches && !reduced);
    const raf = requestAnimationFrame(set);
    mq.addEventListener("change", set);
    return () => { cancelAnimationFrame(raf); mq.removeEventListener("change", set); };
  }, [reduced]);
  return on;
}

/** 镜头推近：页面在顶部时不放大；往下滚，媒体逐渐放大到接近整屏、移到屏幕水平中央，
 *  在它的中心到达屏幕中线时最大，继续滚动再缩回原位 */
export function ZoomStage({ children, on, w, h, className = "" }: { children: React.ReactNode; on: boolean; w: number; h: number; className?: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState({ s: 1, dx: 0, peak: 200 });
  useEffect(() => {
    if (!on) return;
    const measure = () => {
      const el = outer.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const centerDoc = r.top + window.scrollY + r.height / 2;
      const s = Math.max(1, Math.min((innerWidth * 0.84) / w, (innerHeight * 0.7) / h));
      setGeo({ s, dx: innerWidth / 2 - (r.left + r.width / 2), peak: Math.max(160, centerDoc - innerHeight / 2) });
    };
    measure();
    const id = setTimeout(measure, 1200); // 入场动画结束后再量一次
    addEventListener("resize", measure);
    return () => { clearTimeout(id); removeEventListener("resize", measure); };
  }, [on, w, h]);
  const { scrollY: pageY } = useScroll();
  const ease = useTransform(pageY, (sy) => {
    const span = 280;
    const v = sy <= geo.peak ? sy / geo.peak : 1 - (sy - geo.peak) / span;
    const k = Math.max(0, Math.min(1, v));
    return k * k * (3 - 2 * k);
  });
  const scale = useTransform(ease, (v) => 1 + (geo.s - 1) * v);
  const x = useTransform(ease, (v) => geo.dx * v);
  return (
    <div ref={outer} className={className}>
      <motion.div className="relative z-30" style={on ? { scale, x } : undefined}>
        {children}
      </motion.div>
    </div>
  );
}
