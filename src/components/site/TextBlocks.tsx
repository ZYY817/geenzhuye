"use client";

import React, { useRef } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { EASE_SILK } from "./motion";

/* ============================================================================
 * 遮罩行升起文字揭示 (Masked Line Rise)
 * ----------------------------------------------------------------------------
 * 文字一律不使用 filter: blur —— 守住 Windows ClearType 次像素锐度铁律。
 * 每行文字从自身的 overflow 遮罩下沿垂直升起，逐行错峰，如铅字版逐行落版。
 * ==========================================================================*/

const lineVariants: Variants = {
  hidden: { y: "112%" },
  visible: (i: number) => ({
    y: "0%",
    transition: { duration: 0.88, ease: EASE_SILK, delay: 0.06 + i * 0.075 },
    transitionEnd: { transform: "none" },
  }),
};

const blockVariants: Variants = {
  hidden: {},
  visible: {},
};

export function MaskedLine({
  i = 0,
  className = "",
  children,
}: {
  i?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`overflow-hidden pb-[0.16em] -mb-[0.16em] ${className}`}>
      <motion.div data-fallback-reveal variants={lineVariants} custom={i}>
        {children}
      </motion.div>
    </div>
  );
}

/** 文字块容器：自身滚入视口（或等待 gate）后驱动内部逐行升起 */
export function TextBlock({
  gate,
  id,
  className = "",
  children,
}: {
  gate?: boolean;
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-72px" });
  const reduced = useReducedMotion();
  const show = (gate === undefined ? true : gate) && inView;

  if (reduced) {
    return (
      <motion.div
        ref={ref}
        id={id}
        data-fallback-reveal
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.35 }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      id={id}
      data-fallback-reveal
      variants={blockVariants}
      initial="hidden"
      animate={show ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}
