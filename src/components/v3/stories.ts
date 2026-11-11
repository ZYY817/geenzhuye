/* ============================================================================
 * 详情页正文（2026-11-09 第二版：面向招聘方和用户，说人话）
 * ----------------------------------------------------------------------------
 * 栏目：背景 / 定位 / 核心能力 / 构建 / 成果。没有内容的栏目不显示。
 * 写法参照 lieflat-less-ai-tone：直接说判断，不用「不是…而是…」翻案句、
 * 不用「总结：」式提示冒号、句内不堆三项以上顿号罗列、相邻句不套同一个句式。
 * 重点数值用 **…** 标出（页面上加深加粗）。
 * 只写有依据的事实：宇奇引擎的「构建」由智宇逐条确认；其余项目的「构建」只写
 * README 里明确的架构做法；一刻相册、奇览的说法来自智宇本人的描述，奇览数据取自
 * 2026-11-09 线上站点。
 * ==========================================================================*/

import type { Lang } from "./projects";

export type Story = {
  bg?: string;
  pos?: string;
  caps?: string[];
  /** 构建：开头一句 + 若干「要点 / 说明」 */
  build?: { lead?: string; items?: [string, string][] };
  out?: string;
  /** 自定义栏目（例如复盘类项目）：有它时替代上面五个固定栏目 */
  custom?: [string, string | string[]][];
};

