import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  LogIn,
  UserPlus,
  LogOut,
  Settings,
  X,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export default function AccountMenu() {
  const { user, loading, login, register, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState<null | "login" | "register">(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {loading ? (
        <div className="h-9 w-9 animate-pulse rounded border border-[var(--color-border)]" />
      ) : user ? (
        <>
          <button
            onClick={() => setOpen((v) => !v)}
            className="glass glass-hover flex h-9 items-center gap-2 rounded px-3 text-sm text-[var(--text-primary)]"
            aria-label="账号菜单"
          >
            <User className="h-4 w-4 text-[var(--color-primary)]" />
            <span className="hidden max-w-[120px] truncate font-mono sm:inline">
              {user.username}
            </span>
            {user.role === "admin" && (
              <span className="hidden rounded bg-[#f97316]/20 px-1.5 py-0.5 text-[10px] font-bold text-[#f97316] md:inline">
                ADMIN
              </span>
            )}
          </button>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="glass absolute right-0 top-11 z-50 w-48 overflow-hidden rounded-lg border-[var(--color-border)]"
              >
                <div className="border-b border-[var(--color-border)] px-4 py-3">
                  <div className="truncate font-mono text-sm text-[var(--text-primary)]">
                    {user.username}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {user.role === "admin" ? "管理员" : "普通用户"}
                  </div>
                </div>
                {user.role === "admin" && (
                  <MenuItem
                    icon={<Settings className="h-4 w-4" />}
                    label="后台管理"
                    onClick={() => {
                      setOpen(false);
                      navigate("/admin");
                    }}
                  />
                )}
                <MenuItem
                  icon={<LogOut className="h-4 w-4" />}
                  label="退出登录"
                  danger
                  onClick={() => {
                    logout();
                    setOpen(false);
                    navigate("/");
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAuthOpen("login")}
            className="glass glass-hover flex h-9 items-center gap-1.5 rounded px-3 text-sm text-[var(--color-primary)]"
          >
            <LogIn className="h-4 w-4" />
            <span className="hidden sm:inline">登录</span>
          </button>
          <button
            onClick={() => setAuthOpen("register")}
            className="btn-secondary"
          >
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">注册</span>
          </button>
        </div>
      )}

      {createPortal(
        <AnimatePresence>
          {authOpen && (
            <AuthModal
              mode={authOpen}
              onClose={() => setAuthOpen(null)}
              onSwitch={(m) => setAuthOpen(m)}
              onSubmit={async (u, p) => {
                if (authOpen === "login") await login(u, p);
                else await register(u, p);
                setAuthOpen(null);
              }}
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors",
        danger
          ? "text-[#f97316] hover:bg-[#f97316]/10"
          : "text-[var(--text-secondary)] hover:bg-[var(--color-primary)]/5 hover:text-[var(--text-primary)]"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function AuthModal({
  mode,
  onClose,
  onSwitch,
  onSubmit,
}: {
  mode: "login" | "register";
  onClose: () => void;
  onSwitch: (m: "login" | "register") => void;
  onSubmit: (username: string, password: string) => Promise<void>;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await onSubmit(username, password);
    } catch (err: any) {
      setError(err.message || "操作失败");
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-bg)]/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
        className="glass relative w-[90%] max-w-sm rounded-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="mb-1 font-heading text-2xl font-bold text-[var(--text-primary)]">
          {mode === "login" ? "登录" : "注册"}
        </h2>
        <p className="mb-5 text-xs text-[var(--text-muted)]">
          {mode === "login"
            ? "登录后可操作好感度、进入后台"
            : "创建账号以解锁更多功能"}
        </p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1 block font-mono text-xs text-[var(--text-muted)]">
              用户名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              minLength={3}
              maxLength={20}
              required
              className="input-field"
              placeholder="3-20 个字符"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs text-[var(--text-muted)]">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
              className="input-field"
              placeholder="至少 6 位"
            />
          </div>
          {error && (
            <div className="flex items-center gap-2 rounded border border-[#f97316]/40 bg-[#f97316]/10 px-3 py-2 text-sm text-[#f97316]">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <button
            type="submit"
            disabled={busy}
            className="btn-primary w-full justify-center disabled:opacity-50"
          >
            {busy ? "处理中..." : mode === "login" ? "登录" : "注册"}
          </button>
        </form>
        <div className="mt-4 text-center text-xs text-[var(--text-muted)]">
          {mode === "login" ? "还没有账号？" : "已有账号？"}
          <button
            onClick={() => onSwitch(mode === "login" ? "register" : "login")}
            className="ml-1 text-[var(--color-primary)] hover:underline"
          >
            {mode === "login" ? "去注册" : "去登录"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}