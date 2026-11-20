/* ============================================================================
 * 首页三栏与详情页共用的项目清单（SPEC_V3_MINIMAL §10）
 * ----------------------------------------------------------------------------
 * 详情页正文（背景 / 定位 / 核心能力 / 构建 / 成果）在 stories.ts。
 * ==========================================================================*/

import { ARCHIVE_PROJECTS } from "@/data/archive";

export type Item = {
  id: string;
  name: string;
  line: string;
  stamp?: { label: string; value: string };
  preview?: string;
  /** 首页悬停用的局部裁剪图（同尺寸下字更大、看得清）；详情页仍用完整截图 */
  peek?: string;
  /** 宣传片：详情页替代截图（静音循环，可开声音）；首页悬停卡用 peek 里的短片 */
  video?: { src: string; poster: string };
  /** 可交互的网页版演示：详情页点一下在页内加载（iframe），w/h 为演示原生尺寸 */
  demo?: { src: string; poster: string; w: number; h: number };
  meta: string[];
  /** 英文版（SPEC §11.3）；详情页正文在 stories.ts */
  en?: { name: string; line: string; meta: string[] };
};

/* 按软件类型分组（2026-10-31 用户要求：不分"代表作"，按正常的工具类型分）。
 * 提交时刻：GitHub API 作者时间换算为北京时间（PLAN §14）。 */
