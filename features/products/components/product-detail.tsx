"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Star, ShieldCheck, Leaf, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { AddToCartButton } from "@/features/cart";
import { formatPrice } from "@/lib/utils";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import type { Product } from "@/types";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const images = product.images?.length ? product.images : [PLACEHOLDER_IMAGE];
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const fetchRating = useCallback(async () => {
    try {
      const res = await fetch(`/api/feedback?productId=${product.id}`);
      if (!res.ok) return;
      const json = await res.json();
      const list: { rating: number }[] = (json.data ?? []).map(
        (o: { attributes?: { rating: number }; rating: number }) => o.attributes ?? o
      );
      if (list.length > 0) {
        const sum = list.reduce((acc, f) => acc + f.rating, 0);
        setAvgRating(parseFloat((sum / list.length).toFixed(1)));
      }
      setReviewCount(list.length);
    } catch {
      /* ignore */
    }
  }, [product.id]);

  useEffect(() => { fetchRating(); }, [fetchRating]);

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleCarouselScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setSelectedImage(index);
  };

  const scrollToImage = (index: number) => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
    setSelectedImage(index);
  };

  const goToPrev = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="grid gap-6 md:gap-14 md:grid-cols-2">
      {/* ── Image section ── */}
      <div className="space-y-3 sm:space-y-4">

        {/* Mobile: scroll-snap carousel */}
        <div className="relative sm:hidden">
          <div
            ref={carouselRef}
            onScroll={handleCarouselScroll}
            className="flex overflow-x-auto snap-x snap-mandatory aspect-square rounded-xl bg-[#faf6f0] shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
            style={{ scrollbarWidth: "none" }}
          >
            {images.map((image, index) => (
              <div
                key={index}
                className="snap-center shrink-0 w-full aspect-square relative overflow-hidden"
              >
                <Image
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  unoptimized
                />
              </div>
            ))}
          </div>

          {/* Overlay badges */}
          {!product.inStock && (
            <Badge variant="destructive" className="absolute left-3 top-3 text-xs shadow-sm z-10 pointer-events-none">
              Out of Stock
            </Badge>
          )}
          {discountPercent > 0 && (
            <Badge className="absolute right-3 top-3 text-xs bg-linear-to-r from-secondary to-[#ff7722] text-white border-0 shadow-[0_3px_10px_rgba(255,153,51,0.4)] z-10 pointer-events-none">
              {discountPercent}% OFF
            </Badge>
          )}

          {/* Dot indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => scrollToImage(i)}
                  aria-label={`View image ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    selectedImage === i
                      ? "w-5 bg-white"
                      : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Desktop: main image + thumbnail strip */}
        <div className="hidden sm:block space-y-4">
          <div className="group relative aspect-square overflow-hidden rounded-2xl bg-[#faf6f0] shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
            <Image
              src={images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              priority
              unoptimized
            />
            {!product.inStock && (
              <Badge variant="destructive" className="absolute left-4 top-4 text-sm shadow-sm z-10">
                Out of Stock
              </Badge>
            )}
            {discountPercent > 0 && (
              <Badge className="absolute right-4 top-4 text-sm bg-linear-to-r from-secondary to-[#ff7722] text-white border-0 shadow-[0_3px_10px_rgba(255,153,51,0.4)] z-10">
                {discountPercent}% OFF
              </Badge>
            )}

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={goToPrev}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 rounded-full bg-black/60 px-2.5 py-0.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  {selectedImage + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 flex-wrap">
              {images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-20 w-20 overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                    selectedImage === index
                      ? "border-primary shadow-sm shadow-primary/20"
                      : "border-transparent hover:border-muted-foreground/40"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Details section ── */}
      <div className="space-y-5 md:space-y-7">
        <div>
          <Badge variant="secondary" className="mb-2 sm:mb-3 text-xs">
            {product.category.name}
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-primary leading-tight">
            {product.name}
          </h1>

          {reviewCount > 0 && (
            <div className="mt-2.5 sm:mt-3 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(avgRating)
                        ? "fill-accent text-accent"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">
                {avgRating} ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2.5 sm:gap-3 flex-wrap">
          {product.discountPrice ? (
            <>
              <span className="text-2xl sm:text-3xl font-bold text-secondary">
                {formatPrice(product.discountPrice)}
              </span>
              <span className="text-base sm:text-xl text-muted-foreground/60 line-through">
                {formatPrice(product.price)}
              </span>
              <Badge variant="secondary" className="text-xs font-medium">
                Save {discountPercent}%
              </Badge>
            </>
          ) : (
            <span className="text-2xl sm:text-3xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <Separator className="bg-border/50" />

        {/* Product info */}
        <div className="space-y-3">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-medium">Weight</span>
              <span className="text-muted-foreground ml-2">{product.weight}</span>
            </div>
          </div>
          {product.shelfLife && (
            <div className="flex items-start gap-2.5">
              <Clock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-medium">Shelf Life</span>
                <span className="text-muted-foreground ml-2">{product.shelfLife}</span>
              </div>
            </div>
          )}
          {product.ingredients && (
            <div className="flex items-start gap-2.5">
              <Leaf className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-medium block">Ingredients</span>
                <span className="text-muted-foreground leading-relaxed">{product.ingredients}</span>
              </div>
            </div>
          )}
        </div>

        <Separator className="bg-border/50" />

        {/* Add to cart */}
        {product.inStock && (
          <div className="flex items-center gap-3 sm:gap-4">
            <QuantitySelector value={quantity} onChange={setQuantity} />
            <AddToCartButton product={product} quantity={quantity} className="flex-1" />
          </div>
        )}

        {/* Description */}
        <div>
          <h2 className="mb-2.5 sm:mb-3 text-base sm:text-lg font-semibold">Description</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
}
