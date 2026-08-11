import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { profile } from "@/data/profile";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* 全屏视频背景 - 固定不动（使用 portal 式的 fixed 定位，不受父级 stacking context 影响） */}
      <video
        className="fixed inset-0 z-0 h-[100dvh] w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/bg.mp4" type="video/mp4" />
      </video>
      {/* 渐变遮罩 - 在视频之上 */}
      <div className="fixed inset-0 z-[1] bg-gradient-to-b from-black/60 via-black/30 to-black/70 pointer-events-none" />

      {/* Canvas 樱花粒子层 - 在遮罩之上 */}
      <CherryBlossomCanvas />

      {/* 内容 - 在最上层 */}
      <div className="relative z-20 flex min-h-[85dvh] flex-col items-center justify-center px-4 py-20 text-center sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-sm tracking-[0.3em] text-white/70"
        >
          NEON.DEV 的记忆终端
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="max-w-4xl font-heading text-4xl font-black leading-tight text-white drop-shadow-2xl sm:text-6xl md:text-7xl lg:text-8xl"
        >
          <span className="block text-gradient-glow">NEON.DEV</span>
          <span className="mt-2 block text-2xl font-medium tracking-wide text-white/80 sm:text-4xl md:text-5xl">
            记忆终端
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg"
        >
          {profile.bio}
        </motion.p>

        {/* 搜索栏 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 w-full max-w-xl"
        >
          <div className="group relative flex items-center rounded-full border border-white/20 bg-white/10 py-3 pl-5 pr-1.5 backdrop-blur-xl transition-all focus-within:border-white/50 focus-within:bg-white/15">
            <Search className="mr-3 h-5 w-5 shrink-0 text-white/50" />
            <input
              type="text"
              placeholder="搜索文章、标签或分类..."
              className="flex-1 bg-transparent text-white placeholder-white/40 outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const q = (e.target as HTMLInputElement).value.trim();
                  if (q) window.location.href = `/blog?q=${encodeURIComponent(q)}`;
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.querySelector<HTMLInputElement>(
                  'input[placeholder*="搜索"]'
                );
                const q = input?.value.trim();
                if (q) window.location.href = `/blog?q=${encodeURIComponent(q)}`;
              }}
              className="ml-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white transition-all hover:bg-white/30"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* 快捷分类 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
        >
          {[
            { label: "前端", path: "/blog?cat=frontend" },
            { label: "设计", path: "/blog?cat=design" },
            { label: "工程", path: "/blog?cat=engineering" },
            { label: "随想", path: "/blog?cat=thoughts" },
          ].map((tag) => (
            <Link
              key={tag.label}
              to={tag.path}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white/70 backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10 hover:text-white"
            >
              {tag.label}
            </Link>
          ))}
        </motion.div>
      </div>

      {/* 底部渐隐过渡 - 在内容层下但盖住视频，过渡到下一个section的半透明毛玻璃色 */}
      <div className="relative z-20 h-24 bg-gradient-to-b from-transparent to-[rgba(30,41,59,0.55)]" />
    </section>
  );
}

/** Canvas 樱花粒子 */
function CherryBlossomCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    interface Petal {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      angle: number;
      va: number;
      opacity: number;
    }

    const petals: Petal[] = [];
    const PETAL_COUNT = window.innerWidth < 768 ? 15 : 30;

    const create = (init = false): Petal => ({
      x: Math.random() * canvas.width,
      y: init ? Math.random() * canvas.height : -20,
      size: 4 + Math.random() * 7,
      vx: -0.5 + Math.random() * 1,
      vy: 0.3 + Math.random() * 0.6,
      angle: Math.random() * Math.PI * 2,
      va: -0.02 + Math.random() * 0.04,
      opacity: 0.3 + Math.random() * 0.5,
    });

    for (let i = 0; i < PETAL_COUNT; i++) petals.push(create(true));

    let frame = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      petals.forEach((p, i) => {
        p.y += p.vy;
        p.x += p.vx + Math.sin(frame * 0.015 + i) * 0.4;
        p.angle += p.va;

        if (p.y > canvas.height + 20) petals[i] = create(false);
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = p.opacity;

        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
        grad.addColorStop(0, "rgba(255,220,235,0.9)");
        grad.addColorStop(1, "rgba(255,170,200,0.1)");
        ctx.fillStyle = grad;

        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(
          p.size * 0.5, -p.size * 0.5,
          p.size * 0.5, p.size * 0.5,
          0, p.size
        );
        ctx.bezierCurveTo(
          -p.size * 0.5, p.size * 0.5,
          -p.size * 0.5, -p.size * 0.5,
          0, -p.size
        );
        ctx.fill();
        ctx.restore();
      });

      raf = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[5]"
    />
  );
}
