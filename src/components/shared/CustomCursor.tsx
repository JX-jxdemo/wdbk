import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    const move = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      setHovering(
        !!target.closest("a, button, [role='button'], input, textarea")
      );
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      className="custom-cursor pointer-events-none fixed z-[9999] hidden md:block"
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -50%)",
        transition: "width 0.2s, height 0.2s, opacity 0.2s",
      }}
      aria-hidden="true"
    >
      <div
        className="rounded-full border border-[var(--color-primary)] transition-all duration-200"
        style={{
          width: hovering ? 40 : 20,
          height: hovering ? 40 : 20,
          opacity: position.x === -100 ? 0 : 1,
        }}
      />
    </div>
  );
}