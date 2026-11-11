# 交接文档 · 智宇个人主页 (geenzhuye)

> 更新：2026-10-29（macOS 本机实测后重写）。这是**唯一的总入口**，接手前请从头读完。
> `HANDOVER_SPLIT_DETAIL.md` 是上一轮「滚筒 + 详情」的过程记录，背景可参考，但状态以本文件为准。

---

## 〇、先读这一段

**这个页面给谁看**：放在简历里的个人主页链接，主要读者是招聘方和面试官，其次是 AI 社区的同行（会发自荐帖）。读者通常只扫 10 秒左右，所以页面的首要目标是让人**一眼看懂这三件事**：

1. 你是谁、想做什么：AI 产品方向，正在看新机会
2. 你做出过什么，可不可信：真实安装量、Stars、9 个项目
3. 想细看时能不能点进去：可以，点进去是滚筒 + 详情

**风格**：高级、简约、克制。像一本安静的画册，不像技术面板。

**目前的进度**：
- 首页和详情态的功能都做完了，本机全部验证通过（结果见第四节）
- **还没有部署**，线上 `https://zhiyu817.vercel.app` 仍是很早以前的旧版
- 还剩一批手感和视觉上的缺口（第五节），按优先级排好了，可以直接照着做

---

## 一、环境与运行

| 项 | 说明 |
|---|---|
| 项目目录（Mac） | `/Users/sunyuqi/Downloads/geenzhuye/geenzhuye-handover/geenzhuye` |
| 项目目录（Windows） | `F:\yuqiAI\grzy\geenzhuye-handover\geenzhuye` |
| Next.js | 16.3.6，**有破坏性变更**，改 Next API 之前先读 `node_modules/next/dist/docs/` |
| React / framer-motion / Tailwind | 19.2.8 / 13.4.3 / 4.3.3 |
| 平滑滚动 | lenis 1.3.27 |
| 字体 | **系统字体**（Mac 苹方/SF，Windows 雅黑 UI/Segoe UI）+ Geist Mono（数字、标签）。2026-10-31 起不再用 Noto Sans SC，见第十一轮 |
| Node / pnpm | Node 24 / pnpm 11 |

```bash
pnpm install          # 换电脑后必须重装：Windows 带来的 node_modules 在 Mac 上不能用，反之亦然
pnpm dev -p 3200      # 3000 端口历史上有僵尸进程，统一用 3200
```

**验证三件套**（每次改完都要跑，全部通过才算完成）：

```bash
npx tsc --noEmit
npx eslint . --max-warnings=0
npx next build
```

**注意事项**：
- 从 macOS 拷到 Windows 会出现 `._*` 文件（AppleDouble 元数据），会让 ESLint 报解析错误。先确认确实是这类文件，再删除。
- **Git 状态比较乱**：这个目录本身不是独立的 Git 仓库。在 Mac 上它嵌在旧仓库 `/Users/sunyuqi/Downloads/geenzhuye`（远端 `ZYY817/geenzhuye`）里，旧仓库的 `git status` 会把所有文件显示成「已删除」。**不要在外层仓库直接 commit 或清理**，先和用户确认用哪种方式管理版本（建议：把本目录内容覆盖回仓库根目录后再提交）。
- 终端里中文偶尔会显示成乱码，以浏览器里的实际渲染为准。

---

## 二、页面结构（当前，已获用户认可）

### 首页（单栏，居中 660px）

```
顶栏：徽记 智宇 / ZYY817                      联系 ▾   EN   ◐
      （「联系」点开才显示：微信、邮箱一键复制，B站、抖音、GitHub 外链）

Hello，我是智宇。                         ← 打字机
把我懂的经验和思考，借助 AI 去帮到更多的人。
AI 产品方向 · 正在看新机会                 ← 打字结束后浮现
100,000+ 优化工具安装量   600+ GitHub Stars   9 款 自研与开源工具
                                           （安装量从 0 滚动到 100,000）

定位说明：这里的每一项都始于我遇到的真实问题，由 AI 协作完成……

主要项目          01 宇奇引擎 … 04 奇览
AI 技能与知识库   05 需求锻造台、06 AI 前端反平庸设计知识库
实用小工具        07 一刻相册、08 风灵月影、09 企业自动化增效工具集
  每行：序号 · 标题 · 一句话 ………… 状态  →
  悬停：光标旁弹出跟随的预览图（只有带 coverImage 的项目才有），其他行变淡

页脚：智宇 · ZYY817 / 结语        深圳 GMT+8 实时时钟 · 更新于 2026.10
```

### 第三轮结构重做（2026-10-29 晚，当前实现）

