import { useEffect, useState } from "react";
import { Plus, Save, Trash2, X, Megaphone, Cake } from "lucide-react";
import { apiFetch } from "@/contexts/AuthContext";

interface NoticeRow {
  id: number;
  title: string;
  content: string;
  noticeType: "manual" | "birthday";
  userId: number | null;
  targetUsername?: string | null;
  startAt: string;
  endAt: string;
  priority: number;
  isPinned: boolean;
  status: number;
  createdAt: string;
}

export default function AdminNotice() {
  const [list, setList] = useState<NoticeRow[]>([]);
  const [editing, setEditing] = useState<NoticeRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({
    title: "",
    content: "",
    startAt: "",
    endAt: "",
    priority: 0,
    isPinned: false,
    status: 1,
  });

  const refresh = () => {
    apiFetch<{ notices: NoticeRow[] }>("/notice/admin/list").then((r) =>
      setList(r.notices)
    );
  };

  useEffect(refresh, []);

  const openCreate = () => {
    const today = new Date().toISOString().slice(0, 10);
    const week = new Date(Date.now() + 7 * 86400000)
      .toISOString()
      .slice(0, 10);
    setDraft({
      title: "",
      content: "",
      startAt: today,
      endAt: week,
      priority: 0,
      isPinned: false,
      status: 1,
    });
    setCreating(true);
  };

  const openEdit = (n: NoticeRow) => {
    setEditing(n);
    setDraft({
      title: n.title,
      content: n.content,
      startAt: n.startAt.slice(0, 10),
      endAt: n.endAt.slice(0, 10),
      priority: n.priority,
      isPinned: n.isPinned,
      status: n.status,
    });
  };

  const create = async () => {
    await apiFetch("/notice", {
      method: "POST",
      body: JSON.stringify({
        title: draft.title,
        content: draft.content,
        startAt: draft.startAt + " 00:00:00",
        endAt: draft.endAt + " 23:59:59",
        priority: draft.priority,
        isPinned: draft.isPinned,
      }),
    });
    setCreating(false);
    refresh();
  };

  const save = async () => {
    if (!editing) return;
    await apiFetch(`/notice/${editing.id}`, {
      method: "PUT",
      body: JSON.stringify({
        title: draft.title,
        content: draft.content,
        startAt: draft.startAt + " 00:00:00",
        endAt: draft.endAt + " 23:59:59",
        priority: draft.priority,
        isPinned: draft.isPinned,
        status: draft.status,
      }),
    });
    setEditing(null);
    refresh();
  };

  const del = async (n: NoticeRow) => {
    if (!confirm(`确认删除公告「${n.title}」?`)) return;
    await apiFetch(`/notice/${n.id}`, { method: "DELETE" });
    refresh();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-[var(--text-primary)]">公告系统</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-1 rounded border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 px-4 py-2 text-sm font-bold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20"
        >
          <Plus className="h-4 w-4" /> 新建公告
        </button>
      </div>

      <div className="space-y-3">
        {list.map((n) => (
          <div key={n.id} className="glass rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {n.noticeType === "birthday" ? (
                    <Cake className="h-4 w-4 text-[#f97316]" />
                  ) : (
                    <Megaphone className="h-4 w-4 text-[var(--color-primary)]" />
                  )}
                  <span className="font-bold text-[var(--text-primary)]">{n.title}</span>
                  {n.isPinned && (
                    <span className="rounded bg-[var(--color-primary)]/20 px-1.5 py-0.5 text-[10px] text-[var(--color-primary)]">
                      置顶
                    </span>
                  )}
                  {n.noticeType === "birthday" && (
                    <span className="rounded bg-[#f97316]/20 px-1.5 py-0.5 text-[10px] text-[#f97316]">
                      生日
                    </span>
                  )}
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] ${
                      n.status === 1
                        ? "bg-[#22c55e]/20 text-[#22c55e]"
                        : "bg-ink-faint/20 text-ink-faint"
                    }`}
                  >
                    {n.status === 1 ? "启用" : "停用"}
                  </span>
                  <span className="text-[10px] text-ink-faint">
                    P{n.priority}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-[var(--text-secondary)]">
                  {n.content}
                </p>
                <div className="mt-2 font-mono text-[10px] text-[var(--text-faint)]">
                  {n.startAt.slice(0, 10)} ~ {n.endAt.slice(0, 10)}
                  {n.targetUsername ? ` · 用户: ${n.targetUsername}` : ""}
                </div>
              </div>
              <div className="flex flex-shrink-0 gap-1">
                <button
                  onClick={() => openEdit(n)}
                  className="rounded p-1.5 text-[var(--text-secondary)] hover:text-[var(--color-primary)]"
                >
                  <Save className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => del(n)}
                  className="rounded p-1.5 text-[var(--text-secondary)] hover:text-[#f97316]"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <div className="glass rounded-xl py-12 text-center text-[var(--text-secondary)]">
            暂无公告
          </div>
        )}
      </div>

      {(creating || editing) && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-bg)]/80 p-4 backdrop-blur-md"
          onClick={() => {
            setCreating(false);
            setEditing(null);
          }}
        >
          <div
            className="glass w-full max-w-lg rounded-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-[var(--text-primary)]">
                {creating ? "新建公告" : "编辑公告"}
              </h3>
              <button
                onClick={() => {
                  setCreating(false);
                  setEditing(null);
                }}
                className="text-[var(--text-secondary)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-[var(--text-secondary)]">标题</label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)]/60 px-3 py-2 text-sm text-[var(--text-primary)]"
                  placeholder="公告标题"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-[var(--text-secondary)]">正文</label>
                <textarea
                  value={draft.content}
                  onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                  rows={4}
                  className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)]/60 px-3 py-2 text-sm text-[var(--text-primary)]"
                  placeholder="公告正文"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-[var(--text-secondary)]">开始日期</label>
                  <input
                    type="date"
                    value={draft.startAt}
                    onChange={(e) => setDraft({ ...draft, startAt: e.target.value })}
                    className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)]/60 px-3 py-2 text-sm text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-[var(--text-secondary)]">结束日期</label>
                  <input
                    type="date"
                    value={draft.endAt}
                    onChange={(e) => setDraft({ ...draft, endAt: e.target.value })}
                    className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)]/60 px-3 py-2 text-sm text-[var(--text-primary)]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-[var(--text-secondary)]">优先级</label>
                  <input
                    type="number"
                    value={draft.priority}
                    onChange={(e) =>
                      setDraft({ ...draft, priority: Number(e.target.value) })
                    }
                    className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)]/60 px-3 py-2 text-sm text-[var(--text-primary)]"
                  />
                </div>
                <label className="flex items-end gap-2 text-xs text-[var(--text-secondary)]">
                  <input
                    type="checkbox"
                    checked={draft.isPinned}
                    onChange={(e) =>
                      setDraft({ ...draft, isPinned: e.target.checked })
                    }
                    className="accent-[var(--color-primary)]"
                  />
                  置顶
                </label>
                <label className="flex items-end gap-2 text-xs text-[var(--text-secondary)]">
                  <input
                    type="checkbox"
                    checked={draft.status === 1}
                    onChange={(e) =>
                      setDraft({ ...draft, status: e.target.checked ? 1 : 0 })
                    }
                    className="accent-[var(--color-primary)]"
                  />
                  启用
                </label>
              </div>
              <button
                onClick={creating ? create : save}
                className="w-full rounded border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 py-2 text-sm font-bold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20"
              >
                {creating ? "创建" : "保存"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
