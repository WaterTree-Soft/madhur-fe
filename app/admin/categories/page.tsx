"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Loader2, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CategoryFormDialog,
  type StrapiCategoryFull,
} from "@/features/admin/components/category-form-dialog";
import { ConfirmDeleteDialog } from "@/features/admin/components/confirm-delete-dialog";

type CategoryWithCount = StrapiCategoryFull & { productCount?: number };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<StrapiCategoryFull | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<StrapiCategoryFull | null>(null);

  async function fetchCategories() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/categories?pageSize=100");
      if (!res.ok) throw new Error(`Failed to fetch categories (${res.status})`);
      const json = await res.json();
      setCategories(json.data ?? []);
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
      const res = await fetch(`/api/admin/categories/${toDelete.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setCategories((prev) => prev.filter((c) => c.id !== toDelete.id));
      setToDelete(null);
    } catch {
      alert("Failed to delete category. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  useEffect(() => { fetchCategories(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={fetchCategories}>Retry</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3">
        <h1 className="text-xl sm:text-3xl font-bold">Manage Categories</h1>
        <Button size="sm" onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Add Category</span>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            {category.image && (
              <div className="relative aspect-video">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                  unoptimized
                />
              </div>
            )}
            <CardHeader className="p-3 sm:p-6 pb-0 sm:pb-0">
              <div className="flex items-start justify-between gap-1">
                <CardTitle className="text-sm sm:text-lg leading-tight">{category.name}</CardTitle>
                <Badge variant="secondary" className="text-xs shrink-0">
                  {category.productCount ?? 0}
                  <span className="hidden sm:inline"> products</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-2 sm:pt-3">
              <p className="text-muted-foreground text-xs sm:text-sm mb-3 line-clamp-2">{category.description}</p>
              <div className="flex gap-1.5 sm:gap-2">
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs h-7 sm:h-9 px-2 sm:px-3" onClick={() => { setEditing(category); setDialogOpen(true); }}>
                  <Pencil className="h-3 w-3 sm:mr-1" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none text-xs h-7 sm:h-9 px-2 sm:px-3"
                  onClick={() => setToDelete(category)}
                  disabled={deletingId === category.id}
                >
                  {deletingId === category.id ? (
                    <Loader2 className="h-3 w-3 sm:mr-1 animate-spin" />
                  ) : (
                    <Trash2 className="h-3 w-3 sm:mr-1 text-destructive" />
                  )}
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {categories.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
              <FolderOpen className="h-10 w-10 text-muted-foreground/40" />
              <p className="font-medium">No categories yet</p>
              <p className="text-sm text-muted-foreground">Add your first category to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <CategoryFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editing}
        onSaved={fetchCategories}
      />

      <ConfirmDeleteDialog
        open={toDelete !== null}
        onOpenChange={(open) => { if (!open) setToDelete(null); }}
        itemName={toDelete?.name}
        title="Delete category?"
        loading={deletingId !== null}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