- **顶栏 / 页脚固定在页面两侧边缘**（`max-w-[1440px]`、`h-[72px] sm:h-[88px]`、sticky + 半透明白底模糊，无边线），索引态与详情态几何完全相同。实测 5 种环境下切换全程 logo 与右侧按钮坐标**零位移**。不要再给顶栏加 `max-width` 过渡。
- **视图切换不再动画高度**：Hero 作为 `hero` prop 交给 `WorkStream`，和索引一起在 `AnimatePresence mode="wait"` 里淡出（0.22s，EASE_EXIT）→ 新视图挂载 → `jumpTo()`（`SmoothScroll.tsx` 导出，走 Lenis immediate）跳滚动位置。去详情跳到顶部，返回时**回到点击前的滚动位置**。
- **标题 FLIP**：克隆体在索引淡出期间停在原位，滚筒挂载后用 cubic-out(4) 620ms 飞向对焦行，缩放按字号比（16px → 24px）。
- **详情布局**：`DetailStage` 组件（滚筒 effect 跟随挂载），`grid-cols-[300px_1fr] xl:[340px_1fr]`，栏间距 `clamp(56px,8vw,140px)`。左栏 sticky 占满视口剩余高度：顶部返回、中部滚筒垂直居中、底部大号序号 `05 / 09`（强调色，按方向纵向翻牌）。
- **滚筒**：所有行同字号 `clamp(20px,1.7vw,24px)` medium，纵深由 CSS 变量 `--s`（缩放，最低 0.66）和 `--o`（明度 0.42^距离）表达。**注意**：滚动容器必须 `relative`，否则 `offsetTop` 以 sticky aside 为基准，高亮会偏两行。
- **右栏**：标题 `clamp(34px,4.2vw,60px)` medium，元信息行序号用强调色，链接上移到简介下方（下划线从左扫入），底部新增「上一个 / 下一个」相邻项目导航（纯文字项目也有落点）。切换按滚筒方向**纵向**进出（原来是横向，与滚筒方向不一致）。切换后若页面已下滚会跳回顶部。
- **强调色**：`globals.css` 新增 `--accent`（浅色 `#2a3bff`，深色 `#8f9bff`），Tailwind 中是 `text-accent`/`bg-accent`。只用于：安装量数字、悬停行序号与箭头、详情序号、滚筒计数器、外链箭头、宇奇 tab 下划线。**不要扩散**到正文或大面积底色；想换颜色只改这两个值。
- Hero 主标题 `font-medium tracking-[-0.02em]`，更有分量。

### 第四轮质感细节（签名动效，2026-10-29 夜）

新增 `src/components/site/Kinetic.tsx` 排印动效原语（只动文字，不加框线）：
- `RollText`：索引行悬停时标题逐字向上翻滚，下层强调色同字接上（16ms/字错峰）。索引标题统一 `font-medium`
- `SplitRise`：逐字自裁切框内升起。**视口检测必须挂在外层**（字符被移到裁切框外时自身相交比恒为 0，`whileInView` 永远不触发——踩过）
- `Odometer`：机械里程表，每位数字一列滚动，低位多转两圈、高位不转，左高位先启动。用于首页三个数据
其他：
- 详情标题改为逐字升起（方向跟随滚筒）；图片改为自下而上帘幕揭开（clip-path）+ 1.14→1 沉降；宇奇 tab 切换为新图从右侧帘幕扫入盖住旧图
- 索引行分隔发丝入场时自左向右画出（scaleX）；分组标签带上标计数 `主要项目⁰⁴`
- 页脚重做：大号一句话 + 巨幅署名「智宇」逐字升起 + 强调色圆点弹簧落入 + 小字版权/时钟/更新时间
- 主题切换：以点击点为圆心圆形扩散（View Transitions API + `::view-transition-new(root)` clip-path），切换期间 `.theme-switching` 冻结颜色过渡；不支持或减弱动态时直接切换
- **坑**：外层 `AnimatePresence initial={false}` 会关掉**所有子孙**的首次入场动画（之前导致首页索引错峰和首次打开详情全部没有动画）。两层 AnimatePresence 都已去掉 `initial={false}`，代码里留了注释，不要加回去

### 第五轮：时间线审计与编排重构（实测，1440×900，`/tmp/timeline.py` 逐帧采样）

**首访加载**（ms，自首帧；h1 起点 ~620ms 含 JS 加载 + 200ms 静默）

| 元素 | 改前 落定 | 改后 落定 | 说明 |
|---|---|---|---|
| 顶栏 | 978 | 998 | 0.6s 下落淡入 |
| 第一行打字 | 617→1978 | 619→1494 | 26–48ms/字，标点 +160ms |
| 第二行 | 打字至 3912 | 逐字升起 ≈1500→2100 | 两行都打字太慢，改为升起 |
| 身份行 | **4512** | **2077** | onReady 后 +0.12s |
| 数据行 | **4628**（里程表到 ~6.2s） | **2195**（里程表 ~3.2s） | onReady 后 +0.2s |
| 项目首行 | 1045 | 2195 | **改前列表比身份信息早 3.5s 出现——层级倒置** |
| 第 9 行 / 发丝 | 1495 | 2593 / 2643 | 40ms 等距错峰 |

结论：改前访客先看到列表、4.5s 后才看到「AI 产品方向 · 正在看新机会」和 100,000+；改后严格按 身份 → 证据 → 项目 的阅读顺序，2.6s 全部落定。
实现：`HeroTypewriter` 导出 `isHeroDone()`；`WorkStream` 的 `intro` 状态首访为 `INTRO_DELAY=1.15s`，返回后为 0（不重复等待）。

**打开详情**（ms，自点击）：索引退场 0.22→**0.16s**；详情内容起点 272→**204**；标题飞行 620→**560ms**；图片帘幕最终落定 1466→**1406**。
**切换项目**：585–734ms 落定。**返回**：195ms 开始入场、681ms 落定。

