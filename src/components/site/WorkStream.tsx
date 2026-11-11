"use client";

import React, { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion, useMotionValue, useSpring, useTransform, useVelocity, useScroll } from "framer-motion";
import { ArrowUpRight, ArrowRight, Eye, ArrowLeft } from "lucide-react";
import { ARCHIVE_PROJECTS, ProjectItem } from "@/data/archive";
import { UI, EN_PROJECTS, YUQI_TABS_EN, type Lang } from "@/data/i18n";
import { EASE_SILK, EASE_EXIT } from "@/components/site/motion";
import { jumpTo } from "@/components/site/SmoothScroll";
import { RollText, SplitRise } from "@/components/site/Kinetic";
import { isHeroDone } from "@/components/site/HeroTypewriter";
import { useLangFlight } from "@/components/site/LangSwap";

/* ============================================================================
 * 项目档案 (Project Archive) —— 索引 ⇄ 滚筒分栏双态
 * ----------------------------------------------------------------------------
 * 索引态：Hero + 单列分组索引，一屏读懂；
 * 点击后：索引整体淡出 → 被点的标题飞向左栏滚筒对焦位 → 详情自下而上入场。
 *   左栏 iOS 闹钟式对焦滚筒（离散滚轮一格一行 / 触控板原生惯性 / ↑↓），
 *   右栏详情按滚筒方向纵向交接；Esc 或「返回项目列表」回到索引原位。
 * 顶栏与页脚固定在页面两侧边缘，两态之间不发生任何位移。
 * ==========================================================================*/

const YUQI_TABS = [
  { id: "overview", label: "系统状态检测", image: "/yuqi/overview.png" },
  { id: "game", label: "游戏性能调校", image: "/yuqi/game-opt.png" },
  { id: "incident", label: "异常诊断与复原", image: "/yuqi/incident.png" },
] as const;

const MEDIA_PROJECTS = new Set(["yuqi-engine", "agent-project-map", "yuqi-team-orchestrator", "qilan-atlas"]);

const SPRING_PANEL = { type: "spring" as const, stiffness: 380, damping: 34, mass: 1 };
const SPRING_POP = { type: "spring" as const, stiffness: 500, damping: 26, mass: 0.7 };
const ROW_H = 64;
/* 离散滚轮（鼠标滚轮一格约 ≥100px）一步走一行；触控板连续小 delta 走原生惯性 */
const WHEEL_NOTCH = 40;
const WHEEL_LOCK_MS = 260;
/* 打开：索引 0.16s 退场 → 详情挂载 → 标题 0.56s 飞抵；首访索引在 Hero 第一行落定后（≈1.15s）才入场 */
const FLY_MS = 560;
const VIEW_EXIT = { duration: 0.16, ease: EASE_EXIT };
const INTRO_DELAY = 1.15;
const TOTAL = String(ARCHIVE_PROJECTS.length).padStart(2, "0");

const statusOf = (p: ProjectItem, T: (typeof UI)[Lang], full = false) =>
  p.status === "LIVE" ? T.live : p.status === "OPEN SOURCE" ? (full ? T.ossFull : T.oss) : (full ? T.stableFull : T.stable);

const DETAIL_VARIANTS = {
  enter: (d: number) => ({ opacity: 0, y: d * 44 }),
  center: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_SILK } },
  exit: (d: number) => ({ opacity: 0, y: d * -28, transition: { duration: 0.2, ease: EASE_EXIT } }),
};

function useIsLg() {
  return useSyncExternalStore(
    useCallback((notify: () => void) => {
      const mq = window.matchMedia("(min-width: 1024px)");
      mq.addEventListener("change", notify);
      return () => mq.removeEventListener("change", notify);
    }, []),
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => true
  );
}

/* ---------------------------------------------------------------------------
 * 右栏：项目详情
 * -------------------------------------------------------------------------*/
