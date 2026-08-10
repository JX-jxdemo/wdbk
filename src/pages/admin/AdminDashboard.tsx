import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Heart, Music, Megaphone, Settings } from "lucide-react";
import { apiFetch } from "@/contexts/AuthContext";

interface Stats {
  users: number;
  likes: number;
  notices: number;
  tracks: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    Promise.all([
      apiFetch<{ users: any[] }>("/admin/users"),
      apiFetch<{ likes: any[] }>("/admin/likes"),
      apiFetch<{ notices: any[] }>("/notice/admin/list"),
      apiFetch<{ playlist: any[] }>("/music/config"),
    ])
      .then(([u, l, n, m]) => {
        setStats({
          users: u.users.length,
          likes: l.likes.length,
          notices: n.notices.length,
          tracks: m.playlist.length,
        });
      })
      .catch(() => setStats({ users: 0, likes: 0, notices: 0, tracks: 0 }));
  }, []);

  const cards = [
    { label: "用户总数", value: stats?.users ?? "-", to: "/admin/users", icon: Users, color: "[var(--color-primary)]" },
    { label: "好感记录", value: stats?.likes ?? "-", to: "/admin/likes", icon: Heart, color: "[#f97316]" },
    { label: "公告数量", value: stats?.notices ?? "-", to: "/admin/notice", icon: Megaphone, color: "[#8b5cf6]" },
    { label: "歌曲数量", value: stats?.tracks ?? "-", to: "/admin/music", icon: Music, color: "[#22c55e]" },
  ];

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-[var(--text-primary)]">
        仪表盘
      </h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="glass glass-hover rounded-xl p-5"
          >
            <c.icon className={`mb-3 h-6 w-6 text-${c.color}`} />
            <div className="font-heading text-3xl font-bold text-[var(--text-primary)]">
              {c.value}
            </div>
            <div className="mt-1 text-xs text-[var(--text-secondary)]">{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="glass mt-6 rounded-xl p-6">
        <div className="mb-3 flex items-center gap-2">
          <Settings className="h-4 w-4 text-[var(--color-primary)]" />
          <h2 className="font-heading font-bold text-[var(--text-primary)]">快速操作</h2>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link to="/admin/users" className="rounded border border-[var(--color-border)] px-3 py-1.5 text-[var(--text-secondary)] hover:text-[var(--color-primary)]">
            管理用户
          </Link>
          <Link to="/admin/likes" className="rounded border border-[var(--color-border)] px-3 py-1.5 text-[var(--text-secondary)] hover:text-[var(--color-primary)]">
            调整好感度
          </Link>
          <Link to="/admin/notice" className="rounded border border-[var(--color-border)] px-3 py-1.5 text-[var(--text-secondary)] hover:text-[var(--color-primary)]">
            发布公告
          </Link>
          <Link to="/admin/music" className="rounded border border-[var(--color-border)] px-3 py-1.5 text-[var(--text-secondary)] hover:text-[var(--color-primary)]">
            配置播放器
          </Link>
          <Link to="/admin/settings" className="rounded border border-[var(--color-border)] px-3 py-1.5 text-[var(--text-secondary)] hover:text-[var(--color-primary)]">
            站点开关
          </Link>
        </div>
      </div>
    </div>
  );
}