其他本轮修复：
- 页脚结语整句可点击 → 向上展开联系浮层（`ContactMenu` 新增 `placement`/`trigger`/`triggerClassName`），箭头打开时转向上指向浮层；浮层条目 30ms 错峰；「已复制」由绿色改为强调色（全站唯一色相）
- `Kinetic.tokens` 断行：中文逐字可断、行首标点并入前字、拉丁词整词——原来整句中文是一个不可断的 inline-block，长句会溢出
- `SplitRise` 减弱动态的水合不一致（SSR 不知道偏好）已用挂载门控修复，减弱动态模式下 0 报错
- Hero 光标改为强调色 3px 竖条，打完淡出

### 第六轮：多页面架构 + /about 个人页（2026-10-29，当前实现）

**路由结构**
- 新增 `src/app/about/page.tsx`（服务端组件，自带 `metadata`/`alternates.canonical`/`openGraph.type: "profile"`）→ 渲染 `SiteShell` 包 `AboutView`。
- 新增 `src/components/site/SiteShell.tsx`：**全站外壳**。顶栏、颗粒噪点、页脚（结语菜单 + 巨幅署名 + 时钟）从 `page.tsx` 抽出，首页和关于页共用同一几何——切页不跳。
- 顶栏右侧新增导航：`归档 |`「关于」，当前页文字深色、其他 `neutral-500`；logo 整组可点击回首页。
- 语言状态上提为全局：`src/components/site/lang.ts` 的 `useLang()`（`useSyncExternalStore` + localStorage `zhiyu-lang`，服务端快照恒 zh 无水合问题）。切页后语言保持，`<html lang>` 随动。
- `src/app/sitemap.ts` 已加 `/about`（priority 0.8）。

**/about 页面内容结构**（`src/components/site/AboutView.tsx`，全部文案数据驱动）
- 数据源 `src/data/profile.ts`（`PROFILE.zh/en`）：kicker → 主张大标题（SplitRise 逐字升起）→ 事实横条（深圳·方向·看机会，第三条强调色）→ 简介三段（660px 阅读栏）→ 能力三栏（01/02/03 强调色序号：产品定义 / AI 工程 / 交互设计，各配实证句）→ 经历行（期 · 组织 · 说明，发丝分隔与索引同款）→ 佐证大数字（InViewOdometer：滚入视口才启动里程表）。
- **【待补】占位机制**：`profile.ts` 里凡以「待补：」/`TODO: ` 开头的字段是未确认占位内容（经历第一段的公司与年份、简介第三段长故事），渲染为弱化斜体。上线前必须让本人替换，不要猜写。`isTodo()` 判定。

**首页 Hero 微调**
- 身份行下新增能力关键词行：`产品定义 · AI 工程 · 交互设计`（mono 小字）+「更多关于我 ↗」强调色链接 → `/about`。入场序列顺延：身份 0.12s → 能力 0.2s → 数据 0.28s。

**手感**
- 滚筒停格提交时 `navigator.vibrate?.(8)`（仅真实拨动、非程序化滚动、非 reduced-motion；Android 有效，iOS 无此 API 自动忽略）。判定用 `idxRef`（ref 在 render 期赋值会触发 react-hooks/refs 报错，用 useEffect 镜像）。

**踩过的坑**
- `page.click("text=宇奇引擎")` 会先命中 archiveNote 段落里的同名文字（DOM 序在列表前），探测要用 `button:has-text()`。
- Next devtools 的「N」徽标是 `<nextjs-portal>` 自定义元素：CSS 隐藏不可靠（截图仍出现），OG 截图前直接 `e.remove()`。
- 375px 顶栏曾溢出：logo 的「/ ZYY817」改 `hidden sm:inline`，nav gap 4→3.5。

**产物**
- `public/og-cover.jpg` 已重拍为当前首页（1200×630，88 质量 JPEG），两页 metadata 共用。
- `tsc` / `eslint --max-warnings=0` / `next build` 全绿；`/about` 预渲染为静态页；0 控制台错误、双端无横向溢出；点击进详情 → ↓ 切换 → Esc 返回全链路实测通过。

### 第七轮：关于页收为单段 + 语言切换「原地重排」+ 主题流畅度（2026-10-30，当前实现）

**/about 收敛**（用户要求：不复杂、居中、只讲一段做过什么）
- `AboutView` 重写：660px 居中栏 = kicker → 主张（SplitRise）→ 事实横条 → 两段 bio → 邀请语。
- 邀请语是 `ContactMenu` 自定义 trigger，整句可点、向上展开浮层（写明"在找长期发展的新机会"）。不再有能力三栏/经历表/佐证数字。
- `profile.ts` 同步瘦身：`kicker/statement/facts/bio/cta`，已无「待补」占位（履历表整个删掉，不需要公司年份）。

**首页 hero**：「产品定义 · AI 工程 · 交互设计」整行删除（用户不需要）；「更多关于我 ↗」挪进身份行行尾（第三项）。

