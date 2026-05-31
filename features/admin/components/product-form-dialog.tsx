"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ExpressCategory = {
  id: string;
  name: string;
  slug: string;
};

export type StrapiProductFull = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  discountPrice: number | null;
  inStock: boolean;
  weight: string;
  ingredients: string | null;
  shelfLife: string | null;
  rating: number;
  reviewCount: number;
  images: string[] | null;
  category: ExpressCategory | null;
};

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: StrapiProductFull | null;
  onSaved: () => void;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const emptyForm = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  price: "",
  discountPrice: "",
  weight: "",
  ingredients: "",
  shelfLife: "",
  inStock: true,
  categoryId: "",
};

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  onSaved,
}: ProductFormDialogProps) {
  const isEdit = Boolean(product);

  const [form, setForm] = useState(emptyForm);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<ExpressCategory[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setError(null);
    setNewFiles([]);

    if (product) {
      setForm({
        name: product.name ?? "",
        slug: product.slug ?? "",
        shortDescription: product.shortDescription ?? "",
        description: product.description ?? "",
        price: String(product.price ?? ""),
        discountPrice:
          product.discountPrice !== null && product.discountPrice !== undefined
            ? String(product.discountPrice)
            : "",
        weight: product.weight ?? "",
        ingredients: product.ingredients ?? "",
        shelfLife: product.shelfLife ?? "",
        inStock: Boolean(product.inStock),
        categoryId: product.category?.id ?? "",
      });
      setExistingImages(product.images ?? []);
    } else {
      setForm(emptyForm);
      setExistingImages([]);
    }
  }, [open, product]);

  useEffect(() => {
    if (!open) return;
    fetch("/api/admin/categories?pageSize=100")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load categories");
        return res.json();
      })
      .then((json: { data: ExpressCategory[] }) => {
        setCategories(json.data ?? []);
        setCategoriesLoaded(true);
      })
      .catch(() => { setCategories([]); setCategoriesLoaded(true); });
  }, [open]);

  const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleNameChange = (value: string) => {
    setForm((prev) => {
      const shouldSyncSlug =
        !isEdit && (prev.slug === "" || prev.slug === slugify(prev.name));
      return {
        ...prev,
        name: value,
        slug: shouldSyncSlug ? slugify(value) : prev.slug,
      };
    });
  };

  const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    const invalid = picked.filter((f) => !ALLOWED_IMAGE_TYPES.includes(f.type));
    if (invalid.length) {
      setError("Only PNG, JPG/JPEG, and WebP images are allowed.");
      e.target.value = "";
      return;
    }
    if (picked.length) setNewFiles((prev) => [...prev, ...picked]);
    e.target.value = "";
  };

  const removeNewFile = (index: number) =>
    setNewFiles((prev) => prev.filter((_, i) => i !== index));

  const removeExistingImage = (url: string) =>
    setExistingImages((prev) => prev.filter((u) => u !== url));

  async function uploadNewFiles(): Promise<string[]> {
    if (newFiles.length === 0) return [];
    const cat = categories.find((c) => c.id === form.categoryId);
    const catSlug = cat?.slug ?? slugify(cat?.name ?? "uncategorized");
    const prodSlug = form.slug || slugify(form.name) || "product";
    const fd = new FormData();
    fd.append("folder", `products/${catSlug}/${prodSlug}`);
    for (const f of newFiles) fd.append("files", f);

    const res = await fetch("/api/admin/upload/multiple", { method: "POST", body: fd });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.error ?? "Image upload failed");
    }
    const json = await res.json();
    const uploaded: { url: string }[] = json.data ?? json;
    return uploaded.map((u) => u.url);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!form.categoryId) return setError("Category is required");
    if (!form.name.trim()) return setError("Name is required");
    if (!form.shortDescription.trim()) return setError("Short description is required");
    if (!form.description.trim()) return setError("Description is required");
    if (!form.price || Number(form.price) <= 0) return setError("Price must be greater than 0");
    if (!form.weight.trim()) return setError("Weight is required");

    const totalImages = existingImages.length + newFiles.length;
    if (totalImages === 0) return setError("At least one image is required");

    setSubmitting(true);
    try {
      const newUrls = await uploadNewFiles();
      const images = [...existingImages, ...newUrls];

      const payload: Record<string, unknown> = {
        name: form.name.trim(),
        slug: form.slug.trim() || slugify(form.name),
        shortDescription: form.shortDescription.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
        weight: form.weight.trim(),
        ingredients: form.ingredients.trim() || null,
        shelfLife: form.shelfLife.trim() || null,
        inStock: form.inStock,
        images,
      };
      if (form.categoryId) payload.category = form.categoryId;

      const url = isEdit ? `/api/admin/products/${product!.id}` : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const details = data?.details ? Object.values(data.details).flat().join(", ") : null;
        throw new Error(details ?? data?.error ?? `Failed to ${isEdit ? "update" : "create"} product`);
      }

      onSaved();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85svh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Product" : "Add Product"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the product details and save."
              : "Fill in product details and upload at least one photo."}
          </DialogDescription>
        </DialogHeader>

        {categoriesLoaded && categories.length === 0 && (
          <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            No categories exist yet. Please{" "}
            <a href="/admin/categories" className="underline font-medium">
              create a category
            </a>{" "}
            before adding a product.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-2">
              <span className="text-sm font-medium">Name *</span>
              <Input
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium">Slug *</span>
              <Input
                value={form.slug}
                onChange={(e) => setField("slug", e.target.value)}
                required
              />
            </label>
          </div>

          <label className="space-y-2 block">
            <span className="text-sm font-medium">Short description *</span>
            <Input
              value={form.shortDescription}
              onChange={(e) => setField("shortDescription", e.target.value)}
              maxLength={255}
              required
            />
          </label>

          <label className="space-y-2 block">
            <span className="text-sm font-medium">Description *</span>
            <Textarea
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              rows={4}
              required
            />
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <label className="space-y-2">
              <span className="text-sm font-medium">MRP / Original Price (₹) *</span>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 500"
                value={form.price}
                onChange={(e) => setField("price", e.target.value)}
                required
              />
            </label>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="sale-price">
                Sale Price (₹)
                <span className="ml-1 text-xs text-muted-foreground font-normal">(optional)</span>
              </label>
              <Input
                id="sale-price"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 399"
                value={form.discountPrice}
                onChange={(e) => setField("discountPrice", e.target.value)}
              />
              {form.price && form.discountPrice && Number(form.discountPrice) < Number(form.price) && (
                <p className="text-xs text-green-600 font-medium">
                  Customer saves ₹{(Number(form.price) - Number(form.discountPrice)).toFixed(0)}
                  {" "}({Math.round(((Number(form.price) - Number(form.discountPrice)) / Number(form.price)) * 100)}% off)
                </p>
              )}
              {form.price && form.discountPrice && Number(form.discountPrice) >= Number(form.price) && (
                <p className="text-xs text-destructive">Sale price must be less than original price</p>
              )}
            </div>
            <label className="space-y-2">
              <span className="text-sm font-medium">Weight *</span>
              <Input
                value={form.weight}
                onChange={(e) => setField("weight", e.target.value)}
                placeholder="e.g. 500g"
                required
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-2">
              <span className="text-sm font-medium">Shelf life</span>
              <Input
                value={form.shelfLife}
                onChange={(e) => setField("shelfLife", e.target.value)}
                placeholder="e.g. 7 days"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium">Category *</span>
              <select
                value={form.categoryId}
                onChange={(e) => setField("categoryId", e.target.value)}
                className="flex h-10 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">— Select category —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="space-y-2 block">
            <span className="text-sm font-medium">Ingredients</span>
            <Textarea
              value={form.ingredients}
              onChange={(e) => setField("ingredients", e.target.value)}
              rows={2}
            />
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => setField("inStock", e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            <span className="text-sm font-medium">In stock</span>
          </label>

          <div className="space-y-2">
            <span className="text-sm font-medium">Images *</span>
            <div className="flex flex-wrap gap-3">
              {existingImages.map((url) => (
                <div
                  key={url}
                  className="relative h-20 w-20 rounded-sm overflow-hidden border"
                >
                  <Image
                    src={url}
                    alt="product image"
                    fill
                    className="object-cover"
                    sizes="80px"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(url)}
                    className="absolute top-0.5 right-0.5 rounded-full bg-black/60 text-white p-0.5 hover:bg-black/80"
                    aria-label="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {newFiles.map((file, i) => (
                <div
                  key={`new-${i}`}
                  className="relative h-20 w-20 rounded-sm overflow-hidden border bg-muted flex items-center justify-center"
                >
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => removeNewFile(i)}
                    className="absolute top-0.5 right-0.5 rounded-full bg-black/60 text-white p-0.5 hover:bg-black/80"
                    aria-label="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="h-20 w-20 rounded-sm border-2 border-dashed border-input flex flex-col items-center justify-center cursor-pointer hover:bg-muted text-muted-foreground">
                <Upload className="h-5 w-5" />
                <span className="text-[10px] mt-1">Add</span>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp"
                  multiple
                  onChange={handleFilePick}
                  className="sr-only"
                />
              </label>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || (categoriesLoaded && categories.length === 0)}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "Save changes" : "Create product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
