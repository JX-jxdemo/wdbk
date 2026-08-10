import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Eye, ArrowUpRight } from "lucide-react";
import type { Article } from "@/types";
import { categories } from "@/data/articles";
import GradientCover from "@/components/shared/GradientCover";
import Tag from "@/components/ui/Tag";

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function ArticleCard({
  article,
  featured = false,
  index = 0,
}: {
  article: Article;
  featured?: boolean;
  index?: number;
}) {
  const category = categories.find((c) => c.id === article.category);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={featured ? "h-full" : "h-full"}
    >
      <Link
        to={`/blog/${article.slug}`}
        className="glass glass-hover group relative flex h-full flex-col overflow-hidden rounded-xl"
      >
        {/* 封面 */}
        <div className={featured ? "aspect-[16/8]" : "aspect-[16/9]"}>
          <GradientCover cover={article.cover} className="h-full w-full">
            {/* 分类标签 */}
            {category && (
              <span
                className="absolute left-4 top-4 z-10 rounded border px-2.5 py-1 font-mono text-xs backdrop-blur-sm"
                style={{
                  color: category.color,
                  borderColor: `${category.color}66`,
                  backgroundColor: `${category.color}1a`,
                }}
              >
                {category.name}
              </span>
            )}
            {/* 悬停箭头 */}
            <div className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-1">
              <ArrowUpRight className="h-4 w-4" />
            </div>
            {/* 标题水印 */}
            <div className="absolute bottom-0 left-0 right-0 z-[1] flex items-end justify-between p-4">
              <span className="font-heading text-3xl font-bold text-[var(--text-primary)]/10">
                {String(article.id).padStart(2, "0")}
              </span>
            </div>
          </GradientCover>
        </div>

        {/* 内容 */}
        <div className="flex flex-1 flex-col p-5">
          <h3
            className={
              featured
                ? "font-heading text-xl font-bold text-[var(--text-primary)] transition-colors group-hover:text-[var(--color-primary)]"
                : "font-heading text-lg font-bold text-[var(--text-primary)] transition-colors group-hover:text-[var(--color-primary)]"
            }
          >
            {article.title}
          </h3>

          <p className="mt-2 line-clamp-2 flex-1 text-sm text-[var(--text-secondary)]">
            {article.excerpt}
          </p>

          {/* 标签 */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {article.tags.slice(0, 3).map((tag) => (
              <Tag key={tag} color="muted">
                {tag}
              </Tag>
            ))}
          </div>

          {/* 元信息 */}
          <div className="mt-4 flex items-center gap-4 border-t border-[var(--color-border)] pt-4 font-mono text-xs text-[var(--text-faint)]">
            <span>{formatDate(article.publishedAt)}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.readingTime} 分钟
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {article.views.toLocaleString()}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}