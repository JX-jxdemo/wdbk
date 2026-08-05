# Railway 部署指南

本项目为全栈应用（React SPA + Express API + SQLite + node-cron 定时任务），推荐使用 Railway 部署。

## 改造点（已完成）

1. **合并前后端同源**：[api/server.ts](api/server.ts) 在生产环境用 `express.static` 托管 `dist/` 静态资源，所有 `/api/*` 走 API，其他路径回退到 `index.html`（SPA 路由）。
2. **SQLite 持久化**：[api/db.ts](api/db.ts) 读取 `DATA_DIR` 环境变量决定数据库位置；未设置时回退到项目根 `data/`。
3. **端口**：[api/server.ts](api/server.ts) 读取 `PORT` 环境变量（Railway 自动注入），默认 3000。
4. **构建脚本**：[package.json](package.json) 的 `start` = `tsx api/server.ts`，`build` = `tsc -b && vite build`。
5. **Railway 配置**：[railway.json](railway.json) 定义 build/deploy/healthcheck。

## 部署步骤

### 1. 推送代码到 GitHub

```bash
git init
git add .
git commit -m "ready for railway deployment"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

> 注意：`.gitignore` 已忽略 `node_modules`、`dist`、`data/*.db*`，数据库不会上传，Railway 会创建空库并由 `db.ts` 自动建表 + 写入默认管理员 `admin/admin123`。

### 2. 在 Railway 创建项目

1. 访问 https://raily.app/login ，用 GitHub 账号登录
2. **New Project → Deploy from GitHub repo**，选择你的仓库
3. Railway 会自动检测 [railway.json](railway.json) 配置：
   - Build command: `npm run build`
   - Start command: `npm run start`
   - Healthcheck: `GET /api/health`

### 3. 配置持久卷（关键，否则数据会丢）

1. 在 Railway 服务的 **Settings → Volumes → Add Volume**
2. **Mount path** 填 `/data`
3. 在 **Variables** 中添加：
   ```
   DATA_DIR=/data
   ```
4. 重新部署服务

> 不配 Volume 也能跑，但每次重新部署 SQLite 数据会丢失（管理员账号、用户、公告都会回到初始状态）。

### 4. 绑定域名

1. **Settings → Networking → Generate Domain**，Railway 会给一个 `xxx.up.railway.app` 的免费域名
2. 想用自定义域名：在域名注册商添加 CNAME 指向 Railway 给的地址，然后在 Railway 添加 Custom Domain

### 5. 部署后验证

- 访问 `https://<你的域名>/` → 应看到博客首页
- 访问 `https://<你的域名>/api/health` → 返回 `{"ok":true,"time":"..."}`
- 用 `admin / admin123` 登录后台 `https://<你的域名>/admin`

## 常见问题

### Q: 部署后数据库被重置？
A: 没配持久卷。按上面步骤 3 配置 `DATA_DIR=/data` 的 Volume。

### Q: `better-sqlite3` 在 Railway 构建失败？
A: Nixpacks 已内置编译工具链。如仍失败，在 Railway Variables 中加 `PYTHON_VERSION=3.11` 后重新部署。

### Q: node-cron 定时任务在 Railway 不跑？
A: Railway 长驻进程支持 node-cron。若发现没触发，检查日志；定时任务是 `00:30 UTC+0`（即北京时间 08:30），如需调整改 [api/scheduler/birthday.ts](api/scheduler/birthday.ts)。

### Q: 首次部署后管理员账号是什么？
A: `admin / admin123`，**部署后请立即在 `/admin/users` 修改密码或创建新管理员并删除默认 admin**。

## 本地生产模式验证

```bash
npm run build
npm run start
# 访问 http://localhost:3000/
```

## 环境变量参考

| 变量 | 必需 | 默认值 | 说明 |
|---|---|---|---|
| `PORT` | 否 | 3000 | Railway 自动注入 |
| `DATA_DIR` | 是（生产） | `../data` | SQLite 持久化目录，必须指向 Railway Volume 挂载点 |

## 费用提示

- Railway 免费额度：每月 $5 信用额度，约 500 小时执行时间 + 5GB 存储
- 个人博客访问量小，基本不会超；超出后按用量计费（约 $0.000463/GB-hour）
- 想完全免费可考虑 Render（但 SQLite 不持久）或 Fly.io（需配置 volume）
