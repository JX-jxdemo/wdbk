import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, X, Cake } from "lucide-react";
import { apiFetch } from "@/contexts/AuthContext";
import { useSite } from "@/contexts/SiteContext";
import { cn } from "@/lib/utils";

export interface Notice {
  id: number;
  title: string;
  content: string;
  noticeType: "manual" | "birthday";
  userId: number | null;
  startAt: string;
  endAt: string;
  priority: number;
  isPinned: boolean;
  status: number;
  createdAt: string;
}

const CLOSED_KEY = "neon_closed_notices";

function getClosedToday(): number[] {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const raw = JSON.parse(localStorage.getItem(CLOSED_KEY) || "{}");
    if (raw.date !== today) return [];
    return Array.isArray(raw.ids) ? raw.ids : [];
  } catch {
    return [];
  }
}

function closeNotice(id: number) {
  const today = new Date().toISOString().slice(0, 10);
  const ids = getClosedToday();
  if (!ids.includes(id)) ids.push(id);
  localStorage.setItem(CLOSED_KEY, JSON.stringify({ date: today, ids }));
}

export function useNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [closed, setClosed] = useState<number[]>(() => getClosedToday());
  const { status } = useSite();

  const refresh = () => {
    if (status.noticeModuleEnabled === false) {
      setNotices([]);
      return;
    }
    apiFetch<{ notices: Notice[] }>("/notice").then((r) => {
      setNotices(r.notices);
    });
  };

  useEffect(() => {
    refresh();
  }, [status.noticeModuleEnabled]);

  const visible = notices.filter((n) => !closed.includes(n.id));

  const dismiss = (id: number) => {
    closeNotice(id);
    setClosed(getClosedToday());
  };

  return { notices: visible, refresh, dismiss };
}

export default function NoticeBanner() {
  const { notices, dismiss } = useNotices();
  const banner = notices[0];

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--notice-banner-h",
      banner ? "40px" : "0px"
    );
    return () => {
      document.documentElement.style.setProperty("--notice-banner-h", "0px");
    };
  }, [banner]);

  return (
    <AnimatePresence>
      {banner && (
        <motion.div
          key={banner.id}
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          className="fixed inset-x-0 top-0 z-[55] border-b border-[var(--color-border)] bg-base-900/95 backdrop-blur-md"
        >
          <div
            className={cn(
              "container flex items-center gap-3 py-2 text-sm",
              banner.noticeType === "birthday"
                ? "text-neon-magenta"
                : "text-neon-cyan"
            )}
          >
            <span className="flex-shrink-0">
              {banner.noticeType === "birthday" ? (
                <Cake className="h-4 w-4" />
              ) : (
                <Megaphone className="h-4 w-4" />
              )}
            </span>
            <span className="font-bold flex-shrink-0 whitespace-nowrap">
              {banner.title}
            </span>
            <div className="notice-marquee flex-1 overflow-hidden">
              <div className="notice-marquee-inner">
                <span className="whitespace-nowrap pr-12 text-ink-muted">
                  {banner.content}
                </span>
                <span className="whitespace-nowrap pr-12 text-ink-muted">
                  {banner.content}
                </span>
              </div>
            </div>
            <button
              onClick={() => dismiss(banner.id)}
              className="ml-auto flex-shrink-0 rounded p-1 text-ink-muted hover:text-white"
              aria-label="关闭公告"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
