import { Navigate, NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Heart,
  Music,
  Megaphone,
  Settings,
  Terminal,
  ExternalLink,
  FolderOpen,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const menu = [
  { to: "/admin", label: "仪表盘", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "用户管理", icon: Users },
  { to: "/admin/likes", label: "好感度管理", icon: Heart },
  { to: "/admin/resources", label: "资源仓库", icon: FolderOpen },
  { to: "/admin/music", label: "音乐播放器", icon: Music },
  { to: "/admin/notice", label: "公告系统", icon: Megaphone },
  { to: "/admin/settings", label: "站点设置", icon: Settings },
];

export default function AdminLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="section-py container text-center font-mono text-ink-muted">
        加载中...
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (user.role !== "admin") {
    return (
      <div className="section-py container text-center">
        <div className="font-display text-3xl text-neon-magenta">403</div>
        <div className="mt-2 text-ink-muted">需要管理员权限</div>
      </div>
    );
  }

  return (
    <div className="section-py container">
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* 侧边栏 */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="glass rounded-xl p-4">
            <div className="mb-3 flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
              <Terminal className="h-5 w-5 text-neon-cyan" />
              <span className="font-display text-sm font-bold text-white">
                ADMIN PANEL
              </span>
            </div>
            <nav className="space-y-1">
              {menu.map((m) => (
                <NavLink
                  key={m.to}
                  to={m.to}
                  end={m.end}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 rounded px-3 py-2 text-sm transition",
                      isActive
                        ? "bg-neon-cyan/10 text-neon-cyan"
                        : "text-ink-muted hover:bg-white/5 hover:text-white"
                    )
                  }
                >
                  <m.icon className="h-4 w-4" />
                  {m.label}
                </NavLink>
              ))}
            </nav>
            <a
              href="/"
              target="_blank"
              className="mt-3 flex items-center gap-2 rounded border border-[var(--color-border)] px-3 py-2 text-xs text-ink-muted hover:text-neon-cyan"
            >
              <ExternalLink className="h-3 w-3" />
              新窗口打开前台
            </a>
          </div>
        </aside>

        {/* 主区 */}
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
