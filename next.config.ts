import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    // /aiclean/ 下嵌着 AIClean 的静态官网（public/aiclean/），裸路径指到它的 index.html
    return [{ source: "/aiclean", destination: "/aiclean/index.html", permanent: false }];
  },
};

export default nextConfig;
