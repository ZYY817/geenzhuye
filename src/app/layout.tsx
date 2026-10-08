import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#050507",
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://zhiyu817.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  title: "智宇 ZYY · 独立开发者 — 用 AI 创造",
  description:
    "独立开发者智宇 (ZYY) 的作品档案：宇奇引擎 (600+ GitHub Stars)、奇览、多智能体编排调度器、企业自动化增效工具集等 AI 产品与系统工具。",
  openGraph: {
    url: "/",
    title: "智宇 ZYY · 独立开发者 — 用 AI 创造",
    description:
      "用 AI 创造，让想法真正产生价值。宇奇引擎、奇览、Team Orchestrator 等独立软件作品档案。",
    type: "website",
    siteName: "智宇 ZYY",
    images: [
      {
        url: "/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "智宇 ZYY · 独立开发者 — AI 产品与作品档案",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "智宇 ZYY · 独立开发者 — 用 AI 创造",
    description:
      "用 AI 创造，让想法真正产生价值。宇奇引擎、奇览、Team Orchestrator 等独立软件作品档案。",
    images: ["/og-cover.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050507] text-[#f4f4f5]">
        {children}
        {/*
          Hydration 兜底：React 挂载失败（脚本被代理改写/拦截、弱网 chunk 丢失等）
          时，9s 后强制显出全部 SSR 内容并回填 hero 文本，绝不留给访客纯黑页。
        */}
        <script
          id="hydration-visibility-fallback"
          dangerouslySetInnerHTML={{
            __html: `(function(){if('scrollRestoration' in history){history.scrollRestoration='manual';}if(!location.hash&&scrollY>0){scrollTo(0,0);}setTimeout(function(){if(document.documentElement.dataset.appMounted==='true')return;document.documentElement.classList.add('reveal-fallback');var l1=document.getElementById('hero-line-1'),l2=document.getElementById('hero-line-2');if(l1&&!l1.textContent)l1.textContent='见字如面，我是智宇。';if(l2&&!l2.textContent)l2.textContent='过往所作皆有回响，当下所谋正步步前行。';},4000);})();`,
          }}
        />
      </body>
    </html>
  );
}
