import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

/** 章节标题:眉标、大标题与描述 */
export default function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionTitleProps) {
  const isCenter = align === "center";

  return (
    <div
      className={cn(
        "mb-12",
        isCenter && "text-center",
        className
      )}
    >
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, x: isCenter ? 0 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={cn(
            "mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]",
            isCenter && "justify-center"
          )}
        >
          <span className="h-px w-8 bg-[var(--color-primary)]" />
          {eyebrow}
          {isCenter && (
            <span className="h-px w-8 bg-[var(--color-primary)]" />
          )}
        </motion.div>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-heading text-3xl font-bold text-[var(--text-primary)] sm:text-4xl md:text-5xl"
      >
        {title}
      </motion.h2>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={cn(
            "mt-4 max-w-2xl text-[var(--text-secondary)]",
            isCenter && "mx-auto"
          )}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
