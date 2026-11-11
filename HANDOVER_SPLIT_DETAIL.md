# 交接文档：项目滚筒 + 右侧详情联动

更新时间：2026-10-29  
项目：`geenzhuye`（智宇个人主页）  
交接目的：将工作移到另一台电脑后，从当前进度继续完成“点击项目后的双栏浏览”。

> **状态更新（2026-10-29）**：本文件是上一轮的过程记录。下面「当前实现未收尾」「ESLint 阻塞」「Reduced-motion 需要复测」等问题**已经解决并验证**；最新状态、实测结果和下一步待办全部以 `HANDOVER.md` 为准（重点看第四、五节）。文中的「返回作品列表」已改名为「返回项目列表」。

## 先看这里

- 当前**没有批准废弃的首页视觉方案**。首页 `/` 保持原先确认的居中单栏、三组项目索引、深圳时钟等设计；本轮只在 `WorkStream` 里改“点击项目后的详情态”。
- 用户明确要**保留左侧 iOS 时钟式滚筒**。点击任一项目后，左侧仍是可滚动、可停格的项目名称滚筒，右侧同步显示所选项目详情；拨动左边时，右边详情也要随方向交接。
- 详情态左侧只显示**项目名称**，字号比首页索引大，不显示 01/02 等项目序号。右侧不再出现“收起详情”按钮；提供“返回作品列表”放在左侧滚筒上方，`Esc` 也可返回。
- **当前实现未收尾**：`npx tsc --noEmit` 已通过；最新 `npx eslint . --max-warnings=0` 在 `WorkStream.tsx:208` 报错，原因是 effect 内同步调用 `setMounted(true)`。不要忽略 lint 或删掉 reduced-motion 支持。先修复，再跑完全部验证。
- 本次详情页已在浏览器看过。截图位于项目目录外层：`F:\yuqiAI\grzy\split-detail-1.png`、`split-detail-2-next.png`、`split-mobile.png`、`split-1280.png`、`split-wheel.png`。这些是调试截图，不是正式项目资产。

## 用户要做成什么

点击首页任一项目后：

1. 首屏 Hero 收起，页面从居中列表转换成桌面双栏。
2. 左侧保留“滚筒式”项目选择器：滚轮、触控滚动、上下箭头可切换；原生 `scroll-snap` 惯性停格。只显示项目名，不显示项目序号；当前项目更醒目。
3. 右侧显示当前项目类别/年份/状态、标题、详细介绍、项目图、标签和外链。
4. 左侧滚筒换到其他项目时，右侧详情按同一个选中 id 更新，动画方向与滚动方向一致。切换不能回到首页，也不能只换左侧文字。
5. 左侧上方“返回作品列表”和 `Esc` 可退出详情态。右侧不放“收起详情”。
6. 手机端没有左右并排空间时，项目滚筒在上，详情接在下方；不得有横向溢出。
7. 中英文、深浅色、`prefers-reduced-motion` 都要正常；中文标题不能被强制拆成不合理断行。

用户后续会自己修改右侧详情文案。真实文案数据在 `src/data/archive.ts`，英文文案在 `src/data/i18n.ts` 的 `EN_PROJECTS`。

## 本轮参考与设计取舍

借鉴的是导航与内容之间的**交接机制**，不复制参考站的皮肤、色彩或装饰：

- Awwwards / Noci Studio split-screen 项目浏览：<https://www.awwwards.com/inspiration/projects-split-screen-noci-studio>
- Awwwards / Rietveld projects list transition：<https://www.awwwards.com/inspiration/portfolio-list-view-rietveld-projects>
- Awwwards / Xavier Cussó split transition：<https://www.awwwards.com/inspiration/split-transition>

项目自带的 `motion-web` 技能也已阅读 `page-design.md`、`design-slop.md`、`handfeel.md` 和 Framer Motion 规则。此处采用：左侧滚筒的滚动停格 + 选中标题共享位置交接 + 右侧同向进出。继续遵守现有风格：克制排印、无多余徽章/HUD、文字不使用 `filter: blur`、尊重减少动态偏好。

## 已做改动

### `src/components/site/WorkStream.tsx`

- 详情态外层从原最大宽度 1440 收到 1360，桌面左栏约 280–300px，左右留出间距，右侧详情可用宽度扩展到约 860px。
- 点击首页项目后，左栏不再是原来的小字号编号选择器；目前去掉了左侧滚筒中的序号，项目名约 18px，当前项约 20px。
- 滚筒行高改为 64px，展示 7 行。滚轮/原生 `scroll-snap` 停格、上下键、点选后滚动居中仍保留。
- 远离对焦行只做轻微缩放和透明度变化，不做 blur。
- 左栏增加“返回作品列表”；详情 `DetailView` 已移除右侧“收起详情”按钮；Esc 仍可回列表。
- 首页列表和详情滚筒中的标题使用 `layoutId`，意图是点击后标题顺滑交接到左侧滚筒。
- 增加 `DETAIL_VARIANTS`：详情页按选中方向做短距离位移和 `clip-path` 揭示。当前图片仍保持原图比例/原展示方式，不裁切内容。
- 详情的 `AnimatePresence` 现在包住带 project key 的 `DetailView`，项目之间应能播放退出/进入。
- 详情宽度上限改为 860px。

