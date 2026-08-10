import type { Profile } from "@/types";

export const profile: Profile = {
  name: "金·星",
  alias: "NEON_DEV",
  bio: "计算机应用技术在读 / 前端开发学习者 / 开源爱好者。在代码与设计的交汇处探索可能性,相信优秀的产品诞生于工程严谨与艺术直觉的平衡。",
  avatar: "gradient-cyan-magenta",
  location: "河南 · 中国",
  roles: [
    "前端开发学习者",
    "交互设计爱好者",
    "开源贡献者",
    "全栈探索者",
  ],
  socials: [
    { name: "GitHub", url: "https://github.com/JX-jxdemo/wdbk", icon: "Github", handle: "@JX-jxdemo" },
    { name: "Email", url: "mailto:3922893004@qq.com", icon: "Mail", handle: "3922893004@qq.com" },
  ],
  timeline: [
    {
      year: "2026",
      title: "独立开发者",
      org: "个人项目",
      description: "开始独立开发个人博客系统,探索全栈技术与交互设计。",
      type: "milestone",
    },
    {
      year: "2025 - 2026",
      title: "前端开发学习",
      org: "自学",
      description: "系统学习 React、TypeScript 等前端技术栈,完成多个练手项目。",
      type: "work",
    },
    {
      year: "2024 - 2026",
      title: "计算机应用技术 · 在读",
      org: "高校",
      description: "系统学习计算机基础,对前端开发产生兴趣。",
      type: "education",
    },
  ],
  skills: [
    { name: "React", level: 75, category: "frontend" },
    { name: "TypeScript", level: 70, category: "frontend" },
    { name: "Vue.js", level: 60, category: "frontend" },
    { name: "Tailwind CSS", level: 72, category: "frontend" },
    { name: "Framer Motion", level: 55, category: "frontend" },
    { name: "Three.js", level: 40, category: "frontend" },
    { name: "Node.js", level: 58, category: "backend" },
    { name: "PostgreSQL", level: 45, category: "backend" },
    { name: "Figma", level: 62, category: "design" },
    { name: "Blender", level: 35, category: "design" },
    { name: "TRAE", level: 68, category: "tools" },
    { name: "IDE", level: 50, category: "tools" },
  ],
  stats: {
    articles: 8,
    views: 0,
    projects: 1,
    years: 2,
  },
};
