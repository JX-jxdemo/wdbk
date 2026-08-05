import { useState, useEffect, useRef } from "react";

interface TypewriterOptions {
  texts: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  delayBetween?: number;
}

/** 多文本循环打字机效果 */
export function useTypewriter({
  texts,
  typeSpeed = 100,
  deleteSpeed = 50,
  delayBetween = 2000,
}: TypewriterOptions) {
  const [display, setDisplay] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const current = texts[index % texts.length] ?? "";

    if (!deleting && display === current) {
      // 打字完成,等待后开始删除
      timeoutRef.current = setTimeout(() => setDeleting(true), delayBetween);
      return () => clearTimeout(timeoutRef.current);
    }

    if (deleting && display === "") {
      // 删除完成,切换到下一个文本
      setDeleting(false);
      setIndex((i) => i + 1);
      return;
    }

    timeoutRef.current = setTimeout(
      () => {
        setDisplay((prev) =>
          deleting
            ? current.slice(0, prev.length - 1)
            : current.slice(0, prev.length + 1)
        );
      },
      deleting ? deleteSpeed : typeSpeed
    );

    return () => clearTimeout(timeoutRef.current);
  }, [display, deleting, index, texts, typeSpeed, deleteSpeed, delayBetween]);

  return display;
}
