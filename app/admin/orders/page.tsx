"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  OrderStatusBadge,
  type OrderStatus,
} from "@/components/ui/order-status-badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Eye, Loader2, Download } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Address } from "@/types";
import { downloadInvoice } from "@/lib/invoice";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface StrapiOrder {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paid: boolean;
  address: Address;
  createdAt: string;
  razorpayPaymentId?: string | null;
}

const ALL_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<StrapiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [viewOrder, setViewOrder] = useState<StrapiOrder | null>(null);

  const [statusTarget, setStatusTarget] = useState<StrapiOrder | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>("pending");
  const [updating, setUpdating] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.set("status", filterStatus);
      const res = await fetch(`/api/admin/orders?${params}`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const json = await res.json();
      setOrders(json.data ?? []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    setLoading(true);
    fetchOrders();
  }, [fetchOrders]);

  async function handleUpdateStatus() {
    if (!statusTarget) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${statusTarget.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err?.error ?? "Failed to update status");
        return;
      }
      await fetchOrders();
    } catch {
      alert("Something went wrong");
    } finally {
      setUpdating(false);
      setStatusTarget(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-xl sm:text-3xl font-bold">Manage Orders</h1>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-35 sm:w-45 text-xs sm:text-sm h-8 sm:h-10">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {ALL_STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-hidden">
        {orders.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">No orders found.</p>
        ) : (
          <>
            {/* Mobile card list */}
            <ul className="divide-y divide-border sm:hidden">
              {orders.map((order) => (
                <li key={order.id} className="px-4 py-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm">{order.address?.name ?? order.userId}</p>
                      <p className="font-mono text-xs text-muted-foreground mt-0.5">{order.id.slice(0, 10)}…</p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium tabular-nums">{formatPrice(order.total)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8"
                        onClick={() => setViewOrder(order)} title="View order">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8"
                        title="Download invoice"
                        onClick={() => downloadInvoice({ orderRef: order.id, createdAt: order.createdAt, items: order.items ?? [], total: order.total, paid: order.paid, address: order.address, razorpayPaymentId: order.razorpayPaymentId })}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 px-3 text-xs"
                        onClick={() => { setStatusTarget(order); setNewStatus(order.status); }}>
                        Update Status
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4 font-medium">Order ID</th>
                    <th className="text-left p-4 font-medium">Customer</th>
                    <th className="text-left p-4 font-medium">Total</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Date</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/50">
                      <td className="p-4 font-mono font-medium">{order.id.slice(0, 8)}…</td>
                      <td className="p-4 max-w-40 truncate">{order.address?.name ?? order.userId}</td>
                      <td className="p-4 tabular-nums whitespace-nowrap">{formatPrice(order.total)}</td>
                      <td className="p-4"><OrderStatusBadge status={order.status} /></td>
                      <td className="p-4 text-muted-foreground whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8"
                            onClick={() => setViewOrder(order)} title="View order">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8"
                            title="Download invoice"
                            onClick={() => downloadInvoice({ orderRef: order.id, createdAt: order.createdAt, items: order.items ?? [], total: order.total, paid: order.paid, address: order.address, razorpayPaymentId: order.razorpayPaymentId })}>
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs whitespace-nowrap"
                            onClick={() => { setStatusTarget(order); setNewStatus(order.status); }}>
                            Update Status
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>

      {/* View order detail dialog */}
      <Dialog
        open={!!viewOrder}
        onOpenChange={(open) => {
          if (!open) setViewOrder(null);
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Order ID: {viewOrder?.id}
            </DialogDescription>
          </DialogHeader>

          {viewOrder && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <OrderStatusBadge status={viewOrder.status} />
                <span className="text-sm text-muted-foreground">
                  {new Date(viewOrder.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium mb-2">Items</p>
                <ul className="space-y-2 text-sm">
                  {(viewOrder.items ?? []).map((item, i) => (
                    <li
                      key={`${item.productId}-${i}`}
                      className="flex justify-between gap-3"
                    >
                      <span>
                        {item.name}{" "}
                        <span className="text-muted-foreground">
                          x {item.quantity}
                        </span>
                      </span>
                      <span className="font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div className="flex justify-between text-sm">
                <span className="font-medium">Total</span>
                <span className="text-lg font-bold text-primary">
                  {formatPrice(viewOrder.total)}
                </span>
              </div>

              <Separator />

              {viewOrder.address && (
                <div className="text-sm">
                  <p className="font-medium mb-1">Delivery Address</p>
                  <p className="text-muted-foreground">
                    {viewOrder.address.name}, {viewOrder.address.phone}
                  </p>
                  <p className="text-muted-foreground">
                    {viewOrder.address.line1}
                    {viewOrder.address.line2
                      ? `, ${viewOrder.address.line2}`
                      : ""}
                    , {viewOrder.address.city}, {viewOrder.address.state} -{" "}
                    {viewOrder.address.pincode}
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewOrder(null)}>
              Close
            </Button>
            {viewOrder && (
              <Button
                onClick={() =>
                  downloadInvoice({
                    orderRef: viewOrder.id,
                    createdAt: viewOrder.createdAt,
                    items: viewOrder.items ?? [],
                    total: viewOrder.total,
                    paid: viewOrder.paid,
                    address: viewOrder.address,
                    razorpayPaymentId: viewOrder.razorpayPaymentId,
                  })
                }
              >
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update status dialog */}
      <Dialog
        open={!!statusTarget}
        onOpenChange={(open) => {
          if (!open && !updating) setStatusTarget(null);
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Order: {statusTarget?.id.slice(0, 8)}...
            </DialogDescription>
          </DialogHeader>

          <Select
            value={newStatus}
            onValueChange={(v) => setNewStatus(v as OrderStatus)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ALL_STATUSES.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setStatusTarget(null)}
              disabled={updating}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} disabled={updating}>
              {updating && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
