import { Router } from "express";
import { db, getSettings } from "../db.js";
import { requireAdmin, requireLogin } from "../middleware/auth.js";

const router = Router();

interface NoticeRow {
  id: number;
  title: string;
  content: string;
  notice_type: string;
  user_id: number | null;
  start_at: string;
  end_at: string;
  priority: number;
  is_pinned: number;
  status: number;
  created_at: string;
}

function isNoticeEnabled() {
  return getSettings().notice_module_enabled === 1;
}

function rowToNotice(r: NoticeRow) {
  return {
    id: r.id,
    title: r.title,
    content: r.content,
    noticeType: r.notice_type,
    userId: r.user_id,
    startAt: r.start_at,
    endAt: r.end_at,
    priority: r.priority,
    isPinned: r.is_pinned === 1,
    status: r.status,
    createdAt: r.created_at,
  };
}

// 公共：获取当前可见公告列表
router.get("/", (_req, res) => {
  if (!isNoticeEnabled()) return res.json({ notices: [] });
  const now = new Date().toISOString().replace("T", " ").slice(0, 19);
  const rows = db
    .prepare(
      `SELECT * FROM site_notice
       WHERE status = 1 AND start_at <= ? AND end_at >= ?
       ORDER BY is_pinned DESC, priority DESC, id DESC`
    )
    .all(now, now) as NoticeRow[];
  res.json({ notices: rows.map(rowToNotice) });
});

// 当前用户收到的私信类生日预热公告
router.get("/inbox", requireLogin, (req, res) => {
  const u = (req as any).user;
  const now = new Date().toISOString().replace("T", " ").slice(0, 19);
  const rows = db
    .prepare(
      `SELECT * FROM site_notice
       WHERE status = 1 AND notice_type='birthday' AND user_id = ?
         AND start_at <= ? AND end_at >= ?
       ORDER BY is_pinned DESC, priority DESC, id DESC`
    )
    .all(u.uid, now, now) as NoticeRow[];
  res.json({ notices: rows.map(rowToNotice) });
});

// 管理员：获取全部公告
router.get("/admin/list", requireAdmin, (_req, res) => {
  const rows = db
    .prepare(
      `SELECT n.*, u.username AS target_username FROM site_notice n
       LEFT JOIN users u ON u.id = n.user_id
       ORDER BY n.id DESC`
    )
    .all() as (NoticeRow & { target_username: string | null })[];
  res.json({
    notices: rows.map((r) => ({ ...rowToNotice(r), targetUsername: r.target_username })),
  });
});

// 管理员：新增普通公告
router.post("/", requireAdmin, (req, res) => {
  const {
    title,
    content,
    startAt,
    endAt,
    priority = 0,
    isPinned = false,
  } = req.body || {};
  if (!title || !content || !startAt || !endAt) {
    return res.status(400).json({ error: "标题/正文/起止时间必填" });
  }
  const info = db
    .prepare(
      `INSERT INTO site_notice (title, content, notice_type, user_id, start_at, end_at, priority, is_pinned, status)
       VALUES (?, ?, 'manual', NULL, ?, ?, ?, ?, 1)`
    )
    .run(title, content, startAt, endAt, priority, isPinned ? 1 : 0);
  res.json({ id: info.lastInsertRowid });
});

// 管理员：编辑公告（普通或生日）
router.put("/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const row = db.prepare(`SELECT * FROM site_notice WHERE id = ?`).get(id) as
    | NoticeRow
    | undefined;
  if (!row) return res.status(404).json({ error: "公告不存在" });

  const {
    title,
    content,
    startAt,
    endAt,
    priority,
    isPinned,
    status,
  } = req.body || {};

  db.prepare(
    `UPDATE site_notice SET
       title = ?, content = ?, start_at = ?, end_at = ?,
       priority = ?, is_pinned = ?, status = ?
     WHERE id = ?`
  ).run(
    title ?? row.title,
    content ?? row.content,
    startAt ?? row.start_at,
    endAt ?? row.end_at,
    priority ?? row.priority,
    isPinned === undefined ? row.is_pinned : isPinned ? 1 : 0,
    status === undefined ? row.status : status ? 1 : 0,
    id
  );
  res.json({ ok: true });
});

// 管理员：删除公告
router.delete("/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  db.prepare(`DELETE FROM site_notice WHERE id = ?`).run(id);
  res.json({ ok: true });
});

export default router;
