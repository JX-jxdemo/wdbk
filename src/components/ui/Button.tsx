import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "ghost" | "outline";
  to?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
}

const baseStyles =
  "inline-flex items-center justify-center gap-2 px-6 py-3 font-mono text-sm font-medium tracking-wide transition-all duration-300";

const variants = {
  primary:
    "bg-[var(--color-primary)] text-[var(--color-bg)] hover:shadow-card-hover hover:brightness-110",
  ghost:
    "text-[var(--text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5",
  outline:
    "border border-[var(--color-primary)]/40 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 hover:border-[var(--color-primary)] hover:shadow-card-hover",
};

export default function Button({
  children,
  variant = "primary",
  to,
  href,
  onClick,
  className,
  icon,
}: ButtonProps) {
  const content = (
    <>
      {children}
      {icon}
    </>
  );

  const classes = cn(baseStyles, variants[variant], className);

  if (to) {
    return (
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Link to={to} className={classes}>
          {content}
        </Link>
      </motion.div>
    );
  }

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className={classes}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {content}
    </motion.button>
  );
}
