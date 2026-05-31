"use client";

import { ProductCard } from "./product-card";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";
import type { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          No products found.
        </p>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Please check back later for new arrivals.
        </p>
      </div>
    );
  }

  return (
    <StaggerContainer className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 [&>*:last-child:nth-child(odd)]:col-span-2 [&>*:last-child:nth-child(odd)]:justify-self-center [&>*:last-child:nth-child(odd)]:w-[calc(50%-0.5rem)] md:[&>*:last-child:nth-child(odd)]:col-span-1 md:[&>*:last-child:nth-child(odd)]:w-auto md:[&>*:last-child:nth-child(odd)]:justify-self-auto">
      {products.map((product) => (
        <StaggerItem key={product.id}>
          <ProductCard product={product} />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
