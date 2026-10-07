export type Language = "zh" | "en";

export interface HeroCopyI18n {
  name: string;
  handle: string;
  luckyNumber: string;
  titleBadge: string;
  welcomeIntro: string;
  welcomeSubtitle: string;
  statementIntro: string;
  statementBody: string;
  statementPrefix: string;
  kw1: string;
  statementMid1: string;
  kw2: string;
  statementMid2: string;
  kw3: string;
  statementMid3: string;
  kw4: string;
  statementSuffix: string;
  narrativeP1: string;
  narrativeKeyword: string;
  narrativeP1End: string;
  narrativeP2: string;
  narrativeP3: string;
  narrativeP4: string;
  scrollHint: string;
  transformHint: string;
  headlineLine1: string;
  headlineLine2: string;
  statementLine1: string;
  statementLine2: string;
  enterAboutBtn: string;
  browseWorksBtn: string;
}

export interface NavI18n {
  screens: {
    index: number;
    label: string;
    short: string;
    tag: string;
  }[];
  header: {
    about: string;
    works: string;
    contact: string;
  };
}

export interface AboutCardI18n {
  idx: string;
  title: string;
  eng: string;
  desc: string;
  badge: string;
}

export interface AboutSectionI18n {
  tag: string;
  subtag: string;
  greeting: string;
  subgreeting: string;
  monographTitle: string;
  monographSubtitle: string;
  monographVerified: string;
  manifestoMain1: string;
  manifestoHighlight: string;
  manifestoMain2: string;
  manifestoDetail: string;
  manifestoQuote: string;
  specsTitle: string;
  specsVerified: string;
  roleLabel: string;
  roleValue: string;
  flagshipLabel: string;
  flagshipValue: string;
  locationLabel: string;
  locationValue: string;
  creedLabel: string;
  creedValue: string;
  cards: AboutCardI18n[];
}

export interface WorksUniverseI18n {
  tag: string;
  subtag: string;
  title: string;
  subtitle: string;
  categories: {
    all: string;
    system: string;
    ai: string;
    tools: string;
    design: string;
  };
  actions: {
    openModal: string;
    viewSource: string;
    viewRelease: string;
    blueprintFront: string;
    blueprintBack: string;
    inspectBlueprint: string;
    specTitle: string;
    archTitle: string;
    metricsTitle: string;
    starCount: string;
    explore: string;
  };
}

export interface EpilogueI18n {
  tag: string;
  subtag: string;
  title: string;
  subtitle: string;
  statusBadge: string;
  dialogueCardTitle: string;
  dialogueCardDesc: string;
  copyEmailBtn: string;
  copiedBtn: string;
  socialsLabel: string;
  footerRights: string;
}

export interface RibbonsI18n {
  top: string[];
  bottom: string[];
}

export interface I18nDictionary {
  hero: HeroCopyI18n;
  nav: NavI18n;
  about: AboutSectionI18n;
  works: WorksUniverseI18n;
  epilogue: EpilogueI18n;
  ribbons: RibbonsI18n;
}

