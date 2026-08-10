import { motion } from "framer-motion";
import type { Heading } from "@/utils/markdown";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/utils";

/** 文章目录导航 - 滚动高亮当前章节 */
export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const sectionIds = headings.map((h) => h.id);
  const activeId = useActiveSection(sectionIds);

  if (headings.length === 0) return null;

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-24 hidden xl:block">
      <div className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--color-primary)]">
        <span className="h-px w-6 bg-[var(--color-primary)]" />
        目录
      </div>

      <ul className="space-y-1 border-l border-[var(--color-border)]">
        {headings.map((h) => (
          <li key={h.id}>
            <button
              onClick={() => handleClick(h.id)}
              className={cn(
                "relative -ml-px block w-full border-l-2 py-1.5 pl-4 text-left text-sm transition-all",
                h.level === 3 && "pl-8",
                activeId === h.id
                  ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                  : "border-transparent text-[var(--text-faint)] hover:text-[var(--text-primary)]"
              )}
            >
              {activeId === h.id && (
                <motion.span
                  layoutId="toc-active"
                  className="absolute -left-[2px] top-1/2 h-4 w-[2px] -translate-y-1/2 bg-[var(--color-primary)]"
                />
              )}
              {h.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
