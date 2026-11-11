"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- /?p= 是页内视图切换：普通点击被拦截，不发生整页导航 */

/* ============================================================================
 * 项目详情（SPEC_V3_MINIMAL §10）
 * ----------------------------------------------------------------------------
 * 同一张纸：左栏是首页同序的项目目录，右栏是"一句话 → 截图 → 问题 / 做法 /
 * 结果 → 外链 → 上一个 / 下一个"。切换按方向纵向进出，标题逐字升起。
 *
 * 入场编排（2026-11-02，"像一份档案被逐层摊开"）：
 *   标题飞入 → 一句话由模糊变清晰 → 元信息逐项点亮 → 截图帘幕揭开并推近
 *   → 小标题先画出短线、正文再浮现（滚动到才播）→ 链接依次出现 → 分隔线从中间画开
 *   左栏目录逐项淡入，当前项的短线在项目之间滑动。减弱动态时一律简单淡入。
 * ==========================================================================*/

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { jumpTo, pauseScroll, resumeScroll } from "@/components/site/SmoothScroll";
import { motion, AnimatePresence } from "framer-motion";
import { SplitRise } from "@/components/site/Kinetic";
import { useLangFlight } from "@/components/site/LangSwap";
import { COLS, ITEMS, linksOf, yearOf, textOf, stampText, colLabel, type Item, type Lang } from "./projects";
import { Controls } from "./Controls";
import { storyOf, type Story } from "./stories";

const SILK = [0.16, 1, 0.3, 1] as const;

/** 正文里用 **…** 标出的重点数值：加深加粗 */
const rich = (text: string) =>
  text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <strong key={i} className="v3-key">{part}</strong> : part));
const pad2 = (n: number) => String(n).padStart(2, "0");

/** 可交互演示：页内只放静帧；点击后缩略图放大成接近全屏的舞台，真实网页在里面运行（原生尺寸、按窗口等比缩放）。
 *  Esc / 关闭按钮 / 点背景 关闭，收回原位；打开期间暂停页面惯性滚动 */
