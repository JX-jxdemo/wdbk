import Hero from "@/components/home/Hero";
import Sidebar from "@/components/home/Sidebar";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { articles, categories } from "@/data/articles";

export default function Home() {
  const latestArticles = articles.slice(0, 5);

  const getCategoryMeta = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId) || {
      name: categoryId,
      color: "#0ea5e9",
    };
  };

  return (
    <>
      {/* Hero */}
      <Hero />

      {/* 两栏内容区 - 外层统一半透明毛玻璃透出视频 */}
      <div className="relative z-20 bg-[rgba(30,41,59,0.55)] backdrop-blur-[10px]">
        <div className="section-py">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* 左栏：文章流 */}
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-heading text-xl font-bold text-[var(--text-primary)] sm:text-2xl">
                  最新记忆
                </h2>
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-1 text-sm text-[var(--color-primary)] transition-colors hover:underline"
                >
                  查看全部
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="space-y-4">
                {latestArticles.map((article, i) => {
                  const cat = getCategoryMeta(article.category);
                  return (
                    <motion.article
                      key={article.slug}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <Link
                        to={`/blog/${article.slug}`}
                        className="group glass block rounded-xl p-5 transition-all hover:shadow-lg"
                      >
                        <div className="flex gap-4">
                          {/* 封面缩略图 */}
                          <div
                            className="hidden h-20 w-28 shrink-0 rounded-lg sm:block md:h-24 md:w-36"
                            style={{
                              background: `linear-gradient(135deg, ${cat.color}33, #8b5cf633)`,
                            }}
                          >
                            <div className="flex h-full items-center justify-center text-3xl">
                              {article.cover ? (
                                <img
                                  src={article.cover}
                                  alt=""
                                  className="h-full w-full rounded-lg object-cover"
                                />
                              ) : (
                                "📖"
                              )}
                            </div>
                          </div>

                          <div className="min-w-0 flex-1">
                            {/* 分类 + 日期 */}
                            <div className="mb-1.5 flex items-center gap-2 text-xs text-[var(--text-faint)]">
                              <span
                                className="rounded px-2 py-0.5 text-white"
                                style={{ background: cat.color }}
                              >
                                {cat.name}
                              </span>
                              <span>{article.publishedAt.slice(0, 10)}</span>
                              <span>·</span>
                              <span>{article.readingTime} 分钟阅读</span>
                              <span>·</span>
                              <span>{article.views} 阅读</span>
                            </div>

                            {/* 标题 */}
                            <h3 className="truncate font-heading text-base font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--color-primary)] sm:text-lg">
                              {article.title}
                            </h3>

                            {/* 摘要 */}
                            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                              {article.excerpt}
                            </p>

                            {/* 标签 */}
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {article.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-md bg-[var(--color-surface)] px-2 py-0.5 text-xs text-[var(--text-secondary)]"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  );
                })}
              </div>
            </div>

            {/* 右栏：侧边栏 */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <Sidebar />
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
