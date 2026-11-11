"use client";

import { useEffect, useState } from "react";

/* 页脚当地时间：深圳 GMT+8，挂载后才渲染（避免 SSR 时间不一致），每 15s 校准一次 */
const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Shanghai", hour: "2-digit", minute: "2-digit", hour12: false });

export function LocalClock({ city }: { city: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(fmt.format(new Date()));
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 15000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);

  return (
    <span className="tabular-nums">
      {city} GMT+8 <span className={`transition-opacity duration-500 ${time ? "opacity-100" : "opacity-0"}`}>{time ?? "00:00"}</span>
    </span>
  );
}