**语言切换 = 原地重排**（签名细节，不是挤入也不是普通翻牌）
- `page.tsx` 与 `AboutView` 内层各包 `<AnimatePresence mode="popLayout"><motion.div key={lang}>`：旧版 0.2s 淡出（popLayout 绝对定位，高度不塌、滚动条不动），新版 0.3s 淡入 + 各行自带 entrance 错峰重排——像整页重新排版。
- 实测 scrollY 切换前后不变（700 → 700）。
- 小标签走 `SwapText`（Kinetic.tsx 新原语）：overflow-hidden 裁切框内旧词上翻出、新词下翻入，用于顶栏「归档/关于」和「联系」。
- 注意：`key={lang}` 重挂载 `WorkStream` 会丢内部状态（hovered/direction/fly/savedY/wheelScrollTop），详情态切语言会回到列表——可接受的有意取舍。

**主题圆形扩散流畅度**（实测：改前 worst 帧 357ms + 110ms，6 帧 >40ms；改后 worst 118ms，仅 1 帧 >40ms）
- 病因是起始帧：`flushSync` React 渲染 + 全文档 dark 样式重算 + 整页快照栅格化挤在同一帧。
- 改法：快照回调只 `classList.toggle`（`domApply`），React `setIsDark` 推迟到 `vt.finished`——图标在扩散结束后自己翻转（成了有意设计）；切换方向改以根类名为准防连点反向。
- `.theme-switching` 期间 CSS 剔除两层最贵绘制：`grain-overlay`（整页 feTurbulence）`display:none` + `backdrop-blur-md` 关闭。噪点在 `finished` 后自动回来。
- 时长 720→600ms。

### 第八轮：关于页双轴居中 + 语言切换重影根治（2026-10-30，当前实现）

**病根**：第七轮的 `popLayout` 叠化在中英文案长度差下产生错位重影（旧层钉在原位淡出，新旧行 y 坐标不同 → 双层文字错开同时可见）。结论：叠化方向本身错误，改顺序替换。

**实现**（终版，iOS 导航式视差盖页）：`src/components/site/LangSwap.tsx`——`popLayout` 双轨，新页 `±100vw→0` 盖过旧页，旧页退 `±30vw`+渐暗 0.5，新页前缘 64px 软阴影。英文锚定右页、中文锚定左页（`initial`/`exit` 同号，popLayout 退出层属性按其自身 lang 冻结）。iOS 分页曲线 `[0.32,0.72,0,1]` 550ms，两层不透明。**流畅度**：`LangFlightContext`/`useLangFlight` 标记换语言重挂载（渲染期 setState 官方模式），WorkStream/AboutView/hero 所有入场动画 `initial=false` 成品态，`Odometer`/`RollText` flight 时平铺省 ~700 节点；挂载帧 250→183ms，滑动全程无 >40ms 帧。高度钉：取新旧最大高，入场后 670ms 释放。`page.tsx` 与 `AboutView` 共用。页脚巨型「智宇」署名已删。

**关于页**：`min-h-[calc(100svh-170px)] flex-col justify-center` 双轴居中，超长内容自动回退顶对齐。

**实测**：逐帧截图无任何双层文字；scrollY=700 切换后不变；详情态切语言以目标语言直接重挂载；构建全绿。

规划文档：`UPGRADE_PLAN.md`（含诊断、时序表、验收标准、实施结果）。

### 详情态（点击任一项目后）

```
Hero 向上收起，页面变成左右两栏（桌面 ≥ lg）：
  左：项目滚筒（约 280–300px）
      「返回项目列表」在上方
      只显示项目名，不显示序号；当前项最大最黑，离得越远越小越淡（不用 blur）
      滚轮、触控、↑↓ 键都能切换；原生 scroll-snap 惯性停格
  右：详情（最宽 860px）
      序号 · 分类 · 年份 · 状态 / 大标题 / 介绍 / 项目图 / 标签 / 外链
      切换项目时按滚动方向进出
  Esc 或「返回项目列表」回到首页
手机端：滚筒在上，详情在下
```

### 用户明确拒绝过的方案（不要再做）

- 进来就是左右分栏（用户第一次进来抓不到重点）
- 首屏全高 Hero，只有两行字、大片空白
- 「系统自检」式的钉住叙事和长滚动展台
- 首屏直接摆出联系方式（用户要求点「联系」才显示）
- 任何边框、底色块、胶囊徽章、HUD 线条、测量线、技术感装饰
- 对文字使用 `filter: blur`
- 把这些项目称为「作品」（用户认为还算不上作品，统一叫「项目」）

---

## 三、文件地图

