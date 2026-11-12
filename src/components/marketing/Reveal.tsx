"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Delay (ms) before the reveal transition fires once in view. */
  delay?: number;
  /** Render as a different element if needed. */
  as?: "div" | "section" | "li" | "article" | "span" | "ul";
  /** Motion flavour for the one-time entrance. */
  variant?: "lift" | "fade" | "clip" | "scale";
  /** Adds damped scroll depth and (on fine pointers) subtle pointer parallax. */
  kinetic?: "hero" | "stage";
  className?: string;
  style?: React.CSSProperties;
};

const clamp = (value: number, min = -1, max = 1) => Math.min(max, Math.max(min, value));

/**
 * A one-time entrance plus an optional, completely render-free kinetic scene.
 * Scroll and pointer targets are smoothed in one requestAnimationFrame loop;
 * only CSS custom properties change, so React never re-renders while scrolling.
 */
export default function Reveal({
  children,
  delay = 0,
  as = "div",
  variant = "lift",
  kinetic,
  className = "",
  style,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(true);
      return;
    }

    let revealed = false;
    let fallbackFrame = 0;
    let obs: IntersectionObserver | null = null;
    const markVisible = () => {
      if (revealed) return;
      revealed = true;
      setVisible(true);
      obs?.unobserve(el);
      window.removeEventListener("scroll", schedulePassedCheck);
    };
    const checkPassed = () => {
      fallbackFrame = 0;
      if (!revealed && el.getBoundingClientRect().bottom < 0) markVisible();
    };
    const schedulePassedCheck = () => {
      if (!fallbackFrame) fallbackFrame = requestAnimationFrame(checkPassed);
    };

    obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) markVisible();
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );

    obs.observe(el);
    window.addEventListener("scroll", schedulePassedCheck, { passive: true });
    return () => {
      if (fallbackFrame) cancelAnimationFrame(fallbackFrame);
      window.removeEventListener("scroll", schedulePassedCheck);
      obs?.disconnect();
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !kinetic || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    let active = true;
    let frame = 0;
    let lastTime = performance.now();
    let scrollTarget = 0;
    let scrollCurrent = 0;
    let xTarget = 0;
    let yTarget = 0;
    let xCurrent = 0;
    let yCurrent = 0;

    const writeScene = () => {
      if (kinetic === "hero") {
        el.style.setProperty("--hero-front-x", `${xCurrent * 4}px`);
        el.style.setProperty("--hero-front-y", `${scrollCurrent * -22 + yCurrent * 4}px`);
        el.style.setProperty("--hero-back-x", `${xCurrent * -3}px`);
        el.style.setProperty("--hero-back-y", `${scrollCurrent * 13 + yCurrent * -2}px`);
        el.style.setProperty("--hero-disc-x", `${xCurrent * 7}px`);
        el.style.setProperty("--hero-disc-y", `${scrollCurrent * 30 + yCurrent * 5}px`);
        el.style.setProperty("--hero-tilt", `${xCurrent * 1.1}deg`);
      } else {
        el.style.setProperty("--stage-phone-y", `${scrollCurrent * -19 + yCurrent * 3}px`);
        el.style.setProperty("--stage-ghost-y", `${scrollCurrent * 28}px`);
        el.style.setProperty("--stage-bars-y", `${scrollCurrent * -8}px`);
        el.style.setProperty("--stage-phone-tilt", `${xCurrent * 0.9}deg`);
      }
    };

    const tick = (now: number) => {
      frame = 0;
      if (!active) return;
      const dt = Math.min(48, now - lastTime);
      lastTime = now;
      // Exponential damping is frame-rate independent: about 90% settled in 210ms.
      const ease = 1 - Math.exp((-dt / 1000) * 11);
      scrollCurrent += (scrollTarget - scrollCurrent) * ease;
      xCurrent += (xTarget - xCurrent) * ease;
      yCurrent += (yTarget - yCurrent) * ease;
      writeScene();

      const unsettled =
        Math.abs(scrollTarget - scrollCurrent) > 0.0005 ||
        Math.abs(xTarget - xCurrent) > 0.0005 ||
        Math.abs(yTarget - yCurrent) > 0.0005;
      if (unsettled) frame = requestAnimationFrame(tick);
      else {
        scrollCurrent = scrollTarget;
        xCurrent = xTarget;
        yCurrent = yTarget;
        writeScene();
      }
    };

    const wake = () => {
      if (active && !frame) {
        lastTime = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const range = (window.innerHeight + rect.height) / 2;
      scrollTarget = clamp((window.innerHeight / 2 - rect.top - rect.height / 2) / range);
      wake();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!finePointer) return;
      const rect = el.getBoundingClientRect();
      xTarget = clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2);
      yTarget = clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2);
      wake();
    };
    const onPointerLeave = () => {
      xTarget = 0;
      yTarget = 0;
      wake();
    };

    measure();
    scrollCurrent = scrollTarget;
    writeScene();

    const visibility = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        if (active) measure();
        else if (frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { rootMargin: "25% 0px 25% 0px" },
    );
    visibility.observe(el);
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    if (finePointer) {
      el.addEventListener("pointermove", onPointerMove, { passive: true });
      el.addEventListener("pointerleave", onPointerLeave);
    }

    return () => {
      active = false;
      if (frame) cancelAnimationFrame(frame);
      visibility.disconnect();
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [kinetic]);

  const Tag = as as "div";
  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      data-reveal={variant}
      className={`reveal is-${visible ? "visible" : "pending"} ${className}`}
      style={{ ["--reveal-delay" as string]: `${delay}ms`, ...style }}
    >
      {children}
    </Tag>
  );
}
