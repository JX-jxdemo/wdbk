import type { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "1",
    title: "NEON OS",
    description:
      "一个基于 Web 的赛博朋克风格桌面环境,包含窗口管理器、终端、文件系统模拟与多个内置应用,支持拖拽、缩放与多任务。",
    screenshot: "gradient-cyan-purple",
    techStack: ["React", "TypeScript", "Zustand", "Framer Motion", "Tailwind"],
    demoUrl: "https://example.com/neon-os",
    repoUrl: "https://github.com/example/neon-os",
    year: 2026,
    status: "live",
  },
  {
    id: "2",
    title: "Pixel Forge",
    description:
      "在线像素艺术编辑器,支持图层、动画帧、调色板管理与导出 GIF/PNG。纯前端实现,离线可用。",
    screenshot: "gradient-magenta-purple",
    techStack: ["React", "Canvas", "IndexedDB", "Web Workers"],
    demoUrl: "https://example.com/pixel-forge",
    repoUrl: "https://github.com/example/pixel-forge",
    year: 2025,
    status: "live",
  },
  {
    id: "3",
    title: "CodeStream",
    description:
      "实时代码协作编辑器,支持多人光标、语音通话、语法高亮与版本对比。基于 CRDT 实现冲突自动合并。",
    screenshot: "gradient-green-cyan",
    techStack: ["React", "WebSocket", "CRDT", "Monaco Editor", "WebRTC"],
    demoUrl: "https://example.com/codestream",
    repoUrl: "https://github.com/example/codestream",
    year: 2025,
    status: "live",
  },
  {
    id: "4",
    title: "Synthwave Player",
    description:
      "Web Audio API 驱动的可视化音乐播放器,频谱分析与粒子效果实时响应音频,支持播放列表与均衡器。",
    screenshot: "gradient-purple-magenta",
    techStack: ["React", "Web Audio API", "Canvas", "GLSL"],
    demoUrl: "https://example.com/synthwave",
    repoUrl: "https://github.com/example/synthwave",
    year: 2025,
    status: "archived",
  },
  {
    id: "5",
    title: "DevDash",
    description:
      "开发者仪表盘聚合工具,集成 GitHub、CI/CD、监控告警于一体,可自定义 Widget 布局与数据源。",
    screenshot: "gradient-amber-cyan",
    techStack: ["React", "TypeScript", "D3.js", "GraphQL"],
    demoUrl: "https://example.com/devdash",
    repoUrl: "https://github.com/example/devdash",
    year: 2026,
    status: "wip",
  },
  {
    id: "6",
    title: "Neural Canvas",
    description:
      "基于 TensorFlow.js 的浏览器端图像风格迁移工具,支持实时预览、风格强度调节与批次处理。",
    screenshot: "gradient-cyan-green",
    techStack: ["React", "TensorFlow.js", "WebGL", "Canvas"],
    demoUrl: "https://example.com/neural-canvas",
    repoUrl: "https://github.com/example/neural-canvas",
    year: 2024,
    status: "live",
  },
];