export const COLS: { label: string; labelEn: string; items: Item[] }[] = [
  {
    label: "Windows 软件", labelEn: "Windows apps",
    items: [
      {
        id: "yuqi-engine", name: "宇奇引擎", line: "面向玩家的 Windows 优化工具，改动可一键还原",
        stamp: { label: "首次提交", value: "04:55" }, preview: "/projects/yuqi-engine.webp", peek: "/projects/yuqi-engine-peek.webp",
        demo: { src: "/yuqi-web-demo/index.html", poster: "/projects/yuqi-engine-demo.webp", w: 1280, h: 800 },
        video: { src: "/projects/yuqi-engine-promo.mp4", poster: "/projects/yuqi-engine-promo.webp" },
        meta: ["Windows 10 / 11", "C# / .NET 8", "GitHub 660+ 星"],
        en: {
          name: "YuqiEngine", line: "Windows optimizer for gamers, one-click undo",
          meta: ["Windows 10 / 11", "C# / .NET 8", "660+ GitHub stars"],
        },
      },
      {
        id: "yuqi-lite", name: "宇奇轻管", line: "Windows 后台管理工具，关掉的程序不会再复活",
        stamp: { label: "首次提交", value: "00:37" }, preview: "/projects/yuqi-lite.webp", peek: "/projects/yuqi-lite-peek.webp",
        meta: ["Windows 10 / 11", "C# / WPF"],
        en: {
          name: "Yuqi Lite", line: "Windows background-app manager, no comebacks",
          meta: ["Windows 10 / 11", "C# / WPF"],
        },
      },
      {
        id: "wanji-kit", name: "玩机装机工具", line: "游戏运行库一键检测安装，解决游戏打不开",
        preview: "/projects/wanji-kit.webp", peek: "/projects/wanji-kit-peek.webp",
        video: { src: "/projects/wanji-kit-promo.mp4", poster: "/projects/wanji-kit-promo.webp" },
        meta: ["Windows 10 / 11", "Flutter"],
        en: {
          name: "Wanji Kit", line: "One-click game runtimes, so games launch",
          meta: ["Windows 10 / 11", "Flutter"],
        },
      },
      {
        id: "aimframe", name: "AimFrame 准框", line: "把大屏缩成 24.5 寸比赛屏尺寸，一键应用与还原",
        preview: "/projects/aimframe.webp", peek: "/projects/aimframe-peek.webp",
        video: { src: "/projects/aimframe-promo.mp4", poster: "/projects/aimframe-promo.webp" },
        meta: ["Windows 10 / 11", "C# / WPF", "NVIDIA · AMD · Intel"],
        en: {
          name: "AimFrame", line: "Shrinks a big monitor to a 24.5″ esports size, applied and undone in one click",
          meta: ["Windows 10 / 11", "C# / WPF", "NVIDIA · AMD · Intel"],
        },
      },
      {
        id: "aiclean", name: "AIClean", line: "面向 AI 应用的 C 盘清理软件，对话和模型能迁去其他盘",
        preview: "/projects/aiclean.webp", peek: "/projects/aiclean-peek.webp",
        demo: { src: "/aiclean/index.html", poster: "/projects/aiclean-demo.webp", w: 1280, h: 800 },
        meta: ["Windows 10 / 11", "Go + WebView2", "单文件 exe · 6.1 MB"],
        en: {
          name: "AIClean", line: "A C: drive cleaner for AI apps — moves conversations and models off C:",
          meta: ["Windows 10 / 11", "Go + WebView2", "Single exe · 6.1 MB"],
        },
      },
    ],
  },
  {
    label: "AI 工程", labelEn: "AI engineering",
    items: [
      {
        id: "yuqi-team-orchestrator", name: "多智能体编排", line: "让多个 AI 分工协作、凭证据交付的调度插件",
        preview: "/projects/yuqi-team-orchestrator.webp",
        meta: ["DeepSeek Harness 插件", "TypeScript"],
        en: {
          name: "Team Orchestrator", line: "Multi-agent AI teamwork, verified by evidence",
          meta: ["DeepSeek Harness plugin", "TypeScript"],
        },
      },
      {
        id: "yuqi-token-guardian", name: "Token Guardian", line: "想省 DeepSeek token 的插件，实测没起作用，留作复盘",
        meta: ["DeepSeek Harness 插件", "已归档"],
        en: {
          name: "Token Guardian", line: "A plugin meant to cut DeepSeek token waste; measurements showed it didn’t work, kept as a postmortem",
          meta: ["DeepSeek Harness plugin", "Archived"],
        },
      },
      {
        id: "agent-project-map", name: "AI 项目地图", line: "给 AI 的项目地图，项目再大也能随时找到代码",
        preview: "/projects/agent-project-map.webp",
        meta: ["Agent Skill", "Claude Code / Codex / Cursor"],
        en: {
          name: "AI Project Map", line: "A project map for AI—find any code, however big",
          meta: ["Agent Skill", "Claude Code / Codex / Cursor"],
        },
      },
      {
        id: "enterprise-efficiency-suite", name: "企业增效工具集", line: "十余个企业流程 AI 自动化工具",
        meta: ["企业内部交付"],
        en: {
          name: "Enterprise Automation Kit", line: "Ten-plus AI tools for business workflows",
          meta: ["Delivered in-house"],
        },
      },
    ],
  },
  {
    label: "AI Skills", labelEn: "AI skills",
    items: [
      {
        id: "spec-forge", name: "需求锻造台", line: "把会议记录整理成规范需求文档的 AI Skill",
        preview: "/projects/spec-forge.webp",
        meta: ["AI Skill", "中文 / English"],
        en: {
          name: "SpecForge", line: "AI skill: meeting notes into clear specs",
          meta: ["AI skill", "Chinese / English"],
        },
      },
      {
        id: "work-report-skill", name: "工作汇报 Skill", line: "自动整理周报月报的 AI Skill，状态如实",
        preview: "/projects/work-report-skill.webp",
        meta: ["AI Skill", "无运行时依赖"],
        en: {
          name: "Work Report Skill", line: "AI skill for honest weekly and monthly reports",
          meta: ["AI skill", "No runtime dependencies"],
        },
      },
      {
        id: "zy-anti-slop-frontend-design", name: "AI 前端反平庸知识库", line: "让 AI 做出有设计感网页的规范知识库",
        preview: "/projects/zy-anti-slop-frontend-design.webp",
        meta: ["170+ 篇设计文档", "CC BY 4.0"],
        en: {
          name: "Anti-Slop Frontend Design", line: "Design rules that give AI-made sites taste",
          meta: ["170+ design docs", "CC BY 4.0"],
        },
      },
    ],
  },
  {
    label: "网站与小工具", labelEn: "Sites & small tools",
    items: [
      {
        id: "wanji-index", name: "玩机索引", line: "PC 游戏资源与工具索引站，每日自动更新",
        preview: "/projects/wanji-index.webp", peek: "/projects/wanji-index-peek.mp4",
        video: { src: "/projects/wanji-index-promo.mp4", poster: "/projects/wanji-index-promo.webp" },
        meta: ["Next.js 静态站", "数据驱动"],
        en: {
          name: "Wanji Index", line: "PC game resource index, updated daily",
          meta: ["Next.js static site", "Data-driven"],
        },
      },
      {
        id: "qilan-atlas", name: "奇览", line: "635 个设计概念的视觉语言库，附 AI 提示词",
        preview: "/projects/qilan-atlas.webp", peek: "/projects/qilan-atlas-peek.webp",
        meta: ["视觉参考库", "中文 / English"],
        en: {
          name: "Qilan", line: "635 design concepts, each with an AI prompt",
          meta: ["Visual reference library", "Chinese / English"],
        },
      },
      {
        id: "yike-album-downloader", name: "一刻相册下载", line: "一刻相册照片视频批量下载，保留原画质",
        preview: "/projects/yike-album-downloader.webp",
        meta: ["Python", "Windows / macOS / Linux"],
        en: {
          name: "Yike Album Downloader", line: "Batch-download Yike Album at full quality",
          meta: ["Python", "Windows / macOS / Linux"],
        },
      },
      {
        id: "flyykjxzq", name: "风灵月影下载器", line: "输入中文游戏名，直接下载官方修改器",
        preview: "/projects/flyykjxzq.webp",
        meta: ["Python", "打包版可直接运行"],
        en: {
          name: "FLiNG Trainer Downloader", line: "Chinese game name in, official trainer out",
          meta: ["Python", "Packaged build available"],
        },
      },
    ],
  },
];

