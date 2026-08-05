import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdirSync } from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Railway 持久卷：通过环境变量 DATA_DIR 指定；开发时回退到项目根 data/
const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.resolve(__dirname, "../data");
const DB_PATH = path.join(DATA_DIR, "app.db");

mkdirSync(DATA_DIR, { recursive: true });

export const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ============================================================
// 建表初始化 - 所有新功能独立表，不修改原有文章/分类/标签表
// ============================================================
db.exec(`
  -- 用户表（独立，不与文章系统关联）
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT NOT NULL UNIQUE,
    password      TEXT NOT NULL,
    role          TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('admin','user')),
    birthday      TEXT,                       -- 公历生日 YYYY-MM-DD，可空
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- 好感度表
  CREATE TABLE IF NOT EXISTS user_like (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL UNIQUE,
    like_value      INTEGER NOT NULL DEFAULT 0,
    level           INTEGER NOT NULL DEFAULT 0,
    last_action_at  TEXT,                     -- 最后操作时间，用于冷却判断
    updated_at      TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  -- 公告表（生日公告绑定用户 ID，普通公告 user_id 为空）
  CREATE TABLE IF NOT EXISTS site_notice (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    title         TEXT NOT NULL,
    content       TEXT NOT NULL,
    notice_type   TEXT NOT NULL DEFAULT 'manual' CHECK(notice_type IN ('manual','birthday')),
    user_id       INTEGER,                    -- 生日公告绑定用户；普通公告为空
    start_at      TEXT NOT NULL,
    end_at        TEXT NOT NULL,
    priority      INTEGER NOT NULL DEFAULT 0,
    is_pinned     INTEGER NOT NULL DEFAULT 0,
    status        INTEGER NOT NULL DEFAULT 1, -- 1 启用 / 0 停用
    created_at    TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  -- 音乐播放器配置（单行表）
  CREATE TABLE IF NOT EXISTS music_config (
    id              INTEGER PRIMARY KEY CHECK(id = 1),
    enabled         INTEGER NOT NULL DEFAULT 1,
    playlist        TEXT NOT NULL DEFAULT '[]',    -- JSON: [{title, artist, src, cover}]
    default_volume  INTEGER NOT NULL DEFAULT 60,    -- 0-100
    loop_mode       TEXT NOT NULL DEFAULT 'list'    -- list | single | shuffle
  );

  -- 站点设置（单行表）
  CREATE TABLE IF NOT EXISTS site_settings (
    id                       INTEGER PRIMARY KEY CHECK(id = 1),
    registration_enabled     INTEGER NOT NULL DEFAULT 1,
    like_module_enabled      INTEGER NOT NULL DEFAULT 1,
    notice_module_enabled    INTEGER NOT NULL DEFAULT 1,
    music_module_enabled     INTEGER NOT NULL DEFAULT 1,
    birthday_auto_enabled    INTEGER NOT NULL DEFAULT 1,
    birthday_pre_template    TEXT NOT NULL DEFAULT '亲爱的 {username}，你的生日即将到来，提前送上祝福！',
    birthday_day_template    TEXT NOT NULL DEFAULT '今天是 {username} 的生日，全站一起送上祝福！',
    birthday_post_template   TEXT NOT NULL DEFAULT '{username} 的生日周仍在继续，祝福不停！'
  );
`);

// ---- 默认数据初始化 ----
const initMusic = db.prepare(
  `INSERT OR IGNORE INTO music_config (id, enabled, playlist, default_volume, loop_mode)
   VALUES (1, 1, ?, 60, 'list')`
);
initMusic.run(JSON.stringify([
  {
    title: "SoundHelix Song 1",
    artist: "T. Schürger",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "",
  },
  {
    title: "SoundHelix Song 5",
    artist: "T. Schürger",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    cover: "",
  },
  {
    title: "SoundHelix Song 9",
    artist: "T. Schürger",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    cover: "",
  },
]));

const initSettings = db.prepare(
  `INSERT OR IGNORE INTO site_settings (id) VALUES (1)`
);
initSettings.run();

// ---- 默认管理员 ----
const ensureAdmin = db.prepare(`SELECT COUNT(*) as c FROM users WHERE role='admin'`);
const adminCount = (ensureAdmin.get() as { c: number }).c;
if (adminCount === 0) {
  const bcrypt = await import("bcryptjs");
  const hash = bcrypt.hashSync("admin123", 10);
  db.prepare(
    `INSERT INTO users (username, password, role) VALUES (?, ?, 'admin')`
  ).run("admin", hash);
  console.log("[db] default admin created: admin / admin123");
}

export function getSettings() {
  return db.prepare(`SELECT * FROM site_settings WHERE id = 1`).get() as SiteSettings;
}

export function updateSettings(patch: Partial<SiteSettings>) {
  const cur = getSettings();
  const next = { ...cur, ...patch };
  db.prepare(`
    UPDATE site_settings SET
      registration_enabled  = @registration_enabled,
      like_module_enabled   = @like_module_enabled,
      notice_module_enabled = @notice_module_enabled,
      music_module_enabled  = @music_module_enabled,
      birthday_auto_enabled = @birthday_auto_enabled,
      birthday_pre_template = @birthday_pre_template,
      birthday_day_template = @birthday_day_template,
      birthday_post_template= @birthday_post_template
    WHERE id = 1
  `).run(next);
  return next;
}

export interface SiteSettings {
  id: number;
  registration_enabled: number;
  like_module_enabled: number;
  notice_module_enabled: number;
  music_module_enabled: number;
  birthday_auto_enabled: number;
  birthday_pre_template: string;
  birthday_day_template: string;
  birthday_post_template: string;
}
