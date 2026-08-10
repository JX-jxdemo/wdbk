import { motion } from "framer-motion";
import { useScrollProgress } from "@/hooks/useScrollProgress";

/** 顶部固定阅读进度条 */
export default function ReadingProgress() {
  const progress = useScrollProgress();

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-1">
      <div className="h-full bg-[var(--color-border)]" />
      <motion.div
        className="absolute inset-y-0 left-0 origin-left bg-gradient-to-r from-[var(--color-primary)] via-sky-400 to-[#f97316]"
        style={{
          width: `${progress * 100}%`,
        }}
      />
    </div>
  );
}