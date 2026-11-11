"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SplitRise } from "@/components/site/Kinetic";
import { ContactMenu } from "@/components/site/ContactMenu";
import { LangSwap, useLangFlight } from "@/components/site/LangSwap";
import { useLang } from "@/components/site/lang";
import { PROFILE } from "@/data/profile";
import { EASE_SILK } from "@/components/site/motion";

/* ============================================================================
 * 关于页 (AboutView) —— 居中单栏，只讲一件事：我是谁、做过什么、想做什么。
 * ----------------------------------------------------------------------------
 * 双轴居中：660px 阅读栏水平居中，min-h + flex 让内容块在页头与页脚之间
 * 垂直居中（内容超屏时自然回退为顶部流式排版）。
 * 语言切换走 LangSwap 顺序替换：旧版沉降淡出 → 新版错峰重排，无重影。
 * ==========================================================================*/

export function AboutView() {
  const [lang] = useLang();

  return (
    /* main 必须满宽：LangSwap 滑动层继承父级宽度，窄容器会让新旧两列并排可见（重影）；
       阅读栏宽下放到内容层，视觉仍是居中 660px */
    <main className="relative mx-auto flex min-h-[calc(100svh-170px)] w-full flex-col justify-center">
      <LangSwap>
        <AboutContent lang={lang} />
      </LangSwap>
    </main>
  );
}

/* 内容在 LangSwap 子树内渲染——换语言推屏重挂载时读 flight，直接成品态 */
function AboutContent({ lang }: { lang: "zh" | "en" }) {
  const flight = useLangFlight();
  const P = PROFILE[lang];
  const ent = (delay: number) =>
    flight
      ? { initial: false as const, animate: { opacity: 1, y: 0 } }
      : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.55, ease: EASE_SILK, delay } };

  return (
        <div className="mx-auto w-full max-w-[660px] px-5 py-10 sm:px-6">
          <div className="font-mono text-xs tracking-[0.18em] uppercase text-neutral-500 dark:text-neutral-400">
            {P.kicker}
          </div>

          {/* 主张：逐字升起 */}
          <h1 className="mt-7 text-[clamp(28px,4.6vw,52px)] font-medium leading-[1.22] tracking-[-0.02em] text-neutral-950 dark:text-white">
            <SplitRise text={P.statement} stagger={0.016} duration={0.7} />
          </h1>

          {/* 事实横条 */}
          <motion.div
            {...ent(0.5)}
            className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-xs text-neutral-500 dark:text-neutral-400"
          >
            {P.facts.map((f, i) => (
              <React.Fragment key={f}>
                {i > 0 && <span className="text-neutral-300 dark:text-neutral-600">·</span>}
                <span className={i === P.facts.length - 1 ? "text-accent" : undefined}>{f}</span>
              </React.Fragment>
            ))}
          </motion.div>

          {/* 自我介绍：一段话讲做过什么事 */}
          <motion.div
            initial={flight ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={flight ? { duration: 0 } : { duration: 0.6, ease: EASE_SILK, delay: 0.62 }}
            className="mt-14 space-y-6 text-[15.5px] leading-[1.95] text-neutral-700 dark:text-neutral-300"
          >
            {P.bio.map((para, i) => <p key={i}>{para}</p>)}
          </motion.div>

          {/* 邀请语即联系入口：整句可点，向上展开浮层 */}
          <motion.div
            {...ent(0.78)}
            className="mt-14"
          >
            <ContactMenu
              lang={lang}
              placement="up"
              triggerClassName="group block cursor-pointer text-left"
              trigger={(isOpen) => (
                <span className="block text-[15.5px] font-semibold leading-[1.9] text-neutral-950 dark:text-white">
                  {P.cta}
                  <span aria-hidden className={`ml-2 inline-flex text-accent transition-transform duration-300 ${isOpen ? "-translate-y-0.5" : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"}`} style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}>
                    <ArrowUpRight className="h-[0.95em] w-[0.95em] translate-y-[0.18em]" strokeWidth={2.2} />
                  </span>
                </span>
              )}
            />
          </motion.div>
        </div>
  );
}
