import { useState, useEffect } from "react";
import {
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Trash2,
  Edit3,
  Send,
  FolderOpen,
  FileText,
  Code2,
  GraduationCap,
  Eye,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const CATEGORIES = [
  { id: "tools", name: "开发工具", color: "#00f0ff", icon: FolderOpen },
  { id: "docs", name: "文档素材", color: "#ff006e", icon: FileText },
  { id: "source", name: "开源源码", color: "#7c3aed", icon: Code2 },
  { id: "learning", name: "学习资料", color: "#39ff14", icon: GraduationCap },
];

type Tab = "submissions" | "resources";

export default function AdminResources() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("submissions");
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [tab]);

  const loadData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      if (tab === "submissions") {
        const res = await fetch("/api/resources/admin/submissions", { headers });
        if (res.ok) {
          const data = await res.json();
          setSubmissions(data.submissions || []);
        }
      } else {
        const res = await fetch("/api/resources/admin/all", { headers });
        if (res.ok) {
          const data = await res.json();
          setResources(data.resources || []);
        }
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleReview = async (id: string, action: "approve" | "reject") => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/resources/admin/submissions/${id}/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action }),
    });
    if (res.ok) {
      loadData();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定删除这个资源吗？")) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/resources/admin/resources/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      loadData();
    }
  };

  const handleSave = async (data: any) => {
    const token = localStorage.getItem("token");
    const url = editing
      ? `/api/resources/admin/resources/${editing.id}`
      : `/api/resources/admin/resources`;
    const method = editing ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setEditing(null);
      setShowForm(false);
      loadData();
    }
  };

  const getCategory = (id: string) =>
    CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; color: string; icon: any }> = {
      pending: { label: "待审核", color: "#ffb800", icon: Clock },
      approved: { label: "已通过", color: "#39ff14", icon: CheckCircle },
      rejected: { label: "已拒绝", color: "#ff006e", icon: XCircle },
      draft: { label: "草稿", color: "#71717a", icon: Edit3 },
      archived: { label: "已归档", color: "#71717a", icon: Eye },
    };
    const s = map[status] || map.draft;
    const Icon = s.icon;
    return (
      <span
        className="inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[11px]"
        style={{
          color: s.color,
          borderColor: `${s.color}40`,
          backgroundColor: `${s.color}10`,
        }}
      >
        <Icon className="h-3 w-3" />
        {s.label}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">
            资源仓库管理
          </h1>
          <p className="mt-1 font-mono text-xs text-ink-faint">
            管理外链资源与用户投稿审核
          </p>
        </div>
        {tab === "resources" && (
          <button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-purple px-4 py-2 font-mono text-xs font-semibold text-base-900 hover:shadow-[0_0_16px_var(--neon-cyan)]"
          >
            <Plus className="h-4 w-4" />
            新建资源
          </button>
        )}
      </div>

      {/* Tab 切换 */}
      <div className="mb-4 flex gap-2 border-b border-[var(--color-border)]">
        {[
          { key: "submissions", label: "投稿审核", count: submissions.length },
          { key: "resources", label: "资源列表", count: resources.length },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as Tab)}
            className={`border-b-2 px-4 py-2 font-mono text-xs transition-colors ${
              tab === t.key
                ? "border-neon-cyan text-neon-cyan"
                : "border-transparent text-ink-muted hover:text-white"
            }`}
          >
            {t.label}
            <span className="ml-1 rounded bg-white/5 px-1.5 py-0.5 text-[10px]">
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-ink-faint">加载中...</div>
      ) : tab === "submissions" ? (
        submissions.length === 0 ? (
          <div className="py-20 text-center text-ink-faint">
            <Send className="mx-auto mb-3 h-10 w-10 opacity-30" />
            <p className="font-mono text-sm">暂无待审核投稿</p>
          </div>
        ) : (
          <div className="space-y-3">
            {submissions.map((s) => {
              const cat = getCategory(s.category);
              return (
                <div
                  key={s.id}
                  className="glass flex flex-col gap-3 rounded-lg p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading text-sm font-bold text-white">
                        {s.title}
                      </h3>
                      <span
                        className="rounded border px-1.5 py-0.5 font-mono text-[10px]"
                        style={{
                          color: cat.color,
                          borderColor: `${cat.color}40`,
                        }}
                      >
                        {cat.name}
                      </span>
                      {getStatusBadge(s.status)}
                    </div>
                    <p className="mt-1 text-xs text-ink-muted">{s.description}</p>
                    <div className="mt-1 flex items-center gap-3 font-mono text-[11px] text-ink-faint">
                      <span>{s.submittedBy}</span>
                      <span>{s.createdAt}</span>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-0.5 text-neon-cyan hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        查看链接
                      </a>
                    </div>
                  </div>

                  {s.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReview(s.id, "approve")}
                        className="rounded-lg bg-neon-green/20 px-3 py-1.5 font-mono text-xs text-neon-green hover:bg-neon-green/30"
                      >
                        通过
                      </button>
                      <button
                        onClick={() => handleReview(s.id, "reject")}
                        className="rounded-lg bg-neon-magenta/20 px-3 py-1.5 font-mono text-xs text-neon-magenta hover:bg-neon-magenta/30"
                      >
                        拒绝
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      ) : resources.length === 0 ? (
        <div className="py-20 text-center text-ink-faint">
          <FolderOpen className="mx-auto mb-3 h-10 w-10 opacity-30" />
          <p className="font-mono text-sm">暂无资源</p>
        </div>
      ) : (
        <div className="space-y-3">
          {resources.map((r) => {
            const cat = getCategory(r.category);
            return (
              <div
                key={r.id}
                className="glass flex flex-col gap-3 rounded-lg p-4 sm:flex-row sm:items-center"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading text-sm font-bold text-white">
                      {r.title}
                    </h3>
                    <span
                      className="rounded border px-1.5 py-0.5 font-mono text-[10px]"
                      style={{
                        color: cat.color,
                        borderColor: `${cat.color}40`,
                      }}
                    >
                      {cat.name}
                    </span>
                    {getStatusBadge(r.status)}
                  </div>
                  <p className="mt-1 text-xs text-ink-muted">{r.description}</p>
                  <div className="mt-1 flex items-center gap-3 font-mono text-[11px] text-ink-faint">
                    <span>更新于 {r.updatedAt}</span>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-0.5 text-neon-cyan hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      外链
                    </a>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditing(r);
                      setShowForm(true);
                    }}
                    className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-3 py-1.5 font-mono text-xs text-ink-muted hover:text-white"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="flex items-center gap-1 rounded-lg border border-neon-magenta/30 px-3 py-1.5 font-mono text-xs text-neon-magenta hover:bg-neon-magenta/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    删除
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 新建/编辑表单 */}
      {showForm && (
        <ResourceForm
          initial={editing}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function ResourceForm({
  initial,
  onClose,
  onSave,
}: {
  initial: any;
  onClose: () => void;
  onSave: (data: any) => void;
}) {
  const [title, setTitle] = useState(initial?.title || "");
  const [category, setCategory] = useState(initial?.category || "tools");
  const [description, setDescription] = useState(initial?.description || "");
  const [url, setUrl] = useState(initial?.url || "");
  const [metaText, setMetaText] = useState(
    initial?.meta ? JSON.stringify(initial.meta) : ""
  );
  const [buttonText, setButtonText] = useState(initial?.buttonText || "");
  const [status, setStatus] = useState(initial?.status || "approved");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let meta: Record<string, string> | undefined;
    if (metaText.trim()) {
      try {
        meta = JSON.parse(metaText);
      } catch {
        alert("Meta 必须是有效的 JSON");
        return;
      }
    }
    onSave({ title, category, description, url, meta, buttonText, status });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-base-900/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="glass max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl p-6"
      >
        <h3 className="mb-4 font-heading text-lg font-bold text-white">
          {initial ? "编辑资源" : "新建资源"}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block font-mono text-xs text-ink-faint">
              标题
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-lg border border-[var(--color-border)] bg-white/5 px-3 py-2 text-sm text-white focus:border-neon-cyan focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block font-mono text-xs text-ink-faint">
                分类
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] bg-white/5 px-3 py-2 text-sm text-white focus:border-neon-cyan focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id} className="bg-base-900">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block font-mono text-xs text-ink-faint">
                状态
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] bg-white/5 px-3 py-2 text-sm text-white focus:border-neon-cyan focus:outline-none"
              >
                <option value="approved" className="bg-base-900">
                  已发布
                </option>
                <option value="draft" className="bg-base-900">
                  草稿
                </option>
                <option value="archived" className="bg-base-900">
                  已归档
                </option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs text-ink-faint">
              链接 URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              placeholder="https://..."
              className="w-full rounded-lg border border-[var(--color-border)] bg-white/5 px-3 py-2 text-sm text-white focus:border-neon-cyan focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs text-ink-faint">
              描述
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-white/5 px-3 py-2 text-sm text-white focus:border-neon-cyan focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block font-mono text-xs text-ink-faint">
                按钮文案（可选）
              </label>
              <input
                type="text"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                placeholder="留空使用默认"
                className="w-full rounded-lg border border-[var(--color-border)] bg-white/5 px-3 py-2 text-sm text-white focus:border-neon-cyan focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block font-mono text-xs text-ink-faint">
                Meta（JSON，可选）
              </label>
              <input
                type="text"
                value={metaText}
                onChange={(e) => setMetaText(e.target.value)}
                placeholder='{"系统":"Windows"}'
                className="w-full rounded-lg border border-[var(--color-border)] bg-white/5 px-3 py-2 font-mono text-xs text-white focus:border-neon-cyan focus:outline-none"
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-[var(--color-border)] py-2 font-mono text-sm text-ink-muted hover:text-white"
          >
            取消
          </button>
          <button
            type="submit"
            className="flex-1 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-purple py-2 font-mono text-sm font-semibold text-base-900 hover:shadow-[0_0_16px_var(--neon-cyan)]"
          >
            保存
          </button>
        </div>
      </form>
    </div>
  );
}
