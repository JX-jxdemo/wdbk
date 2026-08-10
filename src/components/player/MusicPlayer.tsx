import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Repeat,
  Repeat1,
  Shuffle,
  ListMusic,
  X,
  ChevronDown,
  ChevronUp,
  Music,
} from "lucide-react";
import { apiFetch } from "@/contexts/AuthContext";
import { useSite } from "@/contexts/SiteContext";
import { cn } from "@/lib/utils";

interface Track {
  title: string;
  artist: string;
  src: string;
  cover?: string;
}

interface MusicConfig {
  enabled: boolean;
  playlist: Track[];
  defaultVolume: number;
  loopMode: "list" | "single" | "shuffle";
}

const STORAGE_KEY = "neon_player_state";

export default function MusicPlayer() {
  const { status } = useSite();
  const [config, setConfig] = useState<MusicConfig | null>(null);
  const [loading, setLoading] = useState(true);

  // 持久化播放器状态：当前曲目索引、音量、循环模式
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(60);
  const [loopMode, setLoopMode] = useState<"list" | "single" | "shuffle">("list");
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showList, setShowList] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  // 加载配置
  useEffect(() => {
    if (status.musicModuleEnabled === false) {
      setLoading(false);
      return;
    }
    apiFetch<MusicConfig>("/music/config")
      .then((c) => {
        setConfig(c);
        // 恢复本地状态
        try {
          const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "");
          if (typeof saved.idx === "number" && saved.idx < c.playlist.length) {
            setIdx(saved.idx);
          }
          if (typeof saved.volume === "number") setVolume(saved.volume);
          if (saved.loopMode) setLoopMode(saved.loopMode);
        } catch {}
        if (c.defaultVolume) setVolume(c.defaultVolume);
        if (c.loopMode) setLoopMode(c.loopMode);
      })
      .finally(() => setLoading(false));
  }, [status.musicModuleEnabled]);

  // 持久化
  useEffect(() => {
    if (!config) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ idx, volume, loopMode })
    );
  }, [idx, volume, loopMode, config]);

  // 应用音量
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  // 应用循环模式
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.loop = loopMode === "single";
  }, [loopMode]);

  const track = config?.playlist?.[idx];

  const play = () => {
    if (!audioRef.current || !track) return;
    audioRef.current.play().then(() => setPlaying(true)).catch(() => {
      // 浏览器自动播放限制
      setPlaying(false);
    });
  };
  const pause = () => {
    audioRef.current?.pause();
    setPlaying(false);
  };

  const next = () => {
    if (!config) return;
    const n = config.playlist.length;
    if (n === 0) return;
    if (loopMode === "shuffle") {
      setIdx(Math.floor(Math.random() * n));
    } else {
      setIdx((i) => (i + 1) % n);
    }
  };
  const prev = () => {
    if (!config) return;
    const n = config.playlist.length;
    if (n === 0) return;
    setIdx((i) => (i - 1 + n) % n);
  };

  const onEnded = () => {
    if (loopMode === "single") {
      play();
      return;
    }
    next();
  };

  const onTimeUpdate = () => {
    if (!audioRef.current) return;
    setProgress(audioRef.current.currentTime);
    setDuration(audioRef.current.duration || 0);
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = v;
    setProgress(v);
  };

  if (loading || !config || !config.enabled || status.musicModuleEnabled === false) {
    return null;
  }

  if (!track) return null;

  return (
    <>
      <audio
        ref={audioRef}
        src={track.src}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-4 right-4 z-[60] w-[90%] max-w-sm"
      >
        <div className="glass overflow-hidden rounded-xl border-[var(--color-primary)]/20">
          {/* 顶部条 */}
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-3 py-2">
            <div className="flex items-center gap-2 text-xs text-[var(--color-primary)]">
              <Music className="h-3.5 w-3.5" />
              <span className="font-mono">NOW PLAYING</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowList((v) => !v)}
                className="rounded p-1 text-[var(--text-secondary)] hover:text-[var(--color-primary)]"
                title="歌单"
              >
                <ListMusic className="h-4 w-4" />
              </button>
              <button
                onClick={() => setExpanded((v) => !v)}
                className="rounded p-1 text-[var(--text-secondary)] hover:text-[var(--color-primary)]"
                title={expanded ? "收起" : "展开"}
              >
                {expanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* 主体 */}
          <div className="p-3">
            <div className="flex items-center gap-3">
              {/* 封面 */}
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded border border-[var(--color-border)] bg-[var(--color-bg)]">
                {track.cover ? (
                  <img
                    src={track.cover}
                    alt={track.title}
                    className={cn(
                      "h-full w-full object-cover",
                      playing && "animate-pulse"
                    )}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Music className="h-5 w-5 text-[var(--color-primary)]/60" />
                  </div>
                )}
              </div>
              {/* 信息 */}
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold text-[var(--text-primary)]">
                  {track.title}
                </div>
                <div className="truncate text-xs text-[var(--text-secondary)]">
                  {track.artist}
                </div>
              </div>
            </div>

            {/* 进度条 */}
            <div className="mt-3 flex items-center gap-2 text-[10px] font-mono text-[var(--text-secondary)]">
              <span>{fmtTime(progress)}</span>
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={progress}
                onChange={seek}
                className="neon-range flex-1"
              />
              <span>{fmtTime(duration)}</span>
            </div>

            {/* 控制按钮 */}
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  onClick={prev}
                  className="rounded p-1.5 text-ink-muted hover:text-[var(--color-primary)]"
                >
                  <SkipBack className="h-4 w-4" />
                </button>
                <button
                  onClick={playing ? pause : play}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20"
                >
                  {playing ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4 translate-x-0.5" />
                  )}
                </button>
                <button
                  onClick={next}
                  className="rounded p-1.5 text-ink-muted hover:text-[var(--color-primary)]"
                >
                  <SkipForward className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setLoopMode((m) =>
                      m === "list" ? "single" : m === "single" ? "shuffle" : "list"
                    )
                  }
                  className="rounded p-1.5 text-ink-muted hover:text-[var(--color-primary)]"
                  title={
                    loopMode === "list"
                      ? "列表循环"
                      : loopMode === "single"
                      ? "单曲循环"
                      : "随机播放"
                  }
                >
                  {loopMode === "single" ? (
                    <Repeat1 className="h-4 w-4 text-[var(--color-primary)]" />
                  ) : loopMode === "shuffle" ? (
                    <Shuffle className="h-4 w-4 text-[var(--color-primary)]" />
                  ) : (
                    <Repeat className="h-4 w-4" />
                  )}
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setVolume((v) => (v > 0 ? 0 : 60))}
                    className="rounded p-1.5 text-ink-muted hover:text-[var(--color-primary)]"
                  >
                    {volume === 0 ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="neon-range w-16"
                  />
                </div>
              </div>
            </div>

            {/* 展开区 */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 border-t border-[var(--color-border)] pt-3 text-xs text-[var(--text-secondary)]">
                    <div className="flex items-center justify-between">
                      <span>当前曲目</span>
                      <span className="font-mono text-[var(--color-primary)]">
                        {idx + 1} / {config.playlist.length}
                      </span>
                    </div>
                    <div className="mt-1 truncate font-mono text-[var(--text-primary)]">
                      {track.title} - {track.artist}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 歌单 */}
            <AnimatePresence>
              {showList && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 max-h-48 space-y-1 overflow-y-auto border-t border-[var(--color-border)] pt-3">
                    {config.playlist.map((t, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setIdx(i);
                          setTimeout(play, 50);
                        }}
                        className={cn(
                          "flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs transition",
                          i === idx
                            ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                            : "text-[var(--text-secondary)] hover:bg-[var(--text-primary)]/5 hover:text-[var(--text-primary)]"
                        )}
                      >
                        <span className="font-mono">{i + 1}.</span>
                        <span className="truncate">{t.title}</span>
                        <span className="ml-auto truncate text-[10px] text-[var(--text-faint)]">
                          {t.artist}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  );
}

function fmtTime(s: number) {
  if (!s || !isFinite(s)) return "00:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}
