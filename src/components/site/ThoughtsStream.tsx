"use client";

import React from "react";
import { ArrowUpRight, Play, MessageSquareQuote, Sparkles } from "lucide-react";
import { SYSTEM_METRICS } from "@/data/archive";

interface ThoughtItem {
  index: string;
  topic: string;
  summary: string;
  source: "Bilibili" | "抖音" | "工程手记";
  link: string;
  tag: string;
}

const THOUGHTS: ThoughtItem[] = [
  {
    index: "01",
    topic: "系统调优的本质：为什么优化必须‘先读真实状态，再做可逆选择’？",
    summary: "聊聊做《宇奇引擎》的根本思考。市面上很多一键优化工具容易改坏系统；好工具的第一准则是‘看清楚、可验证、能恢复’，不造流氓虚概念。",
    source: "Bilibili",
    link: SYSTEM_METRICS.socials.bilibili,
    tag: "系统工匠哲学",
  },
  {
    index: "02",
    topic: "多智能体任务图调度：怎样防止多个 AI 编造逻辑与中途卡死？",
    summary: "单打独斗的 Prompt 很容易在复杂工程中迷失。怎样用控制器把大目标拆成有向无环图，并做 Fail-closed 证据校验分头推进？",
    source: "工程手记",
    link: "https://github.com/ZYY817/Yuqi-Team-Orchestrator",
    tag: "Multi-Agent 协作",
  },
  {
    index: "03",
    topic: "给 AI IDE 装上‘代码地图’：如何让 Cursor、Claude Code 省下 80% 上下文？",
    summary: "做 yq-map 的踩坑总结：用单文件建立语义锚点与自检索引，让大模型不再大海捞针乱读无用文件，大幅提升定位精度与编程速度。",
    source: "抖音",
    link: SYSTEM_METRICS.socials.douyin,
    tag: "开发提效思考",
  },
  {
    index: "04",
    topic: "AI 时代的独立产品，怎样避免做成千篇一律的‘平庸模板站’？",
    summary: "当所有人都能一键生成网页时，真正打动人的是克制的版式呼吸感、精确到毫秒的交互手感与真诚不端着的大白话表达。",
    source: "工程手记",
    link: "https://github.com/ZYY817/zy-anti-slop-frontend-design",
    tag: "美学与质感",
  },
];

export function ThoughtsStream() {
  return (
    <section className="relative w-full max-w-6xl mx-auto px-6 sm:px-12 py-12 sm:py-16">
      {/* 标题栏 */}
      <div className="pb-8 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-neutral-400 tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span>02 // THOUGHTS & EXPERIENCE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light text-white tracking-tight mt-2 flex items-center gap-2.5">
            <span>平时经验与思考分享</span>
            <span className="text-xs font-mono text-neutral-500 font-normal">/ KNOWLEDGE & SHARING</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1.5 max-w-xl">
            做工具，也分享经验。在 B 站与抖音分享真实的踩坑教训、底层思路与 AI 实战心得。
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <a
            href={SYSTEM_METRICS.socials.bilibili}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1 group"
          >
            <span>前往 B站 空间</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
          <span className="text-neutral-700">·</span>
          <a
            href={SYSTEM_METRICS.socials.douyin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1 group"
          >
            <span>前往 抖音 主页</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* 思考网格：干净纯粹、间距舒适 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-6">
        {THOUGHTS.map((thought) => (
          <a
            key={thought.index}
            href={thought.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-6 rounded-xl border border-white/[0.06] bg-white/[0.015] hover:bg-white/[0.035] hover:border-white/[0.14] transition-all duration-300 flex flex-col justify-between gap-4 shadow-sm"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
                <span>{thought.index} // {thought.tag}</span>
                <span className="px-2 py-0.5 rounded border border-white/[0.08] bg-white/[0.03] text-neutral-400 group-hover:text-white transition-colors">
                  {thought.source} ↗
                </span>
              </div>
              <h3 className="text-base font-normal text-white group-hover:text-emerald-300 transition-colors leading-snug">
                {thought.topic}
              </h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                {thought.summary}
              </p>
            </div>

            <div className="pt-2 flex items-center gap-1 text-[11px] font-mono text-neutral-500 group-hover:text-white transition-colors">
              <span>阅读详情或观看视频</span>
              <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
