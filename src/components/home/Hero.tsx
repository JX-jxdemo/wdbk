import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Compass, Info } from "lucide-react";
import { profile } from "@/data/profile";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <div
        className="hero-bg"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=1920&q=80')",
        }}
      />
      <div className="hero-overlay" />

      <div className="container relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs backdrop-blur-sm"
            style={{ color: "var(--text-primary)" }}
          >
            <Compass className="h-3.5 w-3.5" style={{ color: "var(--color-primary)" }} />
            <span>欢迎来到我的个人空间</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-6xl font-black leading-[1.05] tracking-tight sm:text-7xl md:text-8xl lg:text-9xl"
          >
            <span className="text-gradient-sky">NEON.DEV</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl"
            style={{ color: "var(--text-secondary)" }}
          >
            {profile.bio}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/blog"
              className="group inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:brightness-110"
              style={{ background: "var(--color-primary)" }}
            >
              探索文章
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-7 py-3.5 text-sm transition-all duration-300 hover:border-white/60"
              style={{ color: "var(--text-primary)" }}
            >
              <Info className="h-4 w-4" />
              关于我
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2" style={{ color: "var(--text-secondary)" }}>
          <span className="text-xs tracking-widest">向下滚动</span>
          <motion.div
            className="h-10 w-6 rounded-full border"
            style={{ borderColor: "var(--text-muted)" }}
          >
            <motion.span
              className="mx-auto mt-1 block h-2 w-1 rounded-full"
              style={{ background: "var(--color-primary)" }}
              animate={{ y: [0, 14, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}