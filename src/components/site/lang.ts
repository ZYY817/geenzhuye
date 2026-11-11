"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import type { Lang } from "@/data/i18n";

/* 全站语言：localStorage 持久化，跨页面（首页 ⇄ 关于）保持一致。
 * 服务端快照恒为 zh，水合后再切到存储值，不产生水合不一致。 */
const KEY = "zhiyu-lang";
const listeners = new Set<() => void>();

const read = (): Lang => {
  try {
    return localStorage.getItem(KEY) === "en" ? "en" : "zh";
  } catch {
    return "zh";
  }
};

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  window.addEventListener("storage", fn);
  return () => { listeners.delete(fn); window.removeEventListener("storage", fn); };
};

export function useLang() {
  const lang = useSyncExternalStore(subscribe, read, (): Lang => "zh");
  const setLang = useCallback((next: Lang) => {
    try { localStorage.setItem(KEY, next); } catch {}
    listeners.forEach((fn) => fn());
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
  }, [lang]);
  return [lang, setLang] as const;
}
