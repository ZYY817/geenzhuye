export interface ProjectItem {
  id: string;
  index: string; // e.g. "01", "02"
  title: string;
  englishTitle: string;
  year: string;
  category: "SYSTEM" | "AI SKILL" | "AGENT" | "DESIGN" | "DEV TOOL";
  categoryLabel: string;
  status: "LIVE" | "OPEN SOURCE" | "RESEARCH" | "STABLE";
  tagline: string;
  description: string;
  definition?: string;
  highlightText?: string;
  coverImage?: string;
  specs: { label: string; value: string }[];
  tags: string[];
  links: {
    website?: string;
    github?: string;
    release?: string;
    bilibili?: string;
    douyin?: string;
    demo?: string;
    quark?: string;
    download?: string;
  };
}

export const ARCHIVE_PROJECTS: ProjectItem[] = [
  {
    id: "yuqi-engine",
    index: "01",
    title: "宇奇引擎",
    englishTitle: "YuqiEngine",
    year: "2026",
    category: "SYSTEM",
    categoryLabel: "系统底层 / 模块化优化",
    status: "LIVE",
    tagline: "面向 Windows 10 和 Windows 11 的模块化系统优化与状态检测工具。",
    description: "先读取系统当前真实的优化状态，再提供直观的可操作选项。你可以根据自己的需求自由开启或调整，实实在在提升系统流畅度与日常使用体验。",
    coverImage: "/yuqi/overview.png",
    tags: ["C#", ".NET 8", "Win32", "WPF", "600+ Stars"],
    specs: [
      { label: "LANGUAGE", value: "C# / .NET 8 Native x64" },
      { label: "METRICS", value: "600+ GitHub Stars / 累计数万安装" },
      { label: "PHILOSOPHY", value: "检测先行 · 可逆恢复 · 零流氓" },
    ],
    links: {
      website: "https://yuqiengine.pages.dev/",
      github: "https://github.com/ZYY817/YuqiEngine",
      release: "https://github.com/ZYY817/YuqiEngine/releases",
      bilibili: "https://space.bilibili.com/41173761",
      douyin: "https://www.douyin.com/user/MS4wLjABAAAAtudWpqXWwZXYdkSk0YT36zpHEPiS2YuFsQL21ihiUxI",
    },
  },
  {
    id: "agent-project-map",
    index: "02",
    title: "代码库拓扑导图",
    englishTitle: "Agent Project Map",
    year: "2026",
    category: "DEV TOOL",
    categoryLabel: "工程资产定位 / AI IDE 项目地图",
    status: "STABLE",
    tagline: "让各种 AI IDE 能够精准找到目标代码的项目地图。",
    description: "通过给代码库建立轻量索引与锚点，帮助 Cursor、Windsurf、Claude Code 等 AI 编程工具快速定位代码位置与业务逻辑，降低寻找代码时的损耗，减少大模型上下文浪费。",
    coverImage: "/yuqi/agent-map-preview.png",
    tags: ["Agent Memory", "Single-file", "Zero Dependency", "Codebase Map"],
    specs: [
      { label: "FOOTPRINT", value: "Zero Dependencies / Single File" },
      { label: "CAPABILITY", value: "Searchable Anchors & Self-check" },
      { label: "COMPATIBILITY", value: "Cursor / Codex / Claude Code" },
    ],
    links: {
      github: "https://github.com/ZYY817/agent-project-map",
    },
  },
  {
    id: "yuqi-team-orchestrator",
    index: "03",
    title: "多智能体编排调度器",
    englishTitle: "Yuqi Team Orchestrator",
    year: "2026",
    category: "AGENT",
    categoryLabel: "自主 Agent 协作 / 任务图调度",
    status: "OPEN SOURCE",
    tagline: "让多个 AI 智能体协同分工的任务调度插件。",
    description: "将复杂的大目标自动拆解为任务图，由控制器指挥多个子 AI 分头执行并验证结果，有条不紊地推进任务，防止 AI 逻辑混乱或中途卡死。",
    coverImage: "/yuqi/team-orchestrator.jpg",
    tags: ["TypeScript", "Multi-Agent", "DeepSeek Harness", "Task Graph"],
    specs: [
      { label: "CORE ARCH", value: "Controller-led Durable Task Graph" },
      { label: "RELIABILITY", value: "Fail-closed Recovery & Evidence Check" },
      { label: "LANGUAGE", value: "TypeScript" },
    ],
    links: {
      github: "https://github.com/ZYY817/Yuqi-Team-Orchestrator",
    },
  },
  {
    id: "qilan-atlas",
    index: "04",
    title: "奇览",
    englishTitle: "Qilan",
    year: "2026",
    category: "DESIGN",
    categoryLabel: "视觉语言图谱 / 风格参考库",
    status: "LIVE",
    tagline: "收录 537 个设计概念词条的视觉参考与提示词库。",
    description: "把一闪而过、难以言明的感觉，拆成能辨认、能检索、能调用的视觉语言。覆盖 264 种界面设计风格，每种配参考演示与可一键复制的 AI 提示词，画廊与索引双模直查，中英文双语。",
    coverImage: "/yuqi/qilan-hero.jpg",
    tags: ["Visual Atlas", "537 Concepts", "AI Prompts", "Bilingual"],
    specs: [
      { label: "COLLECTION", value: "537 个设计概念词条 · 264 种风格" },
      { label: "PROMPTS", value: "一键复制 AI 提示词" },
      { label: "MODES", value: "画廊 / 索引双模 · CN & EN 双语" },
    ],
    links: {
      demo: "https://qilan.pages.dev",
    },
  },
  {
    id: "spec-forge",
    index: "05",
    title: "需求锻造台",
    englishTitle: "SpecForge",
    year: "2026",
    category: "AI SKILL",
    categoryLabel: "需求规范 / 产品文档 Skill",
    status: "OPEN SOURCE",
    tagline: "专门用来写规范需求单与产品文档的 AI Skill。",
    description: "平时把自己写需求单时最看重的思考要点和规则整理成了一个 Skill。面对零散的想法、会议记录或对话，能快速梳理出真正的问题并沉淀为规范、可执行的产品需求文档。",
    coverImage: "/yuqi/overview.png",
    tags: ["AI Skill", "Prompt Architecture", "PRD Engineering", "Bilingual"],
    specs: [
      { label: "TYPE", value: "Customizable AI Agent Skill" },
      { label: "LANGUAGE", value: "Bilingual (CN / EN)" },
      { label: "OUTPUT", value: "Actionable & Testable Specifications" },
    ],
    links: {
      github: "https://github.com/ZYY817/spec-forge",
    },
  },
  {
    id: "zy-anti-slop-frontend-design",
    index: "06",
    title: "AI 前端反平庸设计知识库",
    englishTitle: "Anti-Slop Frontend Design",
    year: "2026",
    category: "DESIGN",
    categoryLabel: "前端美学规范 / 生产级 UI 指南",
    status: "OPEN SOURCE",
    tagline: "避免生成千篇一律模板的前端 AI 提示词与规则指南。",
    description: "把平时沉淀下来的高品质前端描述词和视觉规范整理成清晰的规则表，让 AI 理解排版、间距、动效等设计限制，做出更精致、有辨识度且真正可用的现代网页。",
    coverImage: "/yuqi/game-opt.png",
    tags: ["Frontend Aesthetics", "Anti-Template", "Design Tokens", "Knowledge Base"],
    specs: [
      { label: "STANDARD", value: "Awwwards / Production Ready UI" },
      { label: "SCOPE", value: "Typography / Spatial Grid / Motion Physics" },
      { label: "LICENSE", value: "CC BY 4.0 International" },
    ],
    links: {
      github: "https://github.com/ZYY817/zy-anti-slop-frontend-design",
    },
  },
  {
    id: "yike-album-downloader",
    index: "07",
    title: "一刻相册批量下载工具",
    englishTitle: "Yike Album Downloader",
    year: "2026",
    category: "DEV TOOL",
    categoryLabel: "媒体自动化 / 批量导出",
    status: "OPEN SOURCE",
    tagline: "百度一刻相册照片与视频批量导出工具。",
    description: "突破网页版限制，多线程按原始画质批量高速下载照片和视频，完整保留拍摄时间，方便本地备份个人数字资产。",
    coverImage: "/yuqi/overview.png",
    tags: ["Python", "Batch Downloader", "Media Automation", "Open Source"],
    specs: [
      { label: "CORE", value: "Multi-thread Lossless Pipeline" },
      { label: "FORMAT", value: "Original Photos & High-Res Videos" },
      { label: "LANGUAGE", value: "Python 3" },
    ],
    links: {
      github: "https://github.com/ZYY817/yike-album-downloader",
    },
  },
  {
    id: "flyykjxzq",
    index: "08",
    title: "风灵月影修改器快捷下载器",
    englishTitle: "FLYYKJXZQ",
    year: "2025",
    category: "DEV TOOL",
    categoryLabel: "单机游戏辅助 / 检索直链工具",
    status: "OPEN SOURCE",
    tagline: "单机游戏修改器纯净直链快速提取工具。",
    description: "自动抓取并直接提取官方修改器的真实下载链接，无需在繁琐的网页中到处寻找或点击广告，一键直接下载。",
    coverImage: "/yuqi/game-opt.png",
    tags: ["Python", "Web Crawler", "Automation", "Utility"],
    specs: [
      { label: "TYPE", value: "AI-Generated Utility Tool" },
      { label: "EFFICIENCY", value: "Direct Link Extraction" },
      { label: "LANGUAGE", value: "Python 3" },
    ],
    links: {
      github: "https://github.com/ZYY817/FLYYKJXZQ",
      quark: "https://pan.quark.cn/s/15b66d13754b#/list/share",
    },
  },
  {
    id: "enterprise-efficiency-suite",
    index: "09",
    title: "企业自动化增效工具集",
    englishTitle: "Enterprise AI Efficiency Suite",
    year: "2025",
    category: "DEV TOOL",
    categoryLabel: "企业流程自动化 / AI 降本增效",
    status: "STABLE",
    tagline: "为企业在重复工作流程中搭建的十余款 AI 自动化助手。",
    description: "把企业里高频、重复、消耗人力的流程逐个拆成自动化小工具：商品文案自动生成、智能评价助手、批量记录筛选、按意图生成评论等十余款。面向企业内部交付，无对外公开演示，但流程拆解与自动化的方法论可复用到任何重复性工作流。",
    coverImage: "/yuqi/overview.png",
    tags: ["Enterprise Automation", "AI Workflow", "10+ Assistants", "Private Delivery"],
    specs: [
      { label: "SCALE", value: "十余款自动化助手" },
      { label: "SCOPE", value: "商品文案 / 评价 / 筛选 / 评论生成" },
      { label: "ACCESS", value: "企业内部交付" },
    ],
    links: {},
  },
];

export const SYSTEM_METRICS = {
  authorName: "智宇",
  handle: "ZYY817",
  title: "APPLIED AI · PRODUCT BUILDER & SYSTEMS CRAFTSPERSON",
  status: "ACTIVE // CALIBRATED",
  bio: "Hello，我是智宇。把我懂的经验和思考，借助 AI 去帮到更多的人。",
  manifesto: "把我懂的经验和思考，借助 AI 去帮到更多的人。",
  coordinates: "31°13'N 121°28'E",
  socials: {
    github: "https://github.com/ZYY817",
    bilibili: "https://space.bilibili.com/41173761",
    bilibiliHandle: "智宇丶817",
    douyin: "https://www.douyin.com/user/MS4wLjABAAAAtudWpqXWwZXYdkSk0YT36zpHEPiS2YuFsQL21ihiUxI",
    douyinId: "35071658",
    wechat: "zhiyuydyh",
    x: "https://x.com/ZHIYUGAME",
    xHandle: "@ZHIYUGAME",
    email: "q571567759@aliyun.com",
  },
};
