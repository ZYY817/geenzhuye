# 第八轮升级规划：关于页居中 + 语言切换重影根治

> 日期：2026-10-30 · 状态：✅ 已实施并实测通过（结果见文末「实施结果」）
> 本文件是施工蓝图：先讲病根（代码级），再给设计、时序、文件改动、验证标准。

---

## 一、问题诊断（代码级定位）

### 问题 1：关于页不是真正的「居中」

现状：`AboutView` 用 `max-w-[660px] mx-auto` + `pt-16 sm:pt-24`——**水平居中，垂直方向顶部对齐**。关于页内容很短（标签 + 主张 + 事实条 + 两段 bio + 一句邀请），渲染完只占视口上半部分，下半屏直到页脚全是空白，视觉重心悬空。

目标：内容块在「页头与页脚之间的可用区」内**垂直居中**，同时保持 660px 阅读栏水平居中。

### 问题 2：语言切换的文字重影（popLayout 叠化的结构性缺陷）

现状实现（`page.tsx` / `AboutView.tsx`）：

```tsx
<AnimatePresence mode="popLayout" initial={false}>
  <motion.div key={lang} exit={{ opacity: 0, ... }}>
```

`popLayout` 的机制：旧版本被**绝对定位钉在原位**淡出，新版本同时在正常文档流里入场。这个机制对「新旧内容几何一致」的场景没问题，但语言切换恰好是几何必然不一致的：

| 重影来源 | 具体表现 |
|---|---|
| **文案长度差** | hero 第二行中文 2 行 ≈ 英文 1 行；bio 中文比英文短。旧层所有后续内容的 y 坐标与新层不同 → 旧中文幽灵文字叠在新英文的**错误位置**上 |
| **旧层静止** | exit 只有 `opacity: 0`，旧文字一动不动地淡在新层上面——叠影是静止的，最容易被看出来 |
| **错峰入场** | 新层各行有入场 delay，delay 期间该行位置只有旧层文字 → 延长叠影窗口 |
| **宽度跳变** | SwapText/导航标签 popLayout 时容器宽度瞬间跳到新值 |

结论：**叠化（crossfade）是错误的方向**，不是参数问题。根治方案是改成**顺序替换（sequential swap）**——旧内容先完整撤场，新内容再进场，两者永不共存。

### 顺带要处理的行为

- 详情态切语言：`openId` 在 `Home` 顶层状态里，WorkStream 重挂载后详情直接以打开态出现（滚筒回到选中行居中）——行为可接受，写入规范。
- `SwapText`（顶栏归档/关于、联系）：同一裁切框内上下翻出/翻入，新旧词同原点，属于「原地翻转」的预期效果，**保留**。只修一个细节：宽度跳变时让变化平滑（可选 `layout` 动画）。

---

## 二、设计方案

### 2.1 语言切换：「落版再排」（lift-out → re-typeset）

```
旧版：整体向下微沉 + 淡出（0.16s，EASE_EXIT）
          ↓ 空窗 ≈ 0（高度钉住，见 2.2）
新版：整体微升淡入（0.30s，EASE_SILK）+ 各行自带 entrance 错峰
```

- 旧版不只淡出，加 `y: +10` 的沉降——有方向感的离场，读起来是「旧版让位」而不是「双层叠加」。
- 新版复用现有各行 entrance 动画（索引行 40ms 错峰、分组标签、说明段），等于免费获得「重新排印」的级联。
- 减弱动态模式：两边都只保留 0.15s 淡入淡出，无位移。

### 2.2 高度钉（防止顺序替换时的页面塌陷）

顺序替换有一个窗口期：旧版已卸载、新版未挂载，容器高度为 0。此时若用户停在页面中部（scrollY=700），浏览器会把滚动钳到页面顶部 → 切换后**跳回首屏**。

解法：在语言变化的那个提交帧，旧版仍在 DOM 里（AnimatePresence `mode="wait"` 会保留它直到 exit 完成）。此时用 `useLayoutEffect` 测量容器 `scrollHeight`，给容器钉 `min-height`；新版入场动画开始时（`onAnimationStart`）解除。

