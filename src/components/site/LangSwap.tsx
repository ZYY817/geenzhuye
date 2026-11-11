"use client";

import React, { useRef, useEffect, useLayoutEffect, useState, useContext, createContext } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLang } from "@/components/site/lang";

/* ============================================================================
 * LangSwap —— 语言切换「视差盖页」(parallax cover push)
 * ----------------------------------------------------------------------------
 * 交互模型 = iOS 导航推屏而非主屏等速拖页：新页全速从屏缘推入**盖过**旧页，
 * 旧页只退 30% 屏宽并渐暗——让位感 + 纵深，比两层锁步更有冲击力。
 * 每个语种锚定自己的一侧：英文=右页（从右进）、中文=左页（从左进）；
 * initial/exit 同号（退出层属性按其自身 lang 冻结），来回切换方向始终一致。
 * 新页前缘带一条软阴影掠过旧页，是"盖上去"的关键深度线索。
 *
 * 流畅度：切换瞬间通过 LangFlightContext 告知新页子树"这是换语言重挂载"，
 * 内部入场动画（hero/列表/详情 stagger/里程表）全部直接渲染成品态——
 * 滑动窗口内只剩两层 transform/opacity 合成，零内部动画抢帧。
 * 高度钉：popLayout 提交帧旧版即刻绝对定位、容器只剩新版高度，若新版更矮
 * 页面中段滚动会被钳动；取新旧最大高钉住，入场后释放。
 * reduced-motion 降级为短淡入淡出。
 * ==========================================================================*/

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
const SLIDE_MS = 550;
/* iOS 分页曲线：起步果断、长距离平滑减速、干净落定 */
const EASE_PAGE: [number, number, number, number] = [0.32, 0.72, 0, 1];
/* 旧页退位深度：屏宽占比 + 压暗目标 */
const RETREAT_VW = 30;
const RETREAT_OPACITY = 0.5;

/* 换语言重挂载标记：为 true 时内部组件跳过入场动画、直接渲染成品态 */
const LangFlightContext = createContext(false);
export const useLangFlight = () => useContext(LangFlightContext);

/** animate=false：语言是加载时从存储 / 地址恢复的，不是用户点的——直接换，不推屏 */
export function LangSwap({ children, animate = true }: { children: React.ReactNode; animate?: boolean }) {
  const [lang] = useLang();
  const reducedPref = useReducedMotion();
  const instant = !animate;
  const reduced = reducedPref || instant;
  const wrapRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<number[]>([]);
  const [flight, setFlight] = useState(false);

  /* 「渲染期调整 state」官方模式：语言刚变的渲染帧置 flight，同步重渲染后
     提交的子树读到的就是 true —— 新页内部组件直接渲染成品态。
     （不能读 ref 判断"刚切换"：react-hooks/refs 禁止渲染期访问 ref） */
  const [seenLang, setSeenLang] = useState(lang);
  if (seenLang !== lang) {
    setSeenLang(lang);
    setFlight(true);
  }

  /* 每个语种锚定一侧：英文在右（+）、中文在左（-）。initial=exit 同号。 */
  const dir = lang === "en" ? 1 : -1;

  useIsomorphicLayoutEffect(() => {
    if (!flight) return;
    const el = wrapRef.current;
    if (el && !el.style.minHeight) {
      /* 此刻旧版已是 absolute、新版在流内：取两者最大高钉住，防中段塌陷 */
      let max = 0;
      el.querySelectorAll<HTMLElement>(":scope > div").forEach((c) => {
        max = Math.max(max, c.offsetHeight);
      });
      if (max) el.style.minHeight = `${max}px`;
    }
    timersRef.current.forEach(window.clearTimeout);
    timersRef.current = [
      /* 推屏完成后解钉高度 */
      window.setTimeout(() => { if (el) el.style.minHeight = ""; }, SLIDE_MS + 120),
      /* flight 只需覆盖"切换挂载 + 推屏收尾"窗口；迟挂载的组件（tab 图/悬停预览）
         要保留各自入场，故窗口不宜过长 */
      window.setTimeout(() => setFlight(false), SLIDE_MS + 220),
    ];
  }, [lang, flight]);

  useEffect(() => () => timersRef.current.forEach(window.clearTimeout), []);

  return (
    <div ref={wrapRef} className="overflow-x-clip">
      <LangFlightContext.Provider value={flight}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={lang}
            initial={instant ? false : reduced ? { opacity: 0 } : { x: `${dir * 100}vw` }}
            animate={
              reduced
                ? { opacity: 1, transition: { duration: instant ? 0 : 0.15 } }
                : { x: 0, transition: { duration: SLIDE_MS / 1000, ease: EASE_PAGE } }
            }
            exit={
              reduced
                ? { opacity: 0, transition: { duration: instant ? 0 : 0.15 } }
                : {
                    x: `${dir * RETREAT_VW}vw`,
                    /* 压暗到 0.5 后尾段收到 0：否则旧页比新页高时，
                       新页底缘之下会露出一条残边 */
                    opacity: [1, RETREAT_OPACITY, 0],
                    transition: {
                      duration: SLIDE_MS / 1000,
                      ease: EASE_PAGE,
                      opacity: { duration: SLIDE_MS / 1000, times: [0, 0.72, 1] },
                    },
                  }
            }
            /* 必须不透明底色：否则滑动中下层旧页从新页文字缝隙透出 = 整页重影；
               必须视口满宽：窄容器里的滑动层会让新旧两列并排可见（同样是重影） */
            className="relative w-screen max-w-none bg-[var(--bg,#fff)] will-change-transform mx-[calc(50%-50vw)]"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </LangFlightContext.Provider>
    </div>
  );
}
