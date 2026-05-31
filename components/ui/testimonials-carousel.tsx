"use client";

import { Quote, Star } from "lucide-react";
import type { Testimonial } from "@/types";

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <article className="relative flex h-full w-72 shrink-0 flex-col rounded-2xl border border-primary/10 bg-white p-5 shadow-[0_10px_30px_-15px_rgba(139,0,0,0.25)] sm:w-80 sm:p-6">
      <Quote
        className="pointer-events-none absolute -top-1 right-4 h-16 w-16 text-primary/6"
        strokeWidth={1.2}
      />

      <div className="mb-3 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={
              i < t.rating
                ? "h-4 w-4 fill-accent text-accent"
                : "h-4 w-4 text-muted-foreground/25"
            }
          />
        ))}
      </div>

      <p className="flex-1 text-sm leading-relaxed text-foreground/85 sm:text-[15px]">
        &ldquo;{t.quote}&rdquo;
      </p>

      <div className="mt-6 flex items-center gap-3 border-t border-primary/10 pt-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary to-secondary text-base font-bold text-white shadow-md">
          {t.initial}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-primary">
            {t.name}
          </p>
          {t.location && (
            <p className="truncate text-xs text-muted-foreground">
              {t.location}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

export function TestimonialsCarousel({
  testimonials,
}: TestimonialsCarouselProps) {
  if (testimonials.length === 0) return null;

  // Duplicate the list so the marquee loops seamlessly without a visible jump.
  const loop = [...testimonials, ...testimonials];

  return (
    <div
      className="testimonials-marquee relative mt-14 overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Customer testimonials"
    >
      <div className="testimonials-track flex w-max gap-6 py-4">
        {loop.map((t, i) => (
          <TestimonialCard key={`${t.id}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}
