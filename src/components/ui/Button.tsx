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
    "bg-neon-cyan text-base-900 hover:shadow-neon-cyan hover:brightness-110",
  ghost:
    "text-ink-muted hover:text-neon-cyan hover:bg-neon-cyan/5",
  outline:
    "border border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10 hover:border-neon-cyan hover:shadow-neon-cyan",
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
