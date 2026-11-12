"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useLocale } from "next-intl";
import { usePathname } from "../../../i18n/routing";

/** Route fades plus a very small magnetic response for primary text actions. */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const locale = useLocale();
  const ref = useRef<HTMLElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = ref.current;
    if (!el) return;

    el.classList.remove("page-enter");
    void el.offsetWidth; // restart the animation
    el.classList.add("page-enter");
    const done = () => el.classList.remove("page-enter");
    el.addEventListener("animationend", done, { once: true });
    return () => el.removeEventListener("animationend", done);
  }, [pathname, locale]);

  useEffect(() => {
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;

    let active: HTMLElement | null = null;
    let frame = 0;
    let clientX = 0;
    let clientY = 0;

    const release = (element: HTMLElement | null) => {
      if (!element) return;
      element.style.setProperty("--magnet-x", "0px");
      element.style.setProperty("--magnet-y", "0px");
    };
    const update = () => {
      frame = 0;
      if (!active?.isConnected) return;
      const rect = active.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width - 0.5) * 4;
      const y = ((clientY - rect.top) / rect.height - 0.5) * 3;
      active.style.setProperty("--magnet-x", `${x}px`);
      active.style.setProperty("--magnet-y", `${y}px`);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onPointerOver = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return;
      const next = event.target.closest<HTMLElement>(".btn-primary, .btn-ghost, .text-link");
      if (next === active) return;
      release(active);
      active = next;
      clientX = event.clientX;
      clientY = event.clientY;
      schedule();
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!active) return;
      clientX = event.clientX;
      clientY = event.clientY;
      schedule();
    };
    const onPointerOut = (event: PointerEvent) => {
      if (!active || (event.relatedTarget instanceof Node && active.contains(event.relatedTarget))) return;
      release(active);
      active = null;
    };
    const onBlur = () => {
      release(active);
      active = null;
    };

    document.addEventListener("pointerover", onPointerOver, { passive: true });
    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerout", onPointerOut, { passive: true });
    window.addEventListener("blur", onBlur);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      release(active);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  return (
    <main ref={ref} className="flex-1">
      {children}
    </main>
  );
}
