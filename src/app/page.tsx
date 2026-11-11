import { Instrument_Serif } from "next/font/google";
import { MinimalHome } from "@/components/v3/MinimalHome";

/* 首页（简约 · 文字的质感）。规格：SPEC_V3_MINIMAL.md */
const instrument = Instrument_Serif({ weight: "400", style: "italic", subsets: ["latin"], variable: "--font-instrument" });

const BOOT = `(function(){var d=document.documentElement,q=location.search;
if(/[?&]p=/.test(q))d.classList.add('v3-deep');
try{var m=q.match(/[?&]lang=(en|zh)/);if(m)localStorage.setItem('zhiyu-lang',m[1]);
if(localStorage.getItem('zhiyu-lang')==='en'){d.dataset.wantLang='en';d.classList.add('v3-wait');setTimeout(function(){d.classList.remove('v3-wait')},2500);}}catch(e){}})();`;

export default function Home() {
  return (
    <>
      {/* 水合前的首帧处理：
          · 直链 ?p= 进入时先藏起服务端渲染的首页，避免先闪一下首页（SPEC §10.2）
          · ?lang= 写入语言偏好；要显示英文时先藏起整页（服务端渲染的是中文），语言就位后由 MinimalHome 揭开，2.5s 兜底（SPEC §11.1） */}
      <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      <style>{".v3-deep .v3-home{visibility:hidden}.v3-wait .v3{visibility:hidden}"}</style>
      <MinimalHome serifClass={instrument.variable} />
    </>
  );
}
