import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-[#050507] text-[#f4f4f5] font-sans antialiased flex items-center justify-center px-6">
      <div className="max-w-md text-left space-y-5">
        <div className="font-mono text-xs text-neutral-500 tracking-widest">404 //</div>
        <h1 className="text-3xl font-light tracking-tight text-white">
          这一页不存在。
        </h1>
        <p className="text-sm text-neutral-400 font-light leading-relaxed">
          你抵达的地址没有对应的内容——也许是链接打错了，或者它已经搬走。
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-white hover:text-neutral-300 transition-colors underline underline-offset-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          回到主页
        </Link>
      </div>
    </div>
  );
}
