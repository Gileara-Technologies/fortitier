"use client";

import { useId, useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import type { Faq } from "@/content/faqs";
import { cn } from "@/lib/cn";

export default function FaqAccordion({ items }: { items: Faq[] }) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-outline-variant rounded-lg border border-outline-variant bg-paper">
      {items.map((item, index) => {
        const open = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;
        return (
          <div key={item.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-paper-warm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-gold"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : index)}
              >
                <span className="font-display text-body font-semibold text-brown">
                  {item.question}
                </span>
                <LuChevronDown
                  aria-hidden
                  className={cn(
                    "mt-1 h-5 w-5 shrink-0 text-bronze transition-transform duration-200",
                    open && "rotate-180",
                  )}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!open}
              className="px-5 pb-5"
            >
              <p className="max-w-measure text-body text-brown-muted">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
