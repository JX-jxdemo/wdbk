import { Megaphone, Cake, X } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useNotices } from "./NoticeBanner";
import { cn } from "@/lib/utils";

export default function NoticeSection() {
  const { notices, dismiss } = useNotices();
  const containerRef = useRef<HTMLDivElement>(null);

  // 原生事件监听：悬停暂停 / 离开恢复（比 React 合成事件 + CSS :hover 更可靠）
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const areas = container.querySelectorAll<HTMLDivElement>(".notice-auto-scroll");
    const cleanups: Array<() => void> = [];
    areas.forEach((area) => {
      const inner = area.querySelector<HTMLDivElement>(".notice-auto-scroll-inner");
      if (!inner) return;
      const pause = () => {
        inner.style.animationPlayState = "paused";
      };
      const resume = () => {
        inner.style.animationPlayState = "running";
      };
      area.addEventListener("mouseenter", pause);
      area.addEventListener("mouseleave", resume);
      cleanups.push(() => {
        area.removeEventListener("mouseenter", pause);
        area.removeEventListener("mouseleave", resume);
      });
    });
    return () => cleanups.forEach((fn) => fn());
  }, [notices]);

  if (notices.length === 0) return null;

  return (
    <section className="section-py pt-12">
      <div className="container">
        <div className="mb-6 flex items-center gap-3">
          <Megaphone className="h-6 w-6 text-[var(--color-primary)]" />
          <h2 className="font-heading text-2xl font-bold text-[var(--text-primary)]">
            站点公告
          </h2>
          <div className="ml-2 h-px flex-1 bg-gradient-to-r from-[var(--color-primary)]/40 to-transparent" />
        </div>
        <div ref={containerRef} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {notices.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={cn(
                "glass glass-hover relative flex h-56 flex-col overflow-hidden rounded-lg",
                n.isPinned && "border-[var(--color-primary)]/40"
              )}
            >
              {/* 标题区 - 固定不动 */}
              <div className="flex items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-surface)]/40 px-4 py-3 pr-8">
                {n.noticeType === "birthday" ? (
                  <Cake className="h-4 w-4 flex-shrink-0 text-[#f97316]" />
                ) : (
                  <Megaphone className="h-4 w-4 flex-shrink-0 text-[var(--color-primary)]" />
                )}
                <span className="truncate font-bold text-[var(--text-primary)]">{n.title}</span>
                {n.isPinned && (
                  <span className="flex-shrink-0 rounded bg-[var(--color-primary)]/20 px-1.5 py-0.5 text-[10px] font-bold text-[var(--color-primary)]">
                    置顶
                  </span>
                )}
              </div>
              <button
                onClick={() => dismiss(n.id)}
                className="absolute right-2 top-2 z-10 rounded p-1 text-[var(--text-faint)] hover:text-[#f97316]"
                aria-label="关闭"
              >
                <X className="h-3 w-3" />
              </button>

              {/* 内容区 - 自动滚动，原生事件控制悬停暂停 */}
              <div className="notice-auto-scroll flex-1 overflow-hidden px-4 py-3">
                <div className="notice-auto-scroll-inner">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-secondary)]">
                    {n.content}
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-secondary)]">
                    {n.content}
                  </p>
                </div>
              </div>

              {/* 底部日期 - 固定不动 */}
              <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)]/40 px-4 py-2 font-mono text-[10px] text-[var(--text-faint)]">
                {n.startAt.slice(0, 10)} ~ {n.endAt.slice(0, 10)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}