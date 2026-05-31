"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import {
  Loader2,
  MapPin,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Sparkles,
  PackageCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/ui/back-button";
import { formatPrice } from "@/lib/utils";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { useCartStore } from "@/features/cart/store/cart-store";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { useAddressStore } from "@/features/account/store/address-store";
import {
  AddressForm,
  type AddressFormValue,
} from "@/features/account/components/address-form";
import type { Address } from "@/types";
import { useSiteSettings } from "@/lib/hooks/use-site-settings";

export default function CheckoutPage() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const items = useCartStore((s) => s.items);
  const getTotal = useCartStore((s) => s.getTotal);
  const getItemCount = useCartStore((s) => s.getItemCount);
  const clearCart = useCartStore((s) => s.clearCart);

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isAuthLoading = useAuthStore((s) => s.isLoading);
  const openLoginDialog = useAuthStore((s) => s.openLoginDialog);

  const { freeShippingThreshold: FREE_SHIPPING_THRESHOLD, shippingFee: SHIPPING_FEE, taxRate: TAX_RATE } = useSiteSettings();

  const savedAddresses = useAddressStore((s) => s.addresses);
  const addAddress = useAddressStore((s) => s.addAddress);
  const setDefault = useAddressStore((s) => s.setDefault);

  const userAddresses = useMemo(
    () => (user ? savedAddresses.filter((a) => a.userId === user.id) : []),
    [savedAddresses, user]
  );

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);

  // Trigger login dialog for unauthenticated visitors.
  useEffect(() => {
    if (mounted && !isAuthLoading && !isAuthenticated && !orderPlaced) {
      router.replace("/");
      openLoginDialog();
    }
  }, [mounted, isAuthLoading, isAuthenticated, orderPlaced, router, openLoginDialog]);

  useEffect(() => {
    if (!orderPlaced) return;
    if (countdown <= 0) { router.push("/profile"); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [orderPlaced, countdown, router]);

  // Pick a default selected address once saved list arrives.
  useEffect(() => {
    if (!mounted || selectedAddressId) return;
    if (userAddresses.length === 0) return;
    const def = userAddresses.find((a) => a.isDefault) ?? userAddresses[0];
    setSelectedAddressId(def.id);
  }, [mounted, userAddresses, selectedAddressId]);

  if (!mounted) {
    return (
      <div className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-7xl flex-col px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="mt-8 flex-1 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (isAuthLoading || (!isAuthenticated && !orderPlaced)) {
    return null;
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-4xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center rounded-2xl border bg-card px-6 py-20 text-center shadow-sm">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <ShoppingBag className="h-10 w-10 text-primary" />
          </div>
          <h1 className="mt-6 text-3xl font-bold">Your cart is empty</h1>
          <p className="mt-3 max-w-md text-muted-foreground">
            Add some items to your cart before checking out.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-4xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-green-200/70 bg-linear-to-br from-white via-green-50/70 to-emerald-50 px-6 py-16 text-center shadow-[0_25px_70px_-20px_rgba(16,185,129,0.35)] dark:border-emerald-900/40 dark:from-background dark:via-emerald-950/20 dark:to-background">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.18),transparent_60%)]" />

          <Sparkles className="success-sparkle pointer-events-none absolute left-8 top-10 h-5 w-5 text-amber-400" style={{ animationDelay: "0s" }} />
          <Sparkles className="success-sparkle pointer-events-none absolute right-10 top-16 h-6 w-6 text-emerald-400" style={{ animationDelay: "0.6s" }} />
          <Sparkles className="success-sparkle pointer-events-none absolute bottom-12 left-16 h-4 w-4 text-emerald-500" style={{ animationDelay: "1.2s" }} />
          <Sparkles className="success-sparkle pointer-events-none absolute bottom-16 right-14 h-5 w-5 text-amber-400" style={{ animationDelay: "0.3s" }} />

          <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
            <span className="success-ring-pulse absolute inset-0 rounded-full bg-emerald-500/30" />
            <span className="success-ring absolute inset-0 rounded-full bg-linear-to-br from-emerald-400 to-green-600 shadow-[0_10px_30px_rgba(16,185,129,0.45)]" />
            <svg
              viewBox="0 0 52 52"
              className="relative h-16 w-16 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M14 27 L22 35 L38 18"
                stroke="currentColor"
                strokeWidth="5"
                className="success-check-path"
              />
            </svg>
          </div>

          <h1 className="relative mt-8 text-4xl font-bold tracking-tight sm:text-5xl">
            Order Placed!
          </h1>
          <p className="relative mx-auto mt-3 max-w-md text-muted-foreground">
            Thank you for shopping with us. Your sweets are being prepared —
            we&apos;ll send a confirmation shortly.
          </p>

          {orderId && (
            <div className="relative mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/70 px-4 py-2 text-sm shadow-sm backdrop-blur dark:border-emerald-900/40 dark:bg-background/60">
              <PackageCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono font-semibold text-foreground">
                {orderId}
              </span>
            </div>
          )}

          <p className="relative mt-6 text-sm text-muted-foreground">
            Redirecting to your orders in{" "}
            <span className="font-semibold tabular-nums text-foreground">{countdown}s</span>
            …
          </p>

          <div className="relative mt-4 flex justify-center">
            <Button asChild size="lg" variant="outline">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const itemCount = getItemCount();
  const subtotal = getTotal();
  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + shipping + tax;

  async function handleAddAddress(value: AddressFormValue) {
    if (!user) return;
    const { label, ...address } = value;
    const saved = await addAddress(user.id, address, label);
    setSelectedAddressId(saved.id);
    setShowAddForm(false);
  }

  async function handleRazorpayCheckout() {
    if (!user) return;
    const selected = userAddresses.find((a) => a.id === selectedAddressId);
    if (!selected) {
      setSubmitError("Please select or add a delivery address.");
      return;
    }

    const orderAddress: Address = {
      name: selected.name,
      phone: selected.phone,
      line1: selected.line1,
      line2: selected.line2,
      city: selected.city,
      state: selected.state,
      pincode: selected.pincode,
    };

    const orderItems = items.map((item) => ({
      product: String(item.product.id),
      name: item.product.name,
      price: item.product.discountPrice ?? item.product.price,
      quantity: item.quantity,
      image: item.product.images?.[0] ?? undefined,
    }));

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      // Step 1: create Razorpay order on our backend
      const rzpOrderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(total * 100), currency: "INR" }),
      });
      if (!rzpOrderRes.ok) {
        const errPayload = await rzpOrderRes.json().catch(() => null);
        const reason = errPayload?.reason ?? errPayload?.error ?? "Unknown error";
        throw new Error(`Could not initiate payment: ${reason}`);
      }
      const { order_id, amount: rzpAmount, currency, key_id } = await rzpOrderRes.json();

      // Step 2: open Razorpay modal
      setIsSubmitting(false);
      await new Promise<void>((resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rzp = new (window as any).Razorpay({
          key: key_id,
          order_id,
          amount: rzpAmount,
          currency,
          name: "Madhur Sweets",
          description: `Order of ${orderItems.length} item${orderItems.length > 1 ? "s" : ""}`,
          prefill: { name: user.name, email: user.email, contact: selected.phone },
          theme: { color: "#8b3000" },
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) => {
            try {
              // Step 3: verify signature
              const verifyRes = await fetch("/api/razorpay/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response),
              });
              if (!verifyRes.ok) throw new Error("Payment verification failed.");

              // Step 4: save order in Strapi as paid
              setIsSubmitting(true);
              const orderRes = await fetch("/api/orders/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId: user.id,
                  items: orderItems,
                  total,
                  address: orderAddress,
                  paid: true,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                }),
              });
              if (!orderRes.ok) {
                const errData = await orderRes.json();
                throw new Error(errData?.error?.message ?? "Failed to save order.");
              }
              const orderData = await orderRes.json();
              setOrderId(orderData.data?.documentId ?? orderData.data?.id ?? null);
              clearCart();
              setOrderPlaced(true);
              resolve();
            } catch (err) {
              reject(err);
            } finally {
              setIsSubmitting(false);
            }
          },
          modal: {
            ondismiss: () => reject(new Error("cancelled")),
          },
        });
        rzp.on("payment.failed", (response: { error: { description: string } }) => {
          reject(new Error(response.error?.description ?? "Payment failed."));
        });
        rzp.open();
      });
    } catch (err) {
      if (err instanceof Error && err.message !== "cancelled") {
        setSubmitError(err.message || "Something went wrong. Please try again.");
      }
      setIsSubmitting(false);
    }
  }

  const hasAddresses = userAddresses.length > 0;

  return (
    <div className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-7xl flex-col px-4 py-10 sm:px-6 lg:px-8">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="mb-8">
        <BackButton href="/cart" label="Back to cart" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Checkout
        </h1>
        <p className="mt-1 text-muted-foreground">
          {itemCount} {itemCount === 1 ? "item" : "items"} &middot;{" "}
          {formatPrice(total)}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <section className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold">Delivery Address</h2>
                </div>
                {hasAddresses && !showAddForm && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddForm(true)}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add new
                  </Button>
                )}
              </div>

              {hasAddresses && !showAddForm && (
                <ul className="space-y-3">
                  {userAddresses.map((a) => {
                    const active = a.id === selectedAddressId;
                    return (
                      <li key={a.id}>
                        <label
                          className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                            active
                              ? "border-primary bg-primary/5"
                              : "hover:border-primary/40"
                          }`}
                        >
                          <input
                            type="radio"
                            name="address"
                            value={a.id}
                            checked={active}
                            onChange={() => setSelectedAddressId(a.id)}
                            className="mt-1 h-4 w-4 accent-primary"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold">
                                {a.label ?? a.name}
                              </p>
                              {a.isDefault && (
                                <Badge variant="secondary">Default</Badge>
                              )}
                            </div>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                              {a.name} · +91 {a.phone}
                            </p>
                            <p className="mt-0.5 text-sm">
                              {a.line1}
                              {a.line2 ? `, ${a.line2}` : ""}, {a.city},{" "}
                              {a.state} - {a.pincode}
                            </p>
                            {active && !a.isDefault && user && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setDefault(user.id, a.id);
                                }}
                                className="mt-2 text-xs font-medium text-primary hover:underline"
                              >
                                Make this my default
                              </button>
                            )}
                          </div>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}

              {(showAddForm || !hasAddresses) && (
                <div className={hasAddresses ? "mt-6 border-t pt-6" : undefined}>
                  <h3 className="mb-4 text-base font-semibold">
                    {hasAddresses ? "Add a new address" : "Enter delivery address"}
                  </h3>
                  <AddressForm
                    initial={{ name: user?.name ?? "" }}
                    submitLabel={
                      hasAddresses ? "Save & use this address" : "Save address"
                    }
                    onCancel={
                      hasAddresses ? () => setShowAddForm(false) : undefined
                    }
                    onSubmit={handleAddAddress}
                  />
                </div>
              )}

              {submitError && (
                <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                  {submitError}
                </p>
              )}
            </CardContent>
          </Card>
        </section>

        <aside className="lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold">Order Summary</h2>

                <ul className="mt-4 space-y-3">
                  {items.map((item) => {
                    const unitPrice =
                      item.product.discountPrice ?? item.product.price;
                    return (
                      <li key={item.product.id} className="flex gap-3">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                          <Image
                            src={item.product.images?.[0] || PLACEHOLDER_IMAGE}
                            alt={item.product.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.quantity} &times; {formatPrice(unitPrice)}
                          </p>
                        </div>
                        <p className="text-sm font-medium">
                          {formatPrice(unitPrice * item.quantity)}
                        </p>
                      </li>
                    );
                  })}
                </ul>

                <Separator className="my-5" />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    {shipping === 0 ? (
                      <span className="font-medium text-green-600 dark:text-green-400">
                        FREE
                      </span>
                    ) : (
                      <span className="font-medium">
                        {formatPrice(shipping)}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Tax ({Math.round(TAX_RATE * 100)}%)
                    </span>
                    <span className="font-medium">{formatPrice(tax)}</span>
                  </div>
                </div>

                <Separator className="my-5" />

                <div className="flex items-baseline justify-between">
                  <span className="text-base font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(total)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Inclusive of all taxes
                </p>

                <Button
                  type="button"
                  className="mt-6 w-full"
                  size="lg"
                  disabled={isSubmitting || !selectedAddressId}
                  onClick={handleRazorpayCheckout}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay ${formatPrice(total)}`
                  )}
                </Button>

                {!selectedAddressId && (
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    Add a delivery address to continue.
                  </p>
                )}

                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Secured by Razorpay. UPI, cards, netbanking accepted.
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-3 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-1">
              <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Secure checkout &amp; safe payments</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
                <Truck className="h-4 w-4 text-primary" />
                <span>
                  Free shipping over {formatPrice(FREE_SHIPPING_THRESHOLD)}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
