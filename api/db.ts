import initSqlJs, { Database as SqlJsDatabase } from "sql.js";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.resolve(__dirname, "../data");
const DB_PATH = path.join(DATA_DIR, "app.db");

fs.mkdirSync(DATA_DIR, { recursive: true });

// ---- sql.js 初始化 ----
const SQL = await initSqlJs();

// 加载现有数据库文件（如果存在）
let innerDb: SqlJsDatabase;
if (fs.existsSync(DB_PATH)) {
  const buf = fs.readFileSync(DB_PATH);
  innerDb = new SQL.Database(buf);
} else {
  innerDb = new SQL.Database();
}

function saveDb() {
  const data = innerDb.export();
  const buf = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buf);
}

// ---- 兼容 better-sqlite3 的 Statement 包装器 ----
interface BssResult {
  lastInsertRowid: number;
  changes: number;
}

// 全局追踪最后插入 ID
let lastInsertId = 0;
let lastChanges = 0;

class Statement {
  private sql: string;
  private wraps: SqlJsDatabase;

  constructor(wraps: SqlJsDatabase, sql: string) {
    this.wraps = wraps;
    this.sql = sql;
  }
  run(...args: any[]): BssResult {
    const stmt = this.wraps.prepare(this.sql);
    const params = args.length === 1 ? args[0] : args;
    if (params !== undefined) {
      if (typeof params === "object" && !Array.isArray(params)) {
        stmt.bind(params as Record<string, any>);
      } else {
        stmt.bind(Array.isArray(params) ? params : [params]);
      }
    }
    while (stmt.step()) {}
    stmt.free();

    const idRow = this.wraps.exec("SELECT last_insert_rowid() as id");
    if (idRow.length > 0 && idRow[0].values) {
      lastInsertId = idRow[0].values[0][0] as number;
    }
    const chRow = this.wraps.exec("SELECT changes() as c");
    if (chRow.length > 0 && chRow[0].values) {
      lastChanges = chRow[0].values[0][0] as number;
    }

    saveDb();
    return { lastInsertRowid: lastInsertId, changes: lastChanges };
  }

  get(...args: any[]): any {
    const stmt = this.wraps.prepare(this.sql);
    const params = args.length === 1 ? args[0] : args;
    if (params !== undefined) {
      if (typeof params === "object" && !Array.isArray(params)) {
        stmt.bind(params as Record<string, any>);
      } else {
        stmt.bind(Array.isArray(params) ? params : [params]);
      }
    }
    const result = stmt.step() ? stmt.getAsObject() : undefined;
    stmt.free();
    return result;
  }

  all(...args: any[]): any[] {
    const stmt = this.wraps.prepare(this.sql);
    const params = args.length === 1 ? args[0] : args;
    if (params !== undefined) {
      if (typeof params === "object" && !Array.isArray(params)) {
        stmt.bind(params as Record<string, any>);
      } else {
        stmt.bind(Array.isArray(params) ? params : [params]);
      }
    }
    const results: any[] = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  }
}

// ---- 兼容 better-sqlite3 的 Database 代理 ----
class DatabaseCompat {
  private db: SqlJsDatabase;

  constructor(db: SqlJsDatabase) {
    this.db = db;
  }

  prepare(sql: string): Statement {
    return new Statement(this.db, sql);
  }

  exec(sql: string): this {
    this.db.run(sql);
    return this;
  }

  pragma(pragmaStr: string): void {
    if (pragmaStr.includes("WAL")) return;
    this.db.run(`PRAGMA ${pragmaStr}`);
  }

  close(): void {
    this.db.close();
  }
}

export const db = new DatabaseCompat(innerDb);

// ============================================================
// 建表初始化
// ============================================================
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT NOT NULL UNIQUE,
    password      TEXT NOT NULL,
    role          TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('admin','user')),
    birthday      TEXT,
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS user_like (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL UNIQUE,
    like_value      INTEGER NOT NULL DEFAULT 0,
    level           INTEGER NOT NULL DEFAULT 0,
    last_action_at  TEXT,
    updated_at      TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS site_notice (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    title         TEXT NOT NULL,
    content       TEXT NOT NULL,
    notice_type   TEXT NOT NULL DEFAULT 'manual' CHECK(notice_type IN ('manual','birthday')),
    user_id       INTEGER,
    start_at      TEXT NOT NULL,
    end_at        TEXT NOT NULL,
    priority      INTEGER NOT NULL DEFAULT 0,
    is_pinned     INTEGER NOT NULL DEFAULT 0,
    status        INTEGER NOT NULL DEFAULT 1,
    created_at    TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS music_config (
    id              INTEGER PRIMARY KEY CHECK(id = 1),
    enabled         INTEGER NOT NULL DEFAULT 1,
    playlist        TEXT NOT NULL DEFAULT '[]',
    default_volume  INTEGER NOT NULL DEFAULT 60,
    loop_mode       TEXT NOT NULL DEFAULT 'list'
  );

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
    title: "We Don't Talk Anymore",
    artist: "Charlie Puth & Selena Gomez",
    src: "/music/we-dont-talk-anymore.mp3",
    cover: "",
  },
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
  const hash = bcrypt.hashSync("admin520774", 10);
  db.prepare(
    `INSERT INTO users (username, password, role) VALUES (?, ?, 'admin')`
  ).run("admin", hash);
  console.log("[db] default admin created: admin / admin520774");
}

saveDb();

// ---- 导出工具函数 ----
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
