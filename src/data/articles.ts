import type { Article, Category } from "@/types";

// ==================== 分类 ====================
export const categories: Category[] = [
  { id: "frontend", name: "前端工程", slug: "frontend", color: "var(--color-primary)" },
  { id: "design", name: "设计美学", slug: "design", color: "#f97316" },
  { id: "engineering", name: "工程实践", slug: "engineering", color: "#8b5cf6" },
  { id: "thoughts", name: "随想杂谈", slug: "thoughts", color: "#22c55e" },
];

// ==================== 文章列表 ====================
export const articles: Article[] = [
  {
    id: "1",
    slug: "cyberpunk-web-design",
    title: "赛博朋克 Web 设计:在浏览器中构建霓虹未来",
    excerpt:
      "从色彩系统、玻璃拟态到动态网格,探索如何用纯 CSS 与 React 打造一个充满未来感的赛博朋克风格网站。涵盖霓虹发光、扫描线、噪点纹理等核心技术。",
    content: `## 为什么选择赛博朋克

赛博朋克美学不仅仅是视觉风格,它是一种对未来的态度——高技术与低生活的碰撞,霓虹灯在雨夜中折射,数据流穿梭于钢铁丛林。在 Web 设计中,这种风格能够瞬间抓住访客的注意力。

### 核心视觉要素

一个合格的赛博朋克界面需要以下几个关键要素:

- **深邃的暗色背景**:不是纯黑,而是带有蓝紫色调的深色,营造夜幕感
- **霓虹强调色**:青色、品红、紫色构成的光影三原色
- **玻璃拟态**:半透明、模糊、微光边框,模拟全息投影
- **扫描线与噪点**:模拟 CRT 显示器的复古质感

## 色彩系统搭建

使用 CSS 变量统一管理霓虹色彩,确保全站一致性:

\`\`\`css
:root {
  --neon-cyan: #00f0ff;
  --neon-magenta: #ff006e;
  --neon-purple: #7c3aed;
}
\`\`\`

> 色彩的关键不在于多,而在于对比。一个深邃的底色配上两三个高饱和度的霓虹色,远比彩虹般的配色更有冲击力。

## 霓虹发光效果

文字与边框的发光效果是赛博朋克风格的灵魂。通过 \`text-shadow\` 多层叠加实现真实的辉光感:

\`\`\`css
.neon-text {
  color: var(--neon-cyan);
  text-shadow: 
    0 0 8px rgba(0, 240, 255, 0.6),
    0 0 20px rgba(0, 240, 255, 0.3);
}
\`\`\`

### 关键技巧

1. 使用多层 \`text-shadow\`,从近到远逐渐减弱透明度
2. \`box-shadow\` 同理可实现边框发光
3. 悬停时增强发光强度,提供交互反馈

## 动态网格背景

网格是赛博朋克的空间隐喻——数字世界的坐标系。用两条线性渐变叠加即可实现:

\`\`\`css
.bg-grid {
  background-image: 
    linear-gradient(rgba(0,240,255,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,240,255,0.05) 1px, transparent 1px);
  background-size: 48px 48px;
}
\`\`\`

配合缓慢的位移动画,网格仿佛在流动,赋予页面生命力。

## 性能与可访问性

炫酷不等于牺牲体验。在实现赛博朋克风格时需要注意:

- **减少动画**:尊重用户的 \`prefers-reduced-motion\` 设置
- **对比度**:霓虹色在暗背景上需保证足够的文字对比度
- **触屏适配**:移动端关闭自定义光标与复杂悬停效果

## 结语

赛博朋克 Web 设计是技术与美学的融合。当霓虹光芒在浏览器中亮起,我们不仅是在展示内容,更是在传递一种对未来数字世界的想象。

> 未来已来,只是分布不均。`,
    cover: "gradient-cyan-purple",
    category: "design",
    tags: ["CSS", "设计系统", "赛博朋克", "React"],
    publishedAt: "2026-07-28",
    readingTime: 8,
    views: 2847,
    featured: true,
  },
  {
    id: "2",
    slug: "react-18-concurrent-features",
    title: "深入 React 18 并发特性:从 useTransition 到 Suspense",
    excerpt:
      "React 18 的并发渲染机制重塑了我们构建用户界面的方式。本文深入剖析 useTransition、useDeferredValue 与 Suspense 的工作原理及实战场景。",
    content: `## 并发渲染:React 18 的核心革命

React 18 引入的并发特性不是新 API 那么简单,它是对渲染机制的重新设计。在传统模式下,React 一旦开始渲染就无法中断;并发模式下,渲染可以被暂停、中断甚至放弃。

### useTransition:优雅处理紧急与非紧急更新

\`\`\`tsx
import { useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('home');

  const switchTab = (next) => {
    startTransition(() => {
      setTab(next);
    });
  };

  return (
    <>
      <button onClick={() => switchTab('settings')}>设置</button>
      {isPending && <Spinner />}
      <Content tab={tab} />
    </>
  );
}
\`\`\`

> 关键洞察:\`useTransition\` 将状态更新标记为"非紧急",让 React 优先处理用户输入等高优先级交互。

### useDeferredValue:延迟重渲染

与 \`useTransition\` 侧重于状态更新不同,\`useDeferredValue\` 侧重于延迟某个值的传递:

\`\`\`tsx
function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query);
  // deferredQuery 滞后于 query,避免每次输入都触发昂贵搜索
  const results = useMemo(() => search(deferredQuery), [deferredQuery]);
  return <List items={results} />;
}
\`\`\`

## Suspense:声明式加载状态

Suspense 让数据获取与渲染解耦,你只需声明"我需要什么",加载状态交给 Suspense 处理:

\`\`\`tsx
<Suspense fallback={<Skeleton />}>
  <ArticleList />
  <Suspense fallback={<Spinner />}>
    <Comments />
  </Suspense>
</Suspense>
\`\`\`

### 嵌套 Suspense 的优势

- 各组件独立加载,不互相阻塞
- 已加载内容保持可见,避免闪烁
- 配合 Stream SSR 实现渐进式 hydration

## 实战注意事项

1. **不要滥用并发**:简单场景无需 \`useTransition\`,默认行为已足够
2. **避免在 transition 中执行副作用**:并发渲染可能中断,副作用可能多次执行
3. **配合 memo 使用**:\`useDeferredValue\` 需要子组件被 \`memo\` 包裹才能发挥效果

## 结语

并发特性让 React 在复杂场景下依然保持流畅。理解其背后的优先级调度模型,才能真正发挥它的威力。`,
    cover: "gradient-magenta-purple",
    category: "frontend",
    tags: ["React", "并发", "性能优化"],
    publishedAt: "2026-07-20",
    readingTime: 10,
    views: 3921,
    featured: true,
  },
  {
    id: "3",
    slug: "framer-motion-animations",
    title: "Framer Motion 实战:打造丝滑的页面动效系统",
    excerpt:
      "从页面过渡、滚动触发到微交互,Framer Motion 让 React 动画变得声明式且高性能。本文分享一套可复用的动效系统设计思路。",
    content: `## 为什么选择 Framer Motion

在 React 生态中,Framer Motion 是最优雅的动画方案。它声明式的 API 让动画像写样式一样简单,同时基于浏览器原生动画引擎,性能出色。

### 核心概念

\`\`\`tsx
import { motion } from 'framer-motion';

// 声明式动画
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: 'easeOut' }}
/>
\`\`\`

## 滚动触发动画

\`whileInView\` 是最常用的滚动触发 API:

\`\`\`tsx
<motion.section
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-100px' }}
  transition={{ duration: 0.6 }}
>
  内容
</motion.section>
\`\`\`

> \`viewport.once\` 设为 true 确保动画只播放一次,避免来回滚动时的重复闪烁。

### 错位淡入:列表的高级感

通过 \`staggerChildren\` 实现子元素逐个登场:

\`\`\`tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.ul variants={container} initial="hidden" animate="show">
  {items.map(i => (
    <motion.li key={i.id} variants={item}>{i.name}</motion.li>
  ))}
</motion.ul>
\`\`\`

## 页面过渡

配合 \`AnimatePresence\` 实现路由切换动画:

\`\`\`tsx
<AnimatePresence mode="wait">
  <motion.div
    key={location.pathname}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
</AnimatePresence>
\`\`\`

## 性能优化技巧

1. **优先 transform 与 opacity**:这两个属性不触发重排
2. **使用 \`will-change\`**:提前告知浏览器即将变化的属性
3. **避免动画布局属性**:\`width\`、\`height\`、\`top\` 等会导致重排

## 结语

好的动画不是炫技,而是引导注意力、提供反馈、建立空间感。Framer Motion 让这一切变得简单而优雅。`,
    cover: "gradient-cyan-green",
    category: "frontend",
    tags: ["Framer Motion", "动画", "React", "UX"],
    publishedAt: "2026-07-12",
    readingTime: 7,
    views: 2156,
    featured: true,
  },
  {
    id: "4",
    slug: "tailwind-design-system",
    title: "用 Tailwind CSS 构建可维护的设计系统",
    excerpt:
      "Tailwind 不只是工具类集合,它可以是设计系统的骨架。本文分享如何通过主题扩展、组件抽象与约定规范,打造团队级的设计系统。",
    content: `## Tailwind 作为设计系统基础

很多人把 Tailwind 当成快捷写样式的工具,但它真正的价值在于强制约束设计 Token。

### 主题扩展:定义设计语言

\`\`\`js
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: '#00f0ff',
          magenta: '#ff006e',
        }
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
      }
    }
  }
}
\`\`\`

> 一旦在 config 中定义了色彩与字号,全站就只能使用这些值。这就是设计系统的本质——约束带来一致性。

## 组件抽象

用 \`@layer components\` 封装可复用模式:

\`\`\`css
@layer components {
  .btn-neon {
    @apply px-6 py-2 border border-neon-cyan text-neon-cyan;
    @apply transition-all duration-300 hover:bg-neon-cyan hover:text-black;
    @apply hover:shadow-neon-cyan;
  }
}
\`\`\`

## 与 React 组件结合

\`\`\`tsx
function Button({ variant = 'primary', ...props }) {
  const variants = {
    primary: 'btn-neon',
    ghost: 'border border-white/10 hover:border-white/30',
  };
  return <button className={cn(variants[variant])} {...props} />;
}
\`\`\`

## 结语

设计系统不是文档,而是约束。Tailwind 通过配置驱动的方式,让约束成为默认。`,
    cover: "gradient-purple-cyan",
    category: "engineering",
    tags: ["Tailwind", "设计系统", "CSS"],
    publishedAt: "2026-07-05",
    readingTime: 6,
    views: 1834,
    featured: false,
  },
  {
    id: "5",
    slug: "vite-build-optimization",
    title: "Vite 构建优化:从 30 秒到 3 秒的进阶之路",
    excerpt:
      "大型项目的 Vite 构建可能随代码量增长而变慢。本文分享一系列经过实战验证的优化手段,包括依赖分包、按需加载与缓存策略。",
    content: `## 诊断构建瓶颈

在优化前,先用 \`vite build --debug\` 分析各阶段耗时。常见瓶颈:依赖预构建、大型 chunk、source map 生成。

### 手动分包

\`\`\`ts
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'motion-vendor': ['framer-motion'],
        }
      }
    }
  }
})
\`\`\`

> 将稳定的第三方依赖单独分包,利用浏览器长期缓存,避免业务代码变更导致缓存失效。

## 结语

构建优化是一个持续的过程,关键是建立度量基准,每次改动后对比。`,
    cover: "gradient-amber-magenta",
    category: "engineering",
    tags: ["Vite", "构建优化", "性能"],
    publishedAt: "2026-06-28",
    readingTime: 9,
    views: 2745,
    featured: false,
  },
  {
    id: "6",
    slug: "typescript-advanced-types",
    title: "TypeScript 高级类型:类型体操实战指南",
    excerpt:
      "从条件类型、映射类型到模板字面量类型,掌握 TypeScript 类型系统的高级用法,让你的代码既安全又灵活。",
    content: `## 条件类型

\`\`\`ts
type IsString<T> = T extends string ? true : false;

type A = IsString<'hello'>; // true
type B = IsString<42>; // false
\`\`\`

## 映射类型

\`\`\`ts
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

type ReadonlyObj = { readonly name: string };
type MutableObj = Mutable<ReadonlyObj>; // { name: string }
\`\`\`

## 结语

类型体操不是为了炫技,而是为了在编译期消除更多潜在错误。适度使用,保持可读性。`,
    cover: "gradient-green-cyan",
    category: "frontend",
    tags: ["TypeScript", "类型系统"],
    publishedAt: "2026-06-20",
    readingTime: 11,
    views: 3567,
    featured: false,
  },
  {
    id: "7",
    slug: "minimalism-in-design",
    title: "极简主义的边界:何时少即是多,何时不是",
    excerpt:
      "极简设计不等于留白。本文探讨极简主义的真正内核——信息层级的精确控制,以及它在不同场景下的适用边界。",
    content: `## 极简不等于空白

真正的极简主义是**精确**——每一个元素都有存在的理由,每一处留白都有目的。

### 信息层级的控制

极简设计的核心是清晰的视觉层级:

1. **primary**:用户当前最需要的信息
2. **secondary**:辅助理解的内容
3. **tertiary**:可选的补充信息

## 何时克制,何时表达

> 工具类产品应克制,内容型产品可表达。

阅读器需要安静,但个人博客可以张扬——因为它本身就是作者个性的延伸。

## 结语

极简是一种态度,不是教条。理解其原则,然后根据场景灵活运用。`,
    cover: "gradient-magenta-amber",
    category: "thoughts",
    tags: ["设计哲学", "极简主义"],
    publishedAt: "2026-06-15",
    readingTime: 5,
    views: 1289,
    featured: false,
  },
  {
    id: "8",
    slug: "css-container-queries",
    title: "CSS 容器查询:响应式设计的范式转移",
    excerpt:
      "容器查询让组件根据自身尺寸而非视口尺寸响应,这是响应式设计的重大进化。本文介绍其用法与实战价值。",
    content: `## 从媒体查询到容器查询

媒体查询基于视口,容器查询基于容器:

\`\`\`css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}
\`\`\`

> 这意味着同一个组件在不同位置(侧边栏 vs 主内容区)可以呈现不同布局,真正实现组件级响应式。

## 实战场景

- **卡片组件**:在窄容器中垂直堆叠,宽容器中水平排列
- **导航**:根据父容器宽度切换展开/折叠
- **网格**:列数随容器宽度自适应

## 浏览器支持

容器查询已获所有主流浏览器支持,可以放心使用。

## 结语

容器查询让组件真正成为独立、自适应的单元,这是响应式设计的未来。`,
    cover: "gradient-cyan-purple",
    category: "frontend",
    tags: ["CSS", "响应式", "容器查询"],
    publishedAt: "2026-06-08",
    readingTime: 6,
    views: 1942,
    featured: false,
  },
];

// ==================== 辅助查询函数 ====================
export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getFeaturedArticles(): Article[] {
  return articles.filter((a) => a.featured);
}

export function getAdjacentArticles(currentId: string): {
  prev: Article | undefined;
  next: Article | undefined;
} {
  const index = articles.findIndex((a) => a.id === currentId);
  return {
    prev: index > 0 ? articles[index - 1] : undefined,
    next: index < articles.length - 1 ? articles[index + 1] : undefined,
  };
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  articles.forEach((a) => a.tags.forEach((t) => tags.add(t)));
  return Array.from(tags);
}
