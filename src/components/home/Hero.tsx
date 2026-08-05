import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Terminal, Cpu, Zap } from "lucide-react";
import ParticleField from "@/components/effects/ParticleField";
import { useTypewriter } from "@/hooks/useTypewriter";
import { profile } from "@/data/profile";

export default function Hero() {
  const typedRole = useTypewriter({
    texts: profile.roles,
    typeSpeed: 90,
    deleteSpeed: 45,
    delayBetween: 1800,
  });

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      {/* 粒子场 */}
      <div className="absolute inset-0 z-0">
        <ParticleField density={60} />
      </div>

      {/* 角标装饰 */}
      <div className="absolute left-6 top-24 z-10 hidden font-mono text-xs text-neon-cyan/50 lg:block">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-neon-green" />
          SYSTEM_ONLINE
        </div>
        <div className="mt-1 text-ink-faint">// waiting_for_input</div>
      </div>

      <div className="absolute right-6 top-24 z-10 hidden text-right font-mono text-xs text-ink-faint lg:block">
        <div>LAT: 31.2304°N</div>
        <div>LNG: 121.4737°E</div>
        <div className="mt-1 text-neon-magenta/50">// {profile.location}</div>
      </div>

      <div className="container relative z-10">
        <div className="max-w-4xl">
          {/* 眉标 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 px-4 py-1.5 font-mono text-xs text-neon-cyan"
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>欢迎进入数字领域</span>
          </motion.div>

          {/* 主标题 */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
          >
            <span className="block">CODE &</span>
            <span className="block text-gradient-neon">NEON LIGHTS</span>
          </motion.h1>

          {/* 打字机角色 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 flex items-center gap-3 font-mono text-lg text-ink-muted sm:text-xl"
          >
            <span className="text-neon-magenta">&gt;</span>
            <span className="text-white">{typedRole}</span>
            <span className="inline-block h-5 w-2 animate-pulse bg-neon-cyan" />
          </motion.div>

          {/* 描述 */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg"
          >
            {profile.bio}
          </motion.p>

          {/* CTA 按钮 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/blog"
              className="group inline-flex items-center gap-2 bg-neon-cyan px-7 py-3.5 font-mono text-sm font-medium text-base-900 transition-all duration-300 hover:shadow-neon-cyan hover:brightness-110"
            >
              探索文章
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 border border-white/15 px-7 py-3.5 font-mono text-sm text-ink-muted transition-all duration-300 hover:border-neon-cyan/50 hover:text-neon-cyan"
            >
              <Cpu className="h-4 w-4" />
              关于我
            </Link>
          </motion.div>

          {/* 底部特性条 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-[var(--color-border)] pt-6 font-mono text-xs text-ink-faint"
          >
            <span className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-neon-amber" />
              React 18 + TypeScript
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-neon-magenta" />
              Framer Motion 动效
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-neon-green" />
              赛博朋克美学
            </span>
          </motion.div>
        </div>
      </div>

      {/* 底部滚动提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 font-mono text-xs text-ink-faint">
          <span>SCROLL</span>
          <div className="flex h-10 w-6 justify-center rounded-full border border-ink-faint/40 p-1">
            <motion.span
              className="h-2 w-1 rounded-full bg-neon-cyan"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
