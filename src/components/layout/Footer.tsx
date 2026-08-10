import { Link } from "react-router-dom";
import { Github, Mail } from "lucide-react";

const socials = [
  { name: "GitHub", url: "https://github.com/JX-jxdemo/wdbk", icon: Github },
  { name: "Email", url: "mailto:3922893004@qq.com", icon: Mail },
];

export default function Footer() {
  return (
    <footer
      className="border-t border-[var(--color-border)]"
      style={{ background: "var(--color-surface-2)" }}
    >
      <div className="container py-10">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <Link
              to="/"
              className="font-heading text-lg font-bold tracking-wider"
              style={{ color: "var(--text-primary)" }}
            >
              NEON
              <span style={{ color: "var(--color-primary)" }}>.DEV</span>
            </Link>
            <p
              className="mt-2 max-w-sm text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              在代码与设计的交汇处，构建数字未来。
            </p>
          </div>

          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-11 items-center justify-center rounded-lg border transition-colors duration-200 hover:border-[var(--color-primary)]"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--text-muted)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--color-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text-muted)";
                }}
                aria-label={s.name}
              >
                <s.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <div
          className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-6 text-xs sm:flex-row"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--text-faint)",
          }}
        >
          <p>© 2026 NEON.DEV — 用心与代码构建</p>
          <p>v2.0.26</p>
        </div>
      </div>
    </footer>
  );
}