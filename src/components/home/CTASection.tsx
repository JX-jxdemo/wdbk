import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, ArrowUpRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="section-py">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl"
        >
          {/* 渐变背景 */}
          <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 via-base-800 to-neon-magenta/10" />
          <div className="absolute inset-0 bg-grid opacity-20" />

          {/* 装饰光斑 */}
          <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-neon-cyan/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-neon-magenta/20 blur-3xl" />

          <div className="relative z-10 px-6 py-16 text-center sm:px-12 sm:py-20">
            <div className="mb-4 inline-flex items-center gap-2 font-mono text-xs text-neon-cyan">
              <span className="h-2 w-2 animate-pulse rounded-full bg-neon-green" />
              CONNECTION_READY
            </div>

            <h2 className="font-display text-3xl font-black text-white sm:text-4xl md:text-5xl">
              让我们<span className="text-gradient-neon">构建未来</span>
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-ink-muted">
              有项目想法?技术问题?或者只是想聊聊?
              <br />
              随时与我取得联系。
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/about"
                className="group inline-flex items-center gap-2 bg-neon-cyan px-7 py-3.5 font-mono text-sm font-medium text-base-900 transition-all hover:shadow-neon-cyan hover:brightness-110"
              >
                <Mail className="h-4 w-4" />
                联系我
              </Link>
              <Link
                to="/projects"
                className="group inline-flex items-center gap-2 border border-white/15 px-7 py-3.5 font-mono text-sm text-ink-muted transition-all hover:border-neon-cyan/50 hover:text-neon-cyan"
              >
                查看项目
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
