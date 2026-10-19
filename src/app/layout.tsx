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
  title: "智宇 ZYY — Hello，我是智宇",
  description:
    "Hello，我是智宇。把我懂的经验和思考，借助 AI 去帮到更多的人。宇奇引擎 (10万+ 用户)、多智能体编排调度器等 AI 与系统作品档案。",
  openGraph: {
    url: "/",
    title: "智宇 ZYY — Hello，我是智宇",
    description:
      "把我懂的经验和思考，借助 AI 去帮到更多的人。",
    type: "website",
    siteName: "智宇 ZYY",
    images: [
      {
        url: "/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "智宇 ZYY · AI 创作者 — AI 产品与作品档案",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "智宇 ZYY · AI 创作者 — 用 AI 创造",
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
          时，4s 后强制显出全部 SSR 内容，绝不留给访客纯黑页。
        */}
        <script
          id="hydration-visibility-fallback"
          dangerouslySetInnerHTML={{
            __html: `(function(){if('scrollRestoration' in history){history.scrollRestoration='manual';}if(!location.hash&&scrollY>0){scrollTo(0,0);}setTimeout(function(){if(document.documentElement.dataset.appMounted==='true')return;document.documentElement.classList.add('reveal-fallback');},4000);})();`,
          }}
        />
      </body>
    </html>
  );
}