### `src/data/i18n.ts`

中英文各增加：

- `projectNavigation`
- `backToArchive`
- `wheelHint`

## 当前验证结果

已在本机 `http://localhost:3200` 进行的检查：

- 点击“奇览”后左栏只显示项目名称，没有 01/02 序号；右侧显示“奇览”详情。
- 在左侧 listbox 按 `ArrowDown`，右侧详情由“奇览”切换到“需求锻造台”。
- 实际把鼠标放在左侧滚筒上滚动，右侧详情同步从“奇览”切换到“AI 前端反平庸设计知识库”。
- 返回作品列表可用；移动端页面横向溢出为 0。
- 中英文 + 深色模式下，右侧标题“Qilan Atlas”正常。
- 普通模式控制台错误为 0。
- `npx tsc --noEmit` 通过。
- `npx next build` 在加入最后的 hydration gate 前通过；应在 lint 问题修复后重跑。

### 尚未完成/需重新验证

1. **ESLint 阻塞**：当前 `useEffect(() => { setMounted(true); }, [])` 被 `react-hooks/set-state-in-effect` 报错。它是为避免 SSR/客户端 `useReducedMotion()` 分支不同导致 hydration mismatch 而临时加入的 gate。推荐下一步用 `useSyncExternalStore` 订阅 `matchMedia('(prefers-reduced-motion: reduce)')`，提供稳定的 server snapshot（例如 `false`），并在 hydration 后读取客户端偏好；这样可同时避免 hydration mismatch 和 effect 里同步 setState。也可以采用仓库内更合适的 hydration-safe 模式，但不要直接移除 reduced-motion 支持。
2. **Reduced-motion 需要复测**：之前曾观测到 reduced-motion 下初始列表出现 hydration mismatch；加入 mounted gate 后还没有获得完整、可靠的复验结果。最终必须验证 console/page errors 为 0，详情仍能打开和切换。
3. **桌面截图**：1440×900 的当前视觉已经看过；1280×720 的截图已保存但尚未通过图像工具检查。需要复核无挤压、项目名可读、详情图尺寸合适。
4. **无项目图项目**：例如“需求锻造台”会只有文字/标签/链接，没有借用其他产品图片。这是刻意避免错图；目前右侧在这种项目上较空。先保留真实性，后续可等用户提供文案/素材后再优化，不要擅自编造图片或项目内容。
5. build 和完整 ESLint 必须在最终代码上重跑。

终端输出中有一次中文显示成乱码，但浏览器截图中文字是正常的；搬到新电脑后应优先依据浏览器渲染判断，而不是 Git Bash 输出编码。

## 建议继续步骤

1. 先阅读 `AGENTS.md`、本文件和 `HANDOVER.md`。本项目 Next.js 16.3.6 有破坏性变更；更改 Next API 前先读 `node_modules/next/dist/docs/`。
2. 在 `WorkStream.tsx` 修复 reduced-motion hydration gate 的 lint 失败；只改必要代码。
3. 运行：

   ```bash
   npx tsc --noEmit
   npx eslint . --max-warnings=0
   npx next build
   ```

4. 启动/确认开发服务器（优先 `pnpm dev -p 3200`，3000 曾有僵尸进程），浏览器复测：
   - 1440×900、1280×720；
   - 进入项目、滚筒真实滚动、上下键、点选其他项目；
   - Esc 和“返回作品列表”；
   - 中英文、深浅色、减少动态；
   - 375px 移动端无横向溢出。
5. 重新看截图，确认转场不是单纯淡入淡出：左侧标题交接和右侧详情更新要被感知为同一个动作。若 `layoutId` 在打开详情时没有实际共享位移，检查 `LayoutGroup` 和两边的布局节点，不要只依据代码声明认定动画有效。
6. 不要改掉当前已确认的首页分组、深圳时钟等布局，除非用户另外要求。

## 环境备注

- 项目目录：`F:\yuqiAI\grzy\geenzhuye-handover\geenzhuye`
- Node/pnpm 在前序交接记录中为 Node 24 / pnpm 11；本机开发服务器通常用端口 3200。
- `AGENTS.md` 有项目命令、视觉红线和 AppleDouble 文件说明。
- 目录不是 Git 仓库，不能用 `git diff/status` 作为唯一变更记录；不要做破坏性清理。
- 根目录有 macOS 拷贝留下的 `._*` AppleDouble 文件时，它们会导致 ESLint 解析错误；处理前先确认确实是这些元数据文件。
