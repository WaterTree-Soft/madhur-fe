"use client";

import { PackageOpen } from "lucide-react";
import type { Category } from "@/types";
import { CategoryCard } from "./category-card";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e8d5b7] bg-[#fdf8f2] py-20 px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/15">
          <PackageOpen className="h-6 w-6 text-secondary" />
        </div>
        <h3 className="mt-5 text-lg font-semibold text-primary [font-family:var(--font-fraunces)]">
          No categories yet
        </h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground leading-relaxed">
          Categories will appear here once they are added. Please check back soon.
        </p>
      </div>
    );
  }

  return (
    <StaggerContainer className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:gap-8 [&>*:last-child:nth-child(odd)]:col-span-2 [&>*:last-child:nth-child(odd)]:justify-self-center [&>*:last-child:nth-child(odd)]:w-[calc(50%-0.5rem)] md:[&>*:last-child:nth-child(odd)]:col-span-1 md:[&>*:last-child:nth-child(odd)]:w-auto md:[&>*:last-child:nth-child(odd)]:justify-self-auto">
      {categories.map((category) => (
        <StaggerItem key={category.id}>
          <CategoryCard category={category} />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
