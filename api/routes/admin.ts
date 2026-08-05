import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, getSettings, updateSettings } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

// 站点设置
router.get("/settings", (_req, res) => {
  const s = getSettings();
  res.json({
    registrationEnabled: s.registration_enabled === 1,
    likeModuleEnabled: s.like_module_enabled === 1,
    noticeModuleEnabled: s.notice_module_enabled === 1,
    musicModuleEnabled: s.music_module_enabled === 1,
    birthdayAutoEnabled: s.birthday_auto_enabled === 1,
    birthdayPreTemplate: s.birthday_pre_template,
    birthdayDayTemplate: s.birthday_day_template,
    birthdayPostTemplate: s.birthday_post_template,
  });
});

// 公共校验：哪些模块对游客可见
router.get("/status", (_req, res) => {
  const s = getSettings();
  res.json({
    registrationEnabled: s.registration_enabled === 1,
    likeModuleEnabled: s.like_module_enabled === 1,
    noticeModuleEnabled: s.notice_module_enabled === 1,
    musicModuleEnabled: s.music_module_enabled === 1,
  });
});

router.patch("/settings", requireAdmin, (req, res) => {
  const body = req.body || {};
  const patch: any = {};
  if (typeof body.registrationEnabled === "boolean")
    patch.registration_enabled = body.registrationEnabled ? 1 : 0;
  if (typeof body.likeModuleEnabled === "boolean")
    patch.like_module_enabled = body.likeModuleEnabled ? 1 : 0;
  if (typeof body.noticeModuleEnabled === "boolean")
    patch.notice_module_enabled = body.noticeModuleEnabled ? 1 : 0;
  if (typeof body.musicModuleEnabled === "boolean")
    patch.music_module_enabled = body.musicModuleEnabled ? 1 : 0;
  if (typeof body.birthdayAutoEnabled === "boolean")
    patch.birthday_auto_enabled = body.birthdayAutoEnabled ? 1 : 0;
  if (typeof body.birthdayPreTemplate === "string")
    patch.birthday_pre_template = body.birthdayPreTemplate;
  if (typeof body.birthdayDayTemplate === "string")
    patch.birthday_day_template = body.birthdayDayTemplate;
  if (typeof body.birthdayPostTemplate === "string")
    patch.birthday_post_template = body.birthdayPostTemplate;

  const next = updateSettings(patch);
  res.json({
    registrationEnabled: next.registration_enabled === 1,
    likeModuleEnabled: next.like_module_enabled === 1,
    noticeModuleEnabled: next.notice_module_enabled === 1,
    musicModuleEnabled: next.music_module_enabled === 1,
    birthdayAutoEnabled: next.birthday_auto_enabled === 1,
    birthdayPreTemplate: next.birthday_pre_template,
    birthdayDayTemplate: next.birthday_day_template,
    birthdayPostTemplate: next.birthday_post_template,
  });
});

// ---------- 用户管理 ----------
router.get("/users", requireAdmin, (_req, res) => {
  const rows = db
    .prepare(
      `SELECT u.id, u.username, u.role, u.birthday, u.created_at,
              COALESCE(l.like_value, 0) AS like_value,
              COALESCE(l.level, 0) AS level
       FROM users u
       LEFT JOIN user_like l ON l.user_id = u.id
       ORDER BY u.id DESC`
    )
    .all() as any[];
  res.json({
    users: rows.map((r) => ({
      id: r.id,
      username: r.username,
      role: r.role,
      birthday: r.birthday,
      createdAt: r.created_at,
      likeValue: r.like_value,
      level: r.level,
    })),
  });
});

// 管理员创建用户
router.post("/users", requireAdmin, (req, res) => {
  const { username, password, role, birthday } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "用户名和密码不能为空" });
  }
  if (username.length < 3 || username.length > 20) {
    return res.status(400).json({ error: "用户名长度需 3-20" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "密码至少 6 位" });
  }
  const r = role === "admin" ? "admin" : "user";
  if (birthday && !/^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
    return res.status(400).json({ error: "生日格式应为 YYYY-MM-DD" });
  }

  const exists = db.prepare(`SELECT id FROM users WHERE username = ?`).get(username);
  if (exists) return res.status(409).json({ error: "用户名已存在" });

  const hash = bcrypt.hashSync(password, 10);
  const info = db
    .prepare(`INSERT INTO users (username, password, role, birthday) VALUES (?, ?, ?, ?)`)
    .run(username, hash, r, birthday || null);
  const userId = info.lastInsertRowid as number;

  db.prepare(
    `INSERT OR IGNORE INTO user_like (user_id, like_value, level) VALUES (?, 0, 0)`
  ).run(userId);

  res.json({
    id: userId,
    username,
    role: r,
    birthday: birthday || null,
    createdAt: new Date().toISOString().replace("T", " ").slice(0, 19),
  });
});

// 修改用户角色/生日
router.patch("/users/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const { role, birthday } = req.body || {};
  const row = db.prepare(`SELECT * FROM users WHERE id = ?`).get(id);
  if (!row) return res.status(404).json({ error: "用户不存在" });

  if (role === "admin" || role === "user") {
    db.prepare(`UPDATE users SET role = ? WHERE id = ?`).run(role, id);
  }
  if (birthday !== undefined) {
    if (birthday && !/^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
      return res.status(400).json({ error: "生日格式应为 YYYY-MM-DD" });
    }
    db.prepare(`UPDATE users SET birthday = ? WHERE id = ?`).run(birthday || null, id);
  }
  res.json({ ok: true });
});

// 删除用户
router.delete("/users/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  if (id === (req as any).user.uid) {
    return res.status(400).json({ error: "不能删除当前登录账号" });
  }
  db.prepare(`DELETE FROM users WHERE id = ?`).run(id);
  res.json({ ok: true });
});

// ---------- 好感度管理 ----------
router.get("/likes", requireAdmin, (_req, res) => {
  const rows = db
    .prepare(
      `SELECT l.id, l.user_id, u.username, l.like_value, l.level, l.last_action_at, l.updated_at
       FROM user_like l
       JOIN users u ON u.id = l.user_id
       ORDER BY l.like_value DESC`
    )
    .all() as any[];
  res.json({ likes: rows });
});

// 手动修改某用户好感值
router.patch("/likes/:userId", requireAdmin, (req, res) => {
  const userId = Number(req.params.userId);
  const { likeValue } = req.body || {};
  if (typeof likeValue !== "number" || likeValue < 0) {
    return res.status(400).json({ error: "好感值不合法" });
  }
  const level = Math.min(
    5,
    Math.max(
      0,
      likeValue < 10 ? 0 :
      likeValue < 30 ? 1 :
      likeValue < 60 ? 2 :
      likeValue < 100 ? 3 :
      likeValue < 200 ? 4 : 5
    )
  );
  const nowIso = new Date().toISOString().replace("T", " ").slice(0, 19);
  db.prepare(
    `INSERT INTO user_like (user_id, like_value, level, last_action_at, updated_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       like_value = excluded.like_value,
       level = excluded.level,
       updated_at = excluded.updated_at`
  ).run(userId, likeValue, level, nowIso, nowIso);
  res.json({ ok: true });
});

export default router;