| 文件 | 职责 |
|---|---|
| `src/app/page.tsx` | 首页：Hero（打字机、身份行、能力行、数据行）+ `WorkStream`；外壳在 `SiteShell` |
| `src/app/about/page.tsx` | 关于页路由（服务端组件 + 独立 metadata/OG `type: "profile"`）→ `SiteShell` + `AboutView` |
| `src/app/layout.tsx` | 字体、metadata/OG、`themeColor`、防闪烁主题脚本、`scrollRestoration=manual` 兜底脚本 |
| `src/components/site/SiteShell.tsx` | **全站外壳**：顶栏（logo 回首页 / 归档·关于 导航 / 联系 / 语言 / 主题）、颗粒、页脚；两页共用同一几何 |
| `src/components/site/AboutView.tsx` | 关于页：kicker、主张、事实条、bio 两段、邀请语即联系入口；语言 popLayout 重排 |
| `src/components/site/lang.ts` | `useLang()`：localStorage 持久化 + 跨页共享，SSR 快照恒 zh |
| `src/data/profile.ts` | 关于页双语文案；`待补：`/`TODO: ` 前缀 = 待本人替换的占位，`isTodo()` 渲染弱化斜体 |
| `src/app/globals.css` | 主题变量（浅色 `--bg-page: #ffffff`，深色 `#09090b`）、光标闪烁关键帧、reduced-motion 全局降级 |
| `src/components/site/WorkStream.tsx` | **核心**：首页分组索引、光标跟随预览、详情态滚筒、`DetailView` 详情、方向交接 |
| `src/components/site/HeroTypewriter.tsx` | 打字机（拟人击键、标点停顿、光标闪烁、`heroCompletionCache` 防止重复打字） |
| `src/components/site/ContactMenu.tsx` | 顶栏「联系」浮层（微信、邮箱复制，外链） |
| `src/components/site/LocalClock.tsx` | 页脚深圳时钟 |
| `src/components/site/TextBlocks.tsx` | `MaskedLine` 遮罩升起、`TextBlock` |
| `src/components/site/motion.ts` | `EASE_SILK`（进场）、`EASE_EXIT`（退场） |
| `src/components/site/SmoothScroll.tsx` | Lenis；reduced-motion 时不接管；内部滚动容器要加 `data-lenis-prevent` |
| `src/components/site/LangToggle.tsx` / `ThemeToggle.tsx` | 语言翻牌切换 / 深浅色图标旋转切换 |
| ~~`src/components/site/ThoughtsStream.tsx`~~ | 已删除 |
| `src/data/archive.ts` | **项目数据**：标题、简介、描述、状态、链接、`coverImage`；`PROJECT_GROUPS` 分组；`LAST_UPDATED`；`SYSTEM_METRICS.socials` 联系方式 |
| `src/data/i18n.ts` | **双语文案**：`UI.zh/en`（含 `role`、`openToWork`、`archiveNote`、`groups`）、`EN_PROJECTS`、`YUQI_TABS_EN` |

**改内容的规则**：
- 加项目：在 `archive.ts` 追加条目，调整 `PROJECT_GROUPS` 的区间，在 `i18n.ts` 的 `EN_PROJECTS` 补英文。滚筒和索引会自动多一行。
- 每次发布前把 `LAST_UPDATED` 改成当月。
- 不要替用户编造项目内容、数据或图片。没有图的项目就保持没有图。

---

## 四、本轮已完成并验证的内容（2026-10-29，本机实测）

**本轮改动**：
- 浅色背景统一为纯白 `#ffffff`（原来三个文件里各写了一种底色），深色统一为 `#09090b`，`themeColor` 同步
- 灰色小字调深一档（分组标签、序号、状态）
- 首页新增身份行「AI 产品方向 · 正在看新机会」（英文：AI Product · Open to new opportunities）
- 列表上方加回定位说明 `archiveNote`
- 每行末尾加淡色 `→`，悬停时变深并右移；去掉重复九次的「2026」，只保留状态
- 「主要作品」改为「主要项目」，「返回作品列表」改为「返回项目列表」
- 行距收紧；联系方式只留在顶栏「联系」菜单里
- **修复了上一轮遗留的 ESLint 阻塞**：`WorkStream.tsx` 里 `useEffect(() => setMounted(true))` 换成了 `useSyncExternalStore(() => () => {}, () => true, () => false)`，作用相同（服务端为 false，水合后为 true），不再在 effect 里同步 setState，reduced-motion 支持保留
- **第二批（同日）**：第五节 P1-1～P1-4、P2-3、P2-4 全部修复（标题手动 FLIP、滚轮一格一行、程序化滚动守卫、1440 对齐、手机滚筒 3 行、「全部项目」标签），详情加 `min-h-[62svh]`，`ThoughtsStream.tsx` 删除。实测标题轨迹 (450,712)→(28,381)，构建/typecheck/lint 全绿，0 报错、无横向溢出

**验证结果**：
- `tsc`、`eslint --max-warnings=0`、`next build` 全部通过
- 用 Playwright 在 1440×900、1280×720、深色、reduced-motion、375px 手机五种环境下测试：
  - 控制台错误和页面错误都是 0（**包括 reduced-motion，上一轮的水合报错问题已确认消失**）
  - 点击「奇览」后右侧显示「奇览」详情
  - 在滚筒上按 ↓ 键，详情切换为「需求锻造台」（1440 下第一次按键有一次没切换，见第五节 P1-3）
  - 在滚筒上滚动鼠标滚轮，详情跟着切换
  - Esc 能回到首页
  - 所有尺寸都没有横向溢出
- 英文模式下首页和详情都没有漏翻（剩下的「中」是语言按钮，「智宇」是名字）

---

## 五、发现的缺口（按优先级，下一位从这里开始做）

### P0 · 必须做

**P0-1 部署上线**（第六节有完整流程）。用户在简历里放的就是线上链接，目前线上是旧版。部署前要先完成 P0-2。

~~**P0-2 重拍 OG 分享图**。~~ ✅ 已完成：`public/og-cover.jpg` 重拍为当前首页（1200×630，88 质量）；拍摄前 JS 移除 `<nextjs-portal>` 开发徽标。

