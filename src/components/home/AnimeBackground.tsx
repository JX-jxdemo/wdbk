import { useEffect, useRef } from "react";

/**
 * 二次元风格动态背景
 * - Canvas 樱花花瓣飘落
 * - CSS 流动云层
 * - 远山剪影
 * - 柔光粒子
 */
export default function AnimeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // ---- 樱花花瓣 ----
    interface Petal {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      angle: number;
      angleSpeed: number;
      opacity: number;
      swayAmp: number;
      swayPhase: number;
    }

    const PETAL_COUNT = 35;
    const petals: Petal[] = [];

    const createPetal = (initial = false): Petal => {
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : -20,
        size: 6 + Math.random() * 10,
        speedY: 0.4 + Math.random() * 0.8,
        speedX: -0.3 + Math.random() * 0.6,
        angle: Math.random() * Math.PI * 2,
        angleSpeed: -0.02 + Math.random() * 0.04,
        opacity: 0.4 + Math.random() * 0.5,
        swayAmp: 0.5 + Math.random() * 1.5,
        swayPhase: Math.random() * Math.PI * 2,
      };
    };

    for (let i = 0; i < PETAL_COUNT; i++) {
      petals.push(createPetal(true));
    }

    // ---- 光斑粒子 ----
    interface Sparkle {
      x: number;
      y: number;
      size: number;
      opacity: number;
      phase: number;
      speed: number;
    }

    const SPARKLE_COUNT = 25;
    const sparkles: Sparkle[] = [];
    for (let i = 0; i < SPARKLE_COUNT; i++) {
      sparkles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 1 + Math.random() * 2.5,
        opacity: 0.2 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.02,
      });
    }

    let frame = 0;

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.globalAlpha = p.opacity;

      // 樱花花瓣形状
      const s = p.size;
      const grad = ctx.createLinearGradient(0, -s, 0, s);
      grad.addColorStop(0, "#ffd6e8");
      grad.addColorStop(0.5, "#ffb6d5");
      grad.addColorStop(1, "#ff9ec5");
      ctx.fillStyle = grad;

      ctx.beginPath();
      // 花瓣形状：五瓣樱花单片
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.4, -s * 0.8, s * 0.5, -s * 0.2, 0, 0);
      ctx.bezierCurveTo(-s * 0.5, -s * 0.2, -s * 0.4, -s * 0.8, 0, -s);
      ctx.fill();

      // 花瓣中心淡色
      ctx.globalAlpha = p.opacity * 0.5;
      ctx.fillStyle = "#fff0f6";
      ctx.beginPath();
      ctx.ellipse(0, -s * 0.3, s * 0.15, s * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawSparkle = (sp: Sparkle) => {
      const flicker = Math.sin(sp.phase + frame * sp.speed) * 0.5 + 0.5;
      ctx.save();
      ctx.globalAlpha = sp.opacity * flicker;
      ctx.fillStyle = "#ffffff";
      ctx.shadowBlur = 8;
      ctx.shadowColor = "rgba(255,240,200,0.8)";
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      frame++;

      // 绘制光斑
      sparkles.forEach((sp) => {
        sp.y -= 0.1;
        if (sp.y < -10) sp.y = h + 10;
        drawSparkle(sp);
      });

      // 绘制樱花花瓣
      petals.forEach((p, i) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(frame * 0.02 + p.swayPhase) * p.swayAmp * 0.3;
        p.angle += p.angleSpeed;

        if (p.y > h + 30) {
          petals[i] = createPetal(false);
        }
        if (p.x < -30) p.x = w + 30;
        if (p.x > w + 30) p.x = -30;

        drawPetal(p);
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
    <div className="anime-bg">
      {/* 天空渐变层 */}
      <div className="anime-sky" />

      {/* 流动云层 - 远景 */}
      <div className="anime-clouds anime-clouds-far">
        <div className="cloud cloud-1" />
        <div className="cloud cloud-2" />
        <div className="cloud cloud-3" />
      </div>

      {/* 流动云层 - 近景 */}
      <div className="anime-clouds anime-clouds-near">
        <div className="cloud cloud-4" />
        <div className="cloud cloud-5" />
      </div>

      {/* 太阳光晕 */}
      <div className="anime-sun" />

      {/* 远山剪影 */}
      <div className="anime-mountains">
        <svg
          viewBox="0 0 1920 400"
          preserveAspectRatio="none"
          className="mountain-svg"
        >
          {/* 最远山脉 */}
          <path
            d="M0,400 L0,200 Q200,120 400,180 Q600,240 800,150 Q1000,80 1200,170 Q1400,250 1600,140 Q1800,80 1920,160 L1920,400 Z"
            fill="rgba(186,213,255,0.35)"
          />
          {/* 中层山脉 */}
          <path
            d="M0,400 L0,260 Q300,180 600,240 Q900,300 1100,220 Q1300,160 1500,250 Q1700,320 1920,230 L1920,400 Z"
            fill="rgba(148,190,245,0.4)"
          />
          {/* 近层山脉 */}
          <path
            d="M0,400 L0,320 Q250,260 500,310 Q750,360 1000,290 Q1250,230 1500,310 Q1750,370 1920,300 L1920,400 Z"
            fill="rgba(120,165,220,0.45)"
          />
        </svg>
      </div>

      {/* 樱花树枝 - 左上角 */}
      <div className="anime-branch anime-branch-left">
        <svg viewBox="0 0 300 200" className="branch-svg">
          <path
            d="M0,40 Q60,35 120,50 Q180,65 280,100"
            stroke="rgba(100,70,60,0.6)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M80,48 Q90,30 95,15"
            stroke="rgba(100,70,60,0.5)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M160,55 Q175,38 185,20"
            stroke="rgba(100,70,60,0.5)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M220,75 Q235,55 245,35"
            stroke="rgba(100,70,60,0.5)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          {/* 樱花簇 */}
          {[
            { cx: 95, cy: 15, r: 6 },
            { cx: 88, cy: 25, r: 5 },
            { cx: 100, cy: 22, r: 5 },
            { cx: 185, cy: 20, r: 6 },
            { cx: 178, cy: 30, r: 5 },
            { cx: 195, cy: 28, r: 5 },
            { cx: 245, cy: 35, r: 6 },
            { cx: 238, cy: 48, r: 5 },
            { cx: 255, cy: 45, r: 5 },
          ].map((f, i) => (
            <circle
              key={i}
              cx={f.cx}
              cy={f.cy}
              r={f.r}
              fill="rgba(255,182,213,0.7)"
            />
          ))}
        </svg>
      </div>

      {/* 樱花树枝 - 右上角 */}
      <div className="anime-branch anime-branch-right">
        <svg viewBox="0 0 300 200" className="branch-svg">
          <path
            d="M300,30 Q240,40 180,60 Q100,85 20,110"
            stroke="rgba(100,70,60,0.6)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M220,55 Q210,38 200,22"
            stroke="rgba(100,70,60,0.5)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M140,80 Q125,62 115,45"
            stroke="rgba(100,70,60,0.5)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          {/* 樱花簇 */}
          {[
            { cx: 200, cy: 22, r: 6 },
            { cx: 208, cy: 35, r: 5 },
            { cx: 195, cy: 30, r: 5 },
            { cx: 115, cy: 45, r: 6 },
            { cx: 122, cy: 58, r: 5 },
            { cx: 108, cy: 55, r: 5 },
          ].map((f, i) => (
            <circle
              key={i}
              cx={f.cx}
              cy={f.cy}
              r={f.r}
              fill="rgba(255,182,213,0.7)"
            />
          ))}
        </svg>
      </div>

      {/* Canvas 樱花飘落 + 光斑 */}
      <canvas ref={canvasRef} className="anime-canvas" />

      {/* 底部草地渐变 */}
      <div className="anime-grass" />
    </div>
  );
}
