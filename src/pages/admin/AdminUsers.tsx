import { useEffect, useState } from "react";
import { Trash2, Save, X, UserPlus, AlertCircle } from "lucide-react";
import { apiFetch } from "@/contexts/AuthContext";

interface UserRow {
  id: number;
  username: string;
  role: string;
  birthday: string | null;
  createdAt: string;
  likeValue: number;
  level: number;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<UserRow | null>(null);
  const [draft, setDraft] = useState<{ role: string; birthday: string }>({
    role: "user",
    birthday: "",
  });
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    username: "",
    password: "",
    role: "user",
    birthday: "",
  });
  const [createError, setCreateError] = useState("");
  const [createBusy, setCreateBusy] = useState(false);

  const refresh = () => {
    apiFetch<{ users: UserRow[] }>("/admin/users")
      .then((r) => setUsers(r.users))
      .finally(() => setLoading(false));
  };

  useEffect(refresh, []);

  const startEdit = (u: UserRow) => {
    setEditing(u);
    setDraft({ role: u.role, birthday: u.birthday || "" });
  };

  const save = async () => {
    if (!editing) return;
    await apiFetch(`/admin/users/${editing.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        role: draft.role,
        birthday: draft.birthday || null,
      }),
    });
    setEditing(null);
    refresh();
  };

  const del = async (u: UserRow) => {
    if (!confirm(`确认删除用户 ${u.username}?`)) return;
    await apiFetch(`/admin/users/${u.id}`, { method: "DELETE" });
    refresh();
  };

  const createUser = async () => {
    setCreateError("");
    if (!createForm.username || !createForm.password) {
      setCreateError("用户名和密码不能为空");
      return;
    }
    if (createForm.username.length < 3) {
      setCreateError("用户名至少 3 位");
      return;
    }
    if (createForm.password.length < 6) {
      setCreateError("密码至少 6 位");
      return;
    }
    setCreateBusy(true);
    try {
      await apiFetch("/admin/users", {
        method: "POST",
        body: JSON.stringify({
          username: createForm.username,
          password: createForm.password,
          role: createForm.role,
          birthday: createForm.birthday || null,
        }),
      });
      setCreating(false);
      setCreateForm({ username: "", password: "", role: "user", birthday: "" });
      refresh();
    } catch (err: any) {
      setCreateError(err.message || "创建失败");
    } finally {
      setCreateBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-[var(--text-primary)]">
          用户管理
        </h1>
        <button
          onClick={() => { setCreating(true); setCreateError(""); }}
          className="flex items-center gap-1.5 rounded border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 px-3 py-2 text-sm font-bold text-[var(--color-primary)] transition hover:bg-[var(--color-primary)]/20"
        >
          <UserPlus className="h-4 w-4" />
          新增用户
        </button>
      </div>
      <div className="glass overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--color-border)] bg-[var(--color-bg)]/40 text-xs uppercase text-[var(--text-secondary)]">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">用户名</th>
                <th className="px-4 py-3 text-left">角色</th>
                <th className="px-4 py-3 text-left">生日</th>
                <th className="px-4 py-3 text-left">好感值</th>
                <th className="px-4 py-3 text-left">注册时间</th>
                <th className="px-4 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-[var(--color-border)] last:border-0 hover:bg-white/5"
                >
                  <td className="px-4 py-3 font-mono text-[var(--text-faint)]">{u.id}</td>
                  <td className="px-4 py-3 font-bold text-[var(--text-primary)]">{u.username}</td>
                  <td className="px-4 py-3">
                    {u.role === "admin" ? (
                      <span className="rounded bg-[#f97316]/20 px-2 py-0.5 text-xs text-[#f97316]">
                        管理员
                      </span>
                    ) : (
                      <span className="rounded bg-[var(--color-primary)]/10 px-2 py-0.5 text-xs text-[var(--color-primary)]">
                        用户
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-[var(--text-secondary)]">
                    {u.birthday || "-"}
                  </td>
                  <td className="px-4 py-3 font-mono text-[var(--color-primary)]">
                    {u.likeValue}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--text-faint)]">
                    {u.createdAt?.slice(0, 10)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => startEdit(u)}
                        className="rounded p-1.5 text-[var(--text-secondary)] hover:text-[var(--color-primary)]"
                        title="编辑"
                      >
                        <Save className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => del(u)}
                        className="rounded p-1.5 text-[var(--text-secondary)] hover:text-[#f97316]"
                        title="删除"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-[var(--text-secondary)]">
                    暂无用户
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 编辑弹层 */}
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
                编辑用户 {editing.username}
              </h3>
              <button onClick={() => setEditing(null)} className="text-[var(--text-secondary)]">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs text-[var(--text-secondary)]">角色</label>
                <select
                  value={draft.role}
                  onChange={(e) => setDraft({ ...draft, role: e.target.value })}
                  className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)]/60 px-3 py-2 text-sm text-[var(--text-primary)]"
                >
                  <option value="user">用户</option>
                  <option value="admin">管理员</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-[var(--text-secondary)]">
                  生日 (YYYY-MM-DD)
                </label>
                <input
                  type="date"
                  value={draft.birthday}
                  onChange={(e) => setDraft({ ...draft, birthday: e.target.value })}
                  className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)]/60 px-3 py-2 text-sm text-[var(--text-primary)]"
                />
              </div>
              <button
                onClick={save}
                className="w-full rounded border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 py-2 text-sm font-bold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 新增用户弹层 */}
      {creating && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-bg)]/80 backdrop-blur-md"
          onClick={() => setCreating(false)}
        >
          <div
            className="glass w-[90%] max-w-sm rounded-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading font-bold text-[var(--text-primary)]">新增用户</h3>
              <button onClick={() => setCreating(false)} className="text-[var(--text-secondary)]">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs text-[var(--text-secondary)]">
                  用户名 (3-20 位)
                </label>
                <input
                  type="text"
                  value={createForm.username}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, username: e.target.value })
                  }
                  minLength={3}
                  maxLength={20}
                  required
                  className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)]/60 px-3 py-2 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--color-primary)]"
                  placeholder="3-20 个字符"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-[var(--text-secondary)]">
                  密码 (至少 6 位)
                </label>
                <input
                  type="password"
                  value={createForm.password}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, password: e.target.value })
                  }
                  minLength={6}
                  required
                  className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)]/60 px-3 py-2 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--color-primary)]"
                  placeholder="至少 6 位"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-[var(--text-secondary)]">角色</label>
                <select
                  value={createForm.role}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, role: e.target.value })
                  }
                  className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)]/60 px-3 py-2 text-sm text-[var(--text-primary)]"
                >
                  <option value="user">普通用户</option>
                  <option value="admin">管理员</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-[var(--text-secondary)]">
                  生日 (YYYY-MM-DD，可选)
                </label>
                <input
                  type="date"
                  value={createForm.birthday}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, birthday: e.target.value })
                  }
                  className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)]/60 px-3 py-2 text-sm text-[var(--text-primary)]"
                />
              </div>
              {createError && (
                <div className="flex items-center gap-2 rounded border border-[#f97316]/40 bg-[#f97316]/10 px-3 py-2 text-sm text-[#f97316]">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{createError}</span>
                </div>
              )}
              <button
                onClick={createUser}
                disabled={createBusy}
                className="w-full rounded border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 py-2.5 text-sm font-bold text-[var(--color-primary)] transition hover:bg-[var(--color-primary)]/20 disabled:opacity-50"
              >
                {createBusy ? "创建中..." : "创建用户"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
