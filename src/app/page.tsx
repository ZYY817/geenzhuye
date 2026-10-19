"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { ARCHIVE_PROJECTS, SYSTEM_METRICS } from "@/data/archive";
import { HeroTypewriter } from "@/components/site/HeroTypewriter";
import { MediaPlate } from "@/components/site/MediaPlate";
import { MaskedLine, TextBlock } from "@/components/site/TextBlocks";
import { YuqiInteractiveWebDemo } from "@/components/site/YuqiDemo";
import { MinimalWorkMedia } from "@/components/site/ProjectVisuals";
import { ProjectText } from "@/components/site/ProjectText";
import { EASE_SILK } from "@/components/site/motion";

export default function Home() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  // 分级揭幕：大屏上多块同屏时按序出场，而非同时弹开
  const [revealStage, setRevealStage] = useState(0);

  // 挂载信标：layout 内联兜底脚本以此判断 React 是否已接管 DOM
  // 若兜底在 hydration 慢时已先触发，挂载后清除它以恢复正常动效
  useEffect(() => {
    document.documentElement.dataset.appMounted = "true";
    document.documentElement.classList.remove("reveal-fallback");
  }, []);

  // 内容闸门：打字完成 → 正常揭幕；用户急于下滚 → 视为跳过开场；5.2s 保险丝兜底
  useEffect(() => {
    if (contentReady) return;
    const onScroll = () => {
      if (window.scrollY > 360) setContentReady(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const failsafe = window.setTimeout(() => setContentReady(true), 5200);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(failsafe);
    };
  }, [contentReady]);

  // 揭幕序列：01 立即，其后每 ~0.5s 解锁一级（02→03→04）
  useEffect(() => {
    if (!contentReady) return;
    const timers = [
      window.setTimeout(() => setRevealStage(1), 0),
      window.setTimeout(() => setRevealStage(2), 480),
      window.setTimeout(() => setRevealStage(3), 960),
      window.setTimeout(() => setRevealStage(4), 1440),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [contentReady]);

  const copyEmail = () => {
    navigator.clipboard?.writeText(SYSTEM_METRICS.socials.email).catch(() => {});
    setCopiedEmail(true);
    window.setTimeout(() => setCopiedEmail(false), 2000);
  };

  const project01 = ARCHIVE_PROJECTS.find((p) => p.id === "yuqi-engine") || ARCHIVE_PROJECTS[0];
  const project02 = ARCHIVE_PROJECTS.find((p) => p.id === "agent-project-map") || ARCHIVE_PROJECTS[1];
  const project03 = ARCHIVE_PROJECTS.find((p) => p.id === "yuqi-team-orchestrator") || ARCHIVE_PROJECTS[2];
  const project04 = ARCHIVE_PROJECTS.find((p) => p.id === "qilan-atlas") || ARCHIVE_PROJECTS[3];
  const project05 = ARCHIVE_PROJECTS.find((p) => p.id === "spec-forge") || ARCHIVE_PROJECTS[4];
  const project06 = ARCHIVE_PROJECTS.find((p) => p.id === "zy-anti-slop-frontend-design") || ARCHIVE_PROJECTS[5];
  const project07 = ARCHIVE_PROJECTS.find((p) => p.id === "yike-album-downloader") || ARCHIVE_PROJECTS[6];
  const project08 = ARCHIVE_PROJECTS.find((p) => p.id === "flyykjxzq") || ARCHIVE_PROJECTS[7];
  const project09 = ARCHIVE_PROJECTS.find((p) => p.id === "enterprise-efficiency-suite") || ARCHIVE_PROJECTS[8];

  return (
    <div className="min-h-screen w-full bg-[#050507] text-[#f4f4f5] selection:bg-white selection:text-black font-sans antialiased relative overflow-x-hidden">
      {/* 极简顶栏：YQ 印记 + 联系方式，无生硬分割线 */}
      <motion.header
        data-fallback-reveal
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_SILK }}
        className="w-full max-w-6xl mx-auto px-6 sm:px-12 py-10 sm:py-14 flex items-center justify-between"
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

        <div className="flex items-center gap-5 sm:gap-8 font-mono text-xs text-neutral-400">
          <button
            onClick={copyEmail}
            className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 group"
          >
            {copiedEmail ? (
              <>
                <Check className="w-3 h-3 text-white" />
                <span className="text-white">已复制</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline hover:underline underline-offset-4">{SYSTEM_METRICS.socials.email}</span>
                <span className="sm:hidden hover:underline underline-offset-4">EMAIL</span>
                <Copy className="w-3 h-3 opacity-40 group-hover:opacity-90 transition-opacity" />
              </>
            )}
          </button>

          <a
            href={SYSTEM_METRICS.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-0.5"
          >
            <span>GitHub</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
          <a
            href={SYSTEM_METRICS.socials.x}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors hidden sm:flex items-center gap-0.5"
          >
            <span>X</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
          <a
            href={SYSTEM_METRICS.socials.bilibili}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors hidden md:flex items-center gap-0.5"
          >
            <span>Bilibili</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </motion.header>

      {/* ============================================================== */}
      {/* 第一幕 · 开场：纯文字自白，第一行先出，第二行随后敲出            */}
      {/* ============================================================== */}
      <section className="w-full max-w-6xl mx-auto px-6 sm:px-12 pt-10 sm:pt-16 pb-16 sm:pb-24">
        <div className="max-w-3xl">
          <HeroTypewriter onReady={() => setContentReady(true)} />
        </div>
      </section>

      {/* ============================================================== */}
      {/* 第二幕 · 作品长卷：图版与文字错落展开                           */}
      {/* ============================================================== */}
      <main className="relative w-full max-w-6xl mx-auto px-6 sm:px-12 space-y-28 sm:space-y-36 pb-20">

        {/* 作品 01 · 宇奇引擎 [左图版右文] */}
        <section
          id="project-01"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
        >
          <MediaPlate
            gate={revealStage >= 1}
            ratio="1200 / 780"
            className="lg:col-span-7"
            footer={
              <>
                <span className="text-neutral-400">
                  在线 Web 架构 Demo · 支持直接点击操作
                </span>
                <div className="flex items-center gap-4">
                  {project01.links.website && (
                    <a
                      href={project01.links.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1 group/link"
                    >
                      <span>官网</span>
                      <ArrowUpRight className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                  )}
                  <a
                    href={project01.links.bilibili || "/yuqi-web-demo/index.html"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1 group/link"
                  >
                    <span>Bilibili 演示</span>
                    <ArrowUpRight className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </>
            }
          >
            <YuqiInteractiveWebDemo boot={contentReady} />
          </MediaPlate>

          <TextBlock gate={revealStage >= 1} className="lg:col-span-5 flex flex-col justify-center space-y-4 text-left">
            <ProjectText
              size="lg"
              label="01 // 模块化系统优化"
              project={project01}
              spec="C# · .NET 8 Native x64 · 600+ GitHub Stars"
              extraLinks={[{ href: "/yuqi-web-demo/index.html", label: "全屏运行 Demo" }]}
            />
          </TextBlock>
        </section>

        {/* 作品 02 · 代码库拓扑导图 [错落：左文右版] */}
        <section
          id="project-02"
          className="work-section grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
        >
          <TextBlock gate={revealStage >= 2} className="lg:col-span-5 flex flex-col justify-center space-y-4 text-left order-2 lg:order-1">
            <ProjectText
              size="lg"
              label="02 // AI IDE 项目地图"
              project={project02}
              spec="Single-file Agent Skill · Zero Dependency · yq-map"
            />
          </TextBlock>

          <MediaPlate gate={revealStage >= 2} ratio="16 / 9" glow="rgba(16,185,129,0.06)" className="lg:col-span-7 order-1 lg:order-2">
            <MinimalWorkMedia project={project02} />
          </MediaPlate>
        </section>

        {/* 作品 03 · 多智能体编排调度器 [错落：左版右文] */}
        <section
          id="project-03"
          className="work-section grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
        >
          <MediaPlate gate={revealStage >= 3} ratio="16 / 9" className="lg:col-span-7">
            <MinimalWorkMedia project={project03} />
          </MediaPlate>

          <TextBlock gate={revealStage >= 3} className="lg:col-span-5 flex flex-col justify-center space-y-4 text-left">
            <ProjectText
              size="lg"
              label="03 // 多智能体任务调度"
              project={project03}
              spec="TypeScript · Durable Task Graph · DeepSeek Harness"
            />
          </TextBlock>
        </section>

        {/* 作品 04 · 奇览 视觉语言图谱 [错落：左文右版] */}
        <section
          id="project-04"
          className="work-section grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
        >
          <TextBlock gate={revealStage >= 4} className="lg:col-span-5 flex flex-col justify-center space-y-4 text-left order-2 lg:order-1">
            <ProjectText
              size="lg"
              label="04 // 视觉风格参考库"
              project={project04}
              spec="537 个概念词条 · 264 种风格 · 画廊/索引双模 · CN & EN 双语"
            />
          </TextBlock>

          <MediaPlate gate={revealStage >= 4} ratio="16 / 10" glow="rgba(140,160,255,0.07)" className="lg:col-span-7 order-1 lg:order-2">
            <MinimalWorkMedia project={project04} />
          </MediaPlate>
        </section>

        {/* 纯文字精炼展卷：需求锻造台 & AI 前端反平庸设计知识库 */}
        <section className="work-section pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            <TextBlock gate={contentReady} id="project-05" className="space-y-3.5 text-left">
              <ProjectText label="05 // 需求规范与产品文档" project={project05} />
            </TextBlock>
            <TextBlock gate={contentReady} id="project-06" className="space-y-3.5 text-left">
              <ProjectText label="06 // 前端美学与提示词指南" project={project06} />
            </TextBlock>
          </div>
        </section>

        {/* 实用开源工具组：一刻相册批量下载 & 修改器快捷下载器 */}
        <section className="work-section pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            <TextBlock gate={contentReady} id="project-07" className="space-y-3.5 text-left">
              <ProjectText label="7 // 批量导出工具" project={project07} />
            </TextBlock>
            <TextBlock gate={contentReady} id="project-08" className="space-y-3.5 text-left">
              <ProjectText label="08 // 单机游戏辅助" project={project08} />
            </TextBlock>
          </div>
        </section>

        {/* 项目 09 · 企业自动化增效工具集（内部交付，无公开演示） */}
        <section className="work-section pt-4">
          <TextBlock gate={contentReady} id="project-09" className="space-y-3.5 text-left md:max-w-xl">
            <ProjectText label="09 // 企业流程自动化" project={project09}>
              <MaskedLine i={4}>
                <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-xs text-neutral-500">
                  <span>商品文案生成</span>
                  <span className="text-neutral-700">·</span>
                  <span>智能评价助手</span>
                  <span className="text-neutral-700">·</span>
                  <span>批量记录筛选</span>
                  <span className="text-neutral-700">·</span>
                  <span>意图评论生成</span>
                  <span className="text-neutral-700">·</span>
                  <span>等十余款</span>
                </div>
              </MaskedLine>
              <MaskedLine i={5}>
                <div className="font-mono text-[11px] text-neutral-600 tracking-wide">
                  企业内部交付 · 无公开演示 · 流程拆解逻辑可复用
                </div>
              </MaskedLine>
            </ProjectText>
          </TextBlock>
        </section>
      </main>

      {/* ============================================================== */}
      {/* 第三幕 · 尾声：纯粹名字与联系方式，无多余口号                    */}
      {/* ============================================================== */}
      <footer className="w-full max-w-6xl mx-auto px-6 sm:px-12 py-20 sm:py-28 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-8 font-mono text-xs text-neutral-400">
        <div className="space-y-2">
          <div className="text-white text-sm font-normal">智宇</div>
          <div>
            <button
              onClick={copyEmail}
              className="hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5 group"
            >
              {SYSTEM_METRICS.socials.email}
              <Copy className="w-3 h-3 opacity-40 group-hover:opacity-90 transition-opacity" />
            </button>
          </div>
          <div className="text-neutral-600">{SYSTEM_METRICS.manifesto}</div>
        </div>

        <div className="flex items-center gap-6 sm:gap-8">
          <a
            href={SYSTEM_METRICS.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub ↗
          </a>
          <a
            href={SYSTEM_METRICS.socials.x}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            X ↗
          </a>
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
          <span className="text-neutral-600">© 2026</span>
        </div>
      </footer>
    </div>
  );
}
