import { cn } from "@/lib/utils";

/**
 * 渐变封面组件
 * 根据 cover 标识渲染对应的霓虹渐变,用于文章/项目卡片
 */
const gradients: Record<string, string> = {
  "gradient-cyan-purple": "from-neon-cyan via-neon-purple to-base-900",
  "gradient-magenta-purple": "from-neon-magenta via-neon-purple to-base-900",
  "gradient-cyan-green": "from-neon-cyan via-neon-green to-base-900",
  "gradient-purple-cyan": "from-neon-purple via-neon-cyan to-base-900",
  "gradient-amber-magenta": "from-neon-amber via-neon-magenta to-base-900",
  "gradient-green-cyan": "from-neon-green via-neon-cyan to-base-900",
  "gradient-purple-magenta": "from-neon-purple via-neon-magenta to-base-900",
  "gradient-cyan-magenta": "from-neon-cyan via-neon-magenta to-base-900",
  "gradient-amber-cyan": "from-neon-amber via-neon-cyan to-base-900",
};

export default function GradientCover({
  cover,
  className,
  children,
}: {
  cover: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const gradient = gradients[cover] ?? gradients["gradient-cyan-purple"];

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br",
        gradient,
        className
      )}
    >
      {/* 网格纹理 */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      {/* 扫描线 */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 1px, transparent 1px, transparent 4px)",
        }}
      />
      {/* 光晕 */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
      <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-black/30 blur-2xl" />
      {children}
    </div>
  );
}