function DemoFrame({ demo, label, hint, full, close }: { demo: { src: string; poster: string; w: number; h: number }; label: string; hint: string; full: string; close: string }) {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [fit, setFit] = useState(1);
  useEffect(() => {
    if (!open) return;
    const measure = () => setFit(Math.min(1, (window.innerWidth * 0.92) / demo.w, (window.innerHeight * 0.84) / demo.h));
    measure();
    window.addEventListener("resize", measure);
    // Esc 只关演示，不触发详情页的"返回首页"
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { e.stopImmediatePropagation(); e.preventDefault(); setOpen(false); } };
    window.addEventListener("keydown", onKey, true);
    pauseScroll();
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("keydown", onKey, true);
      resumeScroll();
      document.documentElement.style.overflow = "";
    };
  }, [open, demo.w, demo.h]);
  const shell = "overflow-hidden rounded-[10px] bg-[var(--plate)] shadow-[0_1px_2px_rgba(0,0,0,0.05),0_18px_40px_-22px_rgba(40,30,20,0.35)]";
  // 页内只是一条紧凑的入口：小缩略图 + 一句说明 + 打开按钮；点开后从缩略图放大成大舞台
  return (
    <div>
      <div className="flex items-center gap-4 rounded-[8px] border border-[var(--line2)] p-2.5 pr-4">
        <div className="relative h-[54px] w-[86px] shrink-0">
          {!open && (
            <motion.button
              layoutId="demo-stage"
              type="button"
              onClick={() => { setReady(false); setOpen(true); }}
              aria-label={hint}
              className={`group absolute inset-0 cursor-pointer !rounded-[5px] ${shell}`}
              transition={{ type: "spring", stiffness: 260, damping: 32 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={demo.poster} alt="" className="h-full w-full object-cover" />
            </motion.button>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[14.5px] font-semibold text-[var(--ink)]">{label}</div>
          <a className="v3-link v3-draw text-[12.5px] text-[var(--ink3)]" href={demo.src} target="_blank" rel="noopener noreferrer">{full}</a>
        </div>
        <button
          type="button"
          onClick={() => { setReady(false); setOpen(true); }}
          className="shrink-0 cursor-pointer rounded-full bg-[var(--ink)] px-4 py-2 text-[13px] text-[var(--bg)] transition-opacity duration-200 hover:opacity-85"
        >
          {hint}
        </button>
      </div>

      {typeof document !== "undefined" && createPortal(
      <AnimatePresence>
        {open && (
          <motion.div
            key="demo-overlay"
            className="v3 fixed inset-0 z-[90] flex items-center justify-center"
            style={{ background: "transparent", minHeight: 0 }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            role="dialog"
            aria-modal="true"
            aria-label={label}
          >
            <motion.div
              className="absolute inset-0 bg-[rgba(18,18,17,0.62)] backdrop-blur-[3px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.35 } }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
              onClick={() => setOpen(false)}
            />
            <div className="relative" style={{ width: demo.w * fit, height: demo.h * fit }}>
              <motion.div layoutId="demo-stage" className={`absolute inset-0 ${shell}`} transition={{ type: "spring", stiffness: 260, damping: 32 }} data-lenis-prevent>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={demo.poster} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ opacity: ready ? 0 : 1, transition: "opacity 300ms" }} />
                <iframe
                  src={demo.src}
                  title={label}
                  onLoad={(e) => {
                    setReady(true);
                    // 焦点在演示里时，按键发给的是演示页面：同源，直接在里面也监听 Esc
                    try {
                      e.currentTarget.contentWindow?.addEventListener("keydown", (ev: KeyboardEvent) => { if (ev.key === "Escape") setOpen(false); });
                    } catch {}
                  }}
                  className="absolute left-0 top-0 origin-top-left border-0"
                  style={{ width: demo.w, height: demo.h, transform: `scale(${fit})`, opacity: ready ? 1 : 0, transition: "opacity 300ms" }}
                />
              </motion.div>
              <motion.button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute -top-11 right-0 cursor-pointer rounded-full bg-[rgba(251,250,248,0.92)] px-4 py-1.5 text-[13px] text-[#141414]"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.25 } }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
              >
                {close} · Esc
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body)}
    </div>
  );
}

const L = {
  zh: {
    back: "返回首页", colon: "：", labels: ["背景", "定位", "核心能力", "构建", "成果"], prev: "上一个", next: "下一个",
    pager: "上一个 / 下一个项目", all: "全部项目", shot: "界面截图", film: "宣传片", demo: "网页版界面演示 · 可直接操作", tryIt: "打开体验", full: "新标签页打开", close: "关闭",
    live: (n: number, total: number, name: string) => `第 ${n} / ${total} 个项目：${name}`,
  },
  en: {
    back: "Back home", colon: ": ", labels: ["Context", "Positioning", "Capabilities", "Build", "Outcome"], prev: "Previous", next: "Next",
    pager: "Previous / next project", all: "All projects", shot: "screenshot", film: "promo video", demo: "Live interface demo · fully interactive", tryIt: "Try it", full: "Open in new tab", close: "Close",
    live: (n: number, total: number, name: string) => `Project ${n} of ${total}: ${name}`,
  },
} as const;

/** 普通左键点击才在页内切换；带修饰键 / 中键交给浏览器（新标签打开 ?p=） */
export const plainClick = (e: React.MouseEvent) => !(e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey);

function Body({ item, lang, direction, reduced, fresh, hideTitle, hold, onSelect }: {
  item: Item; lang: Lang; direction: number; reduced: boolean; fresh: boolean; hideTitle: boolean; hold: boolean; onSelect: (id: string) => void;
}) {
  // 换语言推屏重挂载：成品态直接出现，不播入场、不抢焦点（SPEC §11.3）
  const flight = useLangFlight();
  const t = L[lang];
  const tx = textOf(item, lang);
  // 换到这一项后把焦点放到标题上：键盘用户不会掉回页首，读屏会读出新标题
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!hideTitle && !flight) titleRef.current?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 只在换项 / 落地时聚焦
  }, [hideTitle]);
  const i = ITEMS.findIndex((x) => x.id === item.id);
  const prev = ITEMS[(i - 1 + ITEMS.length) % ITEMS.length];
  const next = ITEMS[(i + 1) % ITEMS.length];
  const links = linksOf(item.id, lang);
  const st = storyOf(item.id, lang);

  /* 标题滚出屏幕后，顶部出现一条细的标题栏：项目名 + 入口，始终知道在看哪个项目 */
  const [bar, setBar] = useState(false);
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setBar(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [item.id]);
  // 首次进入：标题由首页飞来，其余内容稍后依次出现；详情内切换：整体更快
  // 首次进入：标题飞行期间其余内容保持隐藏，落地后再依次出现，避免飞行中压在文字上
  const base = fresh ? 0.04 : 0.12;
  const rise = (k: number) =>
    flight
      ? {}
      : reduced
      ? { initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.15 } } }
      : { initial: { opacity: 0, y: 8 * direction }, animate: hold ? undefined : { opacity: 1, y: 0, transition: { duration: 0.5, ease: SILK, delay: base + k * 0.05 } } };
  const still = flight || reduced;
  // 一句话：由模糊变清晰
  const blurIn = still
    ? rise(0)
    : { initial: { opacity: 0, y: 6 * direction, filter: "blur(6px)" }, animate: hold ? undefined : { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: SILK, delay: base } } };
  // 元信息：逐项点亮
  const tick = (k: number) =>
    still ? {} : { initial: { opacity: 0, y: 4 }, animate: hold ? undefined : { opacity: 1, y: 0, transition: { duration: 0.35, ease: SILK, delay: base + 0.12 + k * 0.06 } } };
  // 滚动到才播：只播一次；首次进入且还在飞行时先不播
  const onView = (k: number, extra: object = {}) =>
    still
      ? {}
      : { initial: { opacity: 0, y: 10, ...extra }, whileInView: hold ? undefined : { opacity: 1, y: 0, transition: { duration: 0.5, ease: SILK, delay: 0.05 + (k % 3) * 0.06 } }, viewport: { once: true, margin: "0px 0px -8% 0px" } };
  const rule = (k: number) =>
    still ? {} : { initial: { scaleX: 0 }, whileInView: hold ? undefined : { scaleX: 1, transition: { duration: 0.5, ease: SILK, delay: (k % 3) * 0.06 } }, viewport: { once: true } };

  return (
    <article aria-labelledby="detail-title">
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {bar && (
            <motion.div
              key="bar"
              className="v3 fixed inset-x-0 top-0 z-[60] border-b border-[var(--line2)] bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur-[10px]"
              style={{ minHeight: 0 }}
              initial={{ y: -56, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { duration: 0.35, ease: SILK } }}
              exit={{ y: -56, opacity: 0, transition: { duration: 0.2 } }}
            >
              <div className="mx-auto flex h-12 max-w-[760px] items-center gap-4 px-[22px] min-[800px]:px-0">
                <span className="text-[15px] font-semibold text-[var(--ink)]">{tx.name}</span>
                <span className="hidden min-w-0 truncate text-[13px] text-[var(--ink3)] min-[640px]:inline">{tx.line}</span>
                <span className="ml-auto flex shrink-0 gap-2 text-[12.5px]">
                  {links.slice(0, 2).map((l, k) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={`v3-cta !h-7 !px-3 ${k === 0 ? "v3-cta-main" : ""}`}>{l.label}</a>
                  ))}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
      <h1
        id="detail-title"
        ref={titleRef}
        tabIndex={-1}
        data-detail-title
        className="text-[26px] font-normal leading-[1.35] text-[var(--ink)] outline-none min-[640px]:text-[30px]"
        style={{ opacity: hideTitle ? 0 : 1 }}
      >
        {fresh || reduced || flight ? tx.name : <SplitRise text={tx.name} direction={direction} stagger={0.03} duration={0.6} />}
      </h1>
      <motion.p {...blurIn} className="mt-2 text-[16px] leading-[1.7] text-[var(--ink2)] min-[640px]:text-[17px]">{tx.line}</motion.p>
      <p className="mt-3 flex flex-wrap items-baseline text-[13px] leading-[1.9] text-[var(--ink3)]">
        {[
          <span key="y" className="v3-serif text-[15px]">{yearOf(item.id)}</span>,
          ...(item.stamp ? [<span key="s">{stampText(item.stamp.label, lang)} <span className="v3-serif text-[15px]">{item.stamp.value}</span></span>] : []),
          ...tx.meta.map((m) => <span key={m}>{m}</span>),
        ].map((node, k) => (
          <motion.span key={k} {...tick(k)} className="inline-block whitespace-nowrap">{k > 0 && <span className="mx-2 text-[var(--ink6)]">·</span>}{node}</motion.span>
        ))}
      </p>

      {/* 入口放在最上面：第一眼就能找到在线看 / GitHub / 下载（第一个为主按钮） */}
      {links.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-2.5 text-[13.5px]">
          {links.map((l, k) => (
            <motion.a
              key={l.href}
              {...tick(3 + k)}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`v3-cta ${k === 0 ? "v3-cta-main" : ""}`}
            >
              {l.label}
            </motion.a>
          ))}
        </div>
      )}

      {item.video ? (
        // 视频保持原尺寸：不再随滚动放大（缩放会把原生播放控件一起放大）
        <div className="mt-8">
        <motion.div
          initial={flight ? false : reduced ? { opacity: 0 } : { clipPath: "inset(100% 0% 0% 0%)" }}
          animate={reduced ? { opacity: 1 } : hold ? undefined : { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 0.8, ease: SILK, delay: base + 0.22 } }}
          className="aspect-video overflow-hidden rounded-[8px] bg-black shadow-[0_1px_2px_rgba(0,0,0,0.05),0_18px_40px_-22px_rgba(40,30,20,0.35)]"
        >
          {/* 宣传片：静音自动循环，控件里可以开声音、全屏；减弱动态时不自动播放 */}
          <video
            key={item.video.src}
            src={item.video.src}
            poster={item.video.poster}
            autoPlay={!reduced}
            muted
            loop
            playsInline
            controls
            preload="metadata"
            aria-label={`${tx.name} ${t.film}`}
            className="h-full w-full object-cover"
          />
        </motion.div>
        </div>
      ) : item.preview && (
        <motion.div
          initial={flight ? false : reduced ? { opacity: 0 } : { clipPath: "inset(100% 0% 0% 0%)" }}
          animate={reduced ? { opacity: 1 } : hold ? undefined : { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 0.8, ease: SILK, delay: base + 0.22 } }}
          className="mt-8 aspect-[16/10] overflow-hidden rounded-[8px] bg-[var(--plate)] shadow-[0_1px_2px_rgba(0,0,0,0.05),0_18px_40px_-22px_rgba(40,30,20,0.35)]"
        >
          <motion.img
            src={item.preview}
            alt={`${tx.name} ${t.shot}`}
            initial={reduced || flight ? false : { scale: 1.06 }}
            animate={hold ? undefined : { scale: 1, transition: { duration: 1.4, ease: SILK, delay: base + 0.22 } }}
            className="h-full w-full object-cover"
          />
        </motion.div>
      )}

      {/* 宇奇引擎：宣传片之后，紧跟可交互的网页版演示 */}
      {item.demo && (
        <motion.div
          initial={flight ? false : reduced ? { opacity: 0 } : { clipPath: "inset(100% 0% 0% 0%)" }}
          animate={reduced ? { opacity: 1 } : hold ? undefined : { clipPath: "inset(0% 0% -40px 0%)", transitionEnd: { clipPath: "none" }, transition: { duration: 0.8, ease: SILK, delay: base + 0.22 } }}
          className={item.video || item.preview ? "mt-6" : "mt-8"}
        >
          <DemoFrame demo={item.demo} label={t.demo} hint={t.tryIt} full={t.full} close={t.close} />
        </motion.div>
      )}

      {/* 正文：背景 / 定位 / 核心能力 / 构建 / 成果（没有内容的栏目不显示） */}
      <div className="mt-12 space-y-10">
        {(
          (st.custom ?? [
            [t.labels[0], st.bg],
            [t.labels[1], st.pos],
            [t.labels[2], st.caps],
            [t.labels[3], st.build],
            [t.labels[4], st.out],
          ]) as [string, string | string[] | Story["build"] | undefined][]
        )
          .filter(([, v]) => v && (!Array.isArray(v) || v.length > 0))
          .map(([label, v], k) => (
            <section key={label}>
              <h2 className="flex items-center gap-3 text-[16px] font-semibold text-[var(--ink)]">
                <motion.span aria-hidden {...rule(k)} className="block h-px w-5 origin-left bg-[var(--ink)]" />
                <motion.span {...onView(k)}>{label}</motion.span>
              </h2>
              {typeof v === "string" ? (
                <motion.p {...onView(k + 0.5)} className="mt-3 text-[15px] leading-[1.85] text-[var(--ink2)] [text-wrap:pretty] min-[640px]:text-[15.5px]">{rich(v)}</motion.p>
              ) : Array.isArray(v) ? (
                <ol className="mt-3 space-y-2">
                  {v.map((c, j) => (
                    <motion.li key={c} {...onView(k + 0.3 + j * 0.15)} className="v3-num text-[15px] leading-[1.75] text-[var(--ink2)] min-[640px]:text-[15.5px]">
                      <span aria-hidden className="v3-num-i v3-serif">{pad2(j + 1)}</span>
                      <span>{rich(c)}</span>
                    </motion.li>
                  ))}
                </ol>
              ) : (
                (() => {
                  const bd = v as { lead?: string; items?: [string, string][] };
                  return (
                    <>
                      {bd.lead && <motion.p {...onView(k + 0.4)} className="mt-3 text-[15px] leading-[1.85] text-[var(--ink2)] min-[640px]:text-[15.5px]">{rich(bd.lead)}</motion.p>}
                      {bd.items && (
                        <ol className="mt-4 space-y-4">
                          {bd.items.map(([head, body], j) => (
                            <motion.li key={head} {...onView(k + 0.5 + j * 0.15)} className="v3-num">
                              <span aria-hidden className="v3-num-i v3-serif">{pad2(j + 1)}</span>
                              <span>
                                <span className="block text-[15px] font-semibold leading-[1.6] text-[var(--ink)]">{head}</span>
                                <span className="mt-0.5 block text-[14.5px] leading-[1.75] text-[var(--ink2)]">{rich(body)}</span>
                              </span>
                            </motion.li>
                          ))}
                        </ol>
                      )}
                    </>
                  );
                })()
              )}
            </section>
          ))}
      </div>

      <nav aria-label={t.pager} className="relative mt-16 flex items-baseline justify-between gap-6 pt-5 text-[14px]">
        <motion.span aria-hidden {...rule(5)} className="absolute inset-x-0 top-0 block h-px origin-center bg-[var(--line2)]" style={still ? undefined : { transformOrigin: "50% 50%" }} />
        <motion.a {...onView(5.5)} className="v3-link group text-[var(--ink3)]" href={`/?p=${prev.id}`} onClick={(e) => { if (plainClick(e)) { e.preventDefault(); onSelect(prev.id); } }}>
          {t.prev}{t.colon}<span className="v3-u text-[var(--ink)]">{textOf(prev, lang).name}</span>
        </motion.a>
        <motion.a {...onView(5.5)} className="v3-link group text-right text-[var(--ink3)]" href={`/?p=${next.id}`} onClick={(e) => { if (plainClick(e)) { e.preventDefault(); onSelect(next.id); } }}>
          {t.next}{t.colon}<span className="v3-u text-[var(--ink)]">{textOf(next, lang).name}</span>
        </motion.a>
      </nav>
    </article>
  );
}

