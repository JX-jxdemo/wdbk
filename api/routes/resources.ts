import { Router } from "express";
import { db } from "../db.js";
import { requireLogin, requireAdmin } from "../middleware/auth.js";

const router = Router();

// 资源分类配置
const CATEGORIES = ["tools", "docs", "source", "learning"] as const;
type Category = (typeof CATEGORIES)[number];

// ---------- 公开接口 ----------

// 获取已审核通过的资源列表
router.get("/", (_req, res) => {
  const rows = db
    .prepare(
      `SELECT id, title, category, description, url, thumbnail, meta, updated_at, button_text
       FROM resources
       WHERE status = 'approved'
       ORDER BY category, id DESC`
    )
    .all() as any[];

  res.json({
    resources: rows.map((r) => ({
      id: String(r.id),
      title: r.title,
      category: r.category,
      description: r.description,
      url: r.url,
      thumbnail: r.thumbnail || undefined,
      meta: r.meta ? JSON.parse(r.meta) : undefined,
      updatedAt: r.updated_at,
      buttonText: r.button_text || undefined,
    })),
  });
});

// 获取单个资源详情
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const row = db
    .prepare(
      `SELECT id, title, category, description, url, thumbnail, meta, updated_at, button_text
       FROM resources WHERE id = ? AND status = 'approved'`
    )
    .get(id);
  if (!row) return res.status(404).json({ error: "资源不存在" });

  res.json({
    resource: {
      id: String(row.id),
      title: row.title,
      category: row.category,
      description: row.description,
      url: row.url,
      thumbnail: row.thumbnail || undefined,
      meta: row.meta ? JSON.parse(row.meta) : undefined,
      updatedAt: row.updated_at,
      buttonText: row.button_text || undefined,
    },
  });
});

// ---------- 投稿接口（需登录） ----------

// 用户提交外链投稿
router.post("/submit", requireLogin, (req, res) => {
  const user = (req as any).user;
  const { title, category, description, url } = req.body || {};

  if (!title || !url || !description) {
    return res.status(400).json({ error: "标题、链接、介绍不能为空" });
  }
  if (!CATEGORIES.includes(category as Category)) {
    return res.status(400).json({ error: "分类无效" });
  }
  if (!/^https?:\/\//.test(url)) {
    return res.status(400).json({ error: "链接必须以 http:// 或 https:// 开头" });
  }
  if (title.length > 100) {
    return res.status(400).json({ error: "标题不能超过 100 字" });
  }
  if (description.length > 500) {
    return res.status(400).json({ error: "介绍不能超过 500 字" });
  }

  const now = new Date().toISOString().replace("T", " ").slice(0, 19);
  const info = db
    .prepare(
      `INSERT INTO resource_submissions (title, category, description, url, submitted_by, status, created_at)
       VALUES (?, ?, ?, ?, ?, 'pending', ?)`
    )
    .run(title, category, description, url, user.uid, now);

  res.json({
    id: String(info.lastInsertRowid),
    status: "pending",
    message: "投稿成功,等待管理员审核",
  });
});

// ---------- 管理员接口 ----------

// 获取所有投稿（含审核状态）
router.get("/admin/submissions", requireAdmin, (_req, res) => {
  const rows = db
    .prepare(
      `SELECT s.id, s.title, s.category, s.description, s.url, s.status, s.created_at,
              u.username as submitted_by
       FROM resource_submissions s
       JOIN users u ON u.id = s.submitted_by
       ORDER BY
         CASE s.status WHEN 'pending' THEN 0 WHEN 'approved' THEN 1 ELSE 2 END,
         s.id DESC`
    )
    .all() as any[];

  res.json({
    submissions: rows.map((r) => ({
      id: String(r.id),
      title: r.title,
      category: r.category,
      description: r.description,
      url: r.url,
      status: r.status,
      submittedBy: r.submitted_by,
      createdAt: r.created_at,
    })),
  });
});

