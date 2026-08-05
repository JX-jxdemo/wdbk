import cron from "node-cron";
import { db, getSettings } from "../db.js";

// 三阶段：前3天预热(私信) / 当天(全站) / 后3天(全站)
// 公告起止按当日 00:00:00 - 23:59:59 计算

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function fmt(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function dayStart(d: Date) {
  return `${fmt(d)} 00:00:00`;
}
function dayEnd(d: Date) {
  return `${fmt(d)} 23:59:59`;
}

// 计算某用户今年的生日周区间（按月日匹配，忽略闰年差异）
function computeBirthdayRange(birthday: string, today: Date) {
  const m = Number(birthday.slice(5, 7));
  const d = Number(birthday.slice(8, 10));
  if (!m || !d) return null;
  const year = today.getFullYear();
  const bdThisYear = new Date(year, m - 1, d);
  // 若生日已过超过 4 天，则跳过（避免下一年重复触发）
  const diffDays = Math.floor(
    (bdThisYear.getTime() - today.getTime()) / 86400000
  );
  if (diffDays > 4 || diffDays < -4) return null;
  return { bdThisYear, diffDays };
}

function renderTemplate(tpl: string, username: string) {
  return tpl.replace(/\{username\}/g, username);
}

// 每日 00:30 跑一次
export function startBirthdayScheduler() {
  cron.schedule("30 0 * * *", () => {
    runBirthdayJob().catch((e) => console.error("[birthday-cron]", e));
  });
  console.log("[scheduler] birthday cron registered (daily 00:30)");
}

export async function runBirthdayJob() {
  const settings = getSettings();
  if (!settings.birthday_auto_enabled) {
    return { skipped: "disabled" };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const users = db
    .prepare(`SELECT id, username, birthday FROM users WHERE birthday IS NOT NULL`)
    .all() as { id: number; username: string; birthday: string }[];

  let created = 0;
  let archived = 0;

  for (const u of users) {
    const range = computeBirthdayRange(u.birthday, today);
    if (!range) continue;
    const { bdThisYear, diffDays } = range;

    let stage: "pre" | "day" | "post" | null = null;
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    if (diffDays >= -3 && diffDays < 0) {
      // 前 3 天：私信
      stage = "pre";
      startDate = new Date(bdThisYear);
      startDate.setDate(bdThisYear.getDate() - 3);
      endDate = new Date(bdThisYear);
      endDate.setDate(bdThisYear.getDate() - 1);
    } else if (diffDays === 0) {
      // 当天：全站
      stage = "day";
      startDate = new Date(bdThisYear);
      endDate = new Date(bdThisYear);
    } else if (diffDays > 0 && diffDays <= 3) {
      // 后 3 天：全站
      stage = "post";
      startDate = new Date(bdThisYear);
      startDate.setDate(bdThisYear.getDate() + 1);
      endDate = new Date(bdThisYear);
      endDate.setDate(bdThisYear.getDate() + 3);
    }

    if (!stage || !startDate || !endDate) continue;

    const tpl =
      stage === "pre"
        ? settings.birthday_pre_template
        : stage === "day"
        ? settings.birthday_day_template
        : settings.birthday_post_template;

    const title =
      stage === "pre"
        ? `亲爱的 ${u.username}，生日即将到来`
        : stage === "day"
        ? `今天是 ${u.username} 的生日`
        : `${u.username} 的生日周仍在继续`;

    // pre 阶段：仅私信（user_id 绑定，但仍写入表）
    // day / post 阶段：全站公告（user_id 同样绑定，便于关联）
    const existing = db
      .prepare(
        `SELECT id, status, end_at FROM site_notice
         WHERE notice_type = 'birthday' AND user_id = ?
         AND start_at = ? AND end_at = ?`
      )
      .get(u.id, dayStart(startDate), dayEnd(endDate)) as
      | { id: number; status: number; end_at: string }
      | undefined;

    if (!existing) {
      db.prepare(
        `INSERT INTO site_notice
          (title, content, notice_type, user_id, start_at, end_at, priority, is_pinned, status)
         VALUES (?, ?, 'birthday', ?, ?, ?, 100, 1, 1)`
      ).run(
        title,
        renderTemplate(tpl, u.username),
        u.id,
        dayStart(startDate),
        dayEnd(endDate)
      );
      created++;
    }
  }

  // 归档过期生日公告（end_at < 今天）
  const todayStr = fmt(today) + " 00:00:00";
  const r = db
    .prepare(
      `UPDATE site_notice SET status = 0
       WHERE notice_type = 'birthday' AND status = 1 AND end_at < ?`
    )
    .run(todayStr);
  archived = r.changes;

  return { created, archived };
}
