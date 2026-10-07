import React from "react";
import Image from "next/image";
import type { ProjectItem } from "@/data/archive";

/* ============================================================================
 * 代码地图专属创意拓扑罗盘视窗 (Codebase Topology Radar Plate)
 * 工业蓝图与寻路雷达视觉风格，生动呈现“传统盲搜走弯路 vs 地图一秒直达目标”的对比
 * ==========================================================================*/
function AgentProjectMapGraphic() {
  return (
    <div className="relative w-full h-full">
      {/* 蓝图背景微网格与雷达脉冲同心圆 */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full border border-emerald-500/[0.07] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border border-emerald-500/[0.03] pointer-events-none" />

      <div className="relative w-full h-full p-5 sm:p-6 text-xs flex flex-col justify-between">
        {/* 顶栏：雷达抬头与状态标 */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/[0.07] pb-3 text-[11px] font-mono">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-white font-medium tracking-wider">TOPOLOGY RADAR // yq-map</span>
            <span className="text-neutral-500 hidden sm:inline">· 代码库寻路罗盘</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <span>AI 航向校准 · 0 依赖</span>
          </div>
        </div>

        {/* 中部核心视觉画布：直观生动的路径寻路对比图 */}
        <div className="relative z-10 my-auto py-2">
          <svg viewBox="0 0 520 120" className="w-full h-auto overflow-visible">
            <defs>
              <linearGradient id="emeraldBeam" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="1" />
              </linearGradient>
              <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* 1. 上路径（红色虚线·传统盲搜走弯路） */}
            <path
              d="M 125 45 Q 200 10, 270 35 T 390 28"
              fill="none"
              stroke="rgba(244, 63, 94, 0.45)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            {/* 红路径说明气泡 */}
            <g transform="translate(230, 8)">
              <rect x="0" y="0" width="105" height="18" rx="4" fill="#1c0e13" stroke="rgba(244,63,94,0.35)" strokeWidth="1" />
              <text x="52" y="12" fill="#fda4af" fontSize="9" textAnchor="middle" fontFamily="monospace">盲搜 50+ 文件 ✕</text>
            </g>

            {/* 2. 下路径（绿色实线激光·看地图一秒直达） */}
            <path
              d="M 125 75 C 220 75, 270 88, 385 88"
              fill="none"
              stroke="#10b981"
              strokeWidth="3.5"
              opacity="0.3"
              filter="url(#laserGlow)"
            />
            <path
              d="M 125 75 C 220 75, 270 88, 385 88"
              fill="none"
              stroke="url(#emeraldBeam)"
              strokeWidth="2.2"
            />
            {/* 动态脉冲激光流光 (Laser Beam Flow Pulse) */}
            <path
              d="M 125 75 C 220 75, 270 88, 385 88"
              fill="none"
              stroke="#a7f3d0"
              strokeWidth="2.6"
              strokeDasharray="60 220"
              strokeLinecap="round"
              className="animate-beam-flow"
              filter="url(#laserGlow)"
            />

            {/* 绿路径说明气泡 */}
            <g transform="translate(210, 68)">
              <rect x="0" y="0" width="125" height="20" rx="4" fill="#061c14" stroke="rgba(16,185,129,0.45)" strokeWidth="1" />
              <text x="62" y="13" fill="#6ee7b7" fontSize="9.5" textAnchor="middle" fontFamily="monospace">MAP.md 锚点一秒直达 ✓</text>
            </g>

            {/* 左侧：AI 发起端节点 */}
            <g transform="translate(10, 38)">
              <rect x="0" y="0" width="115" height="44" rx="6" fill="#11131a" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
              <text x="14" y="18" fill="#94a3b8" fontSize="9" fontFamily="monospace">INPUT PROMPT</text>
              <text x="14" y="33" fill="#ffffff" fontSize="11" fontWeight="500">🤖 AI 编程助手</text>
              <circle cx="115" cy="22" r="3" fill="#38bdf8" />
            </g>

            {/* 右上：盲搜死胡同节点 */}
            <g transform="translate(390, 8)">
              <rect x="0" y="0" width="120" height="36" rx="6" fill="#1c0e13" stroke="rgba(244,63,94,0.35)" strokeWidth="1" strokeDasharray="3 3" />
              <text x="12" y="15" fill="#f43f5e" fontSize="9" fontFamily="monospace">TOKEN EXHAUSTED</text>
              <text x="12" y="28" fill="#fda4af" fontSize="10">上下文浪费 / 改错 ✕</text>
            </g>

            {/* 右下：地图直达目标靶心节点 */}
            <g transform="translate(385, 66)">
              <rect x="0" y="0" width="125" height="42" rx="6" fill="#062117" stroke="#10b981" strokeWidth="1.2" />
              <circle cx="18" cy="21" r="9" fill="none" stroke="#34d399" strokeWidth="1" opacity="0.4" className="animate-ping" />
              <circle cx="18" cy="21" r="6" fill="#10b981" opacity="0.35" className="animate-pulse" />
              <circle cx="18" cy="21" r="3" fill="#34d399" />
              <text x="30" y="17" fill="#34d399" fontSize="9" fontFamily="monospace">TARGET LOCKED</text>
              <text x="30" y="31" fill="#ffffff" fontSize="10.5" fontWeight="500">🎯 精确锁定目标行</text>
            </g>
          </svg>
        </div>

        {/* 底部指标栏：极简数据胶囊 */}
        <div className="relative z-10 pt-3 border-t border-white/[0.07] flex items-center justify-between font-mono text-[10px] sm:text-[11px] text-neutral-400">
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-500">寻路损耗</span>
              <strong className="text-emerald-400 font-normal">-82% 杜绝浪费</strong>
            </div>
            <div className="flex items-center gap-1.5 hidden sm:flex">
              <span className="text-neutral-500">定位速度</span>
              <strong className="text-white font-normal">1秒锁定</strong>
            </div>
          </div>
          <div className="text-neutral-500">
            Cursor · Claude Code · Windsurf
          </div>
        </div>
      </div>
    </div>
  );
}

/** 纯粹作品图版：裸内容呈现界面原本的工业美感与透气感 */
export function MinimalWorkMedia({ project }: { project: ProjectItem }) {
  if (project.id === "agent-project-map") {
    return <AgentProjectMapGraphic />;
  }

  return (
    <div className="relative w-full h-full">
      {project.coverImage ? (
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          sizes="(min-width: 1024px) 56vw, 92vw"
          className="object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity duration-700 ease-out"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center font-mono text-xs text-neutral-600">
          [ INTERFACE PREVIEW ]
        </div>
      )}
    </div>
  );
}
