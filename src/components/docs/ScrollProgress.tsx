"use client";

import { useEffect, useRef } from "react";

/** GPU-composited reading progress with a short, frame-rate-independent settle. */
export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let target = 0;
    let current = 0;
    let frame = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      frame = 0;
      const dt = Math.min(48, now - lastTime);
      lastTime = now;
      const ease = reduced ? 1 : 1 - Math.exp((-dt / 1000) * 20);
      current += (target - current) * ease;
      bar.current?.style.setProperty("transform", `scaleX(${current})`);
      if (Math.abs(target - current) > 0.0005) frame = requestAnimationFrame(tick);
      else {
        current = target;
        bar.current?.style.setProperty("transform", `scaleX(${current})`);
      }
    };
    const wake = () => {
      if (!frame) {
        lastTime = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };
    const measure = () => {
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      target = max > 0 ? Math.min(1, Math.max(0, root.scrollTop / max)) : 0;
      wake();
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div className="scroll-progress-track" aria-hidden>
      <div ref={bar} className="scroll-progress h-full" />
    </div>
  );
}
