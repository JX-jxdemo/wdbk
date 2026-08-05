import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Terminal, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSite } from "@/contexts/SiteContext";
import AccountMenu from "@/components/account/AccountMenu";
import ThemeToggle from "@/components/account/ThemeToggle";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { status } = useSite();

  const navItems = useMemo(() => {
    const items = [
      { label: "首页", path: "/" },
      { label: "博客", path: "/blog" },
      { label: "项目", path: "/projects" },
      { label: "关于", path: "/about" },
    ];
    if (status.likeModuleEnabled) {
      items.splice(2, 0, {
        label: "好感空间",
        path: "/like",
        icon: Heart,
      } as any);
    }
    return items;
  }, [status.likeModuleEnabled]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 路由切换时关闭菜单
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ top: "var(--notice-banner-h, 0px)" }}
        className={cn(
          "fixed inset-x-0 z-50 transition-all duration-300",
          scrolled
            ? "glass border-b border-[var(--color-border)] py-3"
            : "border-b border-transparent py-5"
        )}
      >
        <nav className="container flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2">
            <span className="relative flex h-9 w-9 items-center justify-center rounded border border-neon-cyan/40 bg-neon-cyan/5">
              <Terminal className="h-5 w-5 text-neon-cyan" />
              <span className="absolute inset-0 rounded animate-pulse-glow border border-neon-cyan/20" />
            </span>
            <span className="font-display text-lg font-bold tracking-wider text-white">
              NEON<span className="text-neon-cyan">.DEV</span>
            </span>
          </Link>

          {/* 桌面导航 */}
          <ul className="hidden items-center gap-1 md:flex">
            {navItems.map((item: any) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "relative px-4 py-2 font-mono text-sm transition-colors",
                    isActive(item.path)
                      ? "text-neon-cyan"
                      : "text-ink-muted hover:text-white"
                  )}
                >
                  {item.label}
                  {isActive(item.path) && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-2 -bottom-px h-px bg-neon-cyan shadow-[0_0_8px_var(--neon-cyan)]"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* 右侧账号 + 主题 */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <AccountMenu />
            {/* 移动端汉堡按钮 */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded border border-[var(--color-border)] text-neon-cyan md:hidden"
              aria-label="切换菜单"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* 移动端菜单 */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-base-900/80 backdrop-blur-xl"
              onClick={() => setMenuOpen(false)}
            />
            <motion.ul
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ delay: 0.1 }}
              className="relative mx-6 mt-24 space-y-2"
            >
              {navItems.map((item: any, i) => (
                <motion.li
                  key={item.path}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                >
                  <Link
                    to={item.path}
                    className={cn(
                      "glass glass-hover block rounded-lg px-6 py-4 font-heading text-lg",
                      isActive(item.path)
                        ? "neon-text-cyan"
                        : "text-ink-muted"
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
