"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Sparkles, Terminal, Flame, BookOpen, Layers } from "lucide-react";
import { SYSTEM_METRICS } from "@/data/archive";
import { HeroTypewriter } from "@/components/site/HeroTypewriter";
import { WorkStream } from "@/components/site/WorkStream";
import { ThoughtsStream } from "@/components/site/ThoughtsStream";
import { EASE_SILK } from "@/components/site/motion";

export default function Home() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedWechat, setCopiedWechat] = useState(false);

  // 挂载信标：layout 内联兜底脚本以此判断 React 是否已接管 DOM
  useEffect(() => {
    document.documentElement.dataset.appMounted = "true";
    document.documentElement.classList.remove("reveal-fallback");
  }, []);

  const copyEmail = () => {
    navigator.clipboard?.writeText(SYSTEM_METRICS.socials.email).catch(() => {});
    setCopiedEmail(true);
    window.setTimeout(() => setCopiedEmail(false), 2000);
  };

  const copyWechat = () => {
    navigator.clipboard?.writeText(SYSTEM_METRICS.socials.wechat || "zhiyuydyh").catch(() => {});
    setCopiedWechat(true);
    window.setTimeout(() => setCopiedWechat(false), 2000);
  };

  return (
    <div className="min-h-screen w-full bg-[#050507] text-[#f4f4f5] selection:bg-white selection:text-black font-sans antialiased relative overflow-x-hidden">
      {/* 极简顶栏：YQ 印记 + 社交直达 / 微信复制 */}
      <motion.header
        data-fallback-reveal
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_SILK }}
        className="w-full max-w-6xl mx-auto px-6 sm:px-12 py-8 sm:py-10 flex items-center justify-between"
      >
        <div className="flex items-center gap-2.5 font-mono text-sm tracking-wider text-white font-normal">
          <Image
            src="/yuqi/logo.png"
            alt="YQ"
            width={22}
            height={22}
            className="invert"
            priority
          />
          智宇
        </div>

        <div className="flex items-center gap-4 sm:gap-7 font-mono text-xs text-neutral-400">
          {/* 微信快速复制 */}
          <button
            onClick={copyWechat}
            className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 group"
          >
            {copiedWechat ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-medium">已复制微信</span>
              </>
            ) : (
              <>
                <span className="hover:underline underline-offset-4">微信</span>
                <Copy className="w-3 h-3 opacity-40 group-hover:opacity-90 transition-opacity" />
              </>
            )}
          </button>

          <a
            href={SYSTEM_METRICS.socials.bilibili}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-0.5"
          >
            <span>Bilibili</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>

          <a
            href={SYSTEM_METRICS.socials.douyin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-0.5"
          >
            <span>抖音</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>

          <a
            href={SYSTEM_METRICS.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors hidden sm:flex items-center gap-0.5"
          >
            <span>GitHub</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>

          <button
            onClick={copyEmail}
            className="hover:text-white transition-colors cursor-pointer hidden md:flex items-center gap-1 group"
          >
            {copiedEmail ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-medium">已复制邮箱</span>
              </>
            ) : (
              <>
                <span className="hover:underline underline-offset-4">{SYSTEM_METRICS.socials.email}</span>
                <Copy className="w-3 h-3 opacity-40 group-hover:opacity-90 transition-opacity" />
              </>
            )}
          </button>
        </div>
      </motion.header>

      {/* ============================================================== */}
      {/* 第一幕 · 开场自白：真诚破冰 + 打字机哲学 + 一体化 HUD             */}
      {/* ============================================================== */}
      <section className="w-full max-w-6xl mx-auto px-6 sm:px-12 pt-6 sm:pt-12 pb-10 sm:pb-14">
        <div className="max-w-3xl space-y-6">
          <HeroTypewriter />

          {/* 核心数据标尺：用事实与战绩立住专业信服力 */}
          <div className="pt-2 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-xs text-neutral-500 border-t border-white/[0.06] mt-8">
            <div className="flex items-center gap-2">
              <span className="text-white font-medium text-sm">100,000+</span>
              <span>累积优化工具安装</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-medium text-sm">600+</span>
              <span>GitHub Stars</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-medium text-sm">9 款</span>
              <span>自研与开源工具集</span>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>全网持续分享实战经验</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 第二幕 · 核心作品流 (WorkStream · 纯净索引 + 磁吸取景窗 + 抽屉展开) */}
      {/* ============================================================== */}
      <main className="relative w-full">
        <WorkStream />

        {/* ============================================================ */}
        {/* 第三幕 · 思考与经验分享 (Thoughts & Experience)                */}
        {/* ============================================================ */}
        <ThoughtsStream />
      </main>

      {/* ============================================================== */}
      {/* 第四幕 · 尾声：纯粹名字与联系方式，克制收尾                      */}
      {/* ============================================================== */}
      <footer className="w-full max-w-6xl mx-auto px-6 sm:px-12 py-16 sm:py-24 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-8 font-mono text-xs text-neutral-400">
        <div className="space-y-2">
          <div className="text-white text-sm font-normal">智宇 · ZYY817</div>
          <div>
            <button
              onClick={copyEmail}
              className="hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5 group"
            >
              <span>{SYSTEM_METRICS.socials.email}</span>
              <Copy className="w-3 h-3 opacity-40 group-hover:opacity-90 transition-opacity" />
            </button>
          </div>
          <div className="text-neutral-500 text-[11px]">{SYSTEM_METRICS.manifesto}</div>
        </div>

        <div className="flex items-center gap-6 sm:gap-8">
          <button
            onClick={copyWechat}
            className="hover:text-white transition-colors cursor-pointer"
          >
            {copiedWechat ? "已复制微信" : "微信: zhiyuydyh"}
          </button>
          <a
            href={SYSTEM_METRICS.socials.bilibili}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Bilibili ↗
          </a>
          <a
            href={SYSTEM_METRICS.socials.douyin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Douyin ↗
          </a>
          <a
            href={SYSTEM_METRICS.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub ↗
          </a>
          <span className="text-neutral-600">© 2026</span>
        </div>
      </footer>
    </div>
  );
}
