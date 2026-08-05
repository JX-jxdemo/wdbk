import { Router } from "express";
import { db, getSettings } from "../db.js";
import { requireLogin } from "../middleware/auth.js";

const router = Router();

// 冷却时间（秒）
const COOLDOWN_SECONDS = 5;
// 单次操作加分上限
const DELTA_PER_ACTION = 1;
// 等级阈值
const LEVELS = [
  { min: 0,   max: 9,    level: 0, name: "初识",    color: "#a1a1aa" },
  { min: 10,  max: 29,   level: 1, name: "相识",    color: "#00f0ff" },
  { min: 30,  max: 59,   level: 2, name: "熟悉",    color: "#39ff14" },
  { min: 60,  max: 99,   level: 3, name: "挚友",    color: "#ffb800" },
  { min: 100, max: 199,  level: 4, name: "知己",    color: "#ff006e" },
  { min: 200, max: 1e9,  level: 5, name: "至亲",    color: "#7c3aed" },
];

export function getLevelInfo(value: number) {
  return LEVELS.find((l) => value >= l.min && value <= l.max) ?? LEVELS[0];
}

// 模块总开关校验
function isLikeEnabled() {
  return getSettings().like_module_enabled === 1;
}

// 获取当前用户好感度
router.get("/mine", requireLogin, (req, res) => {
  if (!isLikeEnabled()) return res.status(404).json({ error: "模块已关闭" });
  const u = (req as any).user;
  const row = db
    .prepare(`SELECT like_value, last_action_at FROM user_like WHERE user_id = ?`)
    .get(u.uid) as { like_value: number; last_action_at: string | null } | undefined;
  const value = row?.like_value ?? 0;
  const info = getLevelInfo(value);
  res.json({
    value,
    level: info.level,
    levelName: info.name,
    color: info.color,
    lastActionAt: row?.last_action_at ?? null,
    cooldownSeconds: COOLDOWN_SECONDS,
  });
});

// 加分（仅登录用户）
router.post("/increment", requireLogin, (req, res) => {
  if (!isLikeEnabled()) return res.status(404).json({ error: "模块已关闭" });
  const u = (req as any).user;
  const now = Date.now();

  const row = db
    .prepare(`SELECT like_value, last_action_at FROM user_like WHERE user_id = ?`)
    .get(u.uid) as { like_value: number; last_action_at: string | null } | undefined;

  // 冷却判断
  if (row?.last_action_at) {
    const last = new Date(row.last_action_at + "Z").getTime();
    const diff = Math.floor((now - last) / 1000);
    if (diff < COOLDOWN_SECONDS) {
      return res.status(429).json({
        error: "操作过于频繁",
        remaining: COOLDOWN_SECONDS - diff,
      });
    }
  }

  const cur = row?.like_value ?? 0;
  const next = Math.max(0, cur + DELTA_PER_ACTION);
  const info = getLevelInfo(next);
  const nowIso = new Date(now).toISOString().replace("T", " ").slice(0, 19);

  db.prepare(
    `INSERT INTO user_like (user_id, like_value, level, last_action_at, updated_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       like_value = excluded.like_value,
       level = excluded.level,
       last_action_at = excluded.last_action_at,
       updated_at = excluded.updated_at`
  ).run(u.uid, next, info.level, nowIso, nowIso);

  res.json({
    value: next,
    level: info.level,
    levelName: info.name,
    color: info.color,
    lastActionAt: nowIso,
    cooldownSeconds: COOLDOWN_SECONDS,
  });
});

// 减分
router.post("/decrement", requireLogin, (req, res) => {
  if (!isLikeEnabled()) return res.status(404).json({ error: "模块已关闭" });
  const u = (req as any).user;
  const now = Date.now();

  const row = db
    .prepare(`SELECT like_value, last_action_at FROM user_like WHERE user_id = ?`)
    .get(u.uid) as { like_value: number; last_action_at: string | null } | undefined;

  if (row?.last_action_at) {
    const last = new Date(row.last_action_at + "Z").getTime();
    const diff = Math.floor((now - last) / 1000);
    if (diff < COOLDOWN_SECONDS) {
      return res.status(429).json({
        error: "操作过于频繁",
        remaining: COOLDOWN_SECONDS - diff,
      });
    }
  }

  const cur = row?.like_value ?? 0;
  const next = Math.max(0, cur - DELTA_PER_ACTION);
  const info = getLevelInfo(next);
  const nowIso = new Date(now).toISOString().replace("T", " ").slice(0, 19);

  db.prepare(
    `INSERT INTO user_like (user_id, like_value, level, last_action_at, updated_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       like_value = excluded.like_value,
       level = excluded.level,
       last_action_at = excluded.last_action_at,
       updated_at = excluded.updated_at`
  ).run(u.uid, next, info.level, nowIso, nowIso);

  res.json({
    value: next,
    level: info.level,
    levelName: info.name,
    color: info.color,
    lastActionAt: nowIso,
    cooldownSeconds: COOLDOWN_SECONDS,
  });
});

// 等级元信息（前端配色/文案用）
router.get("/meta", (_req, res) => {
  res.json({ levels: LEVELS, cooldownSeconds: COOLDOWN_SECONDS });
});

export default router;