**P0-3 确认 /about 文案**。第七轮已把履历表删掉，`profile.ts` 只剩主张/事实/两段 bio/邀请语——无占位。但 bio 里的表述（白天车企系统负责人、九款产品、AI 协作方式）仍建议本人通读一遍确认再上线。

### P1 · 手感问题（2026-10-29 已全部修复并实测）

**P1-1 ✅ 点击后标题「飞」到左侧——已修复。**
`layoutId`/`LayoutGroup` 方案在「列表卸载 + 容器宽度变化」同时发生时测不到正确起点（标题第一帧就出现在目标 x）。已改为**手动 FLIP**：点击时用 `[data-title]` 记录索引行标题的 rect，渲染一个 fixed 克隆体（`fx/fy/fs` MotionValue），每帧读取滚筒选中行标题的实时 rect，以 cubic-out 缓动在 560ms 内追赶过去（因为目标行本身还在滚动对中，必须逐帧读实时位置，不能一次性算终点）。期间隐藏滚筒内同 id 的标题。reduced-motion 时跳过。
实测轨迹：起点 (450,712) → 457,689 → 171,627 → 106,483 → … → (28,381)，横纵位移均真实发生。
**不要再把 layoutId 加回去**——两种方案共存会互相干扰。

**P1-2 ✅ 鼠标滚轮一格一行——已修复。**
滚筒容器上挂了非 passive 的 `wheel` 监听：`|deltaY| >= WHEEL_NOTCH(40)` 判定为离散滚轮 → `preventDefault` + 260ms 锁定期内只走一行（调 `selectProject` 触发程序化对中）；小于阈值判定为触控板连续滚动，交给原生惯性 + scroll-snap。
实测：滚 120px 从「需求锻造台」→「反平庸知识库」（下一行），不再跳两行。

**P1-3 ✅ 首次 ↓ 偶发失效——已修复。**
程序化滚动前置 `progRef = true`；停格回调里若 `progRef` 为真则跳过提交，滚动停到行边界后自动清除。实测打开瞬间立即按 ↓ 正常切换到下一项。

**P1-4 ✅ 宽屏对齐——已修复。**
详情容器 `max-w` 从 1360 改为 **1440**，与顶栏同一内边距（px-5 sm:px-6），滚筒左缘与顶栏徽记对齐（实测 x=24）。

### P2 · 视觉缺口（可以做得更好）

**P2-1 没有图的项目，右侧非常空。**
9 个项目里只有 3 个有 `coverImage`（宇奇引擎、多智能体编排调度器、奇览）。「需求锻造台」这类项目的详情只有三行字加一行标签，下面是大片空白，页脚直接浮在中间。
不要编造图片。可以做的：
- 纯文字项目改用排版撑起版面：标题放大一档，介绍拆成「解决什么问题 / 怎么做的 / 结果」三段（**需要用户提供文案**，用户说过会自己改详情文案）
- ~~详情区最小高度~~（已加 `min-h-[62svh]`，页脚不再浮在中间）
- 用户计划之后提供每个项目的素材图，到时候直接填 `coverImage` 即可

**P2-2 悬停预览图也只有 3 个项目有。**
其余 6 行悬停时什么都不弹，体验不一致。等用户的素材图到位后自然解决；在此之前保持不弹，不要用别的项目的图顶替。

**P2-3 ✅ 手机端滚筒压缩为 3 行——已修复。**
新增 `isLg`（useSyncExternalStore + matchMedia `(min-width:1024px)`，SSR 快照 true）：桌面 `visible=7`、移动 `visible=3`（高 192px），`pad` 随 visible 计算。实测 375px 下滚筒高 192，详情进入第一屏。

**P2-4 ✅ 「项目滚筒」改名「全部项目」——已修复。**
`i18n.ts` 的 `projectNavigation`：zh「全部项目」/ en「All projects」。左栏标签和 listbox aria-label 同步更新。

**P2-5 1440×900 首页一屏放不下全部 9 项。**
现在第一屏能看到第 01–06 项，07–09 需要往下滚；2K 及以上屏幕可以一屏放下。如果用户要求一屏全看到，可以把定位说明压成一行，或者移到列表下方。**这个取舍要先问用户。**

**P2-6 底图「进度条」效果（用户提过的想法，等素材）。**
用户希望悬停某个项目时，除了光标旁的预览图，页面底部再出现一张宽幅底图，像进度条一样从左向右擦出。素材建议约 2000×400，放在 `public/` 下，在 `archive.ts` 加字段（例如 `bannerImage`），用 `clip-path: inset(0 100% 0 0) → inset(0 0 0 0)` 实现。**用户说过素材最后再弄，先别做。**

### P3 · 清理

- ~~`ThoughtsStream.tsx`~~ 已删除（确认全仓无引用）
- 外层目录 `/Users/sunyuqi/Downloads/geenzhuye` 里有大量调试截图（`split-*.png`、`fix-*.png`、`home-*.png`、`shot-*.png`）和 `probe_*.py`，不是项目资产。清理前先问用户
- `i18n.ts` 里的 `heroLine1/heroLine2` 没有被使用（打字机文案在 `HeroTypewriter.tsx` 的 `HERO_LINES` 里），`heroLine2` 里写的职业描述没有经过用户确认，**不要启用**

