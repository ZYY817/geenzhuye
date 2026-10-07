"use client";

import React, { useRef } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { EASE_SILK } from "./motion";

/* ============================================================================
 * 图版揭示容器 (Media Reveal)
 * ----------------------------------------------------------------------------
 * 裸内容呈现：无框、无边、无装饰线条——只做柔和落地阴影与一次性的
 * clip-path 自上而下擦除入场。视觉重量全部交给内容本身。
 * ==========================================================================*/

const plateVariants: Variants = {
  hidden: { opacity: 0, y: 30, clipPath: "inset(0 0 100% 0)" },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 0.95, ease: EASE_SILK, delay },
  }),
};

const plateReducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35 } },
};

const footerVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_SILK, delay: delay + 0.3 },
    transitionEnd: { transform: "none" },
  }),
};

/**
 * @param gate   undefined → 滚入视口即展开；boolean → 视口内且 gate 为真才展开
 * @param ratio  画幅
 * @param footer 下方的注脚行，随入场一拍后浮现
 */
export function MediaPlate({
  gate,
  delay = 0.08,
  ratio = "16 / 9",
  footer,
  glow = "rgba(255,255,255,0.035)",
  className = "",
  children,
}: {
  gate?: boolean;
  delay?: number;
  ratio?: string;
  footer?: React.ReactNode;
  glow?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-72px" });
  const reduced = useReducedMotion();
  const show = (gate === undefined ? true : gate) && inView;

  return (
    <motion.figure
      ref={ref as React.RefObject<HTMLElement>}
      initial="hidden"
      animate={show ? "visible" : "hidden"}
      data-fallback-reveal
      className={`relative group w-full ${className}`}
    >
      {/* 极隐蔽环境光晕：内容背后的柔光景深，悬停时苏醒 */}
      <div
        aria-hidden="true"
        className="absolute -inset-10 pointer-events-none -z-10 opacity-60 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: `radial-gradient(ellipse at center, ${glow} 0%, transparent 70%)`,
        }}
      />

      <motion.div
        variants={reduced ? plateReducedVariants : plateVariants}
        custom={delay}
        data-fallback-reveal
        className="relative w-full overflow-hidden bg-[#0a0b0f] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.75)]"
        style={{ aspectRatio: ratio }}
      >
        {children}
      </motion.div>

      {footer && (
        <motion.figcaption
          data-fallback-reveal
          variants={reduced ? plateReducedVariants : footerVariants}
          custom={delay}
          className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-2.5"
        >
          {footer}
        </motion.figcaption>
      )}
    </motion.figure>
  );
}
