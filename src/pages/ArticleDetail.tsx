import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import {
  ArrowLeft,
  Clock,
  Eye,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Share2,
} from "lucide-react";
import {
  getArticleBySlug,
  getAdjacentArticles,
  categories,
} from "@/data/articles";
import { slugify, extractHeadings } from "@/utils/markdown";
import ReadingProgress from "@/components/article/ReadingProgress";
import TableOfContents from "@/components/article/TableOfContents";
import GradientCover from "@/components/shared/GradientCover";
import Tag from "@/components/ui/Tag";

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const article = id ? getArticleBySlug(id) : undefined;

  if (!article) {
    return <Navigate to="/blog" replace />;
  }

  const category = categories.find((c) => c.id === article.category);
  const { prev, next } = getAdjacentArticles(article.id);
  const headings = extractHeadings(article.content);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <ReadingProgress />

      <article className="pt-24">
        {/* 文章头部 */}
        <header className="relative overflow-hidden border-b border-[var(--color-border)]">
          <div className="container relative z-10 py-12">
            {/* 返回链接 */}
            <button
              onClick={handleBack}
              className="group mb-8 inline-flex items-center gap-2 rounded border border-[var(--color-border)] bg-[var(--color-surface)]/50 px-4 py-2 font-mono text-xs text-[var(--text-muted)] transition-colors hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)]"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
              返回
            </button>

            {/* 分类 */}
            {category && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
              >
                <span
                  className="rounded border px-3 py-1 font-mono text-xs"
                  style={{
                    color: category.color,
                    borderColor: `${category.color}66`,
                    backgroundColor: `${category.color}1a`,
                  }}
                >
                  {category.name}
                </span>
              </motion.div>
            )}

            {/* 标题 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-4xl font-heading text-3xl font-bold leading-tight text-[var(--text-primary)] sm:text-4xl md:text-5xl"
            >
              {article.title}
            </motion.h1>

            {/* 摘要 */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 max-w-2xl text-[var(--text-muted)]"
            >
              {article.excerpt}
            </motion.p>

            {/* 元信息 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 flex flex-wrap items-center gap-5 font-mono text-xs text-[var(--text-faint)]"
            >
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(article.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {article.readingTime} 分钟阅读
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                {article.views.toLocaleString()} 次浏览
              </span>
            </motion.div>
          </div>
        </header>

        {/* 封面 */}
        <div className="container py-8">
          <GradientCover
            cover={article.cover}
            className="h-48 w-full rounded-xl sm:h-64 md:h-80"
          >
            <div className="absolute bottom-4 right-4 z-[1] font-heading text-6xl font-bold text-[var(--text-primary)]/10">
              {String(article.id).padStart(2, "0")}
            </div>
          </GradientCover>
        </div>

        {/* 正文 + 目录 */}
        <div className="container pb-16">
          <div className="grid gap-10 xl:grid-cols-[1fr_220px]">
            {/* Markdown 正文 */}
            <div className="prose-cyber min-w-0 max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  h2: ({ children }) => {
                    const text = String(children);
                    return <h2 id={slugify(text)}>{children}</h2>;
                  },
                  h3: ({ children }) => {
                    const text = String(children);
                    return <h3 id={slugify(text)}>{children}</h3>;
                  },
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>

            {/* 目录 */}
            <aside className="hidden xl:block">
              <TableOfContents headings={headings} />
            </aside>
          </div>
        </div>

        {/* 标签 + 分享 */}
        <div className="container border-t border-[var(--color-border)] py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-[var(--text-faint)]">TAGS:</span>
              {article.tags.map((tag) => (
                <Tag key={tag} color="cyan">
                  #{tag}
                </Tag>
              ))}
            </div>
            <button className="flex items-center gap-2 border border-[var(--color-border)] px-4 py-2 font-mono text-xs text-[var(--text-muted)] transition-colors hover:border-[var(--color-primary)]/50 hover:text-[var(--color-primary)]">
              <Share2 className="h-3.5 w-3.5" />
              分享文章
            </button>
          </div>
        </div>

        {/* 上一篇/下一篇 */}
        {(prev || next) && (
          <div className="container py-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {prev ? (
                <Link
                  to={`/blog/${prev.slug}`}
                  className="glass glass-hover group flex items-center gap-4 rounded-xl p-5"
                >
                  <ChevronLeft className="h-5 w-5 shrink-0 text-[var(--text-faint)] transition-colors group-hover:text-[var(--color-primary)]" />
                  <div className="min-w-0">
                    <div className="font-mono text-xs text-[var(--text-faint)]">
                      上一篇
                    </div>
                    <div className="mt-1 truncate font-heading text-sm font-medium text-[var(--text-primary)] transition-colors group-hover:text-[var(--color-primary)]">
                      {prev.title}
                    </div>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  to={`/blog/${next.slug}`}
                  className="glass glass-hover group flex items-center justify-end gap-4 rounded-xl p-5 text-right"
                >
                  <div className="min-w-0">
                    <div className="font-mono text-xs text-[var(--text-faint)]">
                      下一篇
                    </div>
                    <div className="mt-1 truncate font-heading text-sm font-medium text-[var(--text-primary)] transition-colors group-hover:text-[var(--color-primary)]">
                      {next.title}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-[var(--text-faint)] transition-colors group-hover:text-[var(--color-primary)]" />
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        )}
      </article>
    </>
  );
}