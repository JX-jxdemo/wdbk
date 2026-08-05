import { Link } from "react-router-dom";
import { Github, Twitter, Mail, BookOpen } from "lucide-react";

const socials = [
  { name: "GitHub", url: "https://github.com", icon: Github },
  { name: "Twitter", url: "https://twitter.com", icon: Twitter },
  { name: "Email", url: "mailto:hello@neon.dev", icon: Mail },
  { name: "掘金", url: "https://juejin.cn", icon: BookOpen },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-[var(--color-border)] bg-base-900/80">
      <div className="container py-12">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* 品牌 */}
          <div className="text-center md:text-left">
            <Link to="/" className="font-display text-xl font-bold text-white">
              NEON<span className="text-neon-cyan">.DEV</span>
            </Link>
            <p className="mt-2 max-w-sm text-sm text-ink-faint">
              在代码与霓虹的交汇处,构建数字未来。
            </p>
          </div>

          {/* 社交链接 */}
          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass glass-hover flex h-11 w-11 items-center justify-center rounded-lg text-ink-muted transition-colors hover:text-neon-cyan"
                aria-label={s.name}
              >
                <s.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        {/* 分割线 */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent" />

        {/* 底部信息 */}
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-ink-faint sm:flex-row">
          <p className="font-mono">
            © 2026 NEON.DEV — 用 <span className="text-neon-magenta">♥</span> 与代码构建
          </p>
          <p className="font-mono">SYSTEM ONLINE · v2.0.26</p>
        </div>
      </div>
    </footer>
  );
}
