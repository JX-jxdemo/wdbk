import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  AlertTriangle,
  Calendar,
  Send,
  FolderOpen,
  FileText,
  Code2,
  GraduationCap,
  UserPlus,
  X,
} from "lucide-react";
import { resourceCategories, resources as fallbackResources } from "@/data/resources";
import type { ResourceItem, ResourceCategory } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

const categoryIcons: Record<ResourceCategory, typeof FolderOpen> = {
  tools: FolderOpen,
  docs: FileText,
  source: Code2,
  learning: GraduationCap,
};

function ResourceCard({
  item,
  buttonText,
  index,
}: {
  item: ResourceItem;
  buttonText: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="glass glass-hover group flex flex-col rounded-xl p-5"
    >
      {/* 头部 */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-heading text-base font-bold text-white transition-colors group-hover:text-neon-cyan">
          {item.title}
        </h3>
        <span className="shrink-0 font-mono text-[11px] text-ink-faint">
          <Calendar className="mr-1 inline h-3 w-3" />
          {item.updatedAt}
        </span>
      </div>

      {/* 描述 */}
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
        {item.description}
      </p>

      {/* 元信息 */}
      {item.meta && (
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(item.meta).map(([key, val]) => (
            <span
              key={key}
              className="rounded border border-[var(--color-border)] bg-white/5 px-2 py-0.5 font-mono text-[11px] text-ink-faint"
            >
              {key}: {val}
            </span>
          ))}
        </div>
      )}

      {/* 按钮 */}
      <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-3">
        <span className="font-mono text-[11px] text-ink-faint transition-colors group-hover:text-neon-cyan/70">
          将打开外部网站
        </span>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg bg-neon-cyan/10 px-3 py-1.5 font-mono text-xs text-neon-cyan transition-all hover:bg-neon-cyan/20 hover:shadow-[0_0_12px_var(--neon-cyan)]"
        >
          {buttonText}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </motion.div>
  );
}

function SubmitModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    category: ResourceCategory;
    description: string;
    url: string;
  }) => void;
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ResourceCategory>("tools");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  const reset = () => {
    setTitle("");
    setCategory("tools");
    setDescription("");
    setUrl("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url || !description) return;
    onSubmit({ title, category, description, url });
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-base-900/80 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.form
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="glass w-full max-w-lg rounded-xl p-6"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-white">
                投稿外链资源
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="text-ink-muted hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block font-mono text-xs text-ink-faint">
                  资源名称
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-white/5 px-3 py-2 text-sm text-white placeholder:text-ink-faint/50 focus:border-neon-cyan focus:outline-none focus:shadow-[0_0_8px_var(--neon-cyan)]"
                  placeholder="例如：VS Code 最新版"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block font-mono text-xs text-ink-faint">
                  所属分类
                </label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as ResourceCategory)
                  }
                  className="w-full rounded-lg border border-[var(--color-border)] bg-white/5 px-3 py-2 text-sm text-white focus:border-neon-cyan focus:outline-none"
                >
                  {resourceCategories.map((c) => (
                    <option key={c.id} value={c.id} className="bg-base-900">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block font-mono text-xs text-ink-faint">
                  资源链接
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-white/5 px-3 py-2 text-sm text-white placeholder:text-ink-faint/50 focus:border-neon-cyan focus:outline-none focus:shadow-[0_0_8px_var(--neon-cyan)]"
                  placeholder="https://..."
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block font-mono text-xs text-ink-faint">
                  资源介绍
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-white/5 px-3 py-2 text-sm text-white placeholder:text-ink-faint/50 focus:border-neon-cyan focus:outline-none focus:shadow-[0_0_8px_var(--neon-cyan)]"
                  placeholder="简单介绍这个资源的用途和特色..."
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-[var(--color-border)] py-2 font-mono text-sm text-ink-muted transition-colors hover:border-neon-cyan/50 hover:text-white"
              >
                取消
              </button>
              <button
                type="submit"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-purple py-2 font-mono text-sm font-semibold text-base-900 transition-all hover:shadow-[0_0_16px_var(--neon-cyan)]"
              >
                <Send className="h-4 w-4" />
                提交投稿
              </button>
            </div>

            <p className="mt-3 text-center font-mono text-[11px] text-ink-faint">
              投稿经管理员审核后将展示在对应分区
            </p>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Resources() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<
    ResourceCategory | "all"
  >("all");
  const [submissionOpen, setSubmissionOpen] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(
    null
  );
  const [apiResources, setApiResources] = useState<ResourceItem[] | null>(null);

  useEffect(() => {
    fetch("/api/resources")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.resources?.length > 0) {
          setApiResources(data.resources);
        }
      })
      .catch(() => {});
  }, []);

  const allResources = apiResources ?? fallbackResources;

  const filteredResources = useMemo(() => {
    if (activeCategory === "all") return allResources;
    return allResources.filter((r) => r.category === activeCategory);
  }, [activeCategory, allResources]);

  const handleSubmit = async (data: {
    title: string;
    category: ResourceCategory;
    description: string;
    url: string;
  }) => {
    try {
      const res = await fetch("/api/resources/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSubmissionMessage("投稿成功!等待管理员审核后将展示在对应分区。");
      } else {
        const err = await res.json();
        setSubmissionMessage(err.error || "投稿失败,请重试");
      }
    } catch {
      setSubmissionMessage("网络错误,请检查连接后重试");
    }
    setTimeout(() => setSubmissionMessage(null), 5000);
  };

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
            RESOURCES
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl font-black text-white sm:text-5xl md:text-6xl"
          >
            资源<span className="text-gradient-neon">仓库</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 max-w-2xl text-ink-muted"
          >
            开发者工具、设计素材、开源项目、学习资料的导航聚合 — 点击卡片即可跳转外部资源。
          </motion.p>

          {/* 风险提示 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
            <p className="font-mono text-xs leading-relaxed text-amber-200/80">
              本站仅整理资源导航,文件存储于第三方平台,请留意外部网站安全提示。所有链接均在新标签页打开。
            </p>
          </motion.div>
        </div>
      </section>

      {/* 分类筛选 */}
      <section className="border-b border-[var(--color-border)]">
        <div className="container py-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`rounded-lg border px-4 py-1.5 font-mono text-xs transition-all ${
                activeCategory === "all"
                  ? "border-neon-cyan bg-neon-cyan/10 text-neon-cyan shadow-[0_0_8px_var(--neon-cyan)]"
                  : "border-[var(--color-border)] text-ink-muted hover:text-white"
              }`}
            >
              全部
            </button>
            {resourceCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-lg border px-4 py-1.5 font-mono text-xs transition-all ${
                  activeCategory === cat.id
                    ? "border-neon-cyan bg-neon-cyan/10 text-neon-cyan shadow-[0_0_8px_var(--neon-cyan)]"
                    : "border-[var(--color-border)] text-ink-muted hover:text-white"
                }`}
              >
                {cat.name}
              </button>
            ))}

            <div className="ml-auto">
              {user ? (
                <button
                  onClick={() => setSubmissionOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-purple px-4 py-1.5 font-mono text-xs font-semibold text-base-900 transition-all hover:shadow-[0_0_16px_var(--neon-cyan)]"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  投稿外链
                </button>
              ) : (
                <button
                  onClick={() =>
                    (window.location.href =
                      "/?login=1&redirect=/resources")
                  }
                  className="rounded-lg border border-[var(--color-border)] px-4 py-1.5 font-mono text-xs text-ink-muted hover:text-white"
                >
                  登录后可投稿
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 提示消息 */}
      <AnimatePresence>
        {submissionMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="container mt-4"
          >
            <div className="rounded-lg border border-neon-green/30 bg-neon-green/5 px-4 py-2 font-mono text-sm text-neon-green">
              {submissionMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 资源分区展示 */}
      <section className="section-py">
        <div className="container">
          {activeCategory === "all" ? (
            <div className="space-y-12">
              {resourceCategories.map((cat) => {
                const items = allResources.filter(
                  (r) => r.category === cat.id
                );
                if (items.length === 0) return null;
                const Icon = categoryIcons[cat.id];
                return (
                  <div key={cat.id}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="mb-5 flex items-center gap-3"
                    >
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg border"
                        style={{
                          borderColor: `${cat.color}40`,
                          backgroundColor: `${cat.color}10`,
                        }}
                      >
                        <Icon
                          className="h-5 w-5"
                          style={{ color: cat.color }}
                        />
                      </div>
                      <div>
                        <h2
                          className="font-heading text-lg font-bold"
                          style={{ color: cat.color }}
                        >
                          {cat.name}
                        </h2>
                        <p className="font-mono text-xs text-ink-faint">
                          {cat.description}
                        </p>
                      </div>
                    </motion.div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {items.map((item, idx) => (
                        <ResourceCard
                          key={item.id}
                          item={item}
                          buttonText={cat.buttonText}
                          index={idx}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredResources.map((item, idx) => {
                const cat = resourceCategories.find(
                  (c) => c.id === item.category
                )!;
                return (
                  <ResourceCard
                    key={item.id}
                    item={item}
                    buttonText={cat.buttonText}
                    index={idx}
                  />
                );
              })}
            </div>
          )}

          {filteredResources.length === 0 && (
            <div className="py-20 text-center text-ink-faint">
              <FolderOpen className="mx-auto mb-3 h-12 w-12 opacity-30" />
              <p className="font-mono text-sm">
                该分类暂无资源,
                <button
                  onClick={() => user && setSubmissionOpen(true)}
                  className="ml-1 text-neon-cyan hover:underline"
                >
                  成为第一个投稿的人
                </button>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 投稿区 */}
      <section className="section-py border-t border-[var(--color-border)]">
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-xl p-8 text-center"
          >
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full border border-neon-cyan/30 bg-neon-cyan/10">
              <Send className="h-6 w-6 text-neon-cyan" />
            </div>
            <h2 className="font-heading text-xl font-bold text-white">
              分享你发现的好资源
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              登录后可提交外链资源,经管理员审核后将展示在对应分区。无需上传文件,仅需提供链接和简介。
            </p>
            <button
              onClick={() => {
                if (user) {
                  setSubmissionOpen(true);
                } else {
                  window.location.href = "/?login=1&redirect=/resources";
                }
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-purple px-6 py-2.5 font-mono text-sm font-semibold text-base-900 transition-all hover:shadow-[0_0_16px_var(--neon-cyan)]"
            >
              <UserPlus className="h-4 w-4" />
              {user ? "立即投稿" : "登录后投稿"}
            </button>
          </motion.div>
        </div>
      </section>

      {/* 投稿弹窗 */}
      <SubmitModal
        open={submissionOpen}
        onClose={() => setSubmissionOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
