import { ARCHIVE_PROJECTS, ProjectItem, SYSTEM_METRICS } from "./archive";

export type { ProjectItem };
export { ARCHIVE_PROJECTS, SYSTEM_METRICS };

export const TOTAL_SCREENS = 3;

export interface ScreenNavItem {
  index: number;
  label: string;
  short: string;
  tag: string;
}

export const SCREEN_NAV: ScreenNavItem[] = [
  { index: 0, label: "序章 // 叙事", short: "01", tag: "NARRATIVE" },
  { index: 1, label: "作品 // 宇宙", short: "02", tag: "WORKS" },
  { index: 2, label: "尾声 // 寄语", short: "03", tag: "EPILOGUE" },
];

export const WATERMARK_TEXTS = [
  "ZHIYU // 智宇",
  "WORKS UNIVERSE",
  "THE EPILOGUE",
];

export const ABOUT_CARDS = [
  {
    idx: "01",
    title: "AI 深度实践",
    eng: "APPLIED AI",
    desc: "超越表面闲聊，将大模型重塑为高阶需求工程与多智能体自动化中枢。",
  },
  {
    idx: "02",
    title: "600+★ 底层系统调优",
    eng: "NATIVE ENGINEERING",
    desc: "打造 Windows 平台宇奇引擎，坚持检测先行、可逆回退与零玄学调优。",
  },
  {
    idx: "03",
    title: "实用主义产品观",
    eng: "UTILITY FIRST",
    desc: "坚持做自己喜欢并能帮助他人切实省时、提效、解决实际问题的真实工具。",
  },
  {
    idx: "04",
    title: "严谨工程抗平庸",
    eng: "ANTI-SLOP CRAFT",
    desc: "抵制千篇一律的 AI 模板代码，坚守扎实的软件工程规范与审美敬畏。",
  },
];

export const HERO_COPY = {
  name: "智宇",
  handle: "ZYY",
  luckyNumber: "7",
  titleBadge: "CREATOR & ENGINEER",
  headlineLine1: "我是智宇，负责天马行空的大胆构想，",
  headlineLine2: "用 AI 亲手把它们做成真正解决现实问题的产品。",
  statementLine1: "我不喜欢随大流的 AI 模板垃圾代码。",
  statementLine2: "我更关注如何通过 AI 工具与严谨的工程架构，去实现真正能解决现实问题的事情，而不是泛泛地做一个浮躁的玩具。",
};
