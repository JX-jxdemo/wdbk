import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { Link } from "react-router-dom";
import { Eye, Clock, Tag, FileText, Users } from "lucide-react";

export default function Sidebar() {
  const { stats } = profile;

  return (
    <aside className="space-y-6">
      {/* 站点统计 */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="glass rounded-2xl p-5"
      >
        <h3 className="mb-4 flex items-center gap-2 font-heading text-base font-semibold text-[var(--text-primary)]">
          <span className="inline-block h-5 w-1 rounded-full bg-[var(--color-primary)]" />
          站点统计
        </h3>
        <div className="space-y-3">
          <StatItem icon={FileText} label="文章" value={stats.articles} />
          <StatItem icon={Eye} label="阅读" value={stats.views.toLocaleString()} />
          <StatItem icon={Clock} label="运行" value={`${stats.years}年`} />
        </div>
      </motion.div>

      {/* 分类标签 */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-5"
      >
        <h3 className="mb-4 flex items-center gap-2 font-heading text-base font-semibold text-[var(--text-primary)]">
          <span className="inline-block h-5 w-1 rounded-full bg-[var(--color-primary)]" />
          热门标签
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            "React",
            "TypeScript",
            "Tailwind",
            "动画",
            "设计",
            "性能",
            "Vite",
            "UX",
          ].map((tagName) => (
            <Link
              key={tagName}
              to={`/blog?tag=${tagName}`}
              className="group flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-xs text-[var(--text-secondary)] transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              <Tag className="h-3 w-3" />
              <span>{tagName}</span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* 关于作者 */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-5"
      >
        <h3 className="mb-4 flex items-center gap-2 font-heading text-base font-semibold text-[var(--text-primary)]">
          <span className="inline-block h-5 w-1 rounded-full bg-[var(--color-primary)]" />
          关于作者
        </h3>
        <div className="flex items-center gap-3">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white"
            style={{ background: "linear-gradient(135deg, var(--color-primary), #8b5cf6)" }}
          >
            {profile.name.charAt(0)}
          </div>
          <div>
            <div className="font-heading text-base font-semibold text-[var(--text-primary)]">
              {profile.name}
            </div>
            <div className="text-xs text-[var(--text-faint)]">@{profile.alias}</div>
          </div>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-[var(--text-secondary)]">
          {profile.bio}
        </p>
        <Link
          to="/about"
          className="mt-4 inline-flex items-center gap-1 text-sm text-[var(--color-primary)] transition-colors hover:underline"
        >
          了解更多 →
        </Link>
      </motion.div>

      {/* 友情链接 */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-5"
      >
        <h3 className="mb-4 flex items-center gap-2 font-heading text-base font-semibold text-[var(--text-primary)]">
          <span className="inline-block h-5 w-1 rounded-full bg-[var(--color-primary)]" />
          友情链接
        </h3>
        <div className="space-y-2">
          {[
            { name: "GitHub", url: "https://github.com/JX-jxdemo/wdbk" },
            { name: "MDN Web Docs", url: "https://developer.mozilla.org" },
            { name: "React 官方文档", url: "https://react.dev" },
          ].map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-primary)]"
            >
              <span className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5" />
                {link.name}
              </span>
              <span className="text-xs text-[var(--text-faint)]">→</span>
            </a>
          ))}
        </div>
      </motion.div>
    </aside>
  );
}

function StatItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-[var(--color-surface)] px-3 py-2">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Icon className="h-4 w-4 text-[var(--color-primary)]" />
        {label}
      </div>
      <span className="font-mono text-sm font-semibold text-[var(--text-primary)]">
        {value}
      </span>
    </div>
  );
}
