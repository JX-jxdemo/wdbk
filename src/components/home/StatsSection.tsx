import { profile } from "@/data/profile";
import { useCountUp } from "@/hooks/useCountUp";
import { motion } from "framer-motion";

function StatItem({
  label,
  value,
  suffix = "",
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  const { value: count, ref } = useCountUp(value);

  return (
    <div ref={ref} className="text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="font-display text-4xl font-black text-gradient-neon sm:text-5xl md:text-6xl"
      >
        {count.toLocaleString()}
        {suffix}
      </motion.div>
      <div className="mt-2 font-mono text-xs uppercase tracking-widest text-ink-faint">
        {label}
      </div>
    </div>
  );
}

export default function StatsSection() {
  const { stats } = profile;

  return (
    <section className="section-py">
      <div className="container">
        <div className="glass relative overflow-hidden rounded-2xl px-6 py-12 sm:px-12">
          {/* 装饰角标 */}
          <div className="absolute left-4 top-4 font-mono text-xs text-neon-cyan/40">
            [ DATA_STREAM ]
          </div>
          <div className="absolute right-4 top-4 font-mono text-xs text-ink-faint">
            real_time
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <StatItem label="已发布文章" value={stats.articles} />
            <StatItem label="总访问量" value={stats.views} />
            <StatItem label="开源项目" value={stats.projects} />
            <StatItem label="编程年数" value={stats.years} suffix="+" />
          </div>

          {/* 底部分割线 */}
          <div className="mt-10 h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent" />
        </div>
      </div>
    </section>
  );
}