export function ProjectDetail({ id, lang, onLang, direction, reduced, fresh, flying, holding, onSelect, onClose }: {
  id: string;
  lang: Lang;
  onLang: (l: Lang) => void;
  direction: number;
  reduced: boolean;
  /** 从首页进入的第一屏（标题由飞行克隆体接管） */
  fresh: boolean;
  flying: boolean;
  /** 飞行前半段：内容先别出来 */
  holding: boolean;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const item = ITEMS.find((x) => x.id === id) ?? ITEMS[0];
  const pos = ITEMS.indexOf(item) + 1;
  const t = L[lang];
  const flight = useLangFlight();

  // 左右方向键 / J K 切换项目；输入框里和带修饰键时不响应
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      const i = ITEMS.findIndex((x) => x.id === id);
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" || e.key === "j" || e.key === "J") onSelect(ITEMS[(i + 1) % ITEMS.length].id);
      else if (e.key === "ArrowLeft" || e.key === "k" || e.key === "K") onSelect(ITEMS[(i - 1 + ITEMS.length) % ITEMS.length].id);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [id, onSelect, onClose]);

  // 左栏目录逐项淡入（只在第一次进入详情时播）
  const cascade = (k: number) =>
    flight || reduced
      ? {}
      : { initial: { opacity: 0, x: -6 }, animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: SILK, delay: 0.18 + k * 0.022 } } };
  const fade = flight
    ? {}
    : reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.15 } } }
    : { initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.4, ease: SILK, delay: 0.15 } } };

  return (
    <main className="mx-auto w-full max-w-[760px] px-[22px] pb-[120px] pt-10 min-[640px]:pt-[72px] min-[800px]:px-0">
      <motion.div {...fade} className="flex items-baseline justify-between text-[14px]">
        <a className="v3-link text-[var(--ink)]" href="/" onClick={(e) => { if (plainClick(e)) { e.preventDefault(); onClose(); } }}>
          <span className="v3-u">{t.back}</span>
        </a>
        <span className="flex items-baseline gap-6">
          <Controls lang={lang} onLang={onLang} />
        </span>
      </motion.div>

      <p className="sr-only" aria-live="polite">{t.live(pos, ITEMS.length, textOf(item, lang).name)}</p>
      <div className="mt-10 min-[640px]:mt-14 min-[960px]:grid min-[960px]:grid-cols-[180px_1fr] min-[960px]:gap-x-10">
        {/* 左栏目录：与首页同序同分组，当前项墨色 + 短线 */}
        <nav aria-label={t.all} className="hidden min-[960px]:block">
          <div className="sticky top-[72px] space-y-6">
            {COLS.map((col, ci) => (
              <div key={col.label}>
                <motion.div {...cascade(ci * 4)} className={`text-[13px] transition-colors duration-300 ${col.items.some((x) => x.id === id) ? "text-[var(--ink)]" : "text-[var(--ink4)]"}`}>{colLabel(col, lang)}</motion.div>
                <ul className="mt-1.5 space-y-0.5">
                  {col.items.map((it, k) => {
                    const on = it.id === id;
                    return (
                      <motion.li key={it.id} {...cascade(ci * 4 + k + 1)}>
                        <a
                          href={`/?p=${it.id}`}
                          aria-current={on ? "page" : undefined}
                          onClick={(e) => { if (plainClick(e)) { e.preventDefault(); onSelect(it.id); } }}
                          className={`v3-toc relative block py-[5px] text-[14px] ${on ? "is-on" : ""}`}
                        >
                          <span className="toc-name relative">
                            {/* 当前项：名字下方一道墨线自左向右画出，像用钢笔划了一下 */}
                            {on && (
                              <svg aria-hidden className="toc-stroke" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M1 6.5 C 18 3.5, 34 8.5, 52 5.5 S 84 3.8, 99 6" />
                              </svg>
                            )}
                            <span className="relative">{textOf(it, lang).name}</span>
                          </span>
                        </a>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        <div className="min-w-0">
          <AnimatePresence mode="wait" custom={direction} onExitComplete={() => jumpTo(0)}>
            <motion.div
              key={item.id}
              custom={direction}
              exit={reduced ? { opacity: 0, transition: { duration: 0.12 } } : { opacity: 0, y: -12 * direction, transition: { duration: 0.16, ease: [0.4, 0, 1, 1] } }}
            >
              <Body item={item} lang={lang} direction={direction} reduced={reduced} fresh={fresh} hideTitle={flying} hold={holding} onSelect={onSelect} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
