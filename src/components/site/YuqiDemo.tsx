"use client";

import React, { useState, useEffect, useRef } from "react";

/* ============================================================================
 * 宇奇引擎 在线可操作 Web Demo (Live Interactive Engine)
 * ----------------------------------------------------------------------------
 * 延迟装配：板面入场完成 + 浏览器空闲后才注入 iframe。
 * 视口驻留：离开视口 2 屏后卸载 —— 同源 iframe 与主页共享主线程，
 * 常驻会让内部 SPA 的定时器/排版在滚动全页时持续抢占主线程。
 * 回到附近时重新挂载，骨架海报先接管，无白闪。
 * ==========================================================================*/
export function YuqiInteractiveWebDemo({ boot }: { boot: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [armed, setArmed] = useState(false);
  const [near, setNear] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        setScale(Math.min(1, Math.max(0.25, width / 1200)));
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setNear(entry.isIntersecting);
        if (!entry.isIntersecting) setLoaded(false);
      },
      { rootMargin: "200% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!boot || armed) return;
    const ric = window.requestIdleCallback;
    let idleId: number | undefined;
    let timerId: number | undefined;
    if (typeof ric === "function") {
      idleId = ric(() => setArmed(true), { timeout: 1500 });
    } else {
      timerId = window.setTimeout(() => setArmed(true), 900);
    }
    return () => {
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timerId !== undefined) window.clearTimeout(timerId);
    };
  }, [boot, armed]);

  return (
    <div ref={containerRef} className="absolute inset-0" style={{ contain: "paint" }}>
      <div
        style={{
          width: 1200,
          height: 780,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          willChange: "transform",
        }}
        className="absolute top-0 left-0"
      >
        {armed && near && (
          <iframe
            src="/yuqi-web-demo/index.html?embed=1"
            title="宇奇引擎 在线可操作 Web Demo"
            className="w-full h-full border-0 pointer-events-none sm:pointer-events-auto"
            loading="lazy"
            onLoad={() => setLoaded(true)}
          />
        )}
      </div>

      {/* 装配期骨架海报：静态外壳轮廓，iframe 就绪后淡出 */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 z-10 bg-[#0b0c10] flex flex-col transition-opacity duration-700 ${
          loaded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="h-[4.6%] min-h-8 border-b border-white/[0.07] flex items-center gap-1.5 px-4">
          <span className="w-2.5 h-2.5 rounded-full bg-white/[0.09]" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/[0.09]" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/[0.09]" />
          <span className="ml-3 h-3 w-28 bg-white/[0.05]" />
        </div>
        <div className="flex-1 flex">
          <div className="w-[15%] border-r border-white/[0.06] p-[1.2%] space-y-2">
            <div className="h-2.5 w-3/4 bg-white/[0.05]" />
            <div className="h-2.5 w-2/3 bg-white/[0.04]" />
            <div className="h-2.5 w-4/5 bg-white/[0.05]" />
            <div className="h-2.5 w-1/2 bg-white/[0.03]" />
          </div>
          <div className="flex-1 p-[2.5%] space-y-3">
            <div className="h-3 w-1/3 bg-white/[0.05]" />
            <div className="grid grid-cols-3 gap-[2%]">
              <div className="h-14 bg-white/[0.03]" />
              <div className="h-14 bg-white/[0.03]" />
              <div className="h-14 bg-white/[0.03]" />
            </div>
            <div className="h-24 bg-white/[0.02]" />
          </div>
        </div>
      </div>
    </div>
  );
}
