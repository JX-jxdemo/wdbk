import { motion } from "framer-motion";

/**
 * CRT 扫描线效果
 * 缓慢移动的水平扫描光带,模拟老式显示器
 */
export default function ScanLines() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      {/* 静态扫描线纹理 */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,240,255,0.5) 0px, rgba(0,240,255,0.5) 1px, transparent 1px, transparent 3px)",
        }}
      />

      {/* 移动的扫描光带 */}
      <motion.div
        className="absolute inset-x-0 h-[200px]"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(0,240,255,0.04), transparent)",
        }}
        initial={{ y: "-200px" }}
        animate={{ y: "100vh" }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