function DetailView({ project, lang, direction, reduced, onSelect, paneRef }: { project: ProjectItem; lang: Lang; direction: number; reduced: boolean; onSelect: (id: string) => void; paneRef: React.RefObject<HTMLDivElement | null> }) {
  const T = UI[lang];
  const pos = ARCHIVE_PROJECTS.findIndex((p) => p.id === project.id);
  const prev = ARCHIVE_PROJECTS[pos - 1];
  const next = ARCHIVE_PROJECTS[pos + 1];
  const titleOf = (p: ProjectItem) => (lang === "en" ? EN_PROJECTS[p.id]?.title : undefined) ?? p.title;
  const en = lang === "en" ? EN_PROJECTS[project.id] : undefined;
  /* 图片视差跟随右栏自己的滚动容器（分屏模型下 window 不再滚动） */
  const { scrollY } = useScroll({ container: paneRef });
  const [base] = useState(() => scrollY.get());
  const imgY = useTransform(scrollY, [base, base + 700], [0, reduced ? 0 : -36]);
  const [tab, setTab] = useState(0);
  /* 换语言推屏重挂载：详情整体成品态入场，滑动过程不重演 stagger */
  const flight = useLangFlight();
  const isYuqi = project.id === "yuqi-engine";
  const cur = YUQI_TABS[tab];
  const hasMedia = MEDIA_PROJECTS.has(project.id) && project.coverImage;
  const enter = (d: number) =>
    flight
      ? { initial: false, animate: { opacity: 1, y: 0 } }
      : reduced
        ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2 } }
        : { initial: { opacity: 0, y: 18 * direction }, animate: { opacity: 1, y: 0 }, transition: { ...SPRING_PANEL, delay: d } };

  const links = [
    project.links.demo && { href: project.links.demo, label: T.demo },
    project.links.github && { href: project.links.github, label: T.github },
    project.links.quark && { href: project.links.quark, label: T.quark },
  ].filter(Boolean) as { href: string; label: string }[];

  /* 相邻项目：纯文字项目也有落点，同时提示可以继续翻阅 */
  const adjNav = (
    <motion.nav {...enter(0.26)} className="mt-20 flex items-start justify-between gap-8">
      {prev ? (
        <button type="button" onClick={() => onSelect(prev.id)} className="group min-w-0 cursor-pointer text-left">
          <span className="flex items-center gap-1.5 font-mono text-xs text-neutral-500 dark:text-neutral-400">
            <ArrowLeft className="h-3 w-3 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:text-accent" />
            {T.prevProject} · {prev.index}
          </span>
          <span className="mt-2 block truncate text-lg font-semibold text-neutral-400 transition-colors duration-200 group-hover:text-neutral-950 dark:text-neutral-500 dark:group-hover:text-white">{titleOf(prev)}</span>
        </button>
      ) : <span />}
      {next && (
        <button type="button" onClick={() => onSelect(next.id)} className="group min-w-0 cursor-pointer text-right">
          <span className="flex items-center justify-end gap-1.5 font-mono text-xs text-neutral-500 dark:text-neutral-400">
            {T.nextProject} · {next.index}
            <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-accent" />
          </span>
          <span className="mt-2 block truncate text-lg font-semibold text-neutral-400 transition-colors duration-200 group-hover:text-neutral-950 dark:text-neutral-500 dark:group-hover:text-white">{titleOf(next)}</span>
        </button>
      )}
    </motion.nav>
  );

  return (
    <motion.article
      custom={direction}
      variants={reduced ? undefined : DETAIL_VARIANTS}
      initial={flight ? false : reduced ? { opacity: 0 } : "enter"}
      animate={reduced ? { opacity: 1 } : "center"}
      exit={reduced ? { opacity: 0, transition: { duration: 0.15 } } : "exit"}
      className="w-full max-w-[920px] pb-24"
    >
      {/* 头部区（序号/标题/简介/链接）垂直居中一屏：
          与左栏滚筒焦点行共享同一根中轴，每个项目首屏构图一致；
          大图与相邻导航接在中轴之后，不撑散头部对齐 */}
      <div className="flex flex-col justify-center lg:min-h-[calc(100svh-88px)]">
      <motion.div {...enter(0.04)} className="font-mono text-xs tracking-wide text-neutral-500 dark:text-neutral-400">
        <span className="text-accent">{project.index}</span>
        <span className="mx-2 text-neutral-300 dark:text-neutral-600">/</span>
        {en?.category ?? project.categoryLabel}
        <span className="mx-2 text-neutral-300 dark:text-neutral-600">/</span>
        {project.year}
        <span className="mx-2 text-neutral-300 dark:text-neutral-600">/</span>
        {statusOf(project, T, true)}
      </motion.div>

      <h2 className="mt-5 text-[clamp(34px,4.2vw,60px)] font-medium leading-[1.08] tracking-[-0.02em] text-neutral-950 dark:text-white [text-wrap:balance]">
        <SplitRise text={en?.title ?? project.title} direction={direction} delay={0.06} stagger={lang === "en" ? 0.012 : 0.032} duration={0.72} />
      </h2>

      <motion.p {...enter(0.1)} className="mt-6 max-w-[36em] text-[16px] sm:text-[17px] leading-[1.9] text-neutral-700 dark:text-neutral-300 [text-wrap:pretty]">
        {en?.description ?? project.description}
      </motion.p>

      <motion.div {...enter(0.15)} className="mt-8 flex flex-wrap items-baseline gap-x-7 gap-y-3">
        {links.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1 text-sm font-semibold text-neutral-950 dark:text-white">
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">{l.label}</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-accent transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        ))}
        {isYuqi && (
          <a href="/yuqi-web-demo/index.html" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-950 dark:text-white">
            <Eye className="h-3.5 w-3.5 text-accent" />
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">{T.simPreview}</span>
          </a>
        )}
        <span className="font-mono text-xs tracking-wide text-neutral-500 dark:text-neutral-400">{project.tags.join(" · ")}</span>
      </motion.div>

      {/* 无图项目的相邻导航并进居中头组（构图与有图项目一致、且导航不进屏外） */}
      {!isYuqi && !hasMedia && adjNav}
      </div>

      {(isYuqi || hasMedia) && (
        <motion.div {...enter(0.2)} className="mt-14">
          <motion.div style={{ y: imgY }}>
            {isYuqi ? (
              <div className="space-y-4">
                <div className="flex items-center gap-5 text-[13px]" role="tablist">
                  {YUQI_TABS.map((t, i) => (
                    <button
                      key={t.id}
                      type="button"
                      role="tab"
                      aria-selected={i === tab}
                      onClick={() => setTab(i)}
                      className={`cursor-pointer pb-1 transition-colors ${
                        i === tab ? "text-neutral-950 dark:text-white font-semibold" : "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                      }`}
                    >
                      {lang === "en" ? YUQI_TABS_EN[i] : t.label}
                      <span className={`mt-1 block h-[2px] origin-left bg-accent transition-transform duration-300 ${i === tab ? "scale-x-100" : "scale-x-0"}`} style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }} />
                    </button>
                  ))}
                </div>
                <motion.div
                  initial={reduced || flight ? false : { clipPath: "inset(100% 0% 0% 0%)" }}
                  animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                  transition={{ duration: 1, ease: EASE_SILK, delay: 0.18 }}
                  className="relative aspect-[16/9.8] overflow-hidden bg-neutral-100 dark:bg-[#0c0d11] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.22)] dark:shadow-[0_30px_80px_-24px_rgba(0,0,0,0.6)]"
                >
                  {/* tab 切换：新画面从右侧帘幕式扫入盖住旧画面，旧画面在扫完后才移除 */}
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={cur.id}
                      initial={reduced ? { opacity: 0 } : flight ? false : { clipPath: "inset(0% 0% 0% 100%)" }}
                      animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.01, delay: reduced ? 0 : 0.6 } }}
                      transition={{ duration: reduced ? 0.2 : 0.7, ease: EASE_SILK }}
                      className="absolute inset-0 z-[1] [&:not(:last-child)]:z-0"
                    >
                      <Image src={cur.image} alt={cur.label} fill sizes="(max-width: 1024px) calc(100vw - 40px), 920px" className="object-cover object-top" />
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </div>
            ) : (
              <motion.div
                initial={reduced || flight ? false : { clipPath: "inset(100% 0% 0% 0%)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                transition={{ duration: 1, ease: EASE_SILK, delay: 0.18 }}
                className="relative overflow-hidden bg-neutral-100 dark:bg-[#0c0d11] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.22)] dark:shadow-[0_30px_80px_-24px_rgba(0,0,0,0.6)] aspect-[16/10]"
              >
                <motion.div initial={reduced || flight ? false : { scale: 1.14, y: "6%" }} animate={{ scale: 1, y: "0%" }} transition={{ duration: 1.3, ease: EASE_SILK, delay: 0.18 }} className="absolute inset-0">
                  <Image src={project.coverImage!} alt={project.title} fill sizes="(max-width: 1024px) calc(100vw - 40px), 920px" className="object-cover object-top" />
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* 有图项目：相邻导航跟在大图之后 */}
      {(isYuqi || hasMedia) && adjNav}
    </motion.article>
  );
}

