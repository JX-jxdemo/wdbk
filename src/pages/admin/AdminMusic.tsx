import { useEffect, useState } from "react";
import { Save, Plus, Trash2, Music } from "lucide-react";
import { apiFetch } from "@/contexts/AuthContext";

interface Track {
  title: string;
  artist: string;
  src: string;
  cover?: string;
}

interface Config {
  enabled: boolean;
  playlist: Track[];
  defaultVolume: number;
  loopMode: "list" | "single" | "shuffle";
}

export default function AdminMusic() {
  const [cfg, setCfg] = useState<Config | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    apiFetch<Config>("/music/config").then(setCfg);
  }, []);

  const update = (patch: Partial<Config>) => {
    setCfg((c) => (c ? { ...c, ...patch } : c));
  };

  const updateTrack = (i: number, patch: Partial<Track>) => {
    if (!cfg) return;
    const list = [...cfg.playlist];
    list[i] = { ...list[i], ...patch };
    update({ playlist: list });
  };

  const addTrack = () => {
    if (!cfg) return;
    update({
      playlist: [
        ...cfg.playlist,
        { title: "新歌曲", artist: "未知", src: "", cover: "" },
      ],
    });
  };

  const removeTrack = (i: number) => {
    if (!cfg) return;
    update({ playlist: cfg.playlist.filter((_, idx) => idx !== i) });
  };

  const save = async () => {
    if (!cfg) return;
    setSaving(true);
    setMsg("");
    try {
      const r = await apiFetch<Config>("/music/config", {
        method: "PUT",
        body: JSON.stringify({
          enabled: cfg.enabled ? 1 : 0,
          playlist: cfg.playlist,
          defaultVolume: cfg.defaultVolume,
          loopMode: cfg.loopMode,
        }),
      });
      setCfg(r);
      setMsg("保存成功");
    } catch (e: any) {
      setMsg(e.message || "保存失败");
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 2000);
    }
  };

  if (!cfg) return <div className="text-ink-muted">加载中...</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">
          音乐播放器配置
        </h1>
        <button
          onClick={save}
          disabled={saving}
          className="rounded border border-neon-cyan/40 bg-neon-cyan/10 px-4 py-2 text-sm font-bold text-neon-cyan hover:bg-neon-cyan/20 disabled:opacity-50"
        >
          {saving ? "保存中..." : "保存配置"}
        </button>
      </div>
      {msg && (
        <div className="mb-4 rounded border border-neon-cyan/30 bg-neon-cyan/10 px-3 py-2 text-sm text-neon-cyan">
          {msg}
        </div>
      )}

      {/* 基础开关 */}
      <div className="glass mb-4 rounded-xl p-5">
        <h3 className="mb-3 font-bold text-white">基础设置</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="flex items-center gap-2 text-sm text-ink-muted">
            <input
              type="checkbox"
              checked={cfg.enabled}
              onChange={(e) => update({ enabled: e.target.checked })}
              className="accent-[var(--neon-cyan)]"
            />
            启用播放器
          </label>
          <div>
            <label className="mb-1 block text-xs text-ink-muted">
              默认音量: {cfg.defaultVolume}
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={cfg.defaultVolume}
              onChange={(e) => update({ defaultVolume: Number(e.target.value) })}
              className="neon-range w-full"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-ink-muted">循环模式</label>
            <select
              value={cfg.loopMode}
              onChange={(e) =>
                update({ loopMode: e.target.value as Config["loopMode"] })
              }
              className="w-full rounded border border-[var(--color-border)] bg-base-900/60 px-3 py-2 text-sm text-white"
            >
              <option value="list">列表循环</option>
              <option value="single">单曲循环</option>
              <option value="shuffle">随机播放</option>
            </select>
          </div>
        </div>
      </div>

      {/* 歌单管理 */}
      <div className="glass rounded-xl p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-bold text-white">
            <Music className="h-4 w-4 text-neon-cyan" />
            歌单 ({cfg.playlist.length})
          </h3>
          <button
            onClick={addTrack}
            className="flex items-center gap-1 rounded border border-neon-cyan/40 bg-neon-cyan/10 px-3 py-1 text-xs text-neon-cyan hover:bg-neon-cyan/20"
          >
            <Plus className="h-3 w-3" /> 添加
          </button>
        </div>
        <div className="space-y-3">
          {cfg.playlist.map((t, i) => (
            <div
              key={i}
              className="grid gap-2 rounded border border-[var(--color-border)] p-3 sm:grid-cols-[2fr_2fr_3fr_1fr_auto]"
            >
              <input
                type="text"
                value={t.title}
                onChange={(e) => updateTrack(i, { title: e.target.value })}
                placeholder="歌曲名"
                className="rounded border border-[var(--color-border)] bg-base-900/60 px-2 py-1 text-sm text-white"
              />
              <input
                type="text"
                value={t.artist}
                onChange={(e) => updateTrack(i, { artist: e.target.value })}
                placeholder="艺术家"
                className="rounded border border-[var(--color-border)] bg-base-900/60 px-2 py-1 text-sm text-white"
              />
              <input
                type="text"
                value={t.src}
                onChange={(e) => updateTrack(i, { src: e.target.value })}
                placeholder="音频 URL"
                className="rounded border border-[var(--color-border)] bg-base-900/60 px-2 py-1 text-sm text-white"
              />
              <input
                type="text"
                value={t.cover || ""}
                onChange={(e) => updateTrack(i, { cover: e.target.value })}
                placeholder="封面 URL"
                className="rounded border border-[var(--color-border)] bg-base-900/60 px-2 py-1 text-sm text-white"
              />
              <button
                onClick={() => removeTrack(i)}
                className="rounded p-1.5 text-ink-muted hover:text-neon-magenta"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {cfg.playlist.length === 0 && (
            <div className="py-8 text-center text-sm text-ink-muted">
              暂无歌曲，点击「添加」开始
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
