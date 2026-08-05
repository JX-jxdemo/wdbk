import { motion } from "framer-motion";

/**
 * 动态渐变网格背景
 * 多层径向渐变缓慢流动,营造赛博朋克空间感
 */
export default function GradientMesh() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* 基础底色 */}
      <div className="absolute inset-0 bg-base-900" />

      {/* 网格线 */}
      <div className="absolute inset-0 bg-grid opacity-40" />

      {/* 流动的霓虹光斑 */}
      <motion.div
        className="absolute -left-1/4 top-0 h-[600px] w-[600px] rounded-full opacity-30 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(0,240,255,0.6) 0%, transparent 70%)",
        }}
        animate={{
          x: ["0%", "40%", "10%", "0%"],
          y: ["0%", "20%", "50%", "0%"],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute right-0 top-1/4 h-[500px] w-[500px] rounded-full opacity-25 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,0,110,0.6) 0%, transparent 70%)",
        }}
        animate={{
          x: ["0%", "-30%", "-10%", "0%"],
          y: ["0%", "30%", "10%", "0%"],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-0 left-1/3 h-[450px] w-[450px] rounded-full opacity-20 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.6) 0%, transparent 70%)",
        }}
        animate={{
          x: ["0%", "20%", "-20%", "0%"],
          y: ["0%", "-10%", "20%", "0%"],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 顶部渐变遮罩 */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-base-900 to-transparent" />
      {/* 底部渐变遮罩 */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-base-900 to-transparent" />
    </div>
  );
}
