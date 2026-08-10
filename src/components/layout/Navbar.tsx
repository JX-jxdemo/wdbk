import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSite } from "@/contexts/SiteContext";
import AccountMenu from "@/components/account/AccountMenu";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { status } = useSite();

  const navItems = useMemo(() => {
    const items = [
      { label: "首页", path: "/" },
      { label: "博客", path: "/blog" },
      { label: "资源仓库", path: "/resources" },
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
        style={{ top: "var(--notice-banner-h, 0px)", background: scrolled ? "#1e293b" : "rgba(30,41,59,0.3)", transition: "background 0.3s ease" }}
        className={cn(
          "fixed inset-x-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-[var(--color-border)] py-3 backdrop-blur-md"
            : "border-b border-transparent py-5 backdrop-blur-sm"
        )}
      >
        <nav
          className="container flex items-center justify-between gap-4"
        >
          <Link to="/" className="flex items-center gap-2">
            <span
              className="font-heading text-xl font-bold tracking-wider"
              style={{ color: "var(--text-primary)" }}
            >
              NEON
              <span style={{ color: "var(--color-primary)" }}>.DEV</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {navItems.map((item: any) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "relative px-4 py-2 text-sm transition-colors duration-200",
                    isActive(item.path)
                      ? ""
                      : "hover:text-[var(--color-primary)]"
                  )}
                  style={{
                    color: isActive(item.path)
                      ? "var(--color-primary)"
                      : "var(--text-secondary)",
                  }}
                >
                  {item.label}
                  {isActive(item.path) && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-2 -bottom-px h-px"
                      style={{ background: "var(--color-primary)" }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <AccountMenu />
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border md:hidden"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-primary)",
              }}
              aria-label="切换菜单"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 backdrop-blur-xl"
              style={{ background: "rgba(0,0,0,0.5)" }}
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
                    onClick={() => setMenuOpen(false)}
                    className="glass block rounded-xl px-6 py-4 text-lg transition-colors"
                    style={{
                      color: isActive(item.path)
                        ? "var(--color-primary)"
                        : "var(--text-secondary)",
                    }}
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