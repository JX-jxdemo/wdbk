import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, FileQuestion } from "lucide-react";
import { articles, categories } from "@/data/articles";
import ArticleCard from "@/components/shared/ArticleCard";
import Tag from "@/components/ui/Tag";

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    articles.forEach((a) => a.tags.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, []);

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      // 分类过滤
      if (activeCategory !== "all" && a.category !== activeCategory)
        return false;
      // 标签过滤
      if (activeTag && !a.tags.includes(activeTag)) return false;
      // 搜索
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        return (
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [activeCategory, activeTag, searchTerm]);

  return (
    <div className="pt-24">
      {/* Banner */}
      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent" />

        <div className="container relative z-10 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-3 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-neon-cyan"
          >
            <span className="h-px w-8 bg-neon-cyan shadow-[0_0_8px_var(--neon-cyan)]" />
            ARCHIVE
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl font-black text-white sm:text-5xl md:text-6xl"
          >
            博客<span className="text-gradient-neon">归档</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 max-w-2xl text-ink-muted"
          >
            共 {articles.length} 篇文章 · 探索前端工程、设计美学与工程实践
          </motion.p>
        </div>
      </section>

      {/* 筛选区 */}
      <section className="border-b border-[var(--color-border)] bg-base-900/50">
        <div className="container space-y-5 py-6">
          {/* 分类 + 搜索 */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory("all")}
                className={`rounded border px-4 py-2 font-mono text-xs transition-all ${
                  activeCategory === "all"
                    ? "border-neon-cyan bg-neon-cyan/10 text-neon-cyan shadow-neon-cyan"
                    : "border-white/10 text-ink-muted hover:border-white/30 hover:text-white"
                }`}
              >
                全部
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded border px-4 py-2 font-mono text-xs transition-all ${
                    activeCategory === cat.id
                      ? "bg-[color-mix(in_srgb,var(--c)_15%,transparent)] text-[var(--c)] shadow-[0_0_12px_var(--c)]"
                      : "border-white/10 text-ink-muted hover:border-white/30 hover:text-white"
                  }`}
                  style={
                    {
                      "--c": cat.color,
                      borderColor:
                        activeCategory === cat.id
                          ? `${cat.color}66`
                          : undefined,
                    } as React.CSSProperties
                  }
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* 搜索框 */}
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索文章..."
                className="w-full rounded border border-[var(--color-border)] bg-base-800 py-2.5 pl-10 pr-10 font-mono text-sm text-white placeholder-ink-faint outline-none transition-colors focus:border-neon-cyan/50 focus:shadow-neon-cyan"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* 标签云 */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-ink-faint">TAGS:</span>
            {allTags.map((tag) => (
              <Tag
                key={tag}
                color={activeTag === tag ? "cyan" : "muted"}
                active={activeTag === tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              >
                #{tag}
              </Tag>
            ))}
          </div>
        </div>
      </section>

      {/* 文章列表 */}
      <section className="section-py">
        <div className="container">
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div
                key={`${activeCategory}-${activeTag}-${searchTerm}`}
                layout
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {filtered.map((article, i) => (
                  <ArticleCard key={article.id} article={article} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <FileQuestion className="mb-4 h-16 w-16 text-ink-faint" />
                <p className="font-heading text-xl text-white">未找到匹配文章</p>
                <p className="mt-2 text-sm text-ink-muted">
                  尝试调整筛选条件或搜索关键词
                </p>
                <button
                  onClick={() => {
                    setActiveCategory("all");
                    setActiveTag(null);
                    setSearchTerm("");
                  }}
                  className="mt-6 border border-neon-cyan/40 px-5 py-2 font-mono text-xs text-neon-cyan transition-all hover:bg-neon-cyan/10 hover:shadow-neon-cyan"
                >
                  重置筛选
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
