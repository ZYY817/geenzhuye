"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import { ArrowUpRight, ChevronDown, Sparkles, ExternalLink, Terminal, Layers, Eye } from "lucide-react";
import { ARCHIVE_PROJECTS, ProjectItem } from "@/data/archive";

export function WorkStream() {
  const [hoveredProject, setHoveredProject] = useState<ProjectItem | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [isMouseOver, setIsMouseOver] = useState(false);

  // 鼠标弹簧物理跟随
  const mouseX = useSpring(0, { stiffness: 280, damping: 26 });
  const mouseY = useSpring(0, { stiffness: 280, damping: 26 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // 浮窗保持在鼠标右上方微偏移位置
      mouseX.set(e.clientX + 24);
      mouseY.set(e.clientY - 120);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const categories = [
    { key: "ALL", label: "全部 ALL" },
    { key: "SYSTEM", label: "系统调校 SYSTEM" },
    { key: "AGENT", label: "AI 智能体 AGENT" },
    { key: "DEV TOOL", label: "开发工具 TOOL" },
    { key: "DESIGN", label: "设计图谱 DESIGN" },
  ];

  const filteredProjects = activeCategory === "ALL"
    ? ARCHIVE_PROJECTS
    : ARCHIVE_PROJECTS.filter((p) => p.category === activeCategory);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="relative w-full max-w-6xl mx-auto px-6 sm:px-12 py-12 sm:py-16">
      {/* 顶部指示区与分类筛选 */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-neutral-400 tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>01 // CRAFT & PROJECTS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light text-white tracking-tight mt-2 flex items-center gap-2.5">
            <span>作品与实用工具</span>
            <span className="text-xs font-mono text-neutral-500 font-normal">/ {ARCHIVE_PROJECTS.length} ITEMS</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1.5 max-w-xl">
            简单罗列，拒绝大图霸屏。悬停可唤醒视觉预览，轻点条目可展开详细解法与参数。
          </p>
        </div>

        {/* 极简分类标签药丸 */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`relative px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "text-white font-medium"
                    : "text-neutral-400 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="category-pill"
                    className="absolute inset-0 rounded-full border border-white/20 bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 核心作品流列表 (纯净、信息层级清晰、悬停磁吸觉醒) */}
      <div
        className="divide-y divide-white/[0.06] relative"
        onMouseEnter={() => setIsMouseOver(true)}
        onMouseLeave={() => {
          setIsMouseOver(false);
          setHoveredProject(null);
        }}
      >
        {filteredProjects.map((project) => {
          const isExpanded = expandedId === project.id;
          const isHovered = hoveredProject?.id === project.id;

          return (
            <div
              key={project.id}
              className="relative group transition-colors"
              onMouseEnter={() => setHoveredProject(project)}
            >
              {/* 悬停平滑光斑底板 */}
              {isHovered && (
                <motion.div
                  layoutId="hover-stream-bg"
                  className="absolute -inset-x-3 -inset-y-1 bg-white/[0.025] border border-white/[0.06] rounded-xl pointer-events-none -z-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}

              {/* 单行主视图：默认纯粹文字信息 */}
              <div
                onClick={() => toggleExpand(project.id)}
                className="py-5 sm:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
              >
                {/* 序号与标题 */}
                <div className="flex items-start sm:items-center gap-4 sm:gap-6 min-w-0 md:max-w-md lg:max-w-lg">
                  <span className="font-mono text-xs text-neutral-500 pt-0.5 sm:pt-0">
                    {project.index}
                  </span>
                  <div>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-base sm:text-lg font-light text-white group-hover:text-emerald-300 transition-colors">
                        {project.title}
                      </span>
                      <span className="text-xs font-mono text-neutral-500">
                        / {project.englishTitle}
                      </span>
                      {project.status === "LIVE" && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                          LIVE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 font-light mt-1 line-clamp-1">
                      {project.tagline}
                    </p>
                  </div>
                </div>

                {/* 右侧规格与快捷入口 */}
                <div className="flex items-center justify-between md:justify-end gap-5 sm:gap-8 font-mono text-xs text-neutral-400">
                  {/* 特别高光参数 */}
                  <span className="text-[11px] text-neutral-500 hidden lg:inline">
                    {project.specs[0]?.value || project.categoryLabel}
                  </span>

                  <span className="text-neutral-500 text-xs">
                    {project.year}
                  </span>

                  {/* 直达外链 */}
                  <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    {project.links.website && (
                      <a
                        href={project.links.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white underline underline-offset-4 hover:text-emerald-300 transition-colors flex items-center gap-0.5"
                      >
                        <span>官网</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-white transition-colors flex items-center gap-0.5"
                      >
                        <span>GitHub</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                    {project.links.demo && (
                      <a
                        href={project.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-white transition-colors flex items-center gap-0.5"
                      >
                        <span>体验</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* 展开/收起详情切换微图标 */}
                  <div className="text-neutral-500 group-hover:text-white transition-colors p-1">
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isExpanded ? "rotate-180 text-emerald-400" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* 展开态：丝滑抽屉展开，展示完整解题思路、架构图与深度参数 */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2 pb-8 px-4 sm:px-6 my-2 rounded-xl bg-white/[0.015] border border-white/[0.06] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                      {/* 左侧说明文字与参数 */}
                      <div className="lg:col-span-7 space-y-4">
                        <div>
                          <div className="font-mono text-[11px] text-emerald-400/90 tracking-wider">
                            DETAIL // {project.categoryLabel}
                          </div>
                          <p className="text-sm text-neutral-300 font-light leading-relaxed mt-2">
                            {project.description}
                          </p>
                        </div>

                        {/* 规格清单 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-xs">
                          {project.specs.map((s, idx) => (
                            <div key={idx} className="p-2.5 rounded bg-white/[0.02] border border-white/[0.04]">
                              <div className="text-[10px] text-neutral-500 uppercase">{s.label}</div>
                              <div className="text-neutral-200 mt-0.5">{s.value}</div>
                            </div>
                          ))}
                        </div>

                        {/* 标签流 */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {project.tags.map((t, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/[0.04] text-neutral-400 border border-white/[0.04]"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>

                        {/* 展开后的快捷操作 */}
                        <div className="pt-2 flex flex-wrap items-center gap-4 font-mono text-xs">
                          {project.id === "yuqi-engine" && (
                            <a
                              href="/yuqi-web-demo/index.html"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 rounded-lg bg-white text-black font-medium hover:bg-neutral-200 transition-colors flex items-center gap-1.5 shadow-sm"
                            >
                              <span>全屏运行 Web 架构 Demo</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {project.links.website && (
                            <a
                              href={project.links.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 rounded-lg border border-white/20 bg-white/[0.05] hover:bg-white/[0.1] text-white transition-colors flex items-center gap-1.5"
                            >
                              <span>访问官方网站</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {project.links.github && (
                            <a
                              href={project.links.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 rounded-lg border border-white/10 hover:border-white/30 text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5"
                            >
                              <span>GitHub 仓库</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* 右侧微缩视觉图版 */}
                      <div className="lg:col-span-5">
                        <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden border border-white/10 bg-[#0a0b0f] shadow-2xl">
                          {project.coverImage ? (
                            <Image
                              src={project.coverImage}
                              alt={project.title}
                              fill
                              className="object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500 font-mono text-xs p-6 text-center">
                              <Terminal className="w-8 h-8 text-neutral-600 mb-2" />
                              <span>{project.title}</span>
                              <span className="text-[10px] text-neutral-600 mt-1">{project.englishTitle}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* 桌面端顶级细节：随光标丝滑悬浮的取景窗 (Floating Viewfinder Lens) */}
      <AnimatePresence>
        {isMouseOver && hoveredProject && !expandedId && (
          <motion.div
            style={{ x: mouseX, y: mouseY }}
            initial={{ opacity: 0, scale: 0.92, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(2px)" }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed pointer-events-none z-50 hidden md:block w-72 rounded-xl p-2.5 bg-[#090a0f]/90 border border-white/20 backdrop-blur-xl shadow-[0_24px_50px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.15)]"
          >
            {/* 取景预览图 */}
            <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden border border-white/10 bg-neutral-900 mb-2.5">
              {hoveredProject.coverImage ? (
                <Image
                  src={hoveredProject.coverImage}
                  alt={hoveredProject.title}
                  fill
                  className="object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-neutral-950 font-mono text-xs text-neutral-500">
                  <span>{hoveredProject.englishTitle}</span>
                </div>
              )}
              {/* 浮窗角标 */}
              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-mono text-neutral-300">
                {hoveredProject.category}
              </div>
            </div>

            {/* 浮窗文字概览 */}
            <div className="px-1 space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-medium">{hoveredProject.title}</span>
                <span className="text-emerald-400 text-[10px]">{hoveredProject.year}</span>
              </div>
              <p className="text-[11px] text-neutral-400 font-light line-clamp-2 leading-relaxed">
                {hoveredProject.tagline}
              </p>
              <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-neutral-500 border-t border-white/[0.06] mt-2">
                <span>轻点条目查看解法</span>
                <span className="text-neutral-400">DETAIL ↗</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