---

## 六、部署上线（Vercel）

**账号和项目**：Vercel 项目名 `geenzhuye`，生产域名 `https://zhiyu817.vercel.app`（已绑定为项目域名，生产部署会自动指向最新版本，不需要手动设置 alias）。

```bash
# 0. 在新电脑上第一次部署
npm i -g vercel           # 安装 Vercel CLI
vercel login              # 用户本人登录，涉及账号授权，AI 不要代办
vercel link               # 在项目目录里关联到已有项目 geenzhuye（不要新建项目）

# 1. 本地验证（全部通过才继续）
npx tsc --noEmit && npx eslint . --max-warnings=0 && npx next build

# 2. 部署到生产
vercel --prod
```

**上线前检查**：
1. 验证三件套全部通过
2. 本地截图检查：1440×900、1280×720、375 手机；浅色、深色；中文、英文；首页、详情、滚筒切换
3. 已替换 `public/og-cover.jpg`
4. `src/data/archive.ts` 的 `LAST_UPDATED` 已更新

**上线后检查**（必须真的打开线上地址看，不能只因为构建通过就说已上线）：
1. 打开 `https://zhiyu817.vercel.app`，确认是新版首页
2. 点开一个项目，滚筒和详情正常
3. 查看页面源码，`og:image`、`canonical`、`og:url` 都指向 `https://zhiyu817.vercel.app`
4. `https://zhiyu817.vercel.app/robots.txt` 和 `/sitemap.xml` 能打开，地址都是正式域名
5. 用无痕窗口打开，确认不需要登录（部署保护已关闭）

**以前踩过的坑**（已解决，不要重复）：
- `zhiyu.vercel.app` 已被别人占用，只能用 `zhiyu817.vercel.app`
- Vercel 的部署保护会让访客必须登录，已在项目设置里关闭
- 手动 alias 会钉在旧部署上，现在用项目域名自动跟随
- 浏览器滚动位置恢复会让 2K/4K 屏一打开就停在项目区，`layout.tsx` 的内联脚本已处理
- `metadataBase`、sitemap、robots 曾经用 `VERCEL_URL` 导致地址漂移，现在都写死为正式域名
- 第一次 `vercel --prod` 可能报 `Not authorized`，确认登录的账号正确后重试即可

---

## 七、动效约定（务必遵守）

- **缓动只有两条**：进场 `EASE_SILK = [0.16, 1, 0.3, 1]`，退场 `EASE_EXIT = [0.64, 0, 0.78, 0]`，不要新增
- **弹簧**：大面板 `SPRING_PANEL {stiffness 380, damping 34, mass 1}`，小元素 `SPRING_POP {500, 26, 0.7}`
- **错峰**：间隔不均匀，不要等差的「机枪」节奏
- **reduced-motion**：所有 framer 的 JS 动画都要走 `useReducedMotion()` 降级为淡入。CSS 已经全局兜底，但管不到 JS 弹簧。判断「是否已挂载」请用 `useSyncExternalStore`，不要在 effect 里同步 setState
- **性能**：尽量不要对 width、height、max-width 做过渡（每帧都会重排）；内部滚动容器加 `data-lenis-prevent`
- **布局红线**：防横向溢出用 `overflow-x: clip`，不要用 `hidden`（会让 sticky 失效）

---

## 八、用户偏好速查

- 中文优先；文案克制，不吹嘘；这些叫「项目」不叫「作品」
- 讨厌：框、边、条、徽章、HUD、技术装饰、过多标签、对文字做模糊
- 喜欢：纯文字排印、接近纯白的干净底色、漫射阴影、留白分区、iOS 式的物理手感（滚筒、惯性、阻尼、翻页）
- 首屏必须是正常的单栏页，点击之后才发生变换；每个动效都要有明确含义
- 联系方式不在首屏展示，点「联系」才出现
- 改完先在本地浏览器截图验证，再谈部署
- 用户之后会提供：新项目、详情文案、每个项目的素材图。到那时再做 P2-1、P2-2、P2-6

---

## 九、2026-10-30 追加变更（第十轮，已验证）

- **LangSwap 终版 = iOS 视差盖页**：新页 ±100vw 盖入、旧页退 ±30vw+渐暗→0，两层不透明底色+视口满宽（`w-screen mx-[calc(50%-50vw)]`）。**两个硬约束，动了就重影**：①层必须有 `bg-white dark:bg-[#09090b]` ②层必须满屏宽（窄容器两列并排=重影）。接缝保持硬切边，用户明确不要前缘阴影条。
- **LangFlightContext / useLangFlight**：切换渲染帧置 true（渲染期 setState 模式），子树入场动画 `initial=false` 成品态；`Odometer`/`RollText` flight 时平铺省 ~700 节点。约 770ms 后清除。
- **首页减负**：删身份行（AI 产品方向/正在看新机会/更多关于我）、分组标签、行序号——九项目平铺清单。页脚只留元信息行（结语句已删）。
- **词槽**：hero 第二行「把经验做成 __，帮到更多的人」嵌可点击作品名轮播（2.2s/个，点击开详情）——HeroTypewriter.tsx 的 WordSlot。
- **详情页对齐**：右栏头部区（meta+标题+简介+链接）`lg:min-h-[calc(100svh-88px)] justify-center`，与滚筒焦点行同轴；无图项目相邻导航并入头组，有图项目大图+导航在中轴之后（首屏=文字封面，图需下滚）。
- **详情分屏**：右栏 `lg:h-[calc(100svh-88px)] overflow-y-auto overscroll-contain data-lenis-prevent`，独立滚动不归零文档；切换项目 paneRef.scrollTo(0)；图片视差 `useScroll({container:paneRef})`。
- **遗留**：profile.ts「待补：」字段仍是占位，上线前必须换真实内容；部署未做。