```
lang 变化 → useLayoutEffect（旧版仍在 DOM）→ 记录 H
        → 容器 style={{minHeight: H}}
        → exit 0.16s → 新版挂载 + onAnimationStart → 解除 minHeight
```

### 2.3 关于页：双轴居中

```
<main className="min-h-[calc(100svh-var(--header-h)-var(--footer-h))] flex items-center">
  <div className="mx-auto w-full max-w-[660px]">…内容…</div>
</main>
```

- 用 `min-h` 而非固定高：内容超过可用区时自然变回顶部流式排版（移动端长英文不会溢出）。
- 页头高 72/88px，页脚不可预知——用 `calc(100svh - 160px)` 级近似值即可（精确值用 svh 保证移动端地址栏不抖）。可选微调：内容块 `translate-y-[-4svh]` 让视觉重心略高于几何中心，更高级。
- 内部时序不变：标签 → 主张逐字升起 → 事实条 → bio → 邀请语，依次入场。

### 2.4 小标签（保留现状，仅平滑宽度）

`SwapText` 不动；在导航容器允许的情况下给包裹 span 加 `layout` 让宽度变化参与动画（若实测造成布局抖动则放弃，宽度跳变在 12px 字号下可接受）。

### 2.5 详情态切语言的行为规范

`key={lang}` 重挂载 `WorkStream` 时：
- `openId` 保留 → 直接以详情态渲染（不经过列表），滚筒瞬移到选中行中心；
- `fly/hovered/direction/savedY` 重置——无视觉副作用（savedY 只在详情关闭时使用，而此刻仍是详情态）；
- 视为**可接受行为**，不额外做状态保留。

---

## 三、时序规范（毫秒级）

| 阶段 | 时长 | 缓动 | 说明 |
|---|---|---|---|
| 旧版离场 | 160ms | EASE_EXIT | `opacity 1→0, y 0→+10`，整版同步 |
| 空窗 | ~16ms（1 帧） | — | 高度钉生效，页面无塌陷 |
| 新版入场 | 300ms | EASE_SILK | `opacity 0→1, y +8→0` |
| 内部错峰 | 沿用现有 | EASE_SILK | 索引行 40ms/行、分组 +10ms、说明段 +50ms |
| 总感知时长 | ≈ 480ms + 尾部错峰 | | 比叠化版稍慢但干净，是「重新排印」不是「闪烁」 |
| reduced-motion | 150ms×2 | — | 仅淡入淡出 |

---

## 四、文件改动清单

| 文件 | 改动 |
|---|---|
| `src/components/site/LangSwap.tsx`（新建） | 共享切换包装器：`AnimatePresence mode="wait"` + `key={lang}` 的 motion.div（exit y+10/160ms、enter y+8→0/300ms）+ `useLayoutEffect` 高度钉 + `onAnimationStart` 解钉。props：`children`。内部自己 `useLang()`。 |
| `src/app/page.tsx` | 删掉自建的 popLayout 包装，`WorkStream` 外包 `<LangSwap>`。 |
| `src/components/site/AboutView.tsx` | 同样换 `<LangSwap>`；外层 main 加 `min-h-[calc(100svh-160px)] flex items-center` 实现双轴居中，内容块加轻微负上移。 |
| `src/components/site/Kinetic.tsx` | （可选）SwapText 加 `layout` 平滑宽度。 |
| `HANDOVER.md` | 记录第八轮：诊断、方案、时序表、坑。 |

不改动：`WorkStream` 内部、`HeroTypewriter`、`SiteShell` 导航结构、`profile.ts` 文案。

---

## 五、验证标准（Playwright 实测，不写不算完）

