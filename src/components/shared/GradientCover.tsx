import { cn } from "@/lib/utils";

const gradients: Record<string, string> = {
  "gradient-cyan-purple": "from-sky-400 via-sky-500 to-indigo-500",
  "gradient-magenta-purple": "from-pink-400 via-purple-500 to-indigo-500",
  "gradient-cyan-green": "from-sky-400 via-teal-400 to-emerald-500",
  "gradient-purple-cyan": "from-purple-400 via-sky-400 to-cyan-400",
  "gradient-amber-magenta": "from-amber-400 via-pink-400 to-rose-500",
  "gradient-green-cyan": "from-emerald-400 via-teal-400 to-sky-400",
  "gradient-purple-magenta": "from-violet-400 via-fuchsia-400 to-pink-400",
  "gradient-cyan-magenta": "from-sky-400 via-pink-400 to-rose-400",
  "gradient-amber-cyan": "from-amber-400 via-sky-400 to-cyan-400",
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
        "relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-gradient-to-br",
        gradient,
        className
      )}
    >
      <div className="absolute inset-0 bg-white/10 dark:bg-white/5" />
      {children}
    </div>
  );
}