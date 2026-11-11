<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project notes

- Package manager: pnpm. Dev server: `pnpm dev -p 3200` (port 3000 has had zombie processes).
- Verify: `npx tsc --noEmit` → `npx eslint . --max-warnings=0` → `npx next build`.
- This copy came from macOS: if `._*` AppleDouble files reappear, delete them (they break eslint).
- Visual regression: `python ../../probe_home.py` (Playwright, run from `F:\yuqiAI\grzy`) screenshots home / hover / detail / EN+dark / mobile.
- Design direction (user-approved): centered single column (660px), restraint + order details (group labels, right-aligned year·status, footer 深圳 GMT+8 clock + 更新于). No borders/badges/HUD decoration; text never uses `filter: blur`.
- Fonts: body uses the system stack (PingFang / Microsoft YaHei UI). Do not switch body text back to a CJK webfont — Noto Sans SC renders blurry on Windows DPR=1 (no hinting). Small titles ≤24px use `font-semibold` (YaHei has no 500 weight).
- Bump `LAST_UPDATED` in `src/data/archive.ts` on each release.
