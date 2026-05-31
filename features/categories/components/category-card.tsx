import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/types";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`} className="group block">
      <article className="relative overflow-hidden rounded-2xl border border-[#e8d5b7] bg-[#fdf8f2] shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(139,48,0,0.18)] hover:border-accent/60">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={category.image || PLACEHOLDER_IMAGE}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            sizes="(max-width: 768px) 50vw, 33vw"
            unoptimized
          />
          {/* Multi-stop gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Top-right product count pill */}
          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 px-3 py-1 text-xs font-medium text-white/90">
            <span className="h-1.5 w-1.5 rounded-full bg-accent inline-block" />
            {category.productCount}{" "}
            {category.productCount === 1 ? "item" : "items"}
          </div>
        </div>

        {/* Card footer */}
        <div className="relative px-5 py-4 flex items-center justify-between">
          {/* Decorative left accent bar */}
          <span className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-accent/70 transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:bottom-0 group-hover:bg-accent" />

          <div className="pl-3">
            <h3 className="text-[15px] font-semibold text-[#2d0a00] [font-family:var(--font-fraunces)] leading-snug group-hover:text-accent transition-colors duration-300">
              {category.name}
            </h3>
            <p className="mt-0.5 text-xs text-[#8b5e3c]/80 font-medium tracking-wide uppercase">
              Explore collection
            </p>
          </div>

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#d4af37]/30 bg-accent/10 transition-all duration-300 group-hover:bg-accent group-hover:border-accent group-hover:scale-110">
            <ArrowRight className="h-3.5 w-3.5 text-accent transition-colors duration-300 group-hover:text-white" />
          </div>
        </div>
      </article>
    </Link>
  );
}
