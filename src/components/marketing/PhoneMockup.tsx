import type { ReactNode } from "react";
import { asset } from "../../lib/assets";

type Props = {
  screenshot?: string;
  alt?: string;
  label?: string;
  children?: ReactNode;
  className?: string;
};

export default function PhoneMockup({ screenshot, alt = "", label, children, className = "" }: Props) {
  return (
    <div className={`phone-mockup relative ${className}`}>
      <div className="phone-device relative aspect-[9/19.5] w-full overflow-hidden rounded-[2.5rem] border-[7px] border-[#151513] bg-[#151513]" style={{ boxShadow: "var(--shadow-phone)" }}>
        <div className="absolute left-1/2 top-2 z-20 h-5 w-20 -translate-x-1/2 rounded-full bg-black" aria-hidden />
        <div className="absolute inset-0 overflow-hidden rounded-[2.05rem] bg-[var(--bg)]">
          {screenshot ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={asset(`/screenshots/${screenshot}`)} alt={alt} className="h-full w-full object-cover" />
          ) : (
            <div className="relative flex h-full w-full flex-col items-center justify-center p-6 text-center" style={{ background: "var(--hero-grad)" }}>
              <div className="relative flex flex-col items-center gap-3 text-[#191916]">
                {children}
                {label && <span className="font-mono text-[10px] font-semibold uppercase tracking-wider">{label}</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
