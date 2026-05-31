"use client";

import { useCallback, useEffect, useState } from "react";
import { Package, Loader2, XCircle, Ban, Download, MapPin, Clock, IndianRupee } from "lucide-react";
import { downloadInvoice } from "@/lib/invoice";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { OrderStatusBadge, type OrderStatus } from "@/components/ui/order-status-badge";
import { formatPrice } from "@/lib/utils";
import { useAuthStore } from "@/features/auth/store/auth-store";
import type { Address } from "@/types";
import { CancelOrderDialog } from "./cancel-order-dialog";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface StrapiOrder {
  id: number;
  documentId?: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paid: boolean;
  address: Address;
  createdAt: string;
  cancellationReason?: string | null;
  cancelledAt?: string | null;
  razorpayPaymentId?: string | null;
}

const CANCELLABLE: OrderStatus[] = ["pending", "confirmed"];

export function OrderHistory() {
  const jwt = useAuthStore((s) => s.jwt);
  const [orders, setOrders]           = useState<StrapiOrder[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<StrapiOrder | null>(null);

  const loadOrders = useCallback(async () => {
    if (!jwt) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/orders/my", {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message ?? "Failed to load orders");
      const list: StrapiOrder[] = Array.isArray(data?.data)
        ? data.data.map((o: StrapiOrder & { attributes?: StrapiOrder }) => ({
            ...(o.attributes ?? o),
            id: o.id,
            documentId: o.documentId,
          }))
        : [];
      setOrders(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [jwt]);

  useEffect(() => { void loadOrders(); }, [loadOrders]);

  async function handleConfirmCancel(reason: string) {
    if (!cancelTarget || !jwt) return;
    const ref = cancelTarget.documentId ?? String(cancelTarget.id);
    const res = await fetch(`/api/orders/${ref}/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
      body: JSON.stringify({ reason }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.error?.message ?? data?.error ?? "Failed to cancel order");
    }
    setCancelTarget(null);
    await loadOrders();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl border bg-muted/30 p-8 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading your orders…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border bg-muted/30 p-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Package className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="font-semibold text-foreground">No orders yet</p>
        <p className="text-sm text-muted-foreground">When you place an order it will appear here.</p>
      </div>
    );
  }

  return (
    <>
      <ul className="space-y-4">
        {orders.map((o) => {
          const orderRef = o.documentId ?? String(o.id);
          const shortRef = orderRef.length > 12 ? orderRef.slice(0, 12) + "…" : orderRef;
          const canCancel = CANCELLABLE.includes(o.status);

          return (
            <li key={orderRef}>
              <Card className="overflow-hidden">
                <CardContent className="p-0">

                  {/* ── Card header ── */}
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 border-b bg-muted/20 px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">Order</span>
                      <span className="font-mono text-xs font-semibold sm:hidden">{shortRef}</span>
                      <span className="hidden font-mono text-xs font-semibold sm:inline">{orderRef}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(o.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </span>
                      <OrderStatusBadge status={o.status} />
                    </div>
                  </div>

                  <div className="px-4 py-4 sm:px-5">
                    {/* Cancellation reason */}
                    {o.status === "cancelled" && o.cancellationReason && (
                      <div className="mb-4 flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive/70" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Cancellation reason
                          </p>
                          <p className="mt-0.5 text-sm">{o.cancellationReason}</p>
                          {o.cancelledAt && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              Cancelled on{" "}
                              {new Date(o.cancelledAt).toLocaleDateString("en-IN", {
                                day: "numeric", month: "short", year: "numeric",
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Items */}
                    <ul className="space-y-2">
                      {(o.items ?? []).map((item, i) => (
                        <li
                          key={`${orderRef}-${item.productId}-${i}`}
                          className="flex items-center justify-between gap-2 text-sm"
                        >
                          <span className="min-w-0 flex-1 truncate text-foreground">
                            {item.name}
                            <span className="ml-1.5 text-xs text-muted-foreground">× {item.quantity}</span>
                          </span>
                          <span className="shrink-0 font-medium tabular-nums">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Separator className="my-3" />

                    {/* Address + total */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <div className="flex min-w-0 items-start gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span className="leading-relaxed">
                          {o.address?.name}, {o.address?.line1}
                          {o.address?.line2 ? `, ${o.address.line2}` : ""},{" "}
                          {o.address?.city} – {o.address?.pincode}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:gap-1">
                        <div className="flex items-center gap-1 text-lg font-bold text-primary">
                          <IndianRupee className="h-4 w-4" />
                          {o.total.toLocaleString("en-IN")}
                        </div>
                        <Badge variant={o.paid ? "default" : "secondary"} className="text-xs">
                          {o.paid ? "Paid" : "Pay on delivery"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* ── Actions footer ── */}
                  <div className="flex items-center justify-between gap-2 border-t bg-muted/20 px-4 py-2.5 sm:px-5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1.5 text-xs"
                      onClick={() =>
                        downloadInvoice({
                          orderRef,
                          createdAt: o.createdAt,
                          items: o.items ?? [],
                          total: o.total,
                          paid: o.paid,
                          address: o.address,
                          razorpayPaymentId: o.razorpayPaymentId,
                        })
                      }
                    >
                      <Download className="h-3.5 w-3.5" />
                      Invoice
                    </Button>

                    {canCancel && (
                      <button
                        type="button"
                        onClick={() => setCancelTarget(o)}
                        className="flex items-center gap-1.5 rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-medium text-rose-600 transition-all hover:bg-rose-600 hover:text-white dark:border-rose-800 dark:bg-transparent dark:text-rose-400 dark:hover:bg-rose-700 dark:hover:text-white"
                      >
                        <Ban className="h-3.5 w-3.5" />
                        Cancel
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>

      <CancelOrderDialog
        open={!!cancelTarget}
        onOpenChange={(open) => { if (!open) setCancelTarget(null); }}
        orderRef={cancelTarget?.documentId ?? String(cancelTarget?.id ?? "")}
        onConfirm={handleConfirmCancel}
      />
    </>
  );
}
