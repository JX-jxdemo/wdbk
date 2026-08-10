import { cn } from "@/lib/utils";

interface TagProps {
  children: React.ReactNode;
  color?: "cyan" | "magenta" | "purple" | "green" | "amber" | "muted";
  className?: string;
  onClick?: () => void;
  active?: boolean;
}

const colorMap = {
  cyan: "border-[var(--color-primary)]/40 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10",
  magenta: "border-[#f97316]/40 text-[#f97316] hover:bg-[#f97316]/10",
  purple: "border-[#8b5cf6]/40 text-[#8b5cf6] hover:bg-[#8b5cf6]/10",
  green: "border-[#22c55e]/40 text-[#22c55e] hover:bg-[#22c55e]/10",
  amber: "border-[#f59e0b]/40 text-[#f59e0b] hover:bg-[#f59e0b]/10",
  muted: "border-[var(--color-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--color-border-hover)]",
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
        active && "bg-[var(--color-primary)]/15",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </Comp>
  );
}
