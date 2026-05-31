"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ShoppingBag,
  Trash2,
  ShieldCheck,
  Truck,
  Tag,
  PartyPopper,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { BackButton } from "@/components/ui/back-button";
import { formatPrice } from "@/lib/utils";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { useCartStore } from "../store/cart-store";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { useSiteSettings } from "@/lib/hooks/use-site-settings";

export function CartPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const rawItems = useCartStore((s) => s.items);
  // Guard against stale localStorage entries where the product was deleted
  const items = rawItems.filter((item) => item.product != null && item.product.id != null);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const getTotal = useCartStore((s) => s.getTotal);
  const getItemCount = useCartStore((s) => s.getItemCount);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isAuthLoading = useAuthStore((s) => s.isLoading);
  const openLoginDialog = useAuthStore((s) => s.openLoginDialog);

  const { freeShippingThreshold: FREE_SHIPPING_THRESHOLD, shippingFee: SHIPPING_FEE, taxRate: TAX_RATE } = useSiteSettings();

  function handleProceedToCheckout() {
    if (isAuthenticated) {
      router.push("/checkout");
    } else {
      openLoginDialog();
    }
  }

  if (!mounted) {
    return (
      <div className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-7xl flex-col px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="mt-8 flex-1 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  const itemCount = getItemCount();
  const subtotal = getTotal();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + shipping + tax;
  const amountForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-4xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center rounded-2xl border bg-card px-6 py-16 sm:py-20 text-center shadow-sm">
          <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-primary/10">
            <ShoppingBag className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          </div>
          <h1 className="mt-5 sm:mt-6 text-2xl sm:text-3xl font-bold">Your cart is empty</h1>
          <p className="mt-3 max-w-md text-sm sm:text-base text-muted-foreground">
            Looks like you haven&apos;t added any delicious sweets yet. Browse
            our collection and treat yourself!
          </p>
          <div className="mt-7 sm:mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/products">
                Browse Products <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/categories">View Categories</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    /* Extra bottom padding on mobile for the sticky checkout bar */
    <div className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-7xl flex-col px-4 py-8 sm:py-10 sm:px-6 lg:px-8 pb-28 sm:pb-10">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <BackButton href="/products" label="Continue shopping" />
          <h1 className="mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            Your Shopping Cart
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="group inline-flex items-center gap-2 self-start rounded-full border border-destructive/25 bg-destructive/5 px-4 py-1.5 text-sm font-medium text-destructive shadow-sm transition-all duration-200 hover:border-destructive hover:bg-destructive hover:text-destructive-foreground hover:shadow-[0_6px_20px_-6px_rgba(200,30,30,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/40 sm:self-auto"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive/10 text-destructive transition-all duration-200 group-hover:rotate-12 group-hover:bg-destructive-foreground/20 group-hover:text-destructive-foreground">
            <Trash2 className="h-3.5 w-3.5" />
          </span>
          Clear cart
        </button>
      </div>

      {/* Free-shipping progress banner */}
      {amountForFreeShipping > 0 ? (
        <div className="mb-5 sm:mb-6 overflow-hidden rounded-xl sm:rounded-2xl border border-primary/20 bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-primary/15 text-primary shrink-0">
                <Truck className="h-4 w-4" />
              </span>
              <p className="text-xs sm:text-sm font-medium">
                Add{" "}
                <span className="font-bold text-primary">{formatPrice(amountForFreeShipping)}</span>{" "}
                more for{" "}
                <span className="font-bold text-primary">free shipping</span>
              </p>
            </div>
            <span className="hidden shrink-0 text-xs font-semibold text-primary sm:inline">
              {Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%
            </span>
          </div>
          <div className="relative mt-3 sm:mt-4 h-2 sm:h-2.5 overflow-hidden rounded-full bg-primary/10">
            <div
              className="h-full rounded-full bg-linear-to-r from-primary via-secondary to-accent shadow-[0_0_10px_rgba(139,0,0,0.35)] transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="relative mb-5 sm:mb-6 overflow-hidden rounded-xl sm:rounded-2xl bg-linear-to-r from-emerald-600 via-green-600 to-emerald-700 p-4 sm:p-5 shadow-[0_15px_40px_-10px_rgba(16,185,129,0.55)] ring-1 ring-emerald-500/30">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.18),transparent_60%)]" />
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <Sparkles className="success-sparkle pointer-events-none absolute right-6 top-4 h-4 w-4 text-amber-300" style={{ animationDelay: "0s" }} />
          <Sparkles className="success-sparkle pointer-events-none absolute right-24 bottom-3 h-3.5 w-3.5 text-white/80" style={{ animationDelay: "0.8s" }} />
          <div className="relative flex items-center gap-3 sm:gap-4">
            <span className="relative flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-white text-emerald-600 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.25)]">
              <span className="success-ring-pulse absolute inset-0 rounded-full bg-white/40" />
              <PartyPopper className="relative h-5 w-5 sm:h-6 sm:w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-50/90">
                Free shipping unlocked
              </p>
              <p className="mt-0.5 sm:mt-1 text-sm sm:text-base font-semibold text-white">
                Great! Your order ships on us.{" "}
                <span className="font-normal text-emerald-50/85">Enjoy the sweets.</span>
              </p>
            </div>
            <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-emerald-700 shadow-md sm:inline-flex">
              <Truck className="h-3.5 w-3.5" />
              FREE
            </span>
          </div>
        </div>
      )}

      <div className="grid flex-1 grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
        {/* Items list */}
        <section className="lg:col-span-2">
          <ul className="space-y-3 sm:space-y-4">
            {items.map((item) => {
              const unitPrice = item.product.discountPrice ?? item.product.price;
              const lineTotal = unitPrice * item.quantity;
              const hasDiscount =
                item.product.discountPrice !== undefined &&
                item.product.discountPrice < item.product.price;

              return (
                <li key={item.product.id}>
                  <Card className="overflow-hidden">
                    <CardContent className="p-3 sm:p-5">
                      {/* Always a horizontal row — small square image on left */}
                      <div className="flex gap-3 sm:gap-4">
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted sm:h-28 sm:w-28"
                        >
                          <Image
                            src={item.product.images?.[0] || PLACEHOLDER_IMAGE}
                            alt={item.product.name}
                            fill
                            sizes="(max-width: 640px) 80px, 112px"
                            className="object-cover"
                            unoptimized
                          />
                        </Link>

                        <div className="flex flex-1 min-w-0 flex-col gap-1.5 sm:gap-2">
                          {/* Name + delete */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <Link
                                href={`/products/${item.product.slug}`}
                                className="text-sm sm:text-lg font-semibold leading-tight hover:text-primary line-clamp-2"
                              >
                                {item.product.name}
                              </Link>
                              <p className="mt-0.5 text-[11px] sm:text-xs text-muted-foreground truncate">
                                {item.product.category.name} · {item.product.weight}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.product.id)}
                              className="shrink-0 rounded-md p-1 sm:p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                              aria-label={`Remove ${item.product.name} from cart`}
                            >
                              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <span className="text-sm sm:text-base font-bold text-primary">
                              {formatPrice(unitPrice)}
                            </span>
                            {hasDiscount && (
                              <span className="text-[11px] sm:text-xs text-muted-foreground line-through">
                                {formatPrice(item.product.price)}
                              </span>
                            )}
                            {!item.product.inStock && (
                              <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-[10px] sm:text-xs font-medium text-destructive">
                                Out of stock
                              </span>
                            )}
                          </div>

                          {/* Qty + line total */}
                          <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                            <QuantitySelector
                              value={item.quantity}
                              onChange={(qty) => updateQuantity(item.product.id, qty)}
                            />
                            <div className="text-right">
                              <p className="text-[10px] sm:text-xs text-muted-foreground">Total</p>
                              <p className="text-sm sm:text-lg font-bold">{formatPrice(lineTotal)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Order summary — desktop sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-20">
            <Card>
              <CardContent className="p-5 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold">Order Summary</h2>

                <div className="mt-4 sm:mt-5 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                    </span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    {shipping === 0 ? (
                      <span className="font-medium text-green-600">FREE</span>
                    ) : (
                      <span className="font-medium">{formatPrice(shipping)}</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Tax ({Math.round(TAX_RATE * 100)}%)
                    </span>
                    <span className="font-medium">{formatPrice(tax)}</span>
                  </div>
                </div>

                <Separator className="my-4 sm:my-5" />

                <div className="flex items-baseline justify-between">
                  <span className="text-base font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes</p>

                <Button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="mt-5 sm:mt-6 w-full"
                  size="lg"
                  disabled={isAuthLoading}
                >
                  {isAuthLoading ? "Loading..." : isAuthenticated ? "Proceed to Checkout" : "Login to Checkout"}
                  <ArrowRight className="ml-1 h-5 w-5" />
                </Button>
                {!isAuthenticated && (
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    Your cart will be saved while you log in.
                  </p>
                )}

                <Button asChild variant="outline" className="mt-3 w-full">
                  <Link href="/products">Continue shopping</Link>
                </Button>

                <div className="mt-4 sm:mt-5 flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-xs">
                  <Tag className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-muted-foreground">
                    Have a promo code? You can apply it at checkout.
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Trust badges */}
            <div className="mt-3 sm:mt-4 grid grid-cols-1 gap-3 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-1">
              <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                <span>Secure checkout &amp; safe payments</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
                <Truck className="h-4 w-4 text-primary shrink-0" />
                <span>Free shipping over {formatPrice(FREE_SHIPPING_THRESHOLD)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile sticky checkout bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-lg font-bold text-primary leading-tight">{formatPrice(total)}</p>
          </div>
          <Button
            type="button"
            onClick={handleProceedToCheckout}
            className="flex-1 h-11"
            disabled={isAuthLoading}
          >
            {isAuthLoading ? "Loading..." : isAuthenticated ? "Checkout" : "Login to Checkout"}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
