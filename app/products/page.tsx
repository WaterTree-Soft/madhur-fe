import type { Metadata } from "next";
import { fetchProducts } from "@/features/products/actions/product-actions";
import { ProductGrid } from "@/features/products";
import { FadeUp } from "@/components/ui/motion";

export const metadata: Metadata = {
  title: "Our Products | Madhur Sweets",
  description:
    "Browse our wide range of traditional Indian sweets, namkeen, ladoos, barfis, and more. Made fresh with pure ingredients.",
};

export default async function ProductsPage() {
  const products = await fetchProducts();

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-24">
      <FadeUp>
        <div className="mb-8 md:mb-14 text-center">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-secondary mb-3">
            Our Collection
          </p>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-primary">Our Products</h1>
          <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover our handcrafted sweets and savoury delights, made fresh daily
            with the finest ingredients.
          </p>
        </div>
      </FadeUp>

      <ProductGrid products={products} />
    </main>
  );
}
