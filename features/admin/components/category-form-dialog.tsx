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

export type StrapiCategoryFull = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
};

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: StrapiCategoryFull | null;
  onSaved: () => void;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const emptyForm = { name: "", slug: "", description: "" };

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  onSaved,
}: CategoryFormDialogProps) {
  const isEdit = Boolean(category);

  const [form, setForm] = useState(emptyForm);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setNewFile(null);
    if (category) {
      setForm({
        name: category.name ?? "",
        slug: category.slug ?? "",
        description: category.description ?? "",
      });
      setExistingImage(category.image ?? null);
    } else {
      setForm(emptyForm);
      setExistingImage(null);
    }
  }, [open, category]);

  const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleNameChange = (value: string) => {
    setForm((prev) => {
      const shouldSyncSlug =
        !isEdit && (prev.slug === "" || prev.slug === slugify(prev.name));
      return { ...prev, name: value, slug: shouldSyncSlug ? slugify(value) : prev.slug };
    });
  };

  const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (picked) {
      if (!ALLOWED_IMAGE_TYPES.includes(picked.type)) {
        setError("Only PNG, JPG/JPEG, and WebP images are allowed.");
        e.target.value = "";
        return;
      }
      setNewFile(picked);
      setExistingImage(null);
    }
    e.target.value = "";
  };

  async function uploadFile(): Promise<string | null> {
    if (!newFile) return null;
    const catSlug = form.slug || slugify(form.name) || "category";
    const fd = new FormData();
    fd.append("folder", `categories/${catSlug}`);
    fd.append("file", newFile);

    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.error ?? "Image upload failed");
    }
    const json = await res.json();
    return (json.data?.url ?? json.url) ?? null;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) return setError("Name is required");
    if (!form.description.trim()) return setError("Description is required");
    if (!existingImage && !newFile) return setError("An image is required");

    setSubmitting(true);
    try {
      const uploadedUrl = await uploadFile();
      const image = uploadedUrl ?? existingImage ?? "";

      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || slugify(form.name),
        description: form.description.trim(),
        image,
      };

      const url = isEdit
        ? `/api/admin/categories/${category!.id}`
        : "/api/admin/categories";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const details = data?.details ? Object.values(data.details).flat().join(", ") : null;
        throw new Error(details ?? data?.error ?? `Failed to ${isEdit ? "update" : "create"} category`);
      }

      onSaved();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const previewSrc = newFile ? URL.createObjectURL(newFile) : existingImage;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85svh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Category" : "Add Category"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the category details and save." : "Fill in category details and upload an image."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <label className="space-y-2 block">
            <span className="text-sm font-medium">Name *</span>
            <Input value={form.name} onChange={(e) => handleNameChange(e.target.value)} required />
          </label>

          <label className="space-y-2 block">
            <span className="text-sm font-medium">Slug *</span>
            <Input value={form.slug} onChange={(e) => setField("slug", e.target.value)} required />
          </label>

          <label className="space-y-2 block">
            <span className="text-sm font-medium">Description *</span>
            <Textarea value={form.description} onChange={(e) => setField("description", e.target.value)} rows={3} required />
          </label>

          <div className="space-y-2">
            <span className="text-sm font-medium">Image *</span>
            <div className="flex flex-wrap gap-3">
              {previewSrc ? (
                <div className="relative h-24 w-24 rounded-sm overflow-hidden border">
                  <Image src={previewSrc} alt="category image" fill className="object-cover" sizes="96px" unoptimized />
                  <button
                    type="button"
                    onClick={() => { setExistingImage(null); setNewFile(null); }}
                    className="absolute top-0.5 right-0.5 rounded-full bg-black/60 text-white p-0.5 hover:bg-black/80"
                    aria-label="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label className="h-24 w-24 rounded-sm border-2 border-dashed border-input flex flex-col items-center justify-center cursor-pointer hover:bg-muted text-muted-foreground">
                  <Upload className="h-5 w-5" />
                  <span className="text-[10px] mt-1">Upload</span>
                  <input type="file" accept=".png,.jpg,.jpeg,.webp" onChange={handleFilePick} className="sr-only" />
                </label>
              )}
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "Save changes" : "Create category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
