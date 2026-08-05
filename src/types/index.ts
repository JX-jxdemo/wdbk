// ==================== 文章相关类型 ====================
export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string; // 霓虹色值
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown 内容
  cover: string; // 封面图 URL 或渐变标识
  category: string; // category id
  tags: string[];
  publishedAt: string; // ISO 日期
  readingTime: number; // 分钟
  views: number;
  featured: boolean;
}

// ==================== 项目相关类型 ====================
export interface Project {
  id: string;
  title: string;
  description: string;
  screenshot: string;
  techStack: string[];
  demoUrl?: string;
  repoUrl?: string;
  year: number;
  status: "live" | "archived" | "wip";
}

// ==================== 个人资料类型 ====================
export interface SocialLink {
  name: string;
  url: string;
  icon: string; // lucide 图标名
  handle: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  org: string;
  description: string;
  type: "work" | "education" | "milestone";
}

export interface Skill {
  name: string;
  level: number; // 0-100
  category: "frontend" | "backend" | "design" | "tools";
}

export interface Profile {
  name: string;
  alias: string;
  bio: string;
  avatar: string;
  location: string;
  roles: string[]; // 打字机轮播的角色
  socials: SocialLink[];
  timeline: TimelineItem[];
  skills: Skill[];
  stats: {
    articles: number;
    views: number;
    projects: number;
    years: number;
  };
}

// ==================== 路由导航项 ====================
export interface NavItem {
  label: string;
  path: string;
  icon: string;
}
