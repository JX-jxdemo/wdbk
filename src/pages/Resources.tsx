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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="group flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-card transition-all duration-250 hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-heading text-base font-semibold text-[var(--text-primary)]">
          {item.title}
        </h3>
        <span className="shrink-0 font-mono text-[11px] text-[var(--text-faint)]">
          <Calendar className="mr-1 inline h-3 w-3" />
          {item.updatedAt}
        </span>
      </div>

      <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
        {item.description}
      </p>

      {item.meta && (
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(item.meta).map(([key, val]) => (
            <span
              key={key}
              className="tag"
            >
              {key}: {val}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-3">
        <span className="font-mono text-[11px] text-[var(--text-faint)] opacity-0 transition-opacity group-hover:opacity-100">
          将会跳转至外部网站
        </span>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="resource-btn"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.form
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-card"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
                投稿外链资源
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block font-mono text-xs text-[var(--text-faint)]">
                  资源名称
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field"
                  placeholder="例如：VS Code 最新版"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block font-mono text-xs text-[var(--text-faint)]">
                  所属分类
                </label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as ResourceCategory)
                  }
                  className="input-field"
                >
                  {resourceCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block font-mono text-xs text-[var(--text-faint)]">
                  资源链接
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="input-field"
                  placeholder="https://..."
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block font-mono text-xs text-[var(--text-faint)]">
                  资源介绍
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="简单介绍这个资源的用途和特色..."
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] py-2 font-mono text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
              >
                取消
              </button>
              <button
                type="submit"
                className="resource-btn justify-center rounded-xl py-2"
              >
                <Send className="h-4 w-4" />
                提交投稿
              </button>
            </div>

            <p className="mt-3 text-center font-mono text-[11px] text-[var(--text-faint)]">
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
      <section className="border-b border-[var(--color-border)]">
        <div className="container py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-2 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]"
          >
            <span className="h-px w-6 bg-[var(--color-primary)]" />
            资源仓库
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="font-heading text-4xl font-bold text-[var(--text-primary)] sm:text-5xl"
          >
            资源<span className="text-[var(--color-primary)]">仓库</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-3 max-w-2xl text-[var(--text-secondary)]"
          >
            开发者工具、设计素材、开源项目、学习资料的导航聚合 — 点击卡片即可跳转外部资源。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="mt-5 flex items-start gap-2"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--text-muted)]" />
            <p className="font-mono text-xs leading-relaxed text-[var(--text-muted)]">
              本站仅做资源导航,文件存储于第三方平台,请留意外部网站安全风险。
            </p>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
        <div className="container py-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`rounded-xl border px-4 py-1.5 font-mono text-xs transition-all ${
                activeCategory === "all"
                  ? "border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                  : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              全部
            </button>
            {resourceCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-xl border px-4 py-1.5 font-mono text-xs transition-all ${
                  activeCategory === cat.id
                    ? "border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                    : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {cat.name}
              </button>
            ))}

            <div className="ml-auto">
              {user ? (
                <button
                  onClick={() => setSubmissionOpen(true)}
                  className="resource-btn"
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
                  className="rounded-xl border border-[var(--color-border)] px-4 py-1.5 font-mono text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                >
                  登录后可投稿
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {submissionMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="container mt-4"
          >
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-primary-light)] px-4 py-2 font-mono text-sm text-[var(--color-primary)]">
              {submissionMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="mb-5 flex items-center gap-3"
                    >
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl border"
                        style={{
                          borderColor: `${cat.color}40`,
                          backgroundColor: `${cat.color}15`,
                        }}
                      >
                        <Icon
                          className="h-5 w-5"
                          style={{ color: cat.color }}
                        />
                      </div>
                      <div>
                        <h2
                          className="font-heading text-lg font-semibold"
                          style={{ color: cat.color }}
                        >
                          {cat.name}
                        </h2>
                        <p className="font-mono text-xs text-[var(--text-faint)]">
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
            <div className="py-20 text-center text-[var(--text-faint)]">
              <FolderOpen className="mx-auto mb-3 h-12 w-12 opacity-30" />
              <p className="font-mono text-sm">
                该分类暂无资源,
                <button
                  onClick={() => user && setSubmissionOpen(true)}
                  className="ml-1 text-[var(--color-primary)] hover:underline"
                >
                  成为第一个投稿的人
                </button>
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="section-py border-t border-[var(--color-border)]">
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center shadow-card"
          >
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary-light)]">
              <Send className="h-6 w-6 text-[var(--color-primary)]" />
            </div>
            <h2 className="font-heading text-xl font-semibold text-[var(--text-primary)]">
              分享你发现的好资源
            </h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
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
              className="resource-btn mt-5"
            >
              <UserPlus className="h-4 w-4" />
              {user ? "立即投稿" : "登录后投稿"}
            </button>
          </motion.div>
        </div>
      </section>

      <SubmitModal
        open={submissionOpen}
        onClose={() => setSubmissionOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}