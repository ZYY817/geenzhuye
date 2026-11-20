"use client";

/* ============================================================================
 * 首页 v3 · 简约（文字的质感）——规格见 SPEC_V3_MINIMAL.md
 * ----------------------------------------------------------------------------
 * 只有文字：名字 → 身份 → 一段自我介绍 → 三栏项目 → 现在 → 联系。
 * 质感来自字号与灰度层级、留白节奏、一处衬线斜体（只给西文与数字）、
 * 链接与悬停细节、真实的提交时刻。动效只做让人舒服的小事。
 * ==========================================================================*/

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, AnimatePresence } from "framer-motion";
import { LAST_UPDATED, SYSTEM_METRICS } from "@/data/archive";
import { RollText } from "@/components/site/Kinetic";
import { SmoothScroll, jumpTo } from "@/components/site/SmoothScroll";
import { COLS, ITEMS, itemById, textOf, stampText, colLabel, type Lang } from "./projects";
import { LangSwap } from "@/components/site/LangSwap";
import { useLang } from "@/components/site/lang";
import { Controls } from "./Controls";
import { ProjectDetail, plainClick } from "./ProjectDetail";
import { LocalClock } from "@/components/site/LocalClock";

/* 首页文案（中 / 英，SPEC §11.3）。项目文案在 projects.ts */
const T = {
  zh: {
    name: "智宇",
    cols: ["代表作", "AI 与方法", "小工具"], now: "现在",
    wechat: "微信", email: "邮箱", bilibili: "B站", douyin: "抖音", city: "深圳", updated: "更新于", copied: "已复制",
  },
  en: {
    name: "Zhiyu",
    cols: ["Selected work", "AI & method", "Small tools"], now: "Now",
    wechat: "WeChat", email: "Email", bilibili: "Bilibili", douyin: "Douyin", city: "Shenzhen", updated: "Updated", copied: "Copied",
  },
} as const;

/* 入场：每块依次淡入上移（SPEC §4）。i 为出场顺序 */
const enter = (i: number) => ({ animationDelay: `${i * 60}ms` });

function CopyLink({ label, value, copied }: { label: string; value: string; copied: string }) {
  const [state, setState] = useState<"idle" | "ok" | "fail">("idle");
  const copy = async () => {
    let ok = true;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      ok = false;
    }
    setState(ok ? "ok" : "fail");
    window.setTimeout(() => setState("idle"), ok ? 1600 : 4000); // 失败时把号码留久一点，方便手动复制
  };
  return (
    <button type="button" onClick={copy} className="v3-link cursor-pointer" aria-live="polite">
      {state === "ok" ? copied : state === "fail" ? value : label}
    </button>
  );
}

