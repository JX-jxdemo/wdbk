import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CustomCursor from "@/components/shared/CustomCursor";
// 模块独立引入：删除下方两行 + 文件夹即可完整移除音乐播放器与公告横幅
import MusicPlayer from "@/components/player";
import NoticeBanner from "@/components/notice/NoticeBanner";

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="relative min-h-screen">
      <CustomCursor />

      {/* 公告横幅（顶部通栏） */}
      <NoticeBanner />

      {/* 导航 */}
      <Navbar />

      {/* 主内容 + 页面过渡 */}
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative"
      >
        {children}
      </motion.main>

      {/* 页脚 */}
      <Footer />

      {/* 全局悬浮音乐播放器（右下角，路由跳转不中断） */}
      <MusicPlayer />
    </div>
  );
}
