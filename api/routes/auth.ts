import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, getSettings } from "../db.js";
import { signToken, JwtPayload } from "../middleware/auth.js";

const router = Router();

// 注册
router.post("/register", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "用户名和密码不能为空" });
  }
  if (username.length < 3 || username.length > 20) {
    return res.status(400).json({ error: "用户名长度需 3-20" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "密码至少 6 位" });
  }
  const settings = getSettings();
  if (!settings.registration_enabled) {
    return res.status(403).json({ error: "注册已关闭" });
  }

  const exists = db.prepare(`SELECT id FROM users WHERE username = ?`).get(username);
  if (exists) return res.status(409).json({ error: "用户名已存在" });

  const hash = bcrypt.hashSync(password, 10);
  const info = db
    .prepare(`INSERT INTO users (username, password, role) VALUES (?, ?, 'user')`)
    .run(username, hash);
  const userId = info.lastInsertRowid as number;

  // 初始化好感度记录
  db.prepare(
    `INSERT OR IGNORE INTO user_like (user_id, like_value, level) VALUES (?, 0, 0)`
  ).run(userId);

  const payload: JwtPayload = { uid: userId, username, role: "user" };
  const token = signToken(payload);
  res.json({ token, user: { id: userId, username, role: "user", birthday: null } });
});

// 登录
router.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "用户名和密码不能为空" });
  }
  const row = db
    .prepare(`SELECT id, username, password, role, birthday FROM users WHERE username = ?`)
    .get(username) as
    | { id: number; username: string; password: string; role: string; birthday: string | null }
    | undefined;
  if (!row) return res.status(401).json({ error: "用户名或密码错误" });

  if (!bcrypt.compareSync(password, row.password)) {
    return res.status(401).json({ error: "用户名或密码错误" });
  }

  const payload: JwtPayload = {
    uid: row.id,
    username: row.username,
    role: row.role as "admin" | "user",
  };
  const token = signToken(payload);
  res.json({
    token,
    user: {
      id: row.id,
      username: row.username,
      role: row.role,
      birthday: row.birthday,
    },
  });
});

// 当前用户信息
router.get("/me", (req, res) => {
  const u = (req as any).user as JwtPayload | null;
  if (!u) return res.json({ user: null });
  const row = db
    .prepare(`SELECT id, username, role, birthday FROM users WHERE id = ?`)
    .get(u.uid) as
    | { id: number; username: string; role: string; birthday: string | null }
    | undefined;
  if (!row) return res.json({ user: null });
  res.json({
    user: {
      id: row.id,
      username: row.username,
      role: row.role,
      birthday: row.birthday,
    },
  });
});

// 用户自己更新生日
router.patch("/me/birthday", (req, res) => {
  const u = (req as any).user as JwtPayload | null;
  if (!u) return res.status(401).json({ error: "未登录" });
  const { birthday } = req.body || {};
  // 校验 YYYY-MM-DD 或空
  if (birthday && !/^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
    return res.status(400).json({ error: "生日格式应为 YYYY-MM-DD" });
  }
  db.prepare(`UPDATE users SET birthday = ? WHERE id = ?`).run(birthday || null, u.uid);
  res.json({ birthday: birthday || null });
});

export default router;