export function MinimalHome({ serifClass }: { serifClass: string }) {
  const reduced = useReducedMotion();
  const [hover, setHover] = useState<{ col: number; id: string; preview?: string } | null>(null);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setCanHover(matchMedia("(hover: hover) and (min-width: 960px)").matches));
    return () => cancelAnimationFrame(id);
  }, []);


  /* ---------- 页内详情（SPEC §10）：?p=<id> 可分享，后退返回 ---------- */
  const [openId, setOpenId] = useState<string | null>(null);
  const [direction, setDirection] = useState(1);
  const [fresh, setFresh] = useState(false); // 从首页进入的第一屏
  const [settled, setSettled] = useState(false); // 首页入场只播一次，回来时不重播
  const [boot, setBoot] = useState(false); // 直链 ?p= 进入：首页不画出来、不淡出，直接是详情
  /* ---------- 语言（SPEC §11.3）：用户点的才推屏；加载时恢复的直接换 ---------- */
  const [lang, setLang] = useLang();
  const t = T[lang];
  const [push, setPush] = useState(false);
  const [seenLang, setSeenLang] = useState<Lang>(lang);
  if (seenLang !== lang) {
    // 渲染期调整：换语言后首页不重播入场
    setSeenLang(lang);
    setSettled(true);
  }
  const switchLang = (next: Lang) => { setPush(true); setLang(next); };
  // 用户换语言后：标题跟着换；推屏结束把焦点交给新页面上的语言按钮，键盘不会掉回页首
  useEffect(() => {
    document.title = lang === "en" ? "Zhiyu — Turning ideas into software and websites with AI" : "智宇 — 用 AI 把想法做成软件与网页";
    if (!push) return;
    const id = window.setTimeout(() => {
      const btns = document.querySelectorAll<HTMLElement>("[data-lang-btn]");
      btns[btns.length - 1]?.focus({ preventScroll: true });
    }, 600);
    return () => window.clearTimeout(id);
  }, [lang, push]);
  // 首帧脚本（page.tsx）在需要英文时先藏起页面；语言就位后再显示
  useEffect(() => {
    const want = document.documentElement.dataset.wantLang;
    if (want && want !== lang) return;
    // 等两帧：旧语言的那一页退场完再揭开
    let r2 = 0;
    const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => document.documentElement.classList.remove("v3-wait")); });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, [lang]);

  const lastId = useRef<string | null>(null); // 回首页后把焦点还给它
  const [fly, setFly] = useState<{ text: string; from: DOMRect; size: number } | null>(null);
  const [released, setReleased] = useState(false); // 飞行过半就放出详情内容，不让页面空等
  const savedY = useRef(0);
  const openRef = useRef<string | null>(null);
  useEffect(() => { openRef.current = openId; }, [openId]);

  const readUrl = () => {
    const p = new URLSearchParams(window.location.search).get("p");
    return itemById(p) ? p : null;
  };
  // 直链：在首帧绘制前读地址，避免先闪一下首页
  useLayoutEffect(() => {
    window.history.scrollRestoration = "manual"; // 滚动位置由我们（和 Lenis）管理
    const p = readUrl();
    // page.tsx 在水合前给直链加了 v3-deep 隐藏首页；退场中的首页拿不到新 props，所以这个类留到离开详情时再去掉
    if (!p) { document.documentElement.classList.remove("v3-deep"); return; }
    /* eslint-disable react-hooks/set-state-in-effect -- 必须在首帧绘制前切到详情 */
    setBoot(true);
    setSettled(true);
    setOpenId(p);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);
  useEffect(() => {
    const onPop = () => {
      const p = readUrl();
      const cur = openRef.current;
      if (p && cur) setDirection(ITEMS.findIndex((i) => i.id === p) >= ITEMS.findIndex((i) => i.id === cur) ? 1 : -1);
      if (!p && cur) lastId.current = cur;
      if (!p) { setBoot(false); document.documentElement.classList.remove("v3-deep"); }
      setFly(null);
      setFresh(false);
      setSettled(true);
      setOpenId(p);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  /* 标题飞行：被点的项目名从原位置飞到详情标题（克隆体逐帧追赶目标，目标挂载前原地等待） */
  const fx = useMotionValue(0);
  const fy = useMotionValue(0);
  const fs = useMotionValue(1);
  useEffect(() => {
    if (!fly) return;
    let start = 0;
    let raf = 0;
    const tick = (now: number) => {
      const target = document.querySelector<HTMLElement>("[data-detail-title]");
      if (target) {
        if (!start) start = now;
        const t = Math.min(1, (now - start) / 600);
        const e = 1 - Math.pow(1 - t, 4);
        const r = target.getBoundingClientRect();
        fx.set(fly.from.left + (r.left - fly.from.left) * e);
        fy.set(fly.from.top + (r.top - fly.from.top) * e);
        fs.set(1 + (parseFloat(getComputedStyle(target).fontSize) / fly.size - 1) * e);
        if (t >= 0.55) setReleased(true);
        if (t >= 1) { setFly(null); return; }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const guard = window.setTimeout(() => setFly(null), 2000);
    return () => { cancelAnimationFrame(raf); window.clearTimeout(guard); };
  }, [fly, fx, fy, fs]);

  const openFromHome = (id: string, el: HTMLElement | null) => {
    const it0 = itemById(id);
    const name = it0 ? textOf(it0, lang).name : "";
    savedY.current = window.scrollY;
    if (el && !reduced) {
      const r = el.getBoundingClientRect();
      fx.set(r.left); fy.set(r.top); fs.set(1);
      setReleased(false);
      setFly({ text: name, from: r, size: parseFloat(getComputedStyle(el).fontSize) || 15 });
    }
    setHover(null);
    setDirection(1);
    setFresh(true);
    setSettled(true);
    window.history.pushState(null, "", `?p=${id}`);
    setOpenId(id);
  };
  const select = useCallback((id: string) => {
    const cur = openRef.current;
    if (!cur || id === cur) return;
    setDirection(ITEMS.findIndex((i) => i.id === id) > ITEMS.findIndex((i) => i.id === cur) ? 1 : -1);
    setFresh(false);
    setFly(null);
    // 详情内切换只替换地址，后退一步就回首页
    window.history.replaceState(null, "", `?p=${id}`);
    setOpenId(id);
  }, []);
  const close = useCallback(() => {
    lastId.current = openRef.current;
    setFly(null);
    setBoot(false);
    document.documentElement.classList.remove("v3-deep");
    window.history.pushState(null, "", window.location.pathname);
    setOpenId(null);
  }, []);
  /* 视图换完后再跳滚动：去详情回顶部，回首页回到原处 */
  const onViewSwap = useCallback(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      jumpTo(openRef.current ? 0 : savedY.current);
      // 回到首页：焦点还给刚才看的那个项目
      if (!openRef.current && lastId.current) {
        const back = document.querySelector<HTMLElement>(`main a[href="/?p=${lastId.current}"]`);
        back?.focus({ preventScroll: true });
        // 刚看过的项目闪一下淡底色，告诉人"你是从这里回来的"
        const row = back?.closest<HTMLElement>(".v3-item");
        if (row) { row.classList.remove("v3-flash"); void row.offsetWidth; row.classList.add("v3-flash"); window.setTimeout(() => row.classList.remove("v3-flash"), 1400); }
      }
    }));
  }, []);
  const onProjectClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (!plainClick(e)) return;
    e.preventDefault();
    openFromHome(id, e.currentTarget.querySelector<HTMLElement>(".v3-name, .v3-u"));
  };

  // 介绍里的链接：外链新开标签，邮箱用 mailto
  const ext = (href: string, label: string) => (
    <a className="v3-link text-[var(--ink)]" href={href} target="_blank" rel="noopener noreferrer"><span className="v3-u">{label}</span></a>
  );
  const mail = (
    <a className="v3-link text-[var(--ink)]" href={`mailto:${SYSTEM_METRICS.socials.email}`}><span className="v3-u">{SYSTEM_METRICS.socials.email}</span></a>
  );

  /* 首屏（2026-11-10 定稿 A · 编号与细线）：四列一屏看全；look / wide 保留为常量，方便以后回退 */
  const look = "a" as const;
  const wide = true;

  let order = 3; // 名字、介绍、联系方式之后
  return (
    <div className={`v3 min-h-svh w-full ${serifClass} ${settled ? "v3-settled" : ""}`}>
      <SmoothScroll />
      <LangSwap animate={push}>
      <AnimatePresence mode="wait" initial={false} onExitComplete={onViewSwap}>
      {openId ? (
        <motion.div key="detail" exit={{ opacity: 0, transition: { duration: reduced ? 0.12 : 0.16 } }}>
          <ProjectDetail id={openId} lang={lang} onLang={switchLang} direction={direction} reduced={!!reduced} fresh={fresh} flying={!!fly} holding={!!fly && !released} onSelect={select} onClose={close} />
        </motion.div>
      ) : (
      <motion.main
        key="home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.25 } }}
        exit={{ opacity: 0, transition: { duration: boot ? 0 : reduced ? 0.12 : 0.2 } }}
        style={boot ? { visibility: "hidden" } : undefined}
        className={wide ? `v3-home look-${look} relative mx-auto w-full max-w-[1120px] px-[22px] pb-16 pt-12 min-[640px]:pt-[72px] min-[1180px]:px-0` : "v3-home mx-auto w-full max-w-[760px] px-[22px] pb-[120px] pt-16 min-[640px]:pt-[112px] min-[800px]:px-0"}>
        <header>
          <div className="v3-in flex items-center text-[15px] font-medium text-[var(--ink)]" style={enter(0)}>
            {t.name}
            {look === "a" && <span className="ml-4 text-[12px] font-normal tracking-[0.08em] text-[var(--ink4)]">{lang === "en" ? "SHENZHEN · 2026" : "深圳 · 2026"}</span>}
            <Controls className="ml-auto" lang={lang} onLang={switchLang} />
          </div>
        </header>

        {/* 自我介绍（2026-11-09 用户定稿 A）：一句话讲清我是谁、擅长什么、相信什么；下面一行联系方式，再往下是项目 */}
        <section className={wide ? "mt-10 max-w-[860px]" : "mt-14"}>
          <p className={`v3-in leading-[1.75] text-[var(--ink)] [text-wrap:pretty] ${wide ? "text-[19px] min-[640px]:text-[23px]" : "text-[17px] leading-[1.85] min-[640px]:text-[19px]"}`} style={enter(1)}>
            {lang === "en" ? (
              <>I’m Zhiyu. I build software with AI to help more people solve real problems.</>
            ) : (
              <>我是智宇，用 AI 做软件，帮更多人解决实际问题。</>
            )}
          </p>
          <p className="v3-in mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-1 text-[14px] text-[var(--ink3)]" style={enter(2)}>
            {ext(SYSTEM_METRICS.socials.github, "GitHub")}
            {ext(SYSTEM_METRICS.socials.bilibili, lang === "en" ? "Bilibili" : "B 站")}
            {ext(SYSTEM_METRICS.socials.douyin, lang === "en" ? "Douyin" : "抖音")}
            <CopyLink label={lang === "en" ? "WeChat" : "微信"} copied={t.copied} value={SYSTEM_METRICS.socials.wechat} />
            {mail}
          </p>
        </section>

        <section className={wide ? "mt-10 grid grid-cols-1 gap-y-9 min-[800px]:grid-cols-2 min-[800px]:gap-x-16" : "mt-16 grid grid-cols-1 gap-x-10 gap-y-12 min-[640px]:grid-cols-2"}>
          {COLS.map((col, ci) => (
            <div key={col.label} className={wide ? "look-col" : undefined}>
              <div className="v3-in look-head text-[14px] text-[var(--ink3)]" style={enter(order++)}>
                {look === "a" && <span aria-hidden className="look-num v3-serif">{String(ci + 1).padStart(2, "0")}</span>}
                <span className="relative">{colLabel(col, lang)}</span>
              </div>
              {col.items.map((it) => {
                const tx = textOf(it, lang);
                const dim = hover && hover.col === ci && hover.id !== it.id;
                return (
                  <div
                    key={it.id}
                    className={`v3-in v3-item ${wide ? "look-row mt-[13px]" : "mt-[14px] min-[640px]:mt-[18px]"} ${dim ? "v3-dim" : ""}`}
                    style={enter(order++)}
                    onPointerEnter={() => { if (canHover) setHover({ col: ci, id: it.id }); }}
                    onPointerLeave={() => setHover(null)}
                  >
                    <a
                      className="v3-link text-[15px] text-[var(--ink)]"
                      href={`/?p=${it.id}`}
                      onClick={(e) => onProjectClick(e, it.id)}
                      onFocus={() => setHover({ col: ci, id: it.id })}
                      onBlur={() => setHover(null)}
                    >
                      {/* 悬停 / 聚焦：项目名逐字向上翻滚，同色接上（融合自旧首页 RollText，SPEC §9 #4） */}
                      <span className="v3-name"><RollText text={tx.name} active={hover?.id === it.id} stagger={14} rollClass="" /></span>
                    </a>
                    {it.stamp && (
                      <i className="v3-serif ml-2.5 text-[14px] text-[var(--ink3)]" title={`${stampText(it.stamp.label, lang)} ${it.stamp.value}`}>
                        {it.stamp.value}
                        {it.stamp.label === "夜间提交" && <span className="ml-1 font-sans text-[12.5px] not-italic" style={{ fontStyle: "normal" }}>{lang === "en" ? "at night" : "夜间"}</span>}
                      </i>
                    )}
                    <span className={`leading-[1.65] text-[var(--ink2)] ${wide ? "look-line text-[13.5px] [word-break:keep-all]" : "mt-0.5 block text-[14px]"}`}>
                      {/* 宽版四列：只在逗号后换行，不把词拆开 */}
                      {wide ? tx.line.split("，").map((part, k, arr) => <span key={k}>{part}{k < arr.length - 1 && <>，<wbr /></>}</span>) : tx.line}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </section>


        <footer className={`v3-in ${wide ? "mt-9" : "mt-14"} flex flex-wrap items-baseline gap-x-[22px] gap-y-2 text-[14px] text-[var(--ink3)]`} style={enter(order++)}>
          {/* 深圳此刻 + 更新于（融合自旧页脚，SPEC §9 #6），与提交时刻呼应 */}
          <span className="text-[13px] text-[var(--ink3)]">
            <LocalClock city={t.city} /> · {t.updated} {LAST_UPDATED}
          </span>
        </footer>
      </motion.main>
      )}
      </AnimatePresence>
      </LangSwap>

      {/* 标题飞行克隆体 */}
      {fly && (
        <motion.div
          aria-hidden
          style={{ x: fx, y: fy, scale: fs, transformOrigin: "left top" }}
          className="pointer-events-none fixed left-0 top-0 z-[70] whitespace-nowrap text-[15px] leading-[1.35] text-[var(--ink)]"
        >
          {fly.text}
        </motion.div>
      )}

      <style>{`
        .v3 {
          --bg: #fbfaf8; --ink: #141414; --ink2: #36352f; --ink3: #6f6d67; --ink4: #8d8b86; --ink5: #b5b3ae; --ink6: #c9c7c1;
          --plate: #eceae6; --line: rgba(23,23,23,.2); --line2: rgba(23,23,23,.1); --tint: rgba(23,23,23,.04); --img: none;
          background: var(--bg); color: var(--ink2); -webkit-font-smoothing: antialiased;
          transition: background-color 320ms ease, color 320ms ease;
        }
        /* 深色：同一张纸的夜晚版——暖黑底、米白墨，没有发光和饱和色（SPEC §11.2） */
        .dark .v3 {
          --bg: #121211; --ink: #ecebe7; --ink2: #b9b7b0; --ink3: #8b8983; --ink4: #7f7d77; --ink5: #5f5d59; --ink6: #4a4946;
          --plate: #1d1c1a; --line: rgba(236,235,231,.22); --line2: rgba(236,235,231,.12); --tint: rgba(236,235,231,.05); --img: brightness(.85);
          color-scheme: dark;
        }

        /* 配色方案（2026-11-20 用户定制）：右上角圆点切换，存 localStorage 的 zhiyu-pal，
           首屏脚本在 hydration 前就把 data-pal 写到 <html> 上，不会闪回原色。--num 是分组序号的专用色 */
        html[data-pal="amber"] .v3 {
          --bg: #faf7f0; --ink: #1c2438; --ink2: #2e3a52; --ink3: #687389; --ink4: #8a92a8; --ink5: #b3b9c9; --ink6: #ccd1dd;
          --plate: #f0ebe1; --line: rgba(28,36,56,.2); --line2: rgba(28,36,56,.1); --tint: rgba(180,83,9,.06);
          --accent: #b45309; --num: #b45309;
        }
        html.dark[data-pal="amber"] .v3 {
          --bg: #141a29; --ink: #e8e4dc; --ink2: #b7bcc9; --ink3: #8a92a8; --ink4: #6f7791; --ink5: #565d78; --ink6: #3f465e;
          --plate: #1c2334; --line: rgba(232,228,220,.2); --line2: rgba(232,228,220,.1); --tint: rgba(217,119,6,.1);
          --accent: #e09a3c; --num: #e09a3c;
        }
        html[data-pal="tech"] .v3 {
          --bg: #ffffff; --ink: #0b1220; --ink2: #1f2d44; --ink3: #54637d; --ink4: #7d8aa3; --ink5: #aab4c8; --ink6: #c9d2e2;
          --plate: #eef1f6; --line: rgba(15,35,80,.18); --line2: rgba(15,35,80,.09); --tint: rgba(37,99,235,.05);
          --accent: #2563eb; --num: #2563eb;
        }
        html.dark[data-pal="tech"] .v3 {
          --bg: #0a1222; --ink: #eaf0fb; --ink2: #a8b6d4; --ink3: #7787ad; --ink4: #5d6d94; --ink5: #46547a; --ink6: #34405f;
          --plate: #101a30; --line: rgba(190,205,240,.2); --line2: rgba(190,205,240,.1); --tint: rgba(59,130,246,.12);
          --accent: #60a5fa; --num: #60a5fa;
        }
        html[data-pal="sky"] .v3 {
          --bg: #fcfeff; --ink: #101d29; --ink2: #233647; --ink3: #56707f; --ink4: #7e97a6; --ink5: #aec2cd; --ink6: #cbdbe2;
          --plate: #eef6fa; --line: rgba(14,90,140,.18); --line2: rgba(14,90,140,.09); --tint: rgba(14,165,233,.06);
          --accent: #0ea5e9; --num: #fb7185;
        }
        html.dark[data-pal="sky"] .v3 {
          --bg: #071420; --ink: #e4f2fb; --ink2: #a4c4d6; --ink3: #7193a8; --ink4: #5a7b90; --ink5: #456073; --ink6: #324a5c;
          --plate: #0d2030; --line: rgba(190,225,245,.2); --line2: rgba(190,225,245,.1); --tint: rgba(14,165,233,.12);
          --accent: #38bdf8; --num: #fb8ba0;
        }
        html[data-pal="night"] .v3 {
          --bg: #f2f5fb; --ink: #101a30; --ink2: #26345a; --ink3: #5a6a94; --ink4: #7e8db4; --ink5: #abb6d6; --ink6: #ccd4e8;
          --plate: #e6ecf7; --line: rgba(20,40,90,.18); --line2: rgba(20,40,90,.09); --tint: rgba(37,99,235,.05);
          --accent: #c2410c; --num: #c2410c;
        }
        html.dark[data-pal="night"] .v3 {
          --bg: #0a0f22; --ink: #e8edff; --ink2: #a9b4dc; --ink3: #7683b3; --ink4: #5e6b96; --ink5: #47527c; --ink6: #333d63;
          --plate: #121830; --line: rgba(200,214,255,.2); --line2: rgba(200,214,255,.1); --tint: rgba(59,130,246,.12);
          --accent: #fb923c; --num: #fb923c;
        }
        /* 各配色下 html/body 的底色跟随（防滚动溢出露白边） */
        html[data-pal="amber"], html[data-pal="amber"] body { background: #faf7f0; }
        html.dark[data-pal="amber"], html.dark[data-pal="amber"] body { background: #141a29; }
        html[data-pal="tech"], html[data-pal="tech"] body { background: #ffffff; }
        html.dark[data-pal="tech"], html.dark[data-pal="tech"] body { background: #0a1222; }
        html[data-pal="sky"], html[data-pal="sky"] body { background: #fcfeff; }
        html.dark[data-pal="sky"], html.dark[data-pal="sky"] body { background: #071420; }
        html[data-pal="night"], html[data-pal="night"] body { background: #f2f5fb; }
        html.dark[data-pal="night"], html.dark[data-pal="night"] body { background: #0a0f22; }
        .v3 img { filter: var(--img); }
        .v3 ::selection { background: var(--ink); color: var(--bg); }
        .v3-serif { font-family: var(--font-instrument), "Instrument Serif", serif; font-style: italic; letter-spacing: .005em; }
        .v3-link { color: inherit; text-decoration: none; }
        .v3-u { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 4px; text-decoration-color: var(--line); transition: text-decoration-color 160ms; }
        .v3-link:hover .v3-u { text-decoration-color: currentColor; }
        .v3-name { display: inline-block; line-height: 1.35; padding-bottom: 2px; border-bottom: 1px solid var(--line); transition: border-color 160ms; }
        .v3-link:hover .v3-name, .v3-link:focus-visible .v3-name { border-bottom-color: currentColor; }
        .v3-arrow { display: inline-block; margin-left: 3px; font-size: 11px; color: var(--ink5); opacity: 0; transform: translate(-2px, 2px); transition: opacity 160ms, transform 200ms cubic-bezier(.16,1,.3,1); }
        .v3-link:hover .v3-arrow, .v3-link:focus-visible .v3-arrow { opacity: 1; transform: none; }
        .v3-link:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; border-radius: 2px; }
        button.v3-link { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 4px; text-decoration-color: var(--line); }
        button.v3-link:hover { text-decoration-color: currentColor; color: var(--ink); }
        a.v3-link:not(:has(.v3-u)) { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 4px; text-decoration-color: var(--line); }
        a.v3-link:not(:has(.v3-u)):hover { text-decoration-color: currentColor; color: var(--ink); }
        /* 详情页外链：悬停时下划线从左往右画出 */
        .v3-draw { position: relative; text-decoration: none !important; }
        .v3-draw::after { content: ""; position: absolute; left: 0; right: 0; bottom: -3px; height: 1px; background: var(--line); }
        .v3-draw::before { content: ""; position: absolute; left: 0; right: 0; bottom: -3px; height: 1px; background: currentColor; transform: scaleX(0); transform-origin: left; transition: transform 360ms cubic-bezier(.16,1,.3,1); z-index: 1; }
        .v3-draw:hover::before, .v3-draw:focus-visible::before { transform: scaleX(1); }
        /* 详情页左栏选中态（2026-11-02 定稿 D · 笔触下划线）：其余项目淡，当前项墨色 + 一道手绘墨线自左向右画出 */
        .v3-toc { color: var(--ink4); transition: color 220ms; }
        .v3-toc:hover { color: var(--ink2); }
        .v3-toc.is-on { color: var(--ink); }
        .toc-stroke { position: absolute; left: -2px; bottom: -5px; width: calc(100% + 6px); height: 8px; overflow: visible; pointer-events: none; }
        .toc-stroke path { fill: none; stroke: var(--ink); stroke-width: 1.6; stroke-linecap: round; vector-effect: non-scaling-stroke; stroke-dasharray: 120; stroke-dashoffset: 120; animation: toc-draw 700ms cubic-bezier(.16,1,.3,1) forwards; }
        @keyframes toc-draw { to { stroke-dashoffset: 0; } }
        @media (prefers-reduced-motion: reduce) { .toc-stroke path { animation: none; stroke-dashoffset: 0; } }
        /* 详情正文：编号列表（衬线斜体 01 02 …，悬挂对齐）与重点数值 */
        .v3-num { display: grid; grid-template-columns: 2.2em 1fr; align-items: baseline; }
        .v3-num-i { font-size: 15px; color: var(--ink4); }
        .v3-key { font-weight: 600; color: var(--ink); }
        /* 详情页入口按钮：第一个实心墨色，其余描边 */
        .v3-cta { display: inline-flex; align-items: center; height: 32px; padding: 0 14px; border-radius: 999px; border: 1px solid var(--line); color: var(--ink); text-decoration: none; transition: border-color 160ms, background-color 160ms, color 160ms; }
        .v3-cta:hover, .v3-cta:focus-visible { border-color: var(--ink); }
        .v3-cta-main { background: var(--ink); border-color: var(--ink); color: var(--bg); }
        .v3-cta-main:hover, .v3-cta-main:focus-visible { opacity: .86; }
        /* —— 首屏改版预览 —— */
        .v3 { --accent: #c2452d; }
        .dark .v3 { --accent: #d4664c; }
        .look-a .look-col { border-top: 1px solid var(--line); padding-top: 18px; }
        .look-a .look-head { display: flex; align-items: baseline; gap: 10px; }
        .look-a .look-num { font-size: 26px; line-height: 1; color: var(--num, var(--ink)); transition: color 300ms; }
        /* 2×2 四角排布：宽屏时项目名和一句话排在同一行，过长省略 */
        @media (min-width: 1100px) {
          .look-row { display: flex; align-items: baseline; gap: 14px; }
          .look-row .look-line { min-width: 0; flex: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; color: var(--ink3); }
          .look-row > a, .look-row > i { flex-shrink: 0; }
        }
        @media (max-width: 1099px) { .look-row .look-line { display: block; margin-top: 2px; } }
        .look-a .look-col:hover .look-num { color: var(--accent); }
        /* 大屏整体放大：2K 以上的屏幕把首页按比例放大，填满屏幕、字更易读（用 zoom，排版比例不变） */
        @media (min-width: 1800px) and (min-height: 1000px) { .v3-home.look-a { zoom: 1.12; } }
        @media (min-width: 2300px) and (min-height: 1300px) { .v3-home.look-a { zoom: 1.45; } }
        .v3-hit { transition: background-color 160ms, color 160ms; }
        .v3-hit:hover { background: var(--line2); }
        .v3-hit:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
        /* 悬停：项目背后出现一层很淡的底色（用外扩阴影画出，不改变排版），200ms 渐入 */
        .v3-item { border-radius: 4px; transition: background-color 200ms, box-shadow 200ms; }
        .v3-item:hover, .v3-item:has(:focus-visible) { background: var(--tint); box-shadow: 0 0 0 10px var(--tint); }
        .v3-flash { animation: v3-flash 1.4s cubic-bezier(.16,1,.3,1); }
        @keyframes v3-flash { 0%, 35% { background: var(--tint); box-shadow: 0 0 0 10px var(--tint); } 100% { background: transparent; box-shadow: 0 0 0 10px transparent; } }
        .v3-in > * { transition: opacity 200ms; }
        .v3-dim > * { opacity: .45; }
        .v3-settled .v3-in { animation: none; }
        .v3-in { animation: v3-in 500ms cubic-bezier(.16,1,.3,1) both; }
        @keyframes v3-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .v3-in { animation: v3-fade 200ms both; } @keyframes v3-fade { from { opacity: 0 } to { opacity: 1 } } }
      `}</style>
    </div>
  );
}
