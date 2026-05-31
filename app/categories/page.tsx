import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { fetchCategories } from "@/features/categories";
import { CategoryGrid } from "@/features/categories";
import { FadeUp } from "@/components/ui/motion";
import { Mandala } from "@/components/ui/mandala";

export const metadata: Metadata = {
  title: "Browse Categories | Madhur Sweet",
  description:
    "Explore our wide range of authentic namkeen, snacks, and traditional Indian treats.",
};

export default async function CategoriesPage() {
  const categories = await fetchCategories();

  return (
    <div>
      {/* Hero-style header — matches home hero */}
      <section className="relative flex items-center justify-center overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 bg-linear-to-br from-[#1c0400] via-[#4a0d00] to-[#8b3000]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(212,175,55,0.08),transparent_55%),radial-gradient(circle_at_20%_80%,rgba(255,100,0,0.07),transparent_50%)]" />
        <Mandala size={280} className="top-0 left-0" />
        <Mandala corner="bottom-right" size={200} className="bottom-0 right-0" />

        <div className="relative z-10 text-center px-4">
          <FadeUp>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-5 py-2 text-sm font-medium text-white/90 mb-6">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Our Range
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white [font-family:var(--font-fraunces)]">
              Browse Categories
            </h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="mt-5 text-base sm:text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
              Bhujia, chakli, mixture and more — handcrafted namkeen sorted just for you.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Grid */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <CategoryGrid categories={categories} />
      </main>
    </div>
  );
}
