# 项目配图 · 生成提示词（2026-10-31）

> 用途：首页悬停项目时，整页背景淡入这张图（氛围底图，约 10%–15% 浓度）。详情页仍用真实截图。
> 你用 ChatGPT / 即梦 / Midjourney 生成后，把图发给我；我负责裁切、压缩、命名和接入页面。

## 一、统一要求（每张都一样）

- **横屏 16:10**，至少 **2400 × 1500**（Midjourney 加 `--ar 16:10`）
- **画面里没有任何文字、Logo、人物、屏幕**
- 主体放在**右侧三分之一**，左侧和中间留大片安静的空白（页面文字压在这里）
- 13 张是**同一个系列**：同样的光线、底色、色调和质感
- 不要深蓝黑底、霓虹、发光、科技感 UI 元素

## 二、统一风格段（每条提示词前面都加上这一段）

**中文（ChatGPT / 即梦）**

> 编辑感静物摄影，柔和的自然窗光从左侧照入，暖白色背景（接近 #F3F1EC），低饱和中性色调，只允许一处很克制的点缀色；哑光材质（纸、木、陶瓷、拉丝金属）；浅景深；主体位于画面右侧三分之一，左侧和中间留出大片干净空白；画面中没有任何文字、Logo、人物或电子屏幕；不要蓝色调、霓虹或发光效果；横版 16:10。

**English (Midjourney)**

> editorial still-life photography, soft natural window light from the left, warm off-white background (#F3F1EC), muted neutral palette with a single restrained accent, matte materials (paper, wood, ceramic, brushed metal), shallow depth of field, subject placed in the right third, large calm empty space on the left and center, no text, no logos, no people, no screens, no blue tint, no neon, no glow --ar 16:10 --style raw

## 三、13 张图的画面

在统一风格段后面接上对应的一句。文件名按左列命名。

| 文件名 | 项目 | 画面（中文） | Subject (English) |
|---|---|---|---|
| `bg-yuqi-engine` | 宇奇引擎 | 一台打开后盖的精密机械仪器，内部零件整齐排列，几枚零件被取出，旁边放着空白的小标签——先看清，再动手 | a precision instrument with its back cover opened, inner parts neatly laid out, a few components removed and placed beside small blank tags |
| `bg-yuqi-lite` | 宇奇轻管 | 一排用细线悬挂的小黄铜铃，其中几个被轻轻摘下，安静地放在一旁的浅托盘里 | a row of small brass bells hanging on thin threads, a few gently taken down and resting in a shallow tray |
| `bg-wanji-kit` | 玩机装机工具 | 一个打开的木制零件盒，格子里装满各式小零件，只有一格空着，旁边放着一枚正要补进去的零件 | an open wooden parts organizer, compartments filled with small components, one compartment empty with a part placed next to it |
| `bg-yuqi-team-orchestrator` | 多智能体编排 | 一组同款的木质小棋子排成清晰的阵列，最前面一枚稍大，像在指挥 | a set of identical small wooden pieces arranged in a clear formation, one slightly larger piece in front leading them |
| `bg-agent-project-map` | 代码库拓扑导图 | 一张展开的纸质地图，用细线和几枚小图钉标出几个位置，边角微微卷起 | an unfolded paper map with a few locations marked by thin thread and small pins, corners slightly curled |
| `bg-enterprise-efficiency-suite` | 企业增效工具集 | 一排整齐的小型黄铜印章，旁边一叠盖好的、完全一样的空白卡片 | a neat row of small brass stamps beside a stack of identical stamped blank cards |
| `bg-spec-forge` | 需求锻造台 | 一块被锻打成整齐长条的金属放在铁砧上，旁边散落几块形状不一的碎料 | a metal bar forged into a clean straight shape resting on an anvil, a few irregular scraps scattered beside it |
| `bg-work-report-skill` | 工作汇报 Skill | 一叠横线记录卡片被一枚金属夹整齐夹住，卡片上只有横线、没有字 | a stack of ruled index cards held together by a metal clip, only ruled lines, no writing |
| `bg-zy-anti-slop-frontend-design` | AI 前端反平庸知识库 | 一组手工陶瓷样片排成一行，每片的颜色、釉面、纹理都不一样 | a row of handmade ceramic sample tiles, each with a different color, glaze and texture |
| `bg-wanji-index` | 玩机索引 | 一个拉开的木质档案柜抽屉，里面是整齐竖立的空白索引卡片 | an open wooden card-catalog drawer with neatly standing blank index cards |
| `bg-qilan-atlas` | 奇览 | 一面浅色墙上整齐排列的小块材质样本：布料、石材、玻璃、纸张 | small material samples neatly arranged on a pale wall: fabric, stone, glass, paper |
| `bg-yike-album-downloader` | 一刻相册下载 | 几张背面朝上的旧照片从布面相册里取出，整齐叠放在桌上 | a few old photographs, backs facing up, taken out of a cloth-bound album and stacked neatly on a table |
| `bg-flyykjxzq` | 风灵月影下载器 | 一把小钥匙放在干净的陶瓷托盘里，旁边一卷细线 | a small key resting in a clean ceramic dish beside a spool of thin thread |

## 四、交付

- 生成后直接发图给我（PNG / JPG 都行，越大越好）。
- 我会统一调色（必要时）、裁成 16:10、压成 webp，放到 `public/projects/bg-*.webp`，并在深色模式下调暗。
- 某张不满意可以只重做那一张，不影响其他。

## 五、如果想换成"胶片光影"风格

只替换第二节的统一风格段，第三节每个项目的画面构思保留，但改为"用光影暗示这个物体"：

> 中文：电影感空镜，抽象的光影与纹理，温暖的午后光线穿过百叶窗或纱帘，在浅色墙面与桌面上投下柔和的影子；胶片颗粒，低饱和暖色调；画面中没有任何文字、Logo、人物或屏幕；主体只在右侧三分之一隐约出现；横版 16:10。
>
> English: cinematic empty shot, abstract light and texture, warm afternoon light through blinds or sheer curtains casting soft shadows on pale walls and tabletops, subtle film grain, muted warm palette, no text, no logos, no people, no screens, subject only faintly suggested in the right third --ar 16:10 --style raw
