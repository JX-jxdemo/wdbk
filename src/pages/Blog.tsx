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
      if (activeCategory !== "all" && a.category !== activeCategory)
        return false;
      if (activeTag && !a.tags.includes(activeTag)) return false;
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
      <section className="border-b border-[var(--color-border)]">
        <div className="container py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-2 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]"
          >
            <span className="h-px w-6 bg-[var(--color-primary)]" />
            文章归档
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="font-heading text-4xl font-bold text-[var(--text-primary)] sm:text-5xl"
          >
            博客<span className="text-[var(--color-primary)]">归档</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-3 max-w-2xl text-[var(--text-secondary)]"
          >
            共 {articles.length} 篇文章 · 探索前端工程、设计美学与工程实践
          </motion.p>
        </div>
      </section>

      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
        <div className="container space-y-5 py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory("all")}
                className={`rounded-xl border px-4 py-2 font-mono text-xs transition-all ${
                  activeCategory === "all"
                    ? "border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                    : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                全部
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-xl border px-4 py-2 font-mono text-xs transition-all ${
                    activeCategory === cat.id
                      ? "border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                      : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
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

            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-faint)]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索文章..."
                className="input-field pl-10 pr-10"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)] transition-colors hover:text-[var(--text-primary)]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-[var(--text-faint)]">TAGS:</span>
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
                <FileQuestion className="mb-4 h-16 w-16 text-[var(--text-faint)]" />
                <p className="font-heading text-xl text-[var(--text-primary)]">未找到匹配文章</p>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  尝试调整筛选条件或搜索关键词
                </p>
                <button
                  onClick={() => {
                    setActiveCategory("all");
                    setActiveTag(null);
                    setSearchTerm("");
                  }}
                  className="resource-btn mt-6"
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