const S: Record<string, { zh: Story; en: Story }> = {
  "yuqi-engine": {
    zh: {
      bg: "很多玩家玩到一定程度，会自己研究怎么提高帧数、降低延迟。可这些设置散落在 Windows 的各个角落，要一项项去找；市面上的优化工具大多一键改完，也不告诉你改了什么，出了问题很难改回去。",
      pos: "宇奇引擎把这些优化项集中到一个软件里，每一项都写明作用、风险和恢复办法，适合想自己动手调优的玩家和系统爱好者。",
      caps: [
        "和帧数、延迟有关的优化项集中在一处，按需开关",
        "修改前先读取电脑当前的真实状态，只做检测时不会改动系统",
        "每一项改动都能备份，也能一键还原",
        "遇到问题可以一键生成问题包，方便反馈",
      ],
      build: {
        lead: "整个软件用 AI 开发，主要用 Claude、Cursor 和 Codex，我负责定需求、定规则和把关质量。",
        items: [
          ["先写需求，再写代码", "每个功能先写成需求文档，再交给 AI 实现，返工少了很多"],
          ["结构化提示词", "把角色、约束和验收标准写成固定模板，迭代很多轮后代码风格也不跑偏"],
          ["项目规则文件", "用规则文件告诉 AI 这个项目该怎么写代码，换一个对话或换一个工具都能接上"],
          ["项目地图", "维护一份代码地图，AI 能直接找到要改的地方，不用每次把整个项目读一遍"],
          ["模块化架构", "每个优化项是一个独立模块，都按「检测、应用、复核、恢复」四步走，加新功能不用动主框架"],
          ["多个 AI 交叉审查", "一个 AI 写完，换另一个 AI 来审代码和方案，能找出单个模型看不到的问题"],
          ["测试与真机验证", "跑完自动化测试，每次改动还要在真机上试一遍。AI 说做完了，我要亲眼确认"],
        ],
      },
      out: "GitHub 上有 **660 多颗星**，和另外几款游戏工具加起来累计下载超过**十万次**。做这个项目的过程，也让我摸索出一套用 AI 开发桌面软件的方法。",
    },
    en: {
      bg: "Plenty of players eventually start tuning their PCs for higher frame rates and lower latency. The settings are scattered all over Windows, and most optimizers change everything in one click without saying what they did, which makes problems hard to undo.",
      pos: "YuqiEngine puts these settings in one app and explains each one: what it does, the risk, and how to undo it. It’s for players and enthusiasts who want to tune things themselves.",
      caps: [
        "Settings that affect frame rate and latency, in one place, switched on as needed",
        "Reads the PC’s real state before changing anything; a scan never touches the system",
        "Every change can be backed up and undone in one click",
        "One click creates a diagnostic bundle for feedback",
      ],
      build: {
        lead: "Built entirely with AI, mainly Claude, Cursor and Codex. I set the requirements and rules and own the quality.",
        items: [
          ["Spec before code", "Each feature is written up as a spec before AI builds it, which cuts rework a lot"],
          ["Structured prompts", "Role, constraints and acceptance criteria live in fixed templates, so the code style holds over many iterations"],
          ["Project rule files", "Rule files tell AI how this project is written, so a new session or a different tool picks up where the last left off"],
          ["Project map", "A maintained code map lets AI go straight to the right place instead of re-reading the whole project"],
          ["Modular architecture", "Each optimization is its own module with the same four steps: detect, apply, verify, restore"],
          ["Cross-review by multiple AIs", "One model writes, another reviews the code and the plan, catching what a single model misses"],
          ["Tests and real-machine checks", "After automated tests, every change runs on a real machine. When AI says it’s done, I check for myself"],
        ],
      },
      out: "**660+ GitHub stars**, and together with a few other game tools, more than **100,000 downloads**. Building it gave me a working method for making desktop software with AI.",
    },
  },

  "yuqi-lite": {
    zh: {
      bg: "电脑后台常常挂着一堆看不懂名字的进程。结束掉之后，有些很快又自己启动了，清理软件却还显示「已关闭」。",
      pos: "宇奇轻管把后台进程按软件归类，说清楚每个是干什么的；关掉之后再检查一遍，如实告诉你到底关没关掉。",
      caps: [
        "按软件归类进程，并附上用途说明",
        "结束后重新检查一次，被别的程序拉起来的会如实标出",
        "常用软件可以加入保护名单，顽固程序可以阻止它自动重启",
        "能找出各处的开机自启项，禁用前自动备份，随时可以还原",
      ],
      build: {
        lead: "用 AI 开发。",
        items: [
          ["分层架构", "界面和核心逻辑分开写，各个功能模块互不影响"],
          ["不联网", "不收集任何数据，所有设置都保存在本机"],
        ],
      },
      out: "**10 月 28 日**凌晨开工，已经发布安装版和免安装版，MIT 开源。",
    },
    en: {
      bg: "A PC’s background is full of processes with names nobody understands. End one and it often starts itself again, while the cleaner still says it’s closed.",
      pos: "Yuqi Lite groups processes by app and explains what each one does. After closing an app it checks again and tells you honestly whether it really closed.",
      caps: [
        "Processes grouped by app, each with a short explanation",
        "Re-checks after closing and flags anything another program relaunched",
        "Protect the apps you rely on, and stop stubborn ones from restarting",
        "Finds startup entries everywhere, backs them up before disabling, and restores them anytime",
      ],
      build: {
        lead: "Built with AI.",
        items: [
          ["Layered architecture", "UI and core logic are separate, and feature modules don’t affect each other"],
          ["Offline", "No data is collected; all settings stay on your PC"],
        ],
      },
      out: "Started in the small hours of **October 28**. Installer and portable builds are out, MIT-licensed.",
    },
  },

  "wanji-kit": {
    zh: {
      bg: "游戏打不开，很多时候是电脑缺了某个运行库。网上的整合包来路不明，装完也不知道到底装上没有。",
      caps: [
        "一键检测 **32 项**运行库和常用系统设置",
        "缺的项目排好队，只需授权一次就能全部装上",
        "优先用微软官方的 winget 安装，没有 winget 时改用官方下载链接",
        "装完逐项复查；实在装不了的，会给出官方的手动安装方法",
      ],
      build: {
        lead: "用 AI 开发。",
        items: [
          ["组件清单数据化", "所有组件写在一份 JSON 文件里，加新组件只改数据，不用改代码"],
          ["演示模式", "可以用假数据把整个流程跑一遍，检查界面和动画，不会动到系统"],
        ],
      },
      out: "免安装版已发布，支持中文和英文。",
    },
    en: {
      bg: "When a game won’t launch, a missing runtime is often the cause. The all-in-one packs online come from who knows where, and you can’t tell what actually got installed.",
      caps: [
        "One-click check of **32** runtimes and common system settings",
        "Missing items are queued and installed after a single permission prompt",
        "Installs through Microsoft’s winget first, falling back to official download links",
        "Re-checks every item afterwards; for anything it can’t install, it shows the official manual steps",
      ],
      build: {
        lead: "Built with AI.",
        items: [
          ["Catalog as data", "Every component lives in one JSON file, so adding one means editing data, not code"],
          ["Demo mode", "Runs the whole flow on fake data to check the UI and animations without touching the system"],
        ],
      },
      out: "Portable build released, in Chinese and English.",
    },
  },

  aimframe: {
    zh: {
      bg: "很多玩家用的是 27 寸甚至更大的显示器，而 CS2、无畏契约的职业比赛用的是 24.5 寸屏。屏幕大了，小地图、血量和弹药离屏幕中心更远，看一眼要多走一段视线。NVIDIA 控制面板能手动缩小画面，但每次都要建自定义分辨率、改缩放模式，玩完再改回去，步骤多，改错了还容易黑屏。",
      pos: "AimFrame 把这套操作做成了一个按钮。选好尺寸点应用，画面会在显卡层面缩成 24.5 寸大小并居中，四周留黑边；玩完点还原就行。",
      caps: [
        "按屏幕对角线比例计算，27 寸 4K 屏缩到 24.5 寸时画面占 **90.2%**",
        "NVIDIA 显卡走驱动级缩放，可以精确到 0.1 寸，不增加输入延迟",
        "AMD 和 Intel 显卡用系统缩放；任何显卡都能只缩小游戏窗口",
        "全局热键一键应用或还原，常用尺寸可以存成配置",
      ],
      build: {
        lead: "用 AI 开发。改分辨率出错的代价大，所以留了几层退路。",
        items: [
          ["15 秒确认", "应用后 15 秒内不点保留，就自动改回原来的分辨率，黑屏也不怕"],
          ["失败当场回滚", "应用失败时立刻恢复原分辨率和缩放模式"],
          ["应急还原", "不依赖保存的状态，直接回到原生设置，热键 Ctrl+Alt+R"],
        ],
      },
      out: "单文件发布，双击就能运行，不用安装 .NET。",
    },
    en: {
      bg: "Many players use 27-inch or larger monitors, while CS2 and Valorant pros play on 24.5-inch screens. On a bigger screen the minimap, health and ammo sit farther from the center, so every glance travels further. NVIDIA’s control panel can shrink the picture by hand, but it means creating a custom resolution and changing the scaling mode every time, then undoing it all, and a mistake can leave you with a black screen.",
      pos: "AimFrame turns that into one button. Pick a size and apply: the picture shrinks to 24.5 inches at the graphics level, centered with black borders. Hit restore when you’re done.",
      caps: [
        "Scales by the diagonal; a 27-inch 4K screen shrunk to 24.5 inches keeps **90.2%** of the picture",
        "On NVIDIA it scales at driver level, accurate to 0.1 inch, with no added input lag",
        "AMD and Intel use system scaling, and any GPU can shrink just the game window",
        "Global hotkeys apply or restore in one press; favorite sizes can be saved",
      ],
      build: {
        lead: "Built with AI. A wrong resolution change is costly, so there are several ways back.",
        items: [
          ["15-second confirm", "If you don’t confirm within 15 seconds, it reverts automatically, even on a black screen"],
          ["Instant rollback", "If applying fails, the original resolution and scaling are restored on the spot"],
          ["Emergency restore", "Returns to native settings without relying on saved state, on Ctrl+Alt+R"],
        ],
      },
      out: "Ships as a single file: double-click to run, no .NET install needed.",
    },
  },

  "yuqi-team-orchestrator": {
    zh: {
      bg: "把一个大任务交给单个 AI，它容易做着做着跑偏，或者卡在半路；它说「做完了」，实际也不一定完成。",
      pos: "这是一个调度插件。一个「控制者」把目标拆成多个小任务，分给多个 AI 同时去做，每一步都要有检查结果才算完成。",
      caps: [
        "按任务之间的依赖关系和涉及的文件，安排多个 AI 并行工作",
        "用构建、测试和截图检查来判断结果，AI 自己说完成了不算数",
        "任务可以暂停、恢复和重试，也能换模型或交给人工接手",
        "控制者不在时，任务会停下来等待，不会接着乱猜",
      ],
      build: {
        lead: "用 AI 开发。",
        items: [["分层架构", "核心逻辑不依赖具体的宿主程序和界面，只有一层适配代码负责对接外部"]],
      },
      out: "**0.0.1** 开发者预览版已开源，界面支持中文和英文。",
    },
    en: {
      bg: "Give one AI a big task and it tends to drift or stall halfway, and when it says “done”, that isn’t always true.",
      pos: "A scheduling plugin. A controller splits the goal into smaller tasks and hands them to several AIs at once; a step only counts as done when a check confirms it.",
      caps: [
        "Runs several AIs in parallel, scheduled by task dependencies and the files involved",
        "Judges results by builds, tests and screenshot checks; an AI saying it’s done doesn’t count",
        "Tasks can be paused, resumed and retried, or moved to another model or a person",
        "When the controller is away, work stops and waits instead of guessing",
      ],
      build: {
        lead: "Built with AI.",
        items: [["Layered architecture", "The core logic doesn’t depend on the host program or UI; a thin adapter layer handles the outside world"]],
      },
      out: "The **0.0.1** developer preview is open source, with a Chinese and English UI.",
    },
  },

  "yuqi-token-guardian": {
    zh: {
      custom: [
        ["背景", "DeepSeek 在长任务里偶尔会「思考失控」，模型反复打转几个小时，烧掉几千万 token。我想做一个插件，压缩每一步都要重复发送的思维链，减少浪费。"],
        ["验证过程", [
          "抓包确认官方接口每一步都会把历史思维链重新发一遍，请求从 55K 涨到 85K 还在涨",
          "但这部分约 **93%** 命中前缀缓存，按缓存价计费",
          "会话中途切换思考档位，缓存会全部失效，整段历史重新按全价计费",
          "max_tokens 上限是服务端的硬截断，实测正好截在设定值",
        ]],
        ["为什么没用", [
          "指标选错了。插件把重复发送的字符减少了 **98.6%**，可这部分本来就按缓存价计费，真实账单的节省一直没被证明",
          "核心机制反而亏钱。中途换思考档位会让缓存失效，长会话里换一次，全部历史都要重新按全价算",
          "真正能止损的手段没打开。token 硬上限和打转检测被做成了默认关闭的提醒，不收敛的模型根本不理会提醒",
          "层级选错了。问题出在框架的序列化层，第三方插件只能绕路",
          "先做后测。开发用的网关本来就会去掉思维链，插件写完才在真实环境里测出来",
        ]],
        ["留下的结论", [
          "真遇到这个问题，把 reasoningEffort 调到 low 或 medium，再设一个 max_tokens 上限，两行配置就够了",
          "算 AI 调用成本要分三块看，没命中缓存的前缀按全价，命中的按缓存价，输出也按全价。省钱先减少往返次数，其次保持前缀稳定，最后才是裁剪内容",
          "计划里写了「先探测再开发」，下一次要真的先做",
        ]],
        ["现状", "已归档，不再维护。代码和完整复盘公开在 GitHub（MIT）。"],
      ],
    },
    en: {
      custom: [
        ["Context", "On long tasks DeepSeek sometimes “thinks out of control”, looping for hours and burning tens of millions of tokens. I set out to build a plugin that compresses the reasoning history re-sent at every step."],
        ["What I measured", [
          "Packet captures confirmed the official API re-sends past reasoning on every step; requests grew from 55K to 85K and kept climbing",
          "But about **93%** of it hit the prefix cache and was billed at the cache price",
          "Switching the thinking level mid-session invalidated the whole cache, re-billing the entire history at full price",
          "max_tokens is a hard server-side cut, and measurements stopped exactly at the cap",
        ]],
        ["Why it didn’t work", [
          "Wrong metric. Re-sent characters dropped by **98.6%**, but that traffic was already billed at the cache price; real savings were never shown",
          "The core mechanism lost money. Changing the thinking level breaks the cache, so one switch in a long session re-bills everything at full price",
          "The real safeguards were switched off. Hard token caps and loop detection shipped as opt-in reminders, and a looping model ignores reminders",
          "Wrong layer. The problem sits in the framework’s serializer; a third-party plugin can only work around it",
          "Built before testing. The dev gateway already stripped reasoning, so the real behavior only showed up after the plugin was written",
        ]],
        ["What I kept", [
          "If you really hit this problem, two settings cover most of the bill: reasoningEffort at low or medium, plus a max_tokens ceiling",
          "AI call cost has three parts: uncached prefix at full price, cached prefix at cache price, output at full price. Cut round-trips first, keep the prefix stable second, trim content last",
          "The plan said “probe before building”. Next time I’ll actually do it",
        ]],
        ["Status", "Archived and no longer maintained. Code and the full postmortem are public on GitHub (MIT)."],
      ],
    },
  },

  "agent-project-map": {
    zh: {
      bg: "用 AI 写代码时，它每接一个新任务，都要把整个项目重新翻一遍，又慢又浪费上下文。我以前总在提示词里加一句「先建一份项目地图」，后来干脆把这个习惯做成了一个 Skill。",
      caps: [
        "让 AI 维护几份简短的地图文档，记下每个功能在哪、彼此怎么关联",
        "每条记录都带可搜索的关键词，并标明是否已经核实过",
        "改代码时顺手更新地图，有疑问的条目会重新核对",
        "只有一个文件，Claude Code、Codex 和 Cursor 都能直接用",
      ],
      out: "已在 GitHub 开源（MIT）。",
    },
    en: {
      bg: "AI coding tools re-read the whole project for every new task, which is slow and wastes context. I used to add “build a project map first” to my prompts, so I turned the habit into a skill.",
      caps: [
        "Has AI keep a few short map docs: where each feature lives and how the parts connect",
        "Every entry has searchable keywords and a note on whether it has been verified",
        "The map is updated alongside code changes, and doubtful entries get re-checked",
        "A single file that works with Claude Code, Codex and Cursor",
      ],
      out: "Open source on GitHub (MIT).",
    },
  },

  "enterprise-efficiency-suite": {
    zh: {
      bg: "企业里有很多每天重复、很耗人力的工作，比如写商品文案、回复用户评价。",
      caps: ["自动生成商品文案", "智能回复用户评价", "批量筛选记录", "按设定的意图生成评论"],
      out: "一共**十余款**工具，交付给企业内部使用，所以没有公开演示。",
    },
    en: {
      bg: "Companies spend a lot of people’s time on the same tasks every day, like writing product copy and replying to reviews.",
      caps: ["Product copy generation", "Smart replies to customer reviews", "Batch record filtering", "Comments drafted to a set intent"],
      out: "**Ten-plus** tools delivered for internal use, so there is no public demo.",
    },
  },

  "spec-forge": {
    zh: {
      bg: "写需求很少是从零开始的，更多时候手上只有一场没结论的会议记录，或者一段聊天记录。",
      caps: [
        "从零散的材料里找出真正要解决的问题",
        "把事实、已定的结论和待确认的事分开写清楚",
        "结合上下文，修正会议转录里的错别字和术语",
        "按需求的复杂程度选择写法，写到开发和测试都能照着验收",
      ],
      out: "MIT 开源，支持中英文，可以按自己团队的习惯修改。",
    },
    en: {
      bg: "Requirements rarely start from scratch. Usually all you have is notes from a meeting that reached no conclusion, or a chat thread.",
      caps: [
        "Finds the real problem in scattered material",
        "Keeps facts, settled decisions and open questions clearly apart",
        "Fixes mis-transcribed words and terms using context",
        "Picks a format by how complex the need is, detailed enough for engineering and QA to verify",
      ],
      out: "MIT-licensed, in Chinese and English, and easy to adapt to a team’s own habits.",
    },
  },

  "work-report-skill": {
    zh: {
      bg: "写周报的时候，很容易漏写事项，或者把「还在排查」写成「已解决」，为了好看把成果写大。",
      caps: [
        "每一件事都保留，状态照实写",
        "按重要程度排序，并根据读者和发送渠道调整格式",
        "会记住你认可过的写法，下次照着写",
        "只有几个文本文件，不用联网，也不需要密钥",
      ],
      out: "**2026 年 8 月**在 Codex Desktop 上实测通过，已开源。",
    },
    en: {
      bg: "Weekly reports easily drop items, turn “still investigating” into “fixed”, or inflate results to look good.",
      caps: [
        "Keeps every item and states its status as it is",
        "Orders by importance and adapts the format to the reader and channel",
        "Remembers the phrasing you’ve approved and reuses it",
        "Just a few text files: no network, no keys",
      ],
      out: "Tested in Codex Desktop in **August 2026**; open source.",
    },
  },

  "zy-anti-slop-frontend-design": {
    zh: {
      bg: "让 AI 写网页，做出来的总是差不多的样子，一样的字体，紫色渐变，再加三张圆角卡片。",
      caps: [
        "整理了 **170 多篇**设计文档，可以搜索，也可以组合着用",
        "把「好看」拆成具体的设计原则和用词",
        "专门讲怎么避开 AI 默认的那套审美",
        "附一份检查清单，做完可以对照打分、改问题；放进项目里，Claude Code 和 Cursor 就能读到",
      ],
      out: "免费公开，采用 CC BY 4.0 协议，中英双语。",
    },
    en: {
      bg: "Ask AI for a web page and you keep getting the same look: the same fonts, a purple gradient and three rounded cards.",
      caps: [
        "**170+** design docs you can search and combine",
        "Breaks “good-looking” down into concrete principles and vocabulary",
        "Shows how to steer away from AI’s default taste",
        "Comes with a checklist to score and fix the result; drop it into a project and Claude Code or Cursor can read it",
      ],
      out: "Free and public under CC BY 4.0, in Chinese and English.",
    },
  },

  "wanji-index": {
    zh: {
      bg: "PC 游戏的资源站、工具、教程和问题解决办法散落在网上各处，很难分辨真假，过时的信息也没人更新。",
      pos: "玩机索引是一个中文的 PC 游戏资源和工具索引网站，每条内容都经过校验，每天自动更新。",
      caps: [
        "游戏、资源站、工具和教程放在一起，用一个搜索框就能找到",
        "自动收集限时免费的游戏，显示北京时间倒计时，到期自动下架",
        "没确认过的信息会标上「未核验」，不写猜测",
      ],
      build: {
        lead: "用 AI 开发。",
        items: [
          ["数据驱动", "每条内容都是一份格式固定的数据，页面、搜索和站点地图在构建时自动生成"],
          ["校验不过不上线", "每次发布前先检查数据，另有专门的反例测试，确保错误数据会被拦下"],
        ],
      },
      out: "已上线，每天自动更新。",
    },
    en: {
      bg: "Resources, tools, guides and fixes for PC games are scattered across the web. It’s hard to tell what to trust, and nobody updates what goes stale.",
      pos: "Wanji Index is a Chinese index of PC game resources and tools. Every entry is validated, and the site updates itself daily.",
      caps: [
        "Games, resource sites, tools and guides in one place, behind one search box",
        "Collects limited-time free games automatically, with a Beijing-time countdown and removal on expiry",
        "Unconfirmed information is marked “unverified” instead of guessed",
      ],
      build: {
        lead: "Built with AI.",
        items: [
          ["Data-driven", "Every entry is fixed-format data; pages, search and the sitemap are generated at build time"],
          ["No release without validation", "Data is checked before every release, and dedicated negative tests make sure bad data is stopped"],
        ],
      },
      out: "Live and updated daily.",
    },
  },

  "qilan-atlas": {
    zh: {
      bg: "我用 AI 做网页时，总在说「再好看一点」。后来才发现问题在我自己，是我没有把「好看」说清楚。",
      pos: "奇览是一个视觉语言知识库。我用 AI 按自己的理解，为每种风格和设计概念生成了演示页面，看一眼就知道它长什么样，还能直接拿到写给 AI 的提示词。",
      caps: [
        "收录 **635** 个词条，从设计风格、页面原型到视觉元素和设计术语",
        "每个词条讲清楚它是什么、长什么样、和相近的概念有什么区别，最后给出可以直接复制的提示词",
        "不少词条可以拖动滑块，实时看参数变化对画面的影响",
        "「灵感参考」整理了 **75** 个外部的优秀网站和设计资源",
        "可以收藏词条，支持中文和英文",
      ],
      out: "已上线，还在持续更新。用 Vibe Coding 做网页时，它能帮你把想要的感觉准确地告诉 AI，做出更好的视觉效果。",
    },
    en: {
      bg: "Building web pages with AI, I kept saying “make it look better”. Eventually I realised the problem was mine. I couldn’t say what “better” meant.",
      pos: "Qilan is a visual-language library. I used AI to build a demo page for each style and design concept as I understand it, so you can see what it looks like at a glance and copy a ready-made prompt.",
      caps: [
        "**635** entries, from design styles and page prototypes to visual elements and design terms",
        "Each entry explains what it is, how it looks and how it differs from similar ideas, then gives a prompt to copy",
        "Many entries have sliders that show live how a parameter changes the result",
        "An inspiration list of **75** outstanding external sites and design resources",
        "Save entries to a collection; Chinese and English",
      ],
      out: "Live and still growing. When you build pages by vibe coding, it helps you describe the look you want to AI precisely.",
    },
  },

  "yike-album-downloader": {
    zh: {
      bg: "一刻相册的网页版和手机 App 只能一张一张地下载，想把几年的照片和视频存回电脑，非常耗时。",
      pos: "扫码登录后，这个工具会自动下载全部照片和视频，不用守在电脑前。",
      caps: [
        "**15 个线程**同时下载，保留原画质",
        "网络中断后可以接着下载，并校验文件是否完整",
        "按拍摄日期自动分好文件夹",
        "下载失败会自动重试，没成功的可以单独再下",
      ],
      out: "已开源。",
    },
    en: {
      bg: "Yike Album’s website and phone app only download one item at a time, so getting years of photos and videos back onto a computer takes forever.",
      pos: "After a QR-code login, this tool downloads every photo and video on its own, so you don’t have to sit and watch.",
      caps: [
        "**15 threads** at once, at original quality",
        "Resumes after a dropped connection and checks every file is complete",
        "Sorts everything into folders by capture date",
        "Retries failures automatically; anything that still fails can be downloaded again on its own",
      ],
      out: "Open source.",
    },
  },

  flyykjxzq: {
    zh: {
      bg: "想给单机游戏找一个风灵月影修改器，要在网页里来回翻、躲广告，还得知道游戏的英文名。",
      caps: ["输入中文游戏名，自动翻成英文去搜索", "直接提取官方的下载链接", "可以同时下载多个版本，显示进度和速度"],
      out: "已开源，网盘里有打包好的版本，下载就能用。",
    },
    en: {
      bg: "Finding a FLiNG trainer for a single-player game means clicking through pages, dodging ads and knowing the game’s English title.",
      caps: ["Type the Chinese title and it searches by the English one", "Pulls the official download link directly", "Downloads several versions at once, with progress and speed"],
      out: "Open source, with a ready-to-run build on a cloud drive.",
    },
  },
};

export const storyOf = (id: string, lang: Lang): Story => S[id]?.[lang] ?? S[id]?.zh ?? {};
