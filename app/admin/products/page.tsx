"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import {
  ProductFormDialog,
  type StrapiProductFull,
} from "@/features/admin/components/product-form-dialog";
import { ConfirmDeleteDialog } from "@/features/admin/components/confirm-delete-dialog";

export default function AdminProductsPage() {
  const [products, setProducts]     = useState<StrapiProductFull[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing]       = useState<StrapiProductFull | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toDelete, setToDelete]     = useState<StrapiProductFull | null>(null);

  async function fetchProducts() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/products?pageSize=100");
      if (!res.ok) throw new Error(`Failed to fetch products (${res.status})`);
      const json = await res.json();
      setProducts(json.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeletingId(toDelete.id);
    try {
      const res = await fetch(`/api/admin/products/${toDelete.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setProducts((prev) => prev.filter((p) => p.id !== toDelete.id));
      setToDelete(null);
    } catch {
      alert("Failed to delete product. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  useEffect(() => { fetchProducts(); }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
        <Loader2 className="h-7 w-7 animate-spin" />
        <p className="text-sm">Loading products…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-sm border border-destructive/30 bg-destructive/5 py-16 text-center">
        <p className="text-sm text-destructive">{error}</p>
        <Button size="sm" onClick={fetchProducts}>Retry</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3">
        <h1 className="text-xl sm:text-3xl font-bold">Manage Products</h1>
        <Button size="sm" onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Add Product</span>
        </Button>
      </div>

      <Card className="overflow-hidden">
        {products.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-12 text-center rounded-sm">
            <Package className="h-10 w-10 text-muted-foreground/40" />
            <p className="font-medium">No products yet</p>
            <p className="text-sm text-muted-foreground">Add your first product to get started.</p>
          </div>
        ) : (
          <>
            {/* Mobile card list */}
            <ul className="divide-y divide-border sm:hidden">
              {products.map((product) => (
                <li key={product.id} className="px-4 py-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm leading-snug">{product.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{product.category?.name ?? "No category"}</p>
                    </div>
                    <Badge variant={product.inStock ? "success" : "destructive"} className="text-xs shrink-0 mt-0.5">
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium tabular-nums">{formatPrice(product.price)}</span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8"
                        onClick={() => { setEditing(product); setDialogOpen(true); }}
                        aria-label={`Edit ${product.name}`}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8"
                        onClick={() => setToDelete(product)}
                        disabled={deletingId === product.id}
                        aria-label={`Delete ${product.name}`}>
                        {deletingId === product.id
                          ? <Loader2 className="h-4 w-4 animate-spin" />
                          : <Trash2 className="h-4 w-4 text-destructive" />}
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
                    <th className="text-left p-4 font-medium">Product</th>
                    <th className="text-left p-4 font-medium">Category</th>
                    <th className="text-left p-4 font-medium">Price</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-muted/50">
                      <td className="p-4 font-medium">{product.name}</td>
                      <td className="p-4 text-muted-foreground">{product.category?.name ?? "—"}</td>
                      <td className="p-4 tabular-nums">{formatPrice(product.price)}</td>
                      <td className="p-4">
                        <Badge variant={product.inStock ? "success" : "destructive"} className="text-xs px-2">
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8"
                            onClick={() => { setEditing(product); setDialogOpen(true); }}
                            aria-label={`Edit ${product.name}`}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8"
                            onClick={() => setToDelete(product)}
                            disabled={deletingId === product.id}
                            aria-label={`Delete ${product.name}`}>
                            {deletingId === product.id
                              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              : <Trash2 className="h-3.5 w-3.5 text-destructive" />}
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

      <ProductFormDialog open={dialogOpen} onOpenChange={setDialogOpen} product={editing} onSaved={fetchProducts} />
      <ConfirmDeleteDialog
        open={toDelete !== null}
        onOpenChange={(open) => { if (!open) setToDelete(null); }}
        itemName={toDelete?.name}
        title="Delete product?"
        loading={deletingId !== null}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
