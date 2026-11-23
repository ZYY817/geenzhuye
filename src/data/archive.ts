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
    tags: ["C#", ".NET 8", "Win32", "WPF", "660+ Stars"],
    specs: [
      { label: "LANGUAGE", value: "C# / .NET 8 Native x64" },
      { label: "METRICS", value: "660+ GitHub Stars / 累计数万安装" },
      { label: "PHILOSOPHY", value: "检测先行 · 可逆恢复 · 零流氓" },
    ],
    links: {
      website: "https://zyy817.github.io/",
      github: "https://github.com/ZYY817/YuqiEngine",
      release: "https://github.com/ZYY817/YuqiEngine/releases",
      bilibili: "https://space.bilibili.com/41173761",
      douyin: "https://www.douyin.com/user/MS4wLjABAAAAtudWpqXWwZXYdkSk0YT36zpHEPiS2YuFsQL21ihiUxI",
    },
  },
  {
    id: "yuqi-lite",
    index: "02",
    title: "宇奇轻管",
    englishTitle: "Yuqi Lite",
    year: "2026",
    category: "SYSTEM",
    categoryLabel: "后台应用清理 / 自启治理",
    status: "OPEN SOURCE",
    tagline: "极简、诚实的 Windows 后台应用清理工具。",
    description: "把看不懂的进程名翻译成人话，告诉你哪些能关、哪些不该碰。按应用归组而不是按进程；结束后延迟复核真实状态，杀不掉的就直说，不把失败包装成「已关闭」。支持保护名单、禁止自动重启、模式规则与自启治理，不联网、不收集数据。",
    tags: ["C#", ".NET 8", "Windows", "Process Management"],
    specs: [
      { label: "PLATFORM", value: "Windows 10 / 11 x64" },
      { label: "PRINCIPLE", value: "如实复核 · 不碰系统关键进程 · 不联网" },
      { label: "DISTRIBUTION", value: "MSI 安装版 / 免安装绿色版" },
    ],
    links: {
      github: "https://github.com/ZYY817/yuqi-lite",
      release: "https://github.com/ZYY817/yuqi-lite/releases",
    },
  },
  {
    id: "aimframe",
    index: "14",
    title: "AimFrame 准框",
    englishTitle: "AimFrame",
    year: "2026",
    category: "SYSTEM",
    categoryLabel: "显示缩放 / FPS 比赛屏尺寸",
    status: "OPEN SOURCE",
    tagline: "把 27 寸、32 寸大屏在显卡层面缩成 24.5 寸比赛屏尺寸。",
    description: "选好尺寸点应用，玩完点还原。NVIDIA 走驱动级自定义分辨率，AMD / Intel 走系统缩放，所有显卡都能用窗口模式。15 秒不确认自动还原，另有应急还原热键。",
    tags: ["C#", ".NET 8", "WPF", "NVAPI"],
    specs: [
      { label: "PLATFORM", value: "Windows 10 / 11 x64" },
      { label: "MODES", value: "驱动级 / 系统缩放 / 仅游戏窗口" },
      { label: "SAFETY", value: "15 秒自动还原 · 应急还原热键" },
    ],
    links: {
      github: "https://github.com/ZYY817/ScreenSizer",
      release: "https://github.com/ZYY817/ScreenSizer/releases/latest",
    },
  },
  {
    id: "aiclean",
    index: "16",
    title: "AIClean",
    englishTitle: "AIClean",
    year: "2026",
    category: "SYSTEM",
    categoryLabel: "C 盘清理 / AI 应用数据迁移",
    status: "OPEN SOURCE",
    tagline: "面向 AI 应用的 C 盘清理软件，整盘占用画成格子看清再动手。",
    description: "扫描 C 盘占用并画成 198 个格子，每个格子是谁占的、占多少都有标注。缓存按住清理，待确认的逐条看一眼，程序正在用的先记下来。各家 AI 应用的对话记录、模型文件原路径迁往其他盘，原位保留链接，软件照常运行；迁移失败自动回滚。",
    tags: ["Go", "WebView2", "Windows", "单文件 exe"],
    specs: [
      { label: "PLATFORM", value: "Windows 10 / 11 x64" },
      { label: "PACKAGE", value: "单文件 exe · 6.1 MB · 免安装" },
      { label: "SAFETY", value: "按住确认 · 迁移保留链接 · 失败自动回滚" },
    ],
    links: {
      website: "https://zyy817.github.io/aiclean/",
      github: "https://github.com/ZYY817/aiclean",
      release: "https://github.com/ZYY817/aiclean/releases/latest",
      bilibili: "https://space.bilibili.com/41173761",
    },
  },
  {
    id: "wanji-kit",
    index: "03",
    title: "玩机装机工具",
    englishTitle: "Wanji Kit",
    year: "2026",
    category: "SYSTEM",
    categoryLabel: "游戏运行环境 / 一键检测安装",
    status: "OPEN SOURCE",
    tagline: "游戏运行库一键检测与安装，全部走官方渠道。",
    description: "游戏打不开，多半是缺运行库。扫一遍就知道缺什么，点一下自动装齐：32 项检测覆盖 VC++、.NET、DirectX、WebView2 等运行库和常用系统优化项，winget 优先、微软官方直链兜底，装完逐项重扫验证；装不了的直接给出官方指引，不留死路。",
    tags: ["Flutter", "Dart", "Windows", "winget"],
    specs: [
      { label: "CHECKS", value: "32 项运行库与系统优化" },
      { label: "SOURCE", value: "winget 优先 · 官方直链兜底" },
      { label: "PLATFORM", value: "Windows 10 / 11 x64 · 免安装" },
    ],
    links: {
      github: "https://github.com/ZYY817/wanji-kit",
      release: "https://github.com/ZYY817/wanji-kit/releases",
    },
  },
  {
    id: "wanji-index",
    index: "04",
    title: "玩机索引",
    englishTitle: "Wanji Index",
    year: "2026",
    category: "DEV TOOL",
    categoryLabel: "游戏资源索引 / 静态站点",
    status: "LIVE",
    tagline: "中文 PC 游戏资源与工具索引，每日自动更新。",
    description: "把 PC 游戏的资源站、工具、教程、免费情报和常见问题整理成一个可检索的索引站。页面、关联列表、搜索索引和站点地图都由数据在构建时生成，每条内容经过统一的校验和发布标准。",
    tags: ["Next.js", "TypeScript", "Static Export", "Data Validation"],
    specs: [
      { label: "CONTENT", value: "游戏 / 资源站 / 工具 / 教程 / 免费情报 / 排障" },
      { label: "PIPELINE", value: "Schema 校验 → 静态导出 → 每日自动更新" },
      { label: "STACK", value: "Next.js 16 · React 19 · Tailwind CSS v4" },
    ],
    links: {
      demo: "https://zyy817.github.io/wanji-index/",
      github: "https://github.com/ZYY817/wanji-index",
    },
  },
  {
    id: "agent-project-map",
    index: "05",
    title: "代码库拓扑导图",
    englishTitle: "Agent Project Map",
    year: "2026",
    category: "DEV TOOL",
    categoryLabel: "工程资产定位 / AI IDE 项目地图",
    status: "STABLE",
    tagline: "让各种 AI IDE 能够精准找到目标代码的项目地图。",
    description: "通过给代码库建立轻量索引与锚点，帮助 Cursor、Windsurf、Claude Code 等 AI 编程工具快速定位代码位置与业务逻辑，降低寻找代码时的损耗，减少大模型上下文浪费。",
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
    index: "06",
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
      github: "https://github.com/ZYY817/dsh-team-orchestrator",
    },
  },
  {
    id: "yuqi-token-guardian",
    index: "15",
    title: "Token Guardian",
    englishTitle: "Token Guardian",
    year: "2026",
    category: "AGENT",
    categoryLabel: "Token 成本 / 已归档复盘",
    status: "RESEARCH",
    tagline: "试图减少 DeepSeek 思维链重复计费的插件，实测没有效果，保留为复盘。",
    description: "DeepSeek Harness 插件。压缩回放的思维链、去重工具结果、给机械步骤降思考档位；实测账单收益未被证明，核心机制反而让缓存失效，已归档。",
    tags: ["TypeScript", "DeepSeek Harness", "Postmortem"],
    specs: [
      { label: "STATUS", value: "已归档 · 不再维护" },
      { label: "FINDING", value: "约 93% 回放内容本就按缓存价计费" },
      { label: "LICENSE", value: "MIT" },
    ],
    links: {
      github: "https://github.com/ZYY817/yuqi-token-guardian",
    },
  },
  {
    id: "qilan-atlas",
    index: "07",
    title: "奇览",
    englishTitle: "Qilan",
    year: "2026",
    category: "DESIGN",
    categoryLabel: "视觉语言图谱 / 风格参考库",
    status: "LIVE",
    tagline: "收录 635 个设计概念词条的视觉参考与提示词库。",
    description: "把一闪而过、难以言明的感觉，拆成能辨认、能检索、能调用的视觉语言。覆盖 264 种界面设计风格，每种配参考演示与可一键复制的 AI 提示词，画廊与索引双模直查，中英文双语。",
    coverImage: "/yuqi/qilan-hero.jpg",
    tags: ["Visual Atlas", "635 Concepts", "AI Prompts", "Bilingual"],
    specs: [
      { label: "COLLECTION", value: "635 个设计概念词条 · 264 种风格" },
      { label: "PROMPTS", value: "一键复制 AI 提示词" },
      { label: "MODES", value: "画廊 / 索引双模 · CN & EN 双语" },
    ],
    links: {
      demo: "https://qilan.pages.dev",
    },
  },
  {
    id: "spec-forge",
    index: "08",
    title: "需求锻造台",
    englishTitle: "SpecForge",
    year: "2026",
    category: "AI SKILL",
    categoryLabel: "需求规范 / 产品文档 Skill",
    status: "OPEN SOURCE",
    tagline: "专门用来写规范需求单与产品文档的 AI Skill。",
    description: "平时把自己写需求单时最看重的思考要点和规则整理成了一个 Skill。面对零散的想法、会议记录或对话，能快速梳理出真正的问题并沉淀为规范、可执行的产品需求文档。",
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
    id: "work-report-skill",
    index: "09",
    title: "工作汇报 Skill",
    englishTitle: "Work Report Skill",
    year: "2026",
    category: "AI SKILL",
    categoryLabel: "周期汇报 / 写作 Skill",
    status: "OPEN SOURCE",
    tagline: "事实优先、格式自适应的中文工作汇报 AI Skill。",
    description: "把零散的工作记录整理成真实、精简、状态清楚的日报、周报、月报或阶段汇报。保留每一个独立事项，不把「排查中」写成「已解决」，也不为了显得高级而制造成果；会按读者、渠道和设备调整格式。",
    tags: ["AI Skill", "Markdown", "Zero Dependency", "Chinese Writing"],
    specs: [
      { label: "OUTPUT", value: "日报 / 周报 / 双周报 / 月报 / 阶段汇报" },
      { label: "PRINCIPLE", value: "事实优先 · 不虚构成果" },
      { label: "FOOTPRINT", value: "纯 Markdown / YAML / JSON，无运行时依赖" },
    ],
    links: {
      github: "https://github.com/ZYY817/work-report-skill",
    },
  },
  {
    id: "zy-anti-slop-frontend-design",
    index: "10",
    title: "AI 前端反平庸设计知识库",
    englishTitle: "Anti-Slop Frontend Design",
    year: "2026",
    category: "DESIGN",
    categoryLabel: "前端美学规范 / 生产级 UI 指南",
    status: "OPEN SOURCE",
    tagline: "避免生成千篇一律模板的前端 AI 提示词与规则指南。",
    description: "把平时沉淀下来的高品质前端描述词和视觉规范整理成清晰的规则表，让 AI 理解排版、间距、动效等设计限制，做出更精致、有辨识度且真正可用的现代网页。",
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
    index: "11",
    title: "一刻相册批量下载工具",
    englishTitle: "Yike Album Downloader",
    year: "2026",
    category: "DEV TOOL",
    categoryLabel: "媒体自动化 / 批量导出",
    status: "OPEN SOURCE",
    tagline: "百度一刻相册照片与视频批量导出工具。",
    description: "突破网页版限制，多线程按原始画质批量高速下载照片和视频，完整保留拍摄时间，方便本地备份个人数字资产。",
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
    index: "12",
    title: "风灵月影修改器快捷下载器",
    englishTitle: "FLYYKJXZQ",
    year: "2025",
    category: "DEV TOOL",
    categoryLabel: "单机游戏辅助 / 检索直链工具",
    status: "OPEN SOURCE",
    tagline: "单机游戏修改器纯净直链快速提取工具。",
    description: "自动抓取并直接提取官方修改器的真实下载链接，无需在繁琐的网页中到处寻找或点击广告，一键直接下载。",
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
    index: "13",
    title: "企业自动化增效工具集",
    englishTitle: "Enterprise AI Efficiency Suite",
    year: "2025",
    category: "DEV TOOL",
    categoryLabel: "企业流程自动化 / AI 降本增效",
    status: "STABLE",
    tagline: "为企业在重复工作流程中搭建的十余款 AI 自动化助手。",
    description: "把企业里高频、重复、消耗人力的流程逐个拆成自动化小工具：商品文案自动生成、智能评价助手、批量记录筛选、按意图生成评论等十余款。面向企业内部交付，无对外公开演示，但流程拆解与自动化的方法论可复用到任何重复性工作流。",
    tags: ["Enterprise Automation", "AI Workflow", "10+ Assistants", "Private Delivery"],
    specs: [
      { label: "SCALE", value: "十余款自动化助手" },
      { label: "SCOPE", value: "商品文案 / 评价 / 筛选 / 评论生成" },
      { label: "ACCESS", value: "企业内部交付" },
    ],
    links: {},
  },
];

/** 首页分组：按编号连续区间切分（01–07 / 08–10 / 11–13），标签见 UI.groups */
export const PROJECT_GROUPS: [number, number][] = [[0, 7], [7, 10], [10, 13]];

/** 页脚"更新于"日期，发版时手动更新 */
export const LAST_UPDATED = "2026.11";

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
