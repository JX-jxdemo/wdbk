import { motion } from "framer-motion";
import { useScrollProgress } from "@/hooks/useScrollProgress";

/** 顶部固定阅读进度条 */
export default function ReadingProgress() {
  const progress = useScrollProgress();

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-1">
      <div className="h-full bg-base-800" />
      <motion.div
        className="absolute inset-y-0 left-0 origin-left bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-magenta"
        style={{
          width: `${progress * 100}%`,
          boxShadow: "0 0 8px var(--neon-cyan)",
        }}
      />
    </div>
  );
}
