import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Plus,
  Minus,
  Lock,
  Sparkles,
  Clock,
  LogIn,
} from "lucide-react";
import { Link } from "react-router-dom";
import { apiFetch, useAuth } from "@/contexts/AuthContext";
import { useSite } from "@/contexts/SiteContext";
import { cn } from "@/lib/utils";

interface LikeMeta {
  levels: {
    min: number;
    max: number;
    level: number;
    name: string;
    color: string;
  }[];
  cooldownSeconds: number;
}

interface LikeState {
  value: number;
  level: number;
  levelName: string;
  color: string;
  lastActionAt: string | null;
  cooldownSeconds: number;
}

export default function LikePage() {
  const { user } = useAuth();
  const { status } = useSite();
  const [meta, setMeta] = useState<LikeMeta | null>(null);
  const [state, setState] = useState<LikeState | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // 加载元信息（所有人）
  useEffect(() => {
    apiFetch<LikeMeta>("/like/meta")
      .then(setMeta)
      .finally(() => setLoading(false));
  }, []);

  // 加载当前用户好感度（仅登录）
  useEffect(() => {
    if (!user) {
      setState(null);
      return;
    }
    apiFetch<LikeState>("/like/mine")
      .then(setState)
      .catch(() => setState(null));
  }, [user]);

  // 冷却倒计时
  useEffect(() => {
    if (!state?.lastActionAt) return;
    const tick = () => {
      const last = new Date(state.lastActionAt! + "Z").getTime();
      const diff = Math.floor((Date.now() - last) / 1000);
      const remain = Math.max(0, state.cooldownSeconds - diff);
      setCooldown(remain);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [state]);

  // 模块关闭 → 404
  if (!loading && status.likeModuleEnabled === false) {
    return <NotFoundInline />;
  }

  if (loading) {
    return (
      <div className="section-py container flex items-center justify-center">
        <div className="font-mono text-ink-muted">加载中...</div>
      </div>
    );
  }

  const isGuest = !user;
  const canAct = !isGuest && cooldown === 0 && !busy;

  const act = async (kind: "increment" | "decrement") => {
    if (!canAct) return;
    setBusy(true);
    setError("");
    try {
      const r = await apiFetch<LikeState>(`/like/${kind}`, { method: "POST" });
      setState(r);
      setCooldown(r.cooldownSeconds);
    } catch (e: any) {
      setError(e.message || "操作失败");
    } finally {
      setBusy(false);
    }
  };

  const currentValue = state?.value ?? 0;
  const currentLevel = state?.levelName ?? "初识";
  const currentColor = state?.color ?? "#a1a1aa";

  return (
    <div className="section-py container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-3xl"
      >
        {/* 标题 */}
        <div className="mb-8 text-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-neon-magenta/30 bg-neon-magenta/5 px-4 py-1 text-xs font-mono text-neon-magenta">
            <Sparkles className="h-3 w-3" />
            LIKE SPACE
          </div>
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
            好感<span className="text-gradient-neon">空间</span>
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            每一次互动都会让我们的距离更近一步
          </p>
        </div>

        {/* 主体卡片 */}
        <div className="glass relative overflow-hidden rounded-2xl p-8 sm:p-12">
          {/* 背景效果 */}
          <div
            className="pointer-events-none absolute inset-0 opacity-30 transition-colors"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${currentColor}40 0%, transparent 70%)`,
            }}
          />

          <div className="relative">
            {/* 等级展示 */}
            <div className="text-center">
              <motion.div
                key={currentLevel}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold"
                style={{
                  color: currentColor,
                  border: `1px solid ${currentColor}60`,
                  background: `${currentColor}10`,
                }}
              >
                <Heart className="h-3.5 w-3.5" fill={currentColor} />
                Lv.{state?.level ?? 0} · {currentLevel}
              </motion.div>
              <motion.div
                key={currentValue}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="font-display text-7xl font-bold sm:text-8xl"
                style={{
                  color: currentColor,
                  textShadow: `0 0 24px ${currentColor}80`,
                }}
              >
                {currentValue}
              </motion.div>
              <div className="mt-2 font-mono text-xs text-ink-muted">
                当前好感值
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={() => act("decrement")}
                disabled={!canAct}
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all",
                  canAct
                    ? "border-neon-magenta/40 bg-neon-magenta/10 text-neon-magenta hover:bg-neon-magenta/20 hover:scale-110"
                    : "cursor-not-allowed border-ink-faint/20 text-ink-faint/40"
                )}
                aria-label="减少好感"
              >
                <Minus className="h-5 w-5" />
              </button>

              <button
                onClick={() => act("increment")}
                disabled={!canAct}
                className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-full border-2 transition-all",
                  canAct
                    ? "border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20 hover:scale-110"
                    : "cursor-not-allowed border-ink-faint/20 text-ink-faint/40"
                )}
                aria-label="增加好感"
              >
                <Plus className="h-6 w-6" />
              </button>
            </div>

            {/* 提示区 */}
            <div className="mt-6 min-h-[2rem] text-center text-sm">
              {isGuest ? (
                <div className="flex items-center justify-center gap-2 text-ink-muted">
                  <Lock className="h-4 w-4" />
                  <span>登录后可操作好感度</span>
                  <Link
                    to="/"
                    className="ml-2 inline-flex items-center gap-1 rounded border border-neon-cyan/40 bg-neon-cyan/10 px-3 py-1 text-neon-cyan hover:bg-neon-cyan/20"
                  >
                    <LogIn className="h-3 w-3" /> 去登录
                  </Link>
                </div>
              ) : cooldown > 0 ? (
                <div className="flex items-center justify-center gap-2 text-neon-amber">
                  <Clock className="h-4 w-4 animate-pulse" />
                  <span className="font-mono">冷却中：{cooldown}s</span>
                </div>
              ) : (
                <div className="text-ink-muted">
                  点击 + / - 调整好感值（每次 ±1）
                </div>
              )}
              {error && (
                <div className="mt-2 text-neon-magenta">{error}</div>
              )}
            </div>
          </div>
        </div>

        {/* 等级表 */}
        {meta && (
          <div className="mt-8">
            <h3 className="mb-4 font-display text-lg font-bold text-white">
              等级阶梯
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {meta.levels.map((l) => {
                const active = state?.level === l.level;
                return (
                  <div
                    key={l.level}
                    className={cn(
                      "glass rounded-lg p-3 transition-all",
                      active && "scale-105"
                    )}
                    style={
                      active
                        ? {
                            borderColor: `${l.color}80`,
                            boxShadow: `0 0 20px ${l.color}40`,
                          }
                        : undefined
                    }
                  >
                    <div
                      className="flex items-center gap-2 text-sm font-bold"
                      style={{ color: l.color }}
                    >
                      <Heart className="h-3 w-3" fill={l.color} />
                      Lv.{l.level} {l.name}
                    </div>
                    <div className="mt-1 font-mono text-xs text-ink-muted">
                      {l.min}-{l.max === 1e9 ? "∞" : l.max}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function NotFoundInline() {
  return (
    <div className="section-py container flex flex-col items-center justify-center text-center">
      <div className="font-display text-6xl font-bold text-neon-magenta">404</div>
      <div className="mt-2 text-ink-muted">好感空间已关闭</div>
      <Link
        to="/"
        className="mt-6 rounded border border-neon-cyan/40 bg-neon-cyan/10 px-4 py-2 text-neon-cyan hover:bg-neon-cyan/20"
      >
        返回首页
      </Link>
    </div>
  );
}
