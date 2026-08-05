import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const JWT_SECRET = "neon-dev-blog-secret-2026";
export const JWT_EXPIRES_IN = "7d";

export interface JwtPayload {
  uid: number;
  username: string;
  role: "admin" | "user";
}

// 从请求中解析 token，挂在 req.user 上（不强制）
export function parseUser(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (token) {
    try {
      (req as any).user = jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
      (req as any).user = null;
    }
  } else {
    (req as any).user = null;
  }
  next();
}

// 强制登录
export function requireLogin(req: Request, res: Response, next: NextFunction) {
  if (!(req as any).user) {
    return res.status(401).json({ error: "未登录" });
  }
  next();
}

// 仅管理员
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const u = (req as any).user as JwtPayload | null;
  if (!u) return res.status(401).json({ error: "未登录" });
  if (u.role !== "admin") return res.status(403).json({ error: "需要管理员权限" });
  next();
}

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
