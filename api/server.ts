import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseUser } from "./middleware/auth.js";
import { startBirthdayScheduler } from "./scheduler/birthday.js";
import authRoutes from "./routes/auth.js";
import likeRoutes from "./routes/like.js";
import musicRoutes from "./routes/music.js";
import noticeRoutes from "./routes/notice.js";
import adminRoutes from "./routes/admin.js";
import resourceRoutes from "./routes/resources.js";
import { runBirthdayJob } from "./scheduler/birthday.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());

// 解析用户（不强制）
app.use(parseUser);

// API 路由
app.use("/api/auth", authRoutes);
app.use("/api/like", likeRoutes);
app.use("/api/music", musicRoutes);
app.use("/api/notice", noticeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/resources", resourceRoutes);

// 健康检查
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// 手动触发生日任务
app.post("/api/admin/run-birthday-job", (_req, res) => {
  runBirthdayJob()
    .then((r) => res.json(r))
    .catch((e) => res.status(500).json({ error: String(e) }));
});

// 生产环境：托管前端构建产物 + SPA 回退
const DIST_DIR = path.resolve(__dirname, "../dist");
app.use(express.static(DIST_DIR));
// Express 5 不再支持 "*" 通配符，用命名通配捕获所有路径
app.get("/{*splat}", (_req, res) => {
  res.sendFile(path.join(DIST_DIR, "index.html"));
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
  console.log(`[api] server running at http://localhost:${PORT}`);
  startBirthdayScheduler();
  runBirthdayJob().catch((e) => console.error("[birthday-init]", e));
});