1. **无重影**：切语言过程中每 60ms 截图一帧，任一帧里不得出现「同一区域两行文字错开重叠」——顺序替换后物理上不可能有双层文字。
2. **不跳滚动**：scrollY=700 处切语言，切换完成后 scrollY 仍为 700（±2）。
3. **不塌陷**：切换全程录屏逐帧检查，页面中段不出现瞬时全白。
4. **详情态**：详情打开时切语言 → 详情直接以新语言重挂载，滚筒居中选中项，0 报错。
5. **关于页居中**：1440×900 与 375×780 截图，内容块垂直方向大致居中（±40px），移动端无溢出。
6. **矩阵**：浅色/深色、1440/1280/375、reduced-motion、中英双向各切一次，控制台 0 错误。
7. `tsc --noEmit` / `eslint --max-warnings=0` / `next build` 全绿。

---

## 六、风险与取舍

- **`mode="wait"` 的空窗一瞬**：靠高度钉吸收；若实测仍有可感知闪烁，备选方案是 wait→exit 前给容器钉 `height` 并 `overflow:hidden`，新内容直接覆盖式入场（不等待），即「钉住高度的 popLayout 变体」——先按 wait 实现，测过再决定。
- **切语言丢详情内滚动位置**：接受（2.5 已写明）。
- **关于页垂直居中在超长内容下回退为顶对齐**：`min-h + flex` 天然处理，不用写断点。

---

## 实施结果（2026-10-30 实测）

**第一版按「顺序替换」实施并验证**（逐帧无重影、scrollY 不变、全绿），随后用户明确想要**方向性挤压**。中间试过 clip 擦幕和主屏等速拖页两个变体，用户反馈"拖页对了但不够流畅、要更有冲击力"。最终发货：**iOS 导航式视差盖页**（`popLayout` 双轨）——

- 新页全速 `±100vw→0` 盖过旧页；旧页只退 `±30vw` 并渐暗到 0.5（让位感+纵深，非锁步）
- 每个语种锚定一侧：英文=右页、中文=左页；`initial`/`exit` **同号**（退出层属性按其自身 lang 冻结——popLayout 的坑，写成 -dir 旧页会追在新页后面跑）
- 接缝保持硬切边——用户实测要求去掉 64px 前缘软阴影（"中间不该有任何干扰"），不要再加回
- **流畅度关键**：`LangFlightContext` 在切换渲染帧置 true（渲染期 setState 官方模式，不能用 ref 判断"刚切换"——`react-hooks/refs` 禁渲染期读 ref），新页所有内部入场动画直接渲染成品态，滑动窗口只剩两层 transform/opacity 合成；`Odometer`/`RollText` 在 flight 时平铺渲染（砍掉 ~700 节点滚柱 DOM），挂载帧 250ms→183ms
- flight 在 SLIDE+220ms 后清除（迟挂载组件保留入场）；`initial={false}` 会关掉子孙全部入场——这正是 flight 想要的，但只限该窗口
- 实测：旧层退到 -432px(=30vw@1440)+op0.5、新层满不透明 432→0、行 op 恒 1、横向溢出 0
- **重影修复（用户实测抓到）**：滑动层必须①不透明底色（`bg-white dark:bg-[#09090b]`，否则旧页从新层文字缝隙透出）②视口满宽（`w-screen mx-[calc(50%-50vw)]`，窄容器里两列并排可见）。旧页压暗后尾段 opacity 收 0（`times:[0,.72,1]`），防新页更矮时底缘露残边。AboutView 的 660px 约束下放到内容层、main 必须满宽——这是改动时要检查的约束
- 高度钉改为取**新旧两层最大高**（popLayout 下旧版即刻 absolute，需子层遍历），入场结束后 `setTimeout(ENTER_MS+120)` 释放
- 容器加 `overflow-x-clip` 防横向溢出；reduced-motion 只保留淡入淡出
- 切语言后 scrollY 会随新页面真实高度变化（英文版更矮时钳到更浅位置）——**合法行为**，不是 bug
- 页脚巨型「智宇」署名按用户要求删除，保留结语 + 元信息行
- `SwapText` 外层加 `layout`，宽度变化平滑
- 探测注意：`text=EN` 会命中 `SplitRise` 的 sr-only 文本（"experience" 含 "EN"），点语言按钮用 `nav >> text=EN`
