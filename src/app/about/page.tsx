import { permanentRedirect } from "next/navigation";

/* 关于页已下线：内容并入新首页（SPEC_V3_MINIMAL §9 #12），旧链接永久跳回首页 */
export default function AboutPage() {
  permanentRedirect("/");
}