/* ---------------------------------------------------------------------------
 * 详情舞台：左栏滚筒 + 右栏详情（挂载即生效，effect 不依赖外部开关）
 * -------------------------------------------------------------------------*/
function DetailStage({
  project, lang, direction, reduced, flyId, onSelect, onClose,
}: {
  project: ProjectItem; lang: Lang; direction: number; reduced: boolean; flyId: string | null;
  onSelect: (id: string) => void; onClose: () => void;
}) {
  const T = UI[lang];
  const isLg = useIsLg();
  const visible = isLg ? 7 : 3;
  const pad = (ROW_H * (visible - 1)) / 2;
  const wheelRef = useRef<HTMLDivElement>(null);
  const settleRef = useRef<number | undefined>(undefined);
  /* 程序化滚动期间挂起停格提交，避免把选中项拉回旧行 */
  const progRef = useRef(false);
  const wheelLockRef = useRef(0);
  const firstRef = useRef(true);
  /* 右栏独立滚动容器：换项目时归零（容器不随项目重挂载，需手动复位） */
  const paneRef = useRef<HTMLDivElement>(null);
  const paneProjectRef = useRef(project.id);
  useEffect(() => {
    if (paneProjectRef.current === project.id) return;
    paneProjectRef.current = project.id;
    paneRef.current?.scrollTo({ top: 0 });
  }, [project.id]);
  /* 换语言推屏重挂载：左栏与计数器直接成品态 */
  const flight = useLangFlight();
  const idx = ARCHIVE_PROJECTS.findIndex((p) => p.id === project.id);
  /* 停格回调在闭包里取最新选中行：滚动中对比用 */
  const idxRef = useRef(idx);
  useEffect(() => { idxRef.current = idx; }, [idx]);

  /* 滚筒纵深：同字号，用缩放与明度表达距离；不对文字做 blur */
  const paintWheel = useCallback(() => {
    const el = wheelRef.current;
    if (!el) return;
    const mid = el.scrollTop + el.clientHeight / 2;
    el.querySelectorAll<HTMLElement>("[data-row]").forEach((row) => {
      const a = Math.abs((row.offsetTop + ROW_H / 2 - mid) / ROW_H);
      row.style.setProperty("--s", Math.max(0.66, 1 - a * 0.19).toFixed(3));
      row.style.setProperty("--o", Math.max(0.1, Math.pow(0.42, a)).toFixed(3));
    });
  }, []);

  const onScroll = useCallback(() => {
    paintWheel();
    window.clearTimeout(settleRef.current);
    settleRef.current = window.setTimeout(() => {
      const el = wheelRef.current;
      if (!el) return;
      if (progRef.current) {
        if (Math.abs(el.scrollTop - Math.round(el.scrollTop / ROW_H) * ROW_H) < 2) progRef.current = false;
        return;
      }
      const nextIdx = Math.round(el.scrollTop / ROW_H);
      const p = ARCHIVE_PROJECTS[nextIdx];
      /* 移动端触觉确认：拨到位换项时轻震一下（仅真实拨动，程序化滚动不触发） */
      if (p && nextIdx !== idxRef.current && !reduced) navigator.vibrate?.(8);
      if (p) onSelect(p.id);
    }, 120);
  }, [paintWheel, onSelect, reduced]);

  useEffect(() => () => window.clearTimeout(settleRef.current), []);

  /* 选中项滚到中心：首次挂载瞬移，之后平滑 */
  useEffect(() => {
    const el = wheelRef.current;
    if (!el || idx < 0) return;
    const target = idx * ROW_H;
    if (firstRef.current) {
      firstRef.current = false;
      el.scrollTop = target;
      el.focus({ preventScroll: true });
    } else if (Math.abs(el.scrollTop - target) > ROW_H / 2) {
      progRef.current = true;
      el.scrollTo({ top: target, behavior: reduced ? "auto" : "smooth" });
    }
    requestAnimationFrame(paintWheel);
  }, [idx, reduced, paintWheel, visible]);

  /* 离散鼠标滚轮：一格走一行；触控板连续 delta 交给原生惯性 */
  useEffect(() => {
    const el = wheelRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < WHEEL_NOTCH) return;
      e.preventDefault();
      const now = performance.now();
      if (now - wheelLockRef.current < WHEEL_LOCK_MS) return;
      wheelLockRef.current = now;
      const next = idx + (e.deltaY > 0 ? 1 : -1);
      if (next >= 0 && next < ARCHIVE_PROJECTS.length) onSelect(ARCHIVE_PROJECTS[next].id);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [idx, onSelect]);

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
    const next = ARCHIVE_PROJECTS[idx + step];
    if (step && next) { e.preventDefault(); onSelect(next.id); }
  };

  const counter = (
    <div className="flex items-baseline gap-2 font-mono tabular-nums">
      <span className="relative inline-flex h-[1.1em] overflow-hidden text-[28px] leading-[1.1] text-accent lg:text-[34px]">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.span
            key={project.index}
            custom={direction}
            initial={flight ? false : reduced ? { opacity: 0 } : { y: `${direction * 100}%` }}
            animate={{ y: "0%", opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { y: `${direction * -100}%`, transition: { duration: 0.2, ease: EASE_EXIT } }}
            transition={{ duration: 0.45, ease: EASE_SILK }}
            className="inline-block"
          >
            {project.index}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="text-sm text-neutral-500 dark:text-neutral-400">/ {TOTAL}</span>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-6 lg:grid lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)] lg:gap-x-[clamp(56px,8vw,140px)]">
      {/* 左栏：滚筒（桌面 sticky 占满视口剩余高度，滚筒垂直居中） */}
      <motion.aside
        initial={flight ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: EASE_SILK }}
        className="lg:sticky lg:top-[88px] lg:flex lg:h-[calc(100svh-88px)] lg:flex-col lg:pb-8"
      >
        <div className="flex items-center justify-between pt-2 lg:pt-6">
          <button
            type="button"
            onClick={onClose}
            className="group flex cursor-pointer items-center gap-1.5 text-[13px] text-neutral-500 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            {T.backToArchive}
          </button>
          <div className="lg:hidden">{counter}</div>
        </div>

        <div className="mt-4 lg:mt-0 lg:flex lg:flex-1 lg:items-center">
          <div
            ref={wheelRef}
            role="listbox"
            aria-label={T.projectNavigation}
            aria-activedescendant={`wheel-${project.id}`}
            tabIndex={0}
            data-lenis-prevent
            onScroll={onScroll}
            onKeyDown={onKey}
            className="relative w-full snap-y snap-mandatory overflow-y-auto overscroll-contain outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{
              height: ROW_H * visible,
              maskImage: "linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent)",
            }}
          >
            <div style={{ height: pad }} aria-hidden />
            {ARCHIVE_PROJECTS.map((p) => {
              const isSel = p.id === project.id;
              const en = lang === "en" ? EN_PROJECTS[p.id] : undefined;
              return (
                <button
                  key={p.id}
                  id={`wheel-${p.id}`}
                  type="button"
                  role="option"
                  aria-selected={isSel}
                  tabIndex={-1}
                  data-row
                  onClick={() => onSelect(p.id)}
                  className="flex w-full cursor-pointer select-none snap-center items-center text-left"
                  style={{ height: ROW_H }}
                >
                  <span
                    data-wheel-title={p.id}
                    className="block origin-left text-[20px] font-semibold leading-[1.12] tracking-[-0.01em] text-neutral-950 transition-[transform,opacity] duration-150 ease-out line-clamp-2 lg:text-[clamp(20px,1.7vw,24px)] dark:text-white"
                    style={{ transform: "scale(var(--s, 1))", opacity: flyId === p.id ? 0 : "var(--o, 1)" }}
                  >
                    {en?.title ?? p.title}
                  </span>
                </button>
              );
            })}
            <div style={{ height: pad }} aria-hidden />
          </div>
        </div>

        <div className="hidden lg:flex lg:items-end lg:justify-between">
          {counter}
          <span className="pb-1 font-mono text-xs text-neutral-500 dark:text-neutral-400">{T.wheelHint}</span>
        </div>
      </motion.aside>

      {/* 右栏：独立滚动页——桌面端锁在视口高度内自滚，滚轮不串联到文档，
          左栏滚筒钉住不动，两栏各自是"一页"。换项目时归零见上方 effect */}
      <div
        id="work-detail"
        role="region"
        aria-live="polite"
        aria-label={project.title}
        ref={paneRef}
        data-lenis-prevent
        className="min-w-0 pt-10 lg:h-[calc(100svh-88px)] lg:overflow-y-auto lg:overscroll-contain lg:pt-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <AnimatePresence mode="wait" custom={direction}>
          <DetailView key={project.id} project={project} lang={lang} direction={direction} reduced={reduced} onSelect={onSelect} paneRef={paneRef} />
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * 档案：索引态 ⇄ 详情态
 * -------------------------------------------------------------------------*/