// 审核投稿
router.post("/admin/submissions/:id/review", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const { action } = req.body || {};
  if (action !== "approve" && action !== "reject") {
    return res.status(400).json({ error: "无效的审核操作" });
  }

  const row = db
    .prepare(`SELECT * FROM resource_submissions WHERE id = ?`)
    .get(id);
  if (!row) return res.status(404).json({ error: "投稿不存在" });

  if (action === "reject") {
    db.prepare(
      `UPDATE resource_submissions SET status = 'rejected' WHERE id = ?`
    ).run(id);
    return res.json({ ok: true, status: "rejected" });
  }

  // 通过审核: 将投稿转为正式资源
  const now = new Date().toISOString().replace("T", " ").slice(0, 19);
  db.prepare(
    `INSERT INTO resources (title, category, description, url, status, updated_at)
     VALUES (?, ?, ?, ?, 'approved', ?)`
  ).run(row.title, row.category, row.description, row.url, now);

  db.prepare(
    `UPDATE resource_submissions SET status = 'approved' WHERE id = ?`
  ).run(id);

  res.json({ ok: true, status: "approved" });
});

// 获取所有资源（含状态）
router.get("/admin/all", requireAdmin, (_req, res) => {
  const rows = db
    .prepare(
      `SELECT id, title, category, description, url, thumbnail, meta, status, updated_at, button_text
       FROM resources
       ORDER BY category, id DESC`
    )
    .all() as any[];

  res.json({
    resources: rows.map((r) => ({
      id: String(r.id),
      title: r.title,
      category: r.category,
      description: r.description,
      url: r.url,
      thumbnail: r.thumbnail || undefined,
      meta: r.meta ? JSON.parse(r.meta) : undefined,
      status: r.status,
      updatedAt: r.updated_at,
      buttonText: r.button_text || undefined,
    })),
  });
});

// 创建/更新资源
router.post("/admin/resources", requireAdmin, (req, res) => {
  const {
    title,
    category,
    description,
    url,
    meta,
    buttonText,
    status,
  } = req.body || {};

  if (!title || !url || !description) {
    return res.status(400).json({ error: "标题、链接、介绍不能为空" });
  }
  if (!CATEGORIES.includes(category as Category)) {
    return res.status(400).json({ error: "分类无效" });
  }

  const now = new Date().toISOString().replace("T", " ").slice(0, 19);
  const info = db
    .prepare(
      `INSERT INTO resources (title, category, description, url, meta, button_text, status, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      title,
      category,
      description,
      url,
      meta ? JSON.stringify(meta) : null,
      buttonText || null,
      status === "approved" ? "approved" : "draft",
      now
    );

  res.json({ id: String(info.lastInsertRowid), ok: true });
});

// 更新资源
router.patch("/admin/resources/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const body = req.body || {};
  const row = db.prepare(`SELECT * FROM resources WHERE id = ?`).get(id);
  if (!row) return res.status(404).json({ error: "资源不存在" });

  const updates: string[] = [];
  const vals: any[] = [];

  if (body.title !== undefined) {
    updates.push("title = ?");
    vals.push(body.title);
  }
  if (body.category !== undefined && CATEGORIES.includes(body.category)) {
    updates.push("category = ?");
    vals.push(body.category);
  }
  if (body.description !== undefined) {
    updates.push("description = ?");
    vals.push(body.description);
  }
  if (body.url !== undefined) {
    updates.push("url = ?");
    vals.push(body.url);
  }
  if (body.meta !== undefined) {
    updates.push("meta = ?");
    vals.push(body.meta ? JSON.stringify(body.meta) : null);
  }
  if (body.buttonText !== undefined) {
    updates.push("button_text = ?");
    vals.push(body.buttonText || null);
  }
  if (body.status !== undefined) {
    updates.push("status = ?");
    vals.push(body.status);
  }

  if (updates.length === 0) {
    return res.json({ ok: true });
  }

  updates.push("updated_at = ?");
  vals.push(new Date().toISOString().replace("T", " ").slice(0, 19));
  vals.push(id);

  db.prepare(
    `UPDATE resources SET ${updates.join(", ")} WHERE id = ?`
  ).run(...vals);

  res.json({ ok: true });
});

// 删除资源
router.delete("/admin/resources/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  db.prepare(`DELETE FROM resources WHERE id = ?`).run(id);
  res.json({ ok: true });
});

export default router;
