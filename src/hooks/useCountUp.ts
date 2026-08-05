import { useState, useEffect, useRef } from "react";
import type { RefObject } from "react";

/** 数字计数动画,在元素进入视口时触发 */
export function useCountUp<T extends HTMLElement = HTMLDivElement>(
  target: number,
  duration = 2000
): { value: number; ref: RefObject<T> } {
  const [value, setValue] = useState(0);
  const ref = useRef<T>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutExpo
            const eased =
              progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setValue(Math.round(target * eased));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { value, ref };
}
