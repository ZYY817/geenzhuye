"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpRight, Copy, Check, MessageSquare } from "lucide-react";
import { SYSTEM_METRICS } from "@/data/archive";

/* ============================================================================
 * 头部欢迎与自白 (Hero Intro & Profile Direct Entry)
 * ----------------------------------------------------------------------------
 * 风格对齐真实、真诚、大白话直奔主题（破冰打招呼 + 身份共鸣 + 实在战绩 + 快捷直达）
 * ==========================================================================*/

export function HeroTypewriter({ onReady }: { onReady?: () => void }) {
  const [copiedWechat, setCopiedWechat] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    // 页面进入即就绪，内容顺畅铺开无卡顿等待
    const timer = window.setTimeout(() => {
      onReady?.();
    }, 120);
    return () => window.clearTimeout(timer);
  }, [onReady]);

  const copyWechat = () => {
    const wx = SYSTEM_METRICS.socials.wechat || "zhiyuydyh";
    navigator.clipboard?.writeText(wx).catch(() => {});
    setCopiedWechat(true);
    window.setTimeout(() => setCopiedWechat(false), 2200);
  };

  const copyEmail = () => {
    navigator.clipboard?.writeText(SYSTEM_METRICS.socials.email).catch(() => {});
    setCopiedEmail(true);
    window.setTimeout(() => setCopiedEmail(false), 2200);
  };

  return (
    <div className="space-y-6">
      {/* 头部大标题：直接真诚打招呼 */}
      <div className="space-y-2.5">
        <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white flex items-center gap-2 flex-wrap">
          <span>👋 可以叫我智宇 or ZYY817</span>
        </h1>
        <p className="text-sm sm:text-base text-neutral-300 font-light">
          一个希望用自己的经验帮到普通人的普通人。
        </p>
      </div>

      {/* 核心大白话自述 */}
      <div className="space-y-2.5 text-xs sm:text-[14px] text-neutral-400 font-light leading-relaxed max-w-2xl">
        <p>
          平时除了写代码、做工具，我也很喜欢把摸索出来的经验和思考思路毫无保留地分享出来。
        </p>
        <p>
          我的思路其实很简单：把自己踩过的坑、解决过的问题实实在在做成工具；同时借助 AI，去做那些以前一个人从没做到过的新事情。
        </p>
        <p>
          做出的 Windows 模块化优化工具<span className="text-neutral-200 font-normal">「宇奇引擎」已有超 10 万人下载使用</span>。平时我会在 B 站和抖音持续分享实战经验、开发日常与思考思路，希望能给同样在探索的朋友一点实在的启发与参考。
        </p>
      </div>

      {/* 快捷联系与直达入口行（微信、B站、抖音、GitHub、邮箱） */}
      <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3 font-mono text-xs">
        {/* 微信快速复制 */}
        <button
          onClick={copyWechat}
          type="button"
          className="px-3.5 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 hover:border-neutral-700 hover:text-white text-neutral-300 transition-all flex items-center gap-1.5 cursor-pointer group shadow-sm"
        >
          {copiedWechat ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">已复制微信: {SYSTEM_METRICS.socials.wechat}</span>
            </>
          ) : (
            <>
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400/80 group-hover:text-emerald-400 transition-colors" />
              <span>微信：{SYSTEM_METRICS.socials.wechat}</span>
              <Copy className="w-3 h-3 opacity-40 group-hover:opacity-90 transition-opacity" />
            </>
          )}
        </button>

        {/* B站 */}
        <a
          href={SYSTEM_METRICS.socials.bilibili}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 hover:border-neutral-700 hover:text-white text-neutral-300 transition-all flex items-center gap-1.5 shadow-sm group"
        >
          <span>📺</span>
          <span>B站：{SYSTEM_METRICS.socials.bilibiliHandle || "智宇丶817"}</span>
          <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>

        {/* 抖音 */}
        <a
          href={SYSTEM_METRICS.socials.douyin}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 hover:border-neutral-700 hover:text-white text-neutral-300 transition-all flex items-center gap-1.5 shadow-sm group"
        >
          <span>🎵</span>
          <span>抖音：{SYSTEM_METRICS.socials.douyinId || "35071658"}</span>
          <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>

        {/* GitHub */}
        <a
          href={SYSTEM_METRICS.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 hover:border-neutral-700 hover:text-white text-neutral-300 transition-all flex items-center gap-1.5 shadow-sm group"
        >
          <span>🐙</span>
          <span>GitHub</span>
          <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>

        {/* 邮箱 */}
        <button
          onClick={copyEmail}
          type="button"
          className="px-3.5 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 hover:border-neutral-700 hover:text-white text-neutral-300 transition-all flex items-center gap-1.5 cursor-pointer group shadow-sm"
        >
          {copiedEmail ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">已复制邮箱</span>
            </>
          ) : (
            <>
              <span>✉️</span>
              <span>邮箱</span>
              <Copy className="w-3 h-3 opacity-40 group-hover:opacity-90 transition-opacity" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
