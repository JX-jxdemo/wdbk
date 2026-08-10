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
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-surface-2)] to-[#f97316]/10" />

          {/* 装饰光斑 */}
          <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-[var(--color-primary)]/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-[#f97316]/20 blur-3xl" />

          <div className="relative z-10 px-6 py-16 text-center sm:px-12 sm:py-20">
            <div className="mb-4 inline-flex items-center gap-2 font-mono text-xs text-[var(--color-primary)]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              随时在线
            </div>

            <h2 className="font-heading text-3xl font-bold text-[var(--text-primary)] sm:text-4xl md:text-5xl">
              让我们<span className="text-gradient-sky">构建未来</span>
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-[var(--text-muted)]">
              有项目想法?技术问题?或者只是想聊聊?
              <br />
              随时与我取得联系。
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/about"
                className="btn-primary"
              >
                <Mail className="h-4 w-4" />
                联系我
              </Link>
              <Link
                to="/projects"
                className="btn-secondary"
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