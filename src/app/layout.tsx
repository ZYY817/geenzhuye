import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf8" },
    { media: "(prefers-color-scheme: dark)", color: "#121211" },
  ],
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://zhiyu817.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  title: "智宇 — 用 AI 把想法做成软件与网页",
  description:
    "做产品出身，用 Claude 和 Cursor 把想法直接做成可用的软件与网页：宇奇引擎、宇奇轻管、AIClean、玩机索引等 14 个项目。",
  openGraph: {
    url: "/",
    title: "智宇 — 用 AI 把想法做成软件与网页",
    description:
      "做产品出身，用 AI 把想法直接做成可用的软件与网页。",
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
    title: "智宇 — 用 AI 把想法做成软件与网页",
    description:
      "做产品出身，用 AI 把想法直接做成可用的软件与网页。",
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
      suppressHydrationWarning
      className={`${geistMono.variable} h-full`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var t = localStorage.getItem('zhiyu-theme');
                var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (t === 'dark' || (!t && d)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch(e) {}
            })();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#fbfaf8] dark:bg-[#121211] text-[#171717] dark:text-[#ecebe7]">
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
