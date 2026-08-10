import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";
import { apiFetch } from "@/contexts/AuthContext";

interface LikeRow {
  id: number;
  user_id: number;
  username: string;
  like_value: number;
  level: number;
  last_action_at: string | null;
  updated_at: string;
}

const LEVEL_NAMES = ["初识", "相识", "熟悉", "挚友", "知己", "至亲"];

export default function AdminLikes() {
  const [likes, setLikes] = useState<LikeRow[]>([]);
  const [editing, setEditing] = useState<LikeRow | null>(null);
  const [val, setVal] = useState(0);

  const refresh = () => {
    apiFetch<{ likes: LikeRow[] }>("/admin/likes").then((r) => setLikes(r.likes));
  };

  useEffect(refresh, []);

  const save = async () => {
    if (!editing) return;
    await apiFetch(`/admin/likes/${editing.user_id}`, {
      method: "PATCH",
      body: JSON.stringify({ likeValue: Number(val) }),
    });
    setEditing(null);
    refresh();
  };

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-[var(--text-primary)]">
        好感度管理
      </h1>
      <div className="glass overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--color-border)] bg-[var(--color-bg)]/40 text-xs uppercase text-[var(--text-secondary)]">
              <tr>
                <th className="px-4 py-3 text-left">用户</th>
                <th className="px-4 py-3 text-left">好感值</th>
                <th className="px-4 py-3 text-left">等级</th>
                <th className="px-4 py-3 text-left">最后操作</th>
                <th className="px-4 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {likes.map((l) => (
                <tr
                  key={l.id}
                  className="border-b border-[var(--color-border)] last:border-0 hover:bg-white/5"
                >
                  <td className="px-4 py-3 font-bold text-[var(--text-primary)]">{l.username}</td>
                  <td className="px-4 py-3 font-mono text-[var(--color-primary)]">
                    {l.like_value}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-[#f97316]/10 px-2 py-0.5 text-xs text-[#f97316]">
                      Lv.{l.level} {LEVEL_NAMES[l.level] || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--text-faint)]">
                    {l.last_action_at?.slice(0, 19) || "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        setEditing(l);
                        setVal(l.like_value);
                      }}
                      className="rounded p-1.5 text-[var(--text-secondary)] hover:text-[var(--color-primary)]"
                    >
                      <Save className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {likes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-[var(--text-secondary)]">
                    暂无数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-bg)]/80 backdrop-blur-md"
          onClick={() => setEditing(null)}
        >
          <div
            className="glass w-[90%] max-w-sm rounded-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading font-bold text-[var(--text-primary)]">
                修改 {editing.username} 的好感值
              </h3>
              <button onClick={() => setEditing(null)} className="text-[var(--text-secondary)]">
                <X className="h-4 w-4" />
              </button>
            </div>
            <input
              type="number"
              min={0}
              value={val}
              onChange={(e) => setVal(Number(e.target.value))}
              className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)]/60 px-3 py-2 text-[var(--text-primary)]"
            />
            <button
              onClick={save}
              className="mt-4 w-full rounded border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 py-2 text-sm font-bold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20"
            >
              保存
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
