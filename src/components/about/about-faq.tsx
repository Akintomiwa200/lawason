"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

const faqItems = [
  {
    question: "What services does GM Lawason Studios offer?",
    category: "Studio",
    preview: "Filmmaking, lighting, cinematography & more",
    answer:
      "We offer filmmaking, cinematography, special effect lighting, scriptwriting, and production design — from gaffer services to full production support on Nollywood sets.",
  },
  {
    question: "Where is the studio based?",
    category: "Location",
    preview: "Ikorodu, Lagos State, Nigeria",
    answer:
      "GM Lawason Studios is based in Ikorodu, Lagos State, Nigeria. We work on productions across Lagos and the wider Nigerian film industry.",
  },
  {
    question: "Who leads the studio?",
    category: "Team",
    preview: "Godwin Lawani — gaffer since 2010",
    answer:
      "Godwin Lawani is the founder — a light designer, scriptwriter, and cinematographer with experience in the Nigerian film industry since 2010, trained at the National Film Institute, Jos.",
  },
  {
    question: "What is The Gaffer Man Show?",
    category: "Media",
    preview: "Behind-the-scenes industry conversations",
    answer:
      "The Gaffer Man Show is a studio-led series featuring honest conversations with industry leaders about craft, leadership, and life on set.",
  },
  {
    question: "How do I book a studio session?",
    category: "Booking",
    preview: "Use the Book a session page",
    answer:
      "Visit our Book a session page to request dates, services, and production details. We'll confirm availability via Instagram.",
  },
  {
    question: "Do you offer training?",
    category: "Academy",
    preview: "GM Lawason Academy for Film and Media",
    answer:
      "Yes. GM Lawason Academy for Film and Media provides professional lighting training and filmmaking education for the next generation of creatives.",
  },
];

export function AboutFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-[var(--lp-bg)] pb-20 pt-4 sm:pb-28 md:pb-36">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <h2 className="text-left font-display text-[1.625rem] leading-tight tracking-tight text-[var(--lp-text)] sm:text-[2rem] md:text-[2.75rem]">
          Frequently asked questions.
        </h2>

        <div className="mt-8 flex flex-col gap-2.5 sm:mt-12 sm:gap-3">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            const answerId = `about-faq-answer-${index}`;

            return (
              <article
                key={item.question}
                className="overflow-hidden rounded-2xl bg-[var(--lp-faq-row-bg)]"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-start gap-3 px-4 py-4 text-left sm:gap-4 sm:px-5 sm:py-5 md:px-6"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[14px] font-semibold leading-snug text-[var(--lp-text)] sm:text-[15px] md:text-base">
                      {item.question}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--lp-text-muted)] sm:text-sm">
                      <span className="font-medium text-accent">{item.category}</span>
                      <span className="mx-1.5 hidden sm:inline">·</span>
                      <span className="block sm:inline">{item.preview}</span>
                    </p>
                  </div>

                  <span
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--lp-text)] text-[var(--lp-text)] sm:h-10 sm:w-10"
                    aria-hidden="true"
                  >
                    {isOpen ? (
                      <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} />
                    ) : (
                      <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} />
                    )}
                  </span>
                </button>

                {isOpen ? (
                  <div
                    id={answerId}
                    className="border-t border-[var(--lp-faq-row-border)] px-4 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-4 md:px-6 md:pb-6"
                  >
                    <p className="text-[13px] leading-relaxed text-[var(--lp-text-muted)] sm:text-sm md:text-[15px]">
                      {item.answer}
                    </p>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