## 十、2026-10-31 第十一轮：Windows 文字模糊修复（已验证）

**问题**：用户在 Windows 上看文字模糊、看不清（Mac 上正常）。
**实测病因**（本机 Windows，DPR=1，1:1 像素对比）：Noto Sans SC 网页字体没有屏幕微调（hinting），Windows 普通屏上只能灰度抗锯齿，笔画发灰发虚，12px 以下尤其糊；Mac 视网膜屏掩盖了这个问题。同样文字换成微软雅黑 UI 明显锐利。噪点层影响可忽略。

**改动**：
- `globals.css`：`--font-sans` 改为系统字体栈 `-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", system-ui, sans-serif`；body 改用 `var(--font-sans)`；等宽栈的中文回落补上雅黑 UI。
- `layout.tsx`：删除 Noto Sans SC 和未使用的 Geist Sans（少下载一套中文字体）。
- 字重：雅黑只有常规 / 粗体两档，`font-medium(500)` 在 Windows 上会落成常规体，层级变平。**≤24px 的标题**（索引行标题、滚筒行、FLIP 克隆体、相邻导航、宇奇 tab、外链、词槽、关于页强调句）改为 `font-semibold`；**大标题**（Hero h1、详情 h2、关于页主张）保持 `font-medium`——48px 以上用粗体太重，且 Segoe 与雅黑粗细不一致。
- 最小字号：所有 `text-[11px]` → `text-xs`（12px）。
- 浅灰：`text-neutral-400 dark:text-neutral-500` → `text-neutral-500 dark:text-neutral-400`（小字对比度 2.6:1 → 4.8:1）。

**注意**：不要把正文字体改回网页字体；以后想换有个性的字体，只用在 ≥32px 的展示级大字上。
**验证**：tsc / eslint --max-warnings=0 / next build 全绿；本机 Windows 浏览器 1:1 截图对比首页、详情。Mac 上的观感变化（苹方替代 Noto、小标题从 medium 变 semibold）尚未在 Mac 上实看。

## 十一、2026-10-31 第十二轮：同步 GitHub 最新项目（9 → 13 个）

数据来源：`gh api users/ZYY817/repos` + 各仓库 README（只用 README 里写明的事实，没有编造）。
- 新增 4 个：宇奇轻管 `yuqi-lite`、玩机装机工具 `wanji-kit`、玩机索引 `wanji-index`（已上线 zyy817.github.io/wanji-index）、工作汇报 Skill `work-report-skill`。中英文案都补了。
- 新顺序：01 宇奇引擎 → 02–04 三个新 Windows 工具/站点 → 05–07 代码库拓扑导图、多智能体编排调度器、奇览 → 08–10 需求锻造台、工作汇报 Skill、反平庸知识库 → 11–13 小工具。序号全部重排；`PROJECT_GROUPS` 改为 `[[0,7],[7,10],[10,13]]`（首页目前不分组，仅保持一致）。
- 宇奇引擎 Star：649（2026-10-31）→ 写作 `640+`（不会因少量波动变成错误数据）。
- 多智能体编排调度器的仓库已改名：链接更新为 `ZYY817/dsh-team-orchestrator`。
- 首页「N 款」改为读 `ARCHIVE_PROJECTS.length`；`profile.ts` 关于页的「九款自研产品 / nine products」改为十三。
- 未处理：`yuqi-token-guardian`（已归档，不上站）；宇奇引擎官网链接仍是 `yuqiengine.pages.dev`，`ZYY817.github.io` 描述也写「宇奇引擎官网」——哪个是正式官网待用户确认。


## 十二、2026-10-31 第十三轮：改版方向「深夜工位」进入规划阶段

- 用户认为现首页"没有视觉、没有亮点、不舒服"。经过三轮讨论，确定人设 **AI Native Builder / 目标 AI 产品经理**，概念 **「深夜工位」**。
- **完整设计蓝图见 `PLAN_AFTER_HOURS.md`**（概念、逐屏设计、视觉、动效、技术、素材清单、阶段、风险、验收、决策记录、进度看板）。
- **逐屏详细规格见 `SPEC_SCENES.md`**；**素材清单与可直接粘贴的提示词见 `ASSETS_PROMPTS.md`**。三份文档冲突时：逐屏细节以 SPEC 为准，决定以 PLAN §14 为准。
- 规则：先规划、后推进；设计变化先改蓝图再改代码；每阶段在 `/v2` 做、真实浏览器验收后再继续；现首页在 `/v2` 定稿前不动。
- ⚠️ `profile.ts` 关于页里的"车企"表述是错的（用户在互联网公司做产品），改版时删除；页面不写公司名、外包和真名。
