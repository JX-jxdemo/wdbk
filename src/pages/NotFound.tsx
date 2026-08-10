import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, TerminalSquare } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-24">

      <motion.div
        className="absolute left-1/4 top-1/3 h-64 w-64 rounded-full bg-[#f97316]/20 blur-3xl"
        animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute right-1/4 bottom-1/3 h-64 w-64 rounded-full bg-[var(--color-primary)]/20 blur-3xl"
        animate={{ opacity: [0.2, 0.5, 0.2], scale: [1.1, 1, 1.1] }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
      />

      <div className="container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 font-mono text-xs text-[#f97316]"
        >
          <TerminalSquare className="h-4 w-4" />
          ERROR: SIGNAL_LOST
        </motion.div>

        {/* 故障 404 */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-heading text-8xl font-black text-[var(--text-primary)] sm:text-9xl md:text-[12rem]"
          style={{
            textShadow:
              "3px 0 #f97316, -3px 0 var(--color-primary)",
          }}
        >
          404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-4 font-heading text-xl text-[var(--text-primary)]"
        >
          信号丢失 — 页面未找到
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto mt-3 max-w-md text-sm text-[var(--text-secondary)]"
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
            className="group inline-flex items-center gap-2 bg-[var(--color-primary)] px-7 py-3.5 font-mono text-sm font-medium text-[var(--color-bg)] transition-all hover:shadow-card-hover hover:brightness-110"
          >
            <Home className="h-4 w-4" />
            返回首页
          </Link>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 border border-[var(--color-border)] px-7 py-3.5 font-mono text-sm text-[var(--text-secondary)] transition-all hover:border-[var(--color-primary)]/50 hover:text-[var(--color-primary)]"
          >
            浏览博客
          </Link>
        </motion.div>

        {/* 终端日志 */}
        <motion.pre
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mx-auto mt-12 max-w-md overflow-x-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]/60 p-4 text-left font-mono text-xs text-[var(--text-faint)]"
        >
          <span className="text-[#22c55e]">$</span> trace --route /unknown
          {"\n"}
          <span className="text-[#f59e0b]">[WARN]</span> route not found in
          registry
          {"\n"}
          <span className="text-[#f97316]">[ERROR]</span> 404 — connection
          terminated
          {"\n"}
          <span className="text-[var(--color-primary)]">[INFO]</span> redirecting to safe
          zone...
        </motion.pre>
      </div>
    </section>
  );
}
