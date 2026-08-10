import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SectionTitle from "@/components/shared/SectionTitle";
import ArticleCard from "@/components/shared/ArticleCard";
import { getFeaturedArticles } from "@/data/articles";

export default function FeaturedArticles() {
  const featured = getFeaturedArticles();

  return (
    <section className="section-py">
      <div className="container">
        <div className="flex items-end justify-between">
          <SectionTitle
            eyebrow="精选推荐"
            title="精选文章"
            description="精选深度技术文章,涵盖前端工程、设计美学与工程实践。"
          />
          <Link
            to="/blog"
            className="group hidden shrink-0 items-center gap-2 font-mono text-sm text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-hover)] md:inline-flex"
          >
            查看全部
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((article, i) => (
            <ArticleCard
              key={article.id}
              article={article}
              featured={i === 0}
              index={i}
            />
          ))}
        </div>

        {/* 移动端查看全部 */}
        <div className="mt-8 text-center md:hidden">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 font-mono text-sm text-[var(--color-primary)]"
          >
            查看全部文章
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}