export function WorkStream({
  openId, onOpen, lang = "zh", hero,
}: { openId: string | null; onOpen: (id: string | null) => void; lang?: Lang; hero?: React.ReactNode }) {
  const T = UI[lang];
  const prefersReducedMotion = useReducedMotion();
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const reduced = !!(mounted && prefersReducedMotion);
  const openProject = ARCHIVE_PROJECTS.find((p) => p.id === openId);
  const open = !!openProject;

  const [hovered, setHovered] = useState<string | null>(null);
  const [direction, setDirection] = useState(1);
  const [intro, setIntro] = useState(() => (isHeroDone() ? 0 : INTRO_DELAY));
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 160, damping: 20, mass: 0.5 });
  const sy = useSpring(py, { stiffness: 160, damping: 20, mass: 0.5 });
  const tilt = useSpring(useTransform(useVelocity(sx), [-1400, 1400], [-9, 9]), { stiffness: 220, damping: 26 });
  const hoveredProject = open ? undefined : ARCHIVE_PROJECTS.find((p) => p.id === hovered);
  /* 换语言推屏重挂载：索引整页成品态，不重演逐行入场 */
  const flight = useLangFlight();

  /* 视图切换：记住索引滚动位置，返回时回到原处 */
  const savedY = useRef(0);
  const openRef = useRef(open);
  useEffect(() => { openRef.current = open; }, [open]);
  /* onExitComplete 时新视图尚未挂载、文档高度不足会夹断滚动值，等两帧再跳 */
  const onViewSwap = useCallback(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => jumpTo(openRef.current ? 0 : savedY.current)));
  }, []);

  /* 标题 FLIP：点击时记录索引行标题位置，克隆体在滚筒挂载后逐帧追赶对焦行 */
  const [fly, setFly] = useState<{ id: string; text: string; from: DOMRect; size: number } | null>(null);
  const fx = useMotionValue(0);
  const fy = useMotionValue(0);
  const fs = useMotionValue(1);

  useEffect(() => {
    if (!fly) return;
    let start = 0;
    let raf = 0;
    const tick = (now: number) => {
      const target = document.querySelector<HTMLElement>(`[data-wheel-title="${fly.id}"]`);
      if (target) {
        if (!start) start = now;
        const t = Math.min(1, (now - start) / FLY_MS);
        const e = 1 - Math.pow(1 - t, 4);
        const r = target.getBoundingClientRect();
        fx.set(fly.from.left + (r.left - fly.from.left) * e);
        fy.set(fly.from.top + (r.top - fly.from.top) * e);
        fs.set(1 + (parseFloat(getComputedStyle(target).fontSize) / fly.size - 1) * e);
        if (t >= 1) { setFly(null); return; }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const guard = window.setTimeout(() => setFly(null), 2200);
    return () => { cancelAnimationFrame(raf); window.clearTimeout(guard); };
  }, [fly, fx, fy, fs]);

  const selectProject = useCallback((id: string) => {
    const next = ARCHIVE_PROJECTS.findIndex((p) => p.id === id);
    const active = ARCHIVE_PROJECTS.findIndex((p) => p.id === openId);
    if (next < 0 || next === active) return;
    setDirection(active < 0 || next > active ? 1 : -1);
    onOpen(id);
  }, [openId, onOpen]);

  const close = useCallback(() => { setFly(null); setIntro(0); onOpen(null); }, [onOpen]);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, close]);

  const openFromIndex = (project: ProjectItem, title: string, el: HTMLElement) => {
    savedY.current = window.scrollY;
    if (!reduced) {
      const t = el.querySelector<HTMLElement>("[data-title]");
      if (t) {
        const r = t.getBoundingClientRect();
        fx.set(r.left); fy.set(r.top); fs.set(1);
        setFly({ id: project.id, text: title, from: r, size: parseFloat(getComputedStyle(t).fontSize) || 16 });
      }
    }
    setHovered(null);
    setDirection(1);
    onOpen(project.id);
  };

  return (
    <>
      {/* 注意：这里和详情内层都不能加 initial={false}——它会关掉所有子孙的首次入场动画 */}
      <AnimatePresence mode="wait" onExitComplete={onViewSwap}>
        {open && openProject ? (
          <motion.div key="detail" exit={{ opacity: 0, transition: VIEW_EXIT }}>
            <DetailStage
              project={openProject}
              lang={lang}
              direction={direction}
              reduced={reduced}
              flyId={fly?.id ?? null}
              onSelect={selectProject}
              onClose={close}
            />
          </motion.div>
        ) : (
          <motion.div
            key="index"
            initial={flight ? false : { opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.35, ease: EASE_SILK } }}
            exit={reduced ? { opacity: 0, transition: { duration: 0.15 } } : { opacity: 0, y: -10, transition: VIEW_EXIT }}
          >
            {hero}
            {/* ---------- 索引：分组标签 + 清单，右侧对齐状态 ---------- */}
            <div
              onMouseMove={(e) => { px.set(e.clientX); py.set(e.clientY); }}
              onMouseLeave={() => setHovered(null)}
              className="mx-auto w-full max-w-[660px] space-y-7 px-5 pt-4 pb-10 sm:px-6 sm:pb-14"
            >
              <motion.p
                initial={flight ? false : reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE_SILK, delay: intro + 0.05 }}
                className="text-[13px] leading-[1.85] text-neutral-600 dark:text-neutral-300"
              >
                {T.archiveNote}
              </motion.p>
              {/* 全部项目平铺一张清单：不分组、不编号——用户要求首页信息减负 */}
              <section>
                <div>
                    {ARCHIVE_PROJECTS.map((project, i) => {
                      const en = lang === "en" ? EN_PROJECTS[project.id] : undefined;
                      const title = en?.title ?? project.title;
                      const isHover = hovered === project.id;
                      return (
                        <motion.button
                          key={project.id}
                          type="button"
                          initial={flight ? false : reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, ease: EASE_SILK, delay: intro + 0.12 + i * 0.04 }}
                          whileTap={reduced ? undefined : { scale: 0.985 }}
                          onClick={(e) => openFromIndex(project, title, e.currentTarget)}
                          onMouseEnter={(e) => { px.set(e.clientX); py.set(e.clientY); setHovered(project.id); }}
                          aria-expanded={false}
                          aria-controls="work-detail"
                          className={`group relative flex w-full cursor-pointer select-none items-baseline gap-3 py-3 text-left transition-opacity duration-200 ${
                            hovered && !isHover ? "opacity-40" : ""
                          }`}
                        >
                          {/* 发丝分隔：入场时自左向右画出 */}
                          {i > 0 && (
                            <motion.span
                              aria-hidden
                              initial={reduced || flight ? false : { scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ duration: 0.9, ease: EASE_SILK, delay: intro + 0.2 + i * 0.04 }}
                              className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left bg-neutral-200/80 dark:bg-white/[0.08]"
                            />
                          )}
                          <span className="min-w-0">
                            <span
                              data-title
                              className="block text-base font-semibold leading-snug text-neutral-950 dark:text-white"
                            >
                              <RollText text={title} active={isHover && !reduced} />
                            </span>
                            <span className="mt-0.5 block truncate text-[13px] font-normal text-neutral-600 dark:text-neutral-300">
                              {en?.tagline ?? project.tagline}
                            </span>
                          </span>
                          <span className="ml-auto flex shrink-0 items-baseline gap-3 pl-4 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                            <span className="hidden sm:inline">{statusOf(project, T)}</span>
                            <ArrowRight aria-hidden className="h-3.5 w-3.5 self-center text-neutral-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent dark:text-neutral-600" />
                          </span>
                        </motion.button>
                      );
                    })}
                </div>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 光标跟随图片预览（仅桌面 + 索引态）：弹簧迟滞 + 速度倾斜 */}
      {!open && (
        <motion.div style={{ x: sx, y: sy, rotate: reduced ? 0 : tilt }} className="pointer-events-none fixed left-0 top-0 z-50 hidden lg:block">
          <div className="-translate-x-1/2 -translate-y-[115%]">
            <AnimatePresence>
              {hoveredProject?.coverImage && (
                <motion.div
                  key="plate"
                  initial={{ opacity: 0, scale: 0.85, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10, transition: { duration: 0.15, ease: EASE_EXIT } }}
                  transition={SPRING_POP}
                  className="relative aspect-[16/10] w-[300px] overflow-hidden bg-neutral-100 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] dark:bg-[#0c0d11]"
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={hoveredProject.id}
                      initial={{ y: "45%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "-45%" }}
                      transition={{ duration: 0.32, ease: EASE_SILK }}
                      className="absolute inset-0"
                    >
                      <Image src={hoveredProject.coverImage} alt="" fill sizes="300px" className="object-cover object-top" />
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* 标题 FLIP 克隆体：从索引行飞向滚筒对焦位 */}
      {fly && (
        <motion.div
          aria-hidden
          style={{ x: fx, y: fy, scale: fs, transformOrigin: "left top" }}
          className="pointer-events-none fixed left-0 top-0 z-[70] whitespace-nowrap text-base font-semibold leading-[1.12] tracking-[-0.01em] text-neutral-950 dark:text-white"
        >
          {fly.text}
        </motion.div>
      )}
    </>
  );
}
