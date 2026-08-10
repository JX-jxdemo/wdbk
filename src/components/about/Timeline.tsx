import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Star } from "lucide-react";
import type { TimelineItem } from "@/types";

const typeConfig = {
  work: { icon: Briefcase, color: "#00f0ff" },
  education: { icon: GraduationCap, color: "#ff006e" },
  milestone: { icon: Star, color: "#39ff14" },
};

export default function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="relative">
      {/* 垂直线 */}
      <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-[var(--color-primary)] via-[#8b5cf6] to-[#f97316] opacity-30" />

      <div className="space-y-8">
        {items.map((item, i) => {
          const config = typeConfig[item.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative flex gap-6"
            >
              {/* 节点 */}
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 bg-[var(--color-bg)]" style={{ borderColor: config.color }}>
                <Icon className="h-4 w-4" style={{ color: config.color }} />
                {/* 发光 */}
                <div
                  className="absolute inset-0 rounded-full opacity-50 blur-sm"
                  style={{ backgroundColor: config.color }}
                />
              </div>

              {/* 内容 */}
              <div className="glass glass-hover flex-1 rounded-xl p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className="font-mono text-xs font-medium"
                    style={{ color: config.color }}
                  >
                    {item.year}
                  </span>
                  <span className="h-px flex-1 bg-[var(--color-border)]" />
                </div>
                <h3 className="mt-2 font-heading text-lg font-bold text-[var(--text-primary)]">
                  {item.title}
                </h3>
                <div className="mt-0.5 font-mono text-xs text-[var(--color-primary)]">
                  {item.org}
                </div>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{item.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
