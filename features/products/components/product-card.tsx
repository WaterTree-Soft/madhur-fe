import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, truncate } from "@/lib/utils";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import type { Product } from "@/types";
import { ShareButton } from "./share-button";
import { QuickAddButton } from "./quick-add-button";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <Card className="h-full overflow-hidden bg-white shadow-[0_4px_16px_rgba(0,0,0,0.07)] sm:hover:shadow-[0_15px_40px_rgba(139,0,0,0.15)] sm:hover:-translate-y-2.5 transition-all duration-400 border-0">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted/20">
          <Image
            src={product.images?.[0] || PLACEHOLDER_IMAGE}
            alt={product.name}
            width={300}
            height={300}
            unoptimized
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

          {/* Share — top left */}
          <ShareButton slug={product.slug} name={product.name} />

          {/* Discount badge — top right */}
          {product.discountPrice && (
            <Badge className="absolute right-2 top-2 sm:right-3 sm:top-3 text-[10px] sm:text-xs bg-linear-to-r from-secondary to-[#ff7722] text-white shadow-[0_3px_10px_rgba(255,153,51,0.4)] border-0 px-1.5 py-0.5 sm:px-2">
              {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
            </Badge>
          )}

          {/* Bottom-left: rating pill OR out-of-stock badge */}
          {!product.inStock ? (
            <Badge
              variant="destructive"
              className="absolute left-2 bottom-2 sm:left-3 sm:bottom-3 text-[10px] sm:text-xs shadow-sm"
            >
              Out of Stock
            </Badge>
          ) : product.reviewCount > 0 ? (
            <div className="absolute left-2 bottom-2 sm:left-3 sm:bottom-3 flex items-center gap-0.5 sm:gap-1 rounded-full bg-black/50 backdrop-blur-sm px-1.5 py-0.5 sm:px-2 sm:py-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${
                    i < Math.round(product.rating)
                      ? "fill-accent text-accent"
                      : "fill-white/30 text-white/30"
                  }`}
                />
              ))}
            </div>
          ) : null}
        </div>

        {/* Text content */}
        <CardContent className="p-3 sm:p-5">
          <h3 className="text-sm sm:text-base font-semibold leading-snug text-primary group-hover:text-secondary transition-colors duration-200 line-clamp-2">
            {product.name}
          </h3>
          <p className="hidden sm:block mt-1.5 text-sm text-muted-foreground leading-relaxed">
            {truncate(product.shortDescription, 60)}
          </p>
        </CardContent>

        {/* Footer: price + add button */}
        <CardFooter className="p-3 sm:p-5 pt-0 flex items-center justify-between gap-2">
          <div>
            {product.discountPrice ? (
              <>
                <span className="text-sm sm:text-lg font-bold text-secondary block leading-tight">
                  {formatPrice(product.discountPrice)}
                </span>
                <span className="text-[11px] sm:text-sm text-muted-foreground/70 line-through leading-tight">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-sm sm:text-lg font-bold text-secondary">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <QuickAddButton product={product} />
        </CardFooter>
      </Card>
    </Link>
  );
}
