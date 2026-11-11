# 部署计划 · GitHub Pages（2026-10-31）

> 目标：把本地已完成的 v3 首页（F1–F3）发布成一个国内能打开、可以写进简历 / bonjour.bio 的公开地址。
> 本文件只是计划；**推送、开启 Pages、改仓库设置都要等你确认**。

## 0. 现状（已核实）

| 项 | 现状 | 影响 |
|---|---|---|
| `zyy817.github.io`（根地址） | 已被 **宇奇引擎官网**（仓库 `ZYY817.github.io`）占用 | 个人主页不能放根地址，除非换掉官网 |
| 仓库 `ZYY817/geenzhuye` | 公开，存着 10 月 27 日的旧版主页；**和本地仓库没有共同历史**；Pages 未开启 | 推送前要先合并历史 |
| 本地仓库 | 8 个提交（baseline → F3），没有远程 | — |
| `gh` 命令行 | 已登录 ZYY817 | 可以替你开启 Pages、推送（需你确认） |
| 试导出（已撤销） | `output: "export"` + `basePath` 能构建；产物见下 | 发现 5 个必须先修的问题 |

### 试导出发现的问题

1. **`public/_local/`（39 MB 本地截图、参考图、字体）会被原样复制进产物。** 它不在 git 里，所以**只要在 GitHub 的 CI 里构建就不会带上**；但如果在本机构建再上传就会泄漏。→ 只在 CI 构建，并加一道"产物里有 `_local` 就失败"的检查。
2. 子路径部署时，代码里写死的 `/projects/*.webp`、`/?p=…`、`href="/"` 都缺前缀 → 会 404。→ 统一加 `BASE` 前缀。
3. `robots.txt` / `sitemap.xml` 要声明为静态，而且里面还是旧的 `zhiyu817.vercel.app`。
4. `/about` 在静态导出里变成"加载完 JS 才跳转"的错误页。→ 换成纯 HTML 的跳转页（`<meta refresh>` + 链接）。
5. 分享预览图 `og-cover.jpg` 是旧版截图，写着"宇奇引擎已被真实安装 100,000+ 次""9 款"——和现在的口径矛盾。→ 用新首页重新生成。

另外：
- 详情页里宇奇引擎的"官网"链接指向 `yuqiengine.pages.dev`（国内常打不开），应改成 `https://zyy817.github.io/`。
- `public/zero`、`public/models`、`public/yuqi-web-demo`、`public/yuqi` 和旧组件（WorkStream、AboutView、SiteShell 等）新版已不用，约 7 MB，顺手清掉，产物只剩 ~1.1 MB。旧代码仍在 git 历史里，随时能找回。

## 1. 需要你拍板的三件事

| # | 问题 | 选项 | 我的建议 |
|---|---|---|---|
| A | 主页地址 | ① `zyy817.github.io/geenzhuye/`（现成仓库名，拼音有点像拼错的"个人主页"）② 把仓库改名为 `zhiyu` → `zyy817.github.io/zhiyu/` ③ 以后买自己的域名（几十元/年，GitHub Pages 绑定即可，境外托管不需要备案） | **②**：短、好记、像名字。域名以后随时可以再加，不影响现在 |
| B | 远程仓库里的旧版历史 | ① 合并保留（旧提交都还在，新版接在后面）② 强推覆盖（旧历史从 GitHub 上消失） | **①**，不丢任何东西 |
| C | 英文版的搜索 / 分享预览 | ① 增加一个静态的 `/en/` 页面（英文标题、描述、预览图，`hreflang` 互指）② 暂不做（英文访客点进来看到的是英文，但链接预览仍是中文） | **①**，投英文岗位时发 `/en/` 链接，预览也是英文；工作量小 |

## 2. 执行步骤（你确认后按顺序做）

### 2.1 本地改代码（可回退，不涉及外部）

1. `next.config.ts`：`output: "export"`、`trailingSlash: true`、`images.unoptimized`、`basePath` 由环境变量 `NEXT_PUBLIC_BASE_PATH` 提供（本地开发为空，不影响现在的预览）。
2. 新增 `src/lib/base.ts`：`withBase(path)`；替换所有写死的路径（项目截图、`/?p=`、返回首页、`pushState`）。
3. `robots.ts` / `sitemap.ts` 加 `dynamic = "force-static"`，站点地址改为最终地址；`layout.tsx` 的 `metadataBase` 同步。
4. `/about` → 纯 HTML 跳转页。
5. 宇奇引擎"官网"链接改为 `zyy817.github.io`。
6. 删除不用的素材与旧组件；`404` 页改成与新版一致的极简样式（"这一页不在这里 → 回首页"）。
7. （若 C 选 ①）`/en/` 页面：同一个组件，初始语言为英文，英文元数据。
8. 重新生成 `og-cover.jpg`（1200×630，新首页的浅色版；英文版另一张）。

### 2.2 本地验收（模拟线上子路径）

- 在本机用子路径起一个静态服务器访问 `out/`，Playwright 跑一遍：首页、11 个详情直链、`?lang=en`、`/en/`、`/about` 跳转、404、深浅色、手机；检查所有图片和链接无 404、控制台无错误。
- 检查产物里没有 `_local`、体积约 1 MB。

### 2.3 发布（每一步都需要你确认）

1. 新增 `.github/workflows/deploy.yml`：推送到 `main` 时自动 `pnpm install` → 构建 → 检查 → 发布到 Pages。
2. （若 A 选 ②）把仓库 `geenzhuye` 改名为 `zhiyu`（GitHub 会自动把旧地址跳到新地址）。
3. 本地添加远程 → 拉取旧版 → 按 B 合并 → 推送 `main`。
4. 开启仓库的 Pages（来源：GitHub Actions）。
5. 等 Actions 跑完，线上再跑一遍 2.2 的检查。

### 2.4 发布后由你做

- 用**手机流量**（不连 Wi-Fi）打开一次，确认国内能访问、速度可以接受。github.io 在国内大多数时候可访问，偶尔会慢；宇奇引擎官网已经在同一个域名下，可作参考。
- 更新简历、bonjour.bio、GitHub 个人资料里的链接。

## 3. 风险与回退

- 代码改动都在本地提交里，可以 `git revert`。
- Pages 出问题时，在仓库设置里关闭 Pages 即可下线；不影响 `zyy817.github.io` 上的宇奇引擎官网。
- 强推（B ②）不可逆——所以默认不用。
