import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, TerminalSquare } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-24">
      <div className="absolute inset-0 bg-grid opacity-20" />

      {/* 故障效果光斑 */}
      <motion.div
        className="absolute left-1/4 top-1/3 h-64 w-64 rounded-full bg-neon-magenta/20 blur-3xl"
        animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute right-1/4 bottom-1/3 h-64 w-64 rounded-full bg-neon-cyan/20 blur-3xl"
        animate={{ opacity: [0.2, 0.5, 0.2], scale: [1.1, 1, 1.1] }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
      />

      <div className="container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 font-mono text-xs text-neon-magenta"
        >
          <TerminalSquare className="h-4 w-4" />
          ERROR: SIGNAL_LOST
        </motion.div>

        {/* 故障 404 */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-8xl font-black text-white sm:text-9xl md:text-[12rem]"
          style={{
            textShadow:
              "3px 0 var(--neon-magenta), -3px 0 var(--neon-cyan)",
          }}
        >
          404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-4 font-heading text-xl text-white"
        >
          信号丢失 — 页面未找到
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto mt-3 max-w-md text-sm text-ink-muted"
        >
          你访问的页面可能在数据流中迷失了方向,
          <br />
          或者从未在这个维度存在过。
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/"
            className="group inline-flex items-center gap-2 bg-neon-cyan px-7 py-3.5 font-mono text-sm font-medium text-base-900 transition-all hover:shadow-neon-cyan hover:brightness-110"
          >
            <Home className="h-4 w-4" />
            返回首页
          </Link>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 border border-white/15 px-7 py-3.5 font-mono text-sm text-ink-muted transition-all hover:border-neon-cyan/50 hover:text-neon-cyan"
          >
            浏览博客
          </Link>
        </motion.div>

        {/* 终端日志 */}
        <motion.pre
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mx-auto mt-12 max-w-md overflow-x-auto rounded-lg border border-[var(--color-border)] bg-base-900/60 p-4 text-left font-mono text-xs text-ink-faint"
        >
          <span className="text-neon-green">$</span> trace --route /unknown
          {"\n"}
          <span className="text-neon-amber">[WARN]</span> route not found in
          registry
          {"\n"}
          <span className="text-neon-magenta">[ERROR]</span> 404 — connection
          terminated
          {"\n"}
          <span className="text-neon-cyan">[INFO]</span> redirecting to safe
          zone...
        </motion.pre>
      </div>
    </section>
  );
}