export const I18N_DATA: Record<Language, I18nDictionary> = {
  zh: {
    hero: {
      name: "智宇",
      handle: "ZYY",
      luckyNumber: "7",
      titleBadge: "CREATOR & ENGINEER",
      welcomeIntro: "你好，我是智宇。",
      welcomeSubtitle: "用 AI、代码和工程，把一闪而过的念头，慢慢做成真正有用的产品。",
      statementIntro: "你好，我是智宇。",
      statementBody:
        "我喜欢想一些还没有发生的东西，也喜欢亲手把它们变成现实。用 AI、代码和工程，把一闪而过的念头，慢慢做成真正有用的产品。想到了，就去做。",
      statementPrefix: "你好，我是",
      kw1: "智宇",
      statementMid1: "。",
      kw2: "还没有发生的东西",
      statementMid2: "，也喜欢亲手把它们变成现实。",
      kw3: "AI、代码和工程",
      statementMid3: "，把一闪而过的念头，慢慢做成",
      kw4: "真正有用的产品",
      statementSuffix: "。想到了，就去做。",
      narrativeP1: "你好，我是智宇。",
      narrativeKeyword: "AI、代码和工程",
      narrativeP1End: "",
      narrativeP2: "我喜欢想一些还没有发生的东西，\n也喜欢亲手把它们变成现实。",
      narrativeP3:
        "用 AI、代码和工程，\n把一闪而过的念头，慢慢做成真正有用的产品。",
      narrativeP4:
        "想到了，就去做。",
      scrollHint: "SCROLL ↓",
      transformHint: "提取核心关键词 // 编译至作品宇宙",
      headlineLine1: "你好，我是智宇。",
      headlineLine2: "想到了，就去做。",
      statementLine1: "我喜欢想一些还没有发生的东西，也喜欢亲手把它们变成现实。",
      statementLine2:
        "用 AI、代码和工程，把一闪而过的念头，慢慢做成真正有用的产品。",
      enterAboutBtn: "探索作品 ➔",
      browseWorksBtn: "作品宇宙 ↗",
    },
    nav: {
      screens: [
        { index: 0, label: "序章 // 叙事", short: "01", tag: "NARRATIVE" },
        { index: 1, label: "作品 // 宇宙", short: "02", tag: "WORKS" },
        { index: 2, label: "尾声 // 寄语", short: "03", tag: "EPILOGUE" },
      ],
      header: {
        about: "叙事自白",
        works: "作品宇宙",
        contact: "联系",
      },
    },
    about: {
      tag: "ABOUT",
      subtag: "个人介绍 · 02 / 04",
      greeting: "大家好，我是智宇。",
      subgreeting: "我是一个 AI 深度使用者与独立开发者。",
      monographTitle: "ZHIYU MONOGRAPH",
      monographSubtitle: "独立工程师专著铭牌",
      monographVerified: "PROVENANCE CERTIFIED",
      manifestoMain1: "我会通过 AI，不断给大家创造",
      manifestoHighlight: "真正有用、自己喜欢、且能切实帮助大家解决现实问题",
      manifestoMain2: "的东西。",
      manifestoDetail: "我不喜欢随大流的 AI 模板垃圾代码，也不沉迷于浮躁套壳的玩具。我更关注如何通过 AI 工具与严谨的工程架构，把天马行空的大胆构想，亲手做成经得起推敲的实用工具。",
      manifestoQuote: "“从底层的状态探测，到高阶智能体的任务编排——技术本身只是杠杆，唯有解决真实世界的痛点，才是一切创作的初衷。”",
      specsTitle: "SPECIFICATION // 参数简报",
      specsVerified: "● VERIFIED",
      roleLabel: "ROLE // 角色定位",
      roleValue: "AI 深度实践者 · 独立工程师",
      flagshipLabel: "FLAGSHIP // 代表作",
      flagshipValue: "宇奇引擎 · 600+ Stars",
      locationLabel: "LOCATION // 坐标",
      locationValue: "中国 · 上海 (Shanghai, CN)",
      creedLabel: "CREED // 信念",
      creedValue: "有用 · 热爱 · 严谨工程",
      cards: [
        {
          idx: "01",
          title: "AI 深度实践",
          eng: "APPLIED AI",
          desc: "超越表面闲聊，将大模型重塑为高阶需求工程与多智能体自动化中枢。",
          badge: "MULTI-AGENT MESH",
        },
        {
          idx: "02",
          title: "600+★ 底层调优",
          eng: "NATIVE SYSTEMS",
          desc: "打造 Windows 平台宇奇引擎，坚持检测先行、可逆回退与零玄学调优。",
          badge: "C# · .NET 8 · WIN32",
        },
        {
          idx: "03",
          title: "实用主义产品观",
          eng: "UTILITY FIRST",
          desc: "坚持做自己喜欢并能帮助他人切实省时、提效、解决实际问题的真实工具。",
          badge: "SOLVE REAL PAINS",
        },
        {
          idx: "04",
          title: "严谨工程抗平庸",
          eng: "ANTI-SLOP CRAFT",
          desc: "抵制千篇一律的 AI 模板代码，坚守扎实的软件工程规范与审美敬畏。",
          badge: "ARCHITECTURAL RIGOR",
        },
      ],
    },
    works: {
      tag: "WORKS UNIVERSE",
      subtag: "开源工程矩阵 · 03 / 04",
      title: "作品宇宙",
      subtitle: "从底层系统性能调优，到多智能体编排与前端美学规范。",
      categories: {
        all: "全部",
        system: "系统底层",
        ai: "AI智能体",
        tools: "实用工具",
        design: "美学规范",
      },
      actions: {
        openModal: "查看完整技术档案",
        viewSource: "源代码仓库",
        viewRelease: "下载安装包",
        blueprintFront: "工程全景",
        blueprintBack: "技术参数",
        inspectBlueprint: "检查工程蓝图",
        specTitle: "技术规范指标",
        archTitle: "架构全景分解",
        metricsTitle: "核心量化收益",
        starCount: "600+ GitHub Stars",
        explore: "探索",
      },
    },
    epilogue: {
      tag: "EPILOGUE",
      subtag: "尾声 · 保持连接 · 04 / 04",
      title: "保持好奇，保持诚恳。",
      subtitle: "期待与同样热爱技术、专注解决现实问题的朋友交流碰撞。",
      statusBadge: "AVAILABLE FOR COLLABORATION",
      dialogueCardTitle: "开启探讨与合作",
      dialogueCardDesc: "无论关于宇奇引擎、多智能体编排，还是独立产品打造与前端工程，随时欢迎来信。",
      copyEmailBtn: "复制邮箱地址",
      copiedBtn: "已复制到剪贴板！",
      socialsLabel: "DIRECT CHANNELS // 社交频道",
      footerRights: "© 2026 智宇 (ZYY) · 保留所有权利 · CRAFTED WITH ARCHITECTURAL DISCIPLINE",
    },
    ribbons: {
      top: [
        "ZHIYU // 智宇 · 负责天马行空的大胆构想 · 用 AI 亲手把它们做成真正解决现实问题的产品 · 宇奇引擎 600+ STARS · NATIVE WIN32 · SPEC FORGE · 7 · ",
        "THE MONOGRAPH // 智宇 · 深度独白 · 独立工程师 · 坚持做自己喜欢并切实解决现实问题的工具 · 7 · ",
        "WORKS UNIVERSE // 智宇 · 真实开源工程矩阵 · 拒绝随大流 AI 模板代码 · 7 · ",
        "THE EPILOGUE // 智宇 · 保持好奇 · 保持诚恳 · 欢迎技术交流与产品探讨 · 上海 SHANGHAI · 7 · ",
      ],
      bottom: [
        "ANTI-SLOP CRAFT · UTILITY FIRST · NO TEMPLATE JUNK · 严谨工程抗平庸 · SHANGHAI · 7 · PURE ART DIRECTION · ",
        "THE MONOGRAPH · 深度独白 · CODE AS SCULPTURE · 架构先行 · 拒绝低质拼凑 · 7 · ",
        "WORKS UNIVERSE · 9 大专属互动展台 · WIN32 NATIVE · SPEC FORGE · 宇奇引擎 · 7 · ",
        "THE EPILOGUE · 保持好奇 · 保持诚恳 · CRAFTED WITH ARCHITECTURAL DISCIPLINE · 7 · ",
      ],
    },
  },
  en: {
    hero: {
      name: "Zhiyu",
      handle: "ZYY",
      luckyNumber: "7",
      titleBadge: "CREATOR & ENGINEER",
      welcomeIntro: "Hello, I am Zhiyu.",
      welcomeSubtitle: "With AI, code, and engineering, turning fleeting sparks of thought into truly useful products.",
      statementIntro: "Hello, I am Zhiyu.",
      statementBody:
        "I love imagining things that haven't happened yet, and turning them into reality with my own hands. With AI, code, and engineering, turning fleeting sparks of thought into truly useful products. Conceived, then created.",
      statementPrefix: "Hello, I am ",
      kw1: "Zhiyu",
      statementMid1: ".",
      kw2: "things that haven't happened yet",
      statementMid2: ", and turning them into reality with my own hands.",
      kw3: "AI, code, and engineering",
      statementMid3: ", turning fleeting sparks of thought into ",
      kw4: "truly useful products",
      statementSuffix: ". Conceived, then created.",
      narrativeP1: "Hello, I am Zhiyu.",
      narrativeKeyword: "AI, code, and engineering",
      narrativeP1End: "",
      narrativeP2: "I love imagining things that haven't happened yet,\nand turning them into reality with my own hands.",
      narrativeP3:
        "With AI, code, and engineering,\nturning fleeting sparks of thought into truly useful products.",
      narrativeP4:
        "Conceived, then created.",
      scrollHint: "SCROLL ↓",
      transformHint: "Extracting Core Token // Compiling to Works Universe",
      headlineLine1: "Hello, I am Zhiyu.",
      headlineLine2: "Conceived, then created.",
      statementLine1: "I love imagining things that haven't happened yet, and turning them into reality with my own hands.",
      statementLine2:
        "With AI, code, and engineering, turning fleeting sparks of thought into truly useful products.",
      enterAboutBtn: "Explore Works ➔",
      browseWorksBtn: "Works Universe ↗",
    },
    nav: {
      screens: [
        { index: 0, label: "PROLOGUE // NARRATIVE", short: "01", tag: "NARRATIVE" },
        { index: 1, label: "WORKS // UNIVERSE", short: "02", tag: "WORKS" },
        { index: 2, label: "EPILOGUE // CONTACT", short: "03", tag: "EPILOGUE" },
      ],
      header: {
        about: "Narrative",
        works: "Works Universe",
        contact: "Contact",
      },
    },
    about: {
      tag: "ABOUT",
      subtag: "The Monograph · 02 / 04",
      greeting: "Hello, I am Zhiyu.",
      subgreeting: "Applied AI practitioner & independent software engineer.",
      monographTitle: "ZHIYU MONOGRAPH",
      monographSubtitle: "Independent Craft Manifesto",
      monographVerified: "PROVENANCE CERTIFIED",
      manifestoMain1: "Through AI, I continuously craft things that are",
      manifestoHighlight: "genuinely useful, personally loved, and effectively solve real-world problems",
      manifestoMain2: ".",
      manifestoDetail: "I reject cookie-cutter AI template slop and superficial wrapper toys. My focus is engineering visionary, audacious concepts into rock-solid, production-grade tools.",
      manifestoQuote: "\"From low-level system diagnostics to high-order multi-agent orchestration — technology is merely leverage. Solving real-world pain points is the true genesis of craft.\"",
      specsTitle: "SPECIFICATION // BRIEF",
      specsVerified: "● VERIFIED",
      roleLabel: "ROLE // ARCHETYPE",
      roleValue: "Applied AI Practitioner · Systems Engineer",
      flagshipLabel: "FLAGSHIP // CREATION",
      flagshipValue: "YuqiEngine · 600+ Stars",
      locationLabel: "LOCATION // BASE",
      locationValue: "Shanghai, China",
      creedLabel: "CREED // ETHOS",
      creedValue: "Utility · Passion · Disciplined Craft",
      cards: [
        {
          idx: "01",
          title: "Applied AI Craft",
          eng: "APPLIED AI",
          desc: "Beyond casual chat — re-architecting LLMs into high-order prompt engineering and autonomous multi-agent orchestration hubs.",
          badge: "MULTI-AGENT MESH",
        },
        {
          idx: "02",
          title: "600+★ Native Systems",
          eng: "NATIVE SYSTEMS",
          desc: "Architecting Windows native YuqiEngine: diagnostics-first, fully reversible changes, and zero-gimmick systems tuning.",
          badge: "C# · .NET 8 · WIN32",
        },
        {
          idx: "03",
          title: "Utility-First Ethos",
          eng: "UTILITY FIRST",
          desc: "Committed to creating tools I love that genuinely save time, multiply efficiency, and solve tangible challenges.",
          badge: "SOLVE REAL PAINS",
        },
        {
          idx: "04",
          title: "Anti-Slop Craft",
          eng: "ANTI-SLOP CRAFT",
          desc: "Resisting copy-paste AI boilerplate, upholding disciplined software engineering architecture and aesthetic reverence.",
          badge: "ARCHITECTURAL RIGOR",
        },
      ],
    },
    works: {
      tag: "WORKS UNIVERSE",
      subtag: "Engineering Matrix · 03 / 04",
      title: "Works Universe",
      subtitle: "From low-level system tuning to multi-agent orchestration and design specifications.",
      categories: {
        all: "All",
        system: "Systems",
        ai: "AI & Agents",
        tools: "Utilities",
        design: "Aesthetics",
      },
      actions: {
        openModal: "View Full Engineering Dossier",
        viewSource: "Source Repository",
        viewRelease: "Download Release",
        blueprintFront: "Overview",
        blueprintBack: "Specifications",
        inspectBlueprint: "Inspect Blueprint",
        specTitle: "Technical Specifications",
        archTitle: "Architectural Breakdown",
        metricsTitle: "Measured Impact",
        starCount: "600+ GitHub Stars",
        explore: "Explore",
      },
    },
    epilogue: {
      tag: "EPILOGUE",
      subtag: "Stay Connected · 04 / 04",
      title: "Stay Curious, Stay Earnest.",
      subtitle: "Always open to dialogue with creators and engineers who care about building real-world utility.",
      statusBadge: "AVAILABLE FOR COLLABORATION",
      dialogueCardTitle: "Initiate Dialogue",
      dialogueCardDesc: "Whether discussing YuqiEngine, multi-agent systems, independent product building, or frontend engineering craft — feel free to reach out.",
      copyEmailBtn: "Copy Email Address",
      copiedBtn: "Copied to Clipboard!",
      socialsLabel: "DIRECT CHANNELS // SOCIALS",
      footerRights: "© 2026 Zhiyu (ZYY) · All Rights Reserved · CRAFTED WITH ARCHITECTURAL DISCIPLINE",
    },
    ribbons: {
      top: [
        "ZHIYU // CRAFT & RIGOR · VISIONARY CONCEPTS BUILT WITH APPLIED AI · YUQI ENGINE 600+ STARS · NATIVE WIN32 · SPEC FORGE · 7 · ",
        "THE MONOGRAPH // ZHIYU · INDEPENDENT ENGINEER · UTILITY FIRST · SOLVING REAL WORLD PROBLEMS · 7 · ",
        "WORKS UNIVERSE // OPEN SOURCE ENGINEERING · ANTI-SLOP DISCIPLINE · PRODUCTION READY CRAFT · 7 · ",
        "THE EPILOGUE // STAY CURIOUS · STAY EARNEST · OPEN FOR COLLABORATION · SHANGHAI · 7 · ",
      ],
      bottom: [
        "ANTI-SLOP CRAFT · UTILITY FIRST · NO TEMPLATE JUNK · DISCIPLINED ARCHITECTURE · SHANGHAI · 7 · PURE ART DIRECTION · ",
        "THE MONOGRAPH · CODE AS SCULPTURE · SYSTEM INTEGRITY · ZERO GIMMICKS · 7 · ",
        "WORKS UNIVERSE · 9 INTERACTIVE WORKSTATIONS · WIN32 NATIVE · SPEC FORGE · YUQI ENGINE · 7 · ",
        "THE EPILOGUE · STAY CURIOUS · STAY EARNEST · CRAFTED WITH ARCHITECTURAL DISCIPLINE · 7 · ",
      ],
    },
  },
};

