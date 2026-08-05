import { Router } from "express";
import { db, getSettings } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

interface MusicRow {
  id: number;
  enabled: number;
  playlist: string;
  default_volume: number;
  loop_mode: string;
}

function isMusicEnabled() {
  return getSettings().music_module_enabled === 1;
}

// 公共：获取播放器配置
router.get("/config", (_req, res) => {
  const row = db.prepare(`SELECT * FROM music_config WHERE id = 1`).get() as MusicRow;
  let playlist: any[] = [];
  try {
    playlist = JSON.parse(row.playlist || "[]");
  } catch {
    playlist = [];
  }
  res.json({
    enabled: isMusicEnabled() && row.enabled === 1,
    playlist,
    defaultVolume: row.default_volume,
    loopMode: row.loop_mode,
  });
});

// 管理员：更新播放器配置
router.put("/config", requireAdmin, (req, res) => {
  const { enabled, playlist, defaultVolume, loopMode } = req.body || {};
  const row = db.prepare(`SELECT * FROM music_config WHERE id = 1`).get() as MusicRow;

  const next = {
    enabled: typeof enabled === "number" ? enabled : row.enabled,
    playlist:
      Array.isArray(playlist) ? JSON.stringify(playlist) : row.playlist,
    defaultVolume:
      typeof defaultVolume === "number" && defaultVolume >= 0 && defaultVolume <= 100
        ? defaultVolume
        : row.default_volume,
    loopMode:
      ["list", "single", "shuffle"].includes(loopMode) ? loopMode : row.loop_mode,
  };

  db.prepare(
    `UPDATE music_config SET enabled = ?, playlist = ?, default_volume = ?, loop_mode = ? WHERE id = 1`
  ).run(next.enabled, next.playlist, next.defaultVolume, next.loopMode);

  res.json({
    enabled: isMusicEnabled() && next.enabled === 1,
    playlist: JSON.parse(next.playlist),
    defaultVolume: next.defaultVolume,
    loopMode: next.loopMode,
  });
});

export default router;
