/* ============================================================================
 * 关于页文案 (Profile content) —— 中英双语，全部由本文件驱动。
 * ----------------------------------------------------------------------------
 * 克制版：一页只讲一件事——我是谁、我做过什么、想做什么。
 * 不列工作履历表；邀请语本身即联系入口（点击展开联系浮层）。
 * ==========================================================================*/

export type ProfileCopy = {
  kicker: string;    // 页面小标签
  statement: string; // 一句话主张（大标题）
  facts: string[];   // 事实横条（位置 · 方向 · 状态）
  bio: string[];     // 自我介绍段落——讲做过什么事，不列履历
  cta: string;       // 邀请语（点击展开联系浮层）
};

export const PROFILE: Record<"zh" | "en", ProfileCopy> = {
  zh: {
    kicker: "关于 / About",
    statement: "把经验变成方法，把方法做成工具，让工具帮到更多人。",
    facts: ["深圳 · GMT+8", "AI 产品方向", "正在看新机会"],
    bio: [
      "我是智宇。白天在车企数字营销领域负责系统建设，晚上做独立开发——用 AI 把重复的工作变成工具。十三款自研产品都始于我自己遇到的真实问题：游戏掉帧、需求模糊、素材散乱、效率黑洞。",
      "我的工作方式是 AI 协作：我定义问题、做决策、验收质量，AI 承担检索、生成与体力活。宇奇引擎用这套方式做到 100,000+ 真实安装。对我来说，AI 不是简历上的关键词，是每天都在用的生产力。",
    ],
    cta: "如果你对我做的事感兴趣，欢迎来聊聊——最近在找能长期发展的新机会。",
  },
  en: {
    kicker: "About",
    statement: "Turn experience into methods, methods into tools — and let the tools help more people.",
    facts: ["Shenzhen · GMT+8", "AI product direction", "Open to new opportunities"],
    bio: [
      "I'm Zhiyu. By day I lead digital-marketing systems at an automaker; by night I'm an independent developer, turning repetitive work into tools with AI. Each of my thirteen products started from a real problem I hit: frame drops, vague requirements, scattered assets, efficiency black holes.",
      "My way of working is AI collaboration: I define problems, make the calls and gate the quality, while AI handles retrieval, generation and heavy lifting. YuqiEngine shipped this way reached 100,000+ real installs — to me AI isn't a résumé keyword, it's daily production capacity.",
    ],
    cta: "If what I make interests you, come say hi — I'm looking for a place to grow long-term.",
  },
};