export interface ProjectI18n {
  title: string;
  categoryLabel: string;
  tagline: string;
  description: string;
}

export const PROJECTS_I18N: Record<string, Record<Language, ProjectI18n>> = {
  "yuqi-engine": {
    zh: {
      title: "宇奇引擎",
      categoryLabel: "系统底层 / 游戏优化",
      tagline: "面向 Windows 10/11 的模块化系统优化、状态检测与性能诊断工具。",
      description: "先读取系统底层真实状态，再提供透明选择；拒绝万能一键玄学，每一次修改均可验证与安全回退。",
    },
    en: {
      title: "YuqiEngine",
      categoryLabel: "Native Systems / Gaming Optimization",
      tagline: "Modular systems optimization, state diagnostics, and performance tool for Windows 10/11.",
      description: "Inspects underlying system telemetry before presenting transparent choices. Zero blackbox gimmicks — every change is verified and fully reversible.",
    },
  },
  "yuqi-team-orchestrator": {
    zh: {
      title: "多智能体编排调度器",
      categoryLabel: "自主 Agent 协作 / 任务图调度",
      tagline: "DeepSeek Harness 插件：控制器主导的多智能体编排系统。",
      description: "具备持久化任务拓扑图、依赖分析调度、证据校验比对、模型路由与闭环容错恢复能力。",
    },
    en: {
      title: "Yuqi Team Orchestrator",
      categoryLabel: "Autonomous Agent Mesh / Task Graph",
      tagline: "DeepSeek Harness Plugin: Controller-led multi-agent orchestration architecture.",
      description: "Features durable task DAG topology, dependency scheduling, evidence verification, intelligent model routing, and closed-loop fault recovery.",
    },
  },
  "yuqi-token-guardian": {
    zh: {
      title: "宇奇 Token 守护者",
      categoryLabel: "DeepSeek 推理加速 / 节流拦截",
      tagline: "DeepSeek Harness 插件：削减重复推理重传 98.6%，官方 API 实测无质量损失。",
      description: "通过推理状态缓存指纹与增量提示词上下文比对，精确拦截大模型调用中的重复推理重传，显著降低 Token 消耗并提升响应速度。",
    },
    en: {
      title: "Yuqi Token Guardian",
      categoryLabel: "DeepSeek Reasoning Acceleration / Throttle",
      tagline: "DeepSeek Harness Plugin: Cuts repeated reasoning re-transmissions by 98.6% with zero quality degradation.",
      description: "Employs reasoning state fingerprints and incremental context matching to intercept redundant tokens, drastically saving cost and boosting throughput.",
    },
  },
  "spec-forge": {
    zh: {
      title: "需求锻造台",
      categoryLabel: "AI 需求工程 / 上下文管理",
      tagline: "双语可定制 AI 需求工程 Skill，将模糊上下文重构为清晰、可执行且可测试的高阶需求。",
      description: "针对大模型在复杂任务中理解偏差与遗忘痛点，提供结构化 PRD 生成、测试用例推导与边界防御规则。",
    },
    en: {
      title: "SpecForge",
      categoryLabel: "AI Requirement Engineering / Context Management",
      tagline: "Bilingual customizable AI spec skill: transforming ambiguous context into precise, testable requirements.",
      description: "Solves model hallucination and task drift by synthesizing structured PRDs, edge-case derivations, and strict operational boundaries.",
    },
  },
  "agent-project-map": {
    zh: {
      title: "代码库拓扑导图",
      categoryLabel: "工程资产定位 / Agent 拓扑记忆",
      tagline: "让 AI Agent 始终保持对代码库拓扑结构的精确记忆与状态感知。",
      description: "单文件零依赖设计，内置可检索锚点、强制状态标识与自动化自检能力，杜绝 Agent 在大型项目开发中盲目翻找文件。",
    },
    en: {
      title: "Agent Project Map",
      categoryLabel: "Asset Discovery / Agent Topological Memory",
      tagline: "Empowering AI agents with persistent, precise spatial memory and codebase topology.",
      description: "Single-file, zero-dependency blueprint with indexed anchors and state telemetry, preventing agents from hallucinating or aimlessly wandering through repos.",
    },
  },
  "zy-anti-slop-frontend-design": {
    zh: {
      title: "AI 前端反平庸设计知识库",
      categoryLabel: "前端美学规范 / 生产级 UI",
      tagline: "抵制千篇一律的 AI 模板垃圾代码，建立具有鲜明辨识度与生产可用水准的前端美学指南。",
      description: "包含排版尺度、负空间调度、物理阻尼微动效、状态机反馈与非对称构图的双语专业知识库。",
    },
    en: {
      title: "Anti-Slop Frontend Design",
      categoryLabel: "Design System Tokens / Production UI",
      tagline: "Rejecting generic AI template slop, establishing distinct, production-grade frontend aesthetic standards.",
      description: "Bilingual architectural knowledge base spanning typographic scales, spatial negative space, physics-based damping, and asymmetric composition.",
    },
  },
  "yike-album-downloader": {
    zh: {
      title: "一刻相册批量下载工具",
      categoryLabel: "自动化媒体迁移 / 原画下载",
      tagline: "支持百度一刻相册照片与视频原画质多线程批量下载与时间线智能整理。",
      description: "通过接口解析与多线程并发流水线，突破网页端单张下载限制，支持断点续传与媒体元数据无损保留，高效迁移个人数字相册资产。",
    },
    en: {
      title: "Yike Album Downloader",
      categoryLabel: "Automated Media Migration / Lossless Batch Pipeline",
      tagline: "Concurrent multi-threaded batch download tool for original-quality photos and videos.",
      description: "Bypasses web rate limits via concurrent pipeline, preserving lossless EXIF metadata, resuming broken transfers, and migrating digital archives efficiently.",
    },
  },
  "flyykjxzq": {
    zh: {
      title: "风灵月影修改器快捷下载器",
      categoryLabel: "游戏辅助 / 自动化检索工具",
      tagline: "AI 生成实用软件：通过网页信息爬取与自动化匹配，快捷检索并下载修改器。",
      description: "针对玩家频繁手动寻找、甄别真伪修改器的痛点，自动解析官方网页动态更新列表，一键提取真实下载地址，省去层层跳转与广告干扰。",
    },
    en: {
      title: "FLYYKJXZQ Utility",
      categoryLabel: "Game Utility / Automated Discovery",
      tagline: "AI-generated automation tool for direct trainer search and verified downloading.",
      description: "Eliminates deceptive ad portals and multiple redirections by scraping official release feeds directly to extract authentic download packages.",
    },
  },
  "titanium-spatial-skeleton": {
    zh: {
      title: "Web 视觉骨架与前端概念",
      categoryLabel: "磨砂钛金与全息光影实验",
      tagline: "打破传统系统工具笨重死板的刻板印象，用纯白浮雪与高光倒角重新定义工程美学。",
      description: "完整的 Web 前端设计骨架、CNC 边缘倒角高光计算、多重弥散物理投影与模块化布局系统。",
    },
    en: {
      title: "Titanium Spatial Skeleton",
      categoryLabel: "Frosted Titanium & Holographic Light Lab",
      tagline: "Re-imagining desktop engineering tools with snow-white matte surfaces and chamfered glint highlights.",
      description: "Modular web frontend design skeleton featuring CNC chamfer specular reflections, multi-point diffuse ambient lighting, and fluid layouts.",
    },
  },
};