/** 详情页的顺序：与首页阅读顺序一致 */
export const ITEMS: Item[] = COLS.flatMap((c) => c.items);
export const itemById = (id: string | null) => ITEMS.find((i) => i.id === id);
/** 分组名（中 / 英） */
export const colLabel = (c: { label: string; labelEn: string }, lang: Lang) => (lang === "en" ? c.labelEn : c.label);
export const colOf = (id: string) => COLS.findIndex((c) => c.items.some((i) => i.id === id));

const byId = (id: string) => ARCHIVE_PROJECTS.find((p) => p.id === id);

/** 外链：只列真实存在的 */
export const linksOf = (id: string, lang: Lang = "zh") => {
  const l = byId(id)?.links ?? {};
  const en = lang === "en";
  const out: { label: string; href: string }[] = [];
  if (l.demo) out.push({ label: en ? "Live site" : "在线看", href: l.demo });
  if (l.website) out.push({ label: en ? "Website" : "官网", href: l.website });
  if (l.github) out.push({ label: "GitHub", href: l.github });
  if (l.release) out.push({ label: en ? "Download" : "下载", href: l.release });
  if (l.quark) out.push({ label: en ? "Cloud drive" : "网盘", href: l.quark });
  return out;
};

export type Lang = "zh" | "en";
/** 按语言取文案；英文缺失时回落中文 */
export const textOf = (it: Item, lang: Lang) => (lang === "en" && it.en ? it.en : it);
/** 提交时刻的说明文字 */
export const stampText = (label: string, lang: Lang) =>
  lang === "en" ? (label === "夜间提交" ? "commits at night" : "first commit") : label;

export const yearOf = (id: string) => byId(id)?.year ?? "";
