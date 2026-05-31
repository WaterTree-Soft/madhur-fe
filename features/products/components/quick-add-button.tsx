"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/features/cart/store/cart-store";
import type { Product } from "@/types";

interface QuickAddButtonProps {
  product: Product;
}

export function QuickAddButton({ product }: QuickAddButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (!product.inStock) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Add ${product.name} to cart`}
      disabled={added}
      className={`
        shrink-0 flex items-center justify-center rounded-full font-semibold text-white
        transition-all duration-200 active:scale-95 disabled:opacity-70
        h-8 w-8 sm:h-auto sm:w-auto sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs
        ${added
          ? "bg-success shadow-sm"
          : "bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg"
        }
      `}
    >
      {added ? (
        <>
          <Check className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Added!</span>
        </>
      ) : (
        <>
          <ShoppingCart className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Quick Add</span>
        </>
      )}
    </button>
  );
}
