"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

type Item = { q: string; a: string };

export default function FaqAccordion({ items }: { items: Item[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div>
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.q} className={`faq-item ${open ? "is-open" : ""}`}>
            <button
              type="button"
              className="faq-trigger"
              aria-expanded={open}
              aria-controls={`faq-panel-${i}`}
              onClick={() => setOpenIndex(open ? null : i)}
            >
              <span className="faq-number">{String(i + 1).padStart(2, "0")}</span>
              <span>{item.q}</span>
              <span className="faq-plus" aria-hidden>
                <Plus className="size-3.5" strokeWidth={2} />
              </span>
            </button>
            <div className="faq-panel" id={`faq-panel-${i}`} role="region" aria-hidden={!open}>
              <div className="faq-panel-inner">
                <p className="faq-answer">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
