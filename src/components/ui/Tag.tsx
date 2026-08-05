import { cn } from "@/lib/utils";

interface TagProps {
  children: React.ReactNode;
  color?: "cyan" | "magenta" | "purple" | "green" | "amber" | "muted";
  className?: string;
  onClick?: () => void;
  active?: boolean;
}

const colorMap = {
  cyan: "border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10",
  magenta: "border-neon-magenta/40 text-neon-magenta hover:bg-neon-magenta/10",
  purple: "border-neon-purple/40 text-neon-purple hover:bg-neon-purple/10",
  green: "border-neon-green/40 text-neon-green hover:bg-neon-green/10",
  amber: "border-neon-amber/40 text-neon-amber hover:bg-neon-amber/10",
  muted: "border-white/10 text-ink-muted hover:text-white hover:border-white/30",
};

export default function Tag({
  children,
  color = "muted",
  className,
  onClick,
  active = false,
}: TagProps) {
  const Comp = onClick ? "button" : "span";

  return (
    <Comp
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded border px-2.5 py-1 font-mono text-xs transition-all duration-200",
        colorMap[color],
        active && "bg-neon-cyan/15 shadow-neon-cyan",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </Comp>
  );
}
