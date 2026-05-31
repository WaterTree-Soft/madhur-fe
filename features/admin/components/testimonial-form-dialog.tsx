"use client";

import { useEffect, useState } from "react";
import { Loader2, Star } from "lucide-react";
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

export type StrapiTestimonialFull = {
  id: string;
  name: string;
  location: string;
  rating: number;
  quote: string;
  initial?: string;
  active: boolean;
  order: number;
};

interface TestimonialFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonial?: StrapiTestimonialFull | null;
  onSaved: () => void;
}

const emptyForm = {
  name: "",
  location: "",
  rating: 5,
  quote: "",
  initial: "",
  active: true,
  order: 0,
};

export function TestimonialFormDialog({
  open,
  onOpenChange,
  testimonial,
  onSaved,
}: TestimonialFormDialogProps) {
  const isEdit = Boolean(testimonial);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);

    if (testimonial) {
      setForm({
        name: testimonial.name ?? "",
        location: testimonial.location ?? "",
        rating: testimonial.rating ?? 5,
        quote: testimonial.quote ?? "",
        initial: testimonial.initial ?? "",
        active: testimonial.active ?? true,
        order: testimonial.order ?? 0,
      });
    } else {
      setForm(emptyForm);
    }
  }, [open, testimonial]);

  const setField = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) return setError("Name is required");
    if (!form.quote.trim()) return setError("Quote is required");
    if (form.rating < 1 || form.rating > 5)
      return setError("Rating must be between 1 and 5");

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        location: form.location.trim(),
        rating: form.rating,
        quote: form.quote.trim(),
        initial:
          form.initial.trim().slice(0, 1).toUpperCase() ||
          form.name.trim().charAt(0).toUpperCase(),
        active: form.active,
        order: form.order,
      };

      const url = isEdit
        ? `/api/admin/testimonials/${testimonial!.id}`
        : "/api/admin/testimonials";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? `Failed to ${isEdit ? "update" : "create"} testimonial`);
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
      <DialogContent className="max-w-lg max-h-[85svh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Testimonial" : "Add Testimonial"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the testimonial details and save."
              : "Add a customer testimonial to display on the homepage carousel."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-2 block">
              <span className="text-sm font-medium">Customer name *</span>
              <Input
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Priya Sharma"
                required
              />
            </label>

            <label className="space-y-2 block">
              <span className="text-sm font-medium">Location</span>
              <Input
                value={form.location}
                onChange={(e) => setField("location", e.target.value)}
                placeholder="Mumbai, Maharashtra"
              />
            </label>
          </div>

          <label className="space-y-2 block">
            <span className="text-sm font-medium">Quote *</span>
            <Textarea
              value={form.quote}
              onChange={(e) => setField("quote", e.target.value)}
              rows={4}
              placeholder="The aloo bhujia tastes exactly like..."
              required
            />
            <span className="text-xs text-muted-foreground">
              {form.quote.length} characters
            </span>
          </label>

          <div>
            <span className="text-sm font-medium block mb-2">Rating *</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setField("rating", star)}
                  className="p-0.5 transition-transform hover:scale-110"
                  aria-label={`${star} stars`}
                >
                  <Star
                    className={
                      star <= form.rating
                        ? "h-7 w-7 fill-amber-400 text-amber-400"
                        : "h-7 w-7 text-muted-foreground/30"
                    }
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {form.rating} / 5
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-2 block">
              <span className="text-sm font-medium">
                Avatar initial{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </span>
              <Input
                value={form.initial}
                onChange={(e) =>
                  setField("initial", e.target.value.slice(0, 1).toUpperCase())
                }
                maxLength={1}
                placeholder={form.name.charAt(0).toUpperCase() || "P"}
              />
              <span className="text-xs text-muted-foreground">
                Defaults to first letter of name
              </span>
            </label>

            <label className="space-y-2 block">
              <span className="text-sm font-medium">Display order</span>
              <Input
                type="number"
                value={form.order}
                onChange={(e) => setField("order", Number(e.target.value))}
                placeholder="0"
              />
              <span className="text-xs text-muted-foreground">
                Lower numbers show first
              </span>
            </label>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setField("active", e.target.checked)}
              className="h-4 w-4 rounded border-input accent-primary"
            />
            <span className="text-sm font-medium">
              Active{" "}
              <span className="text-muted-foreground font-normal">
                (visible on homepage)
              </span>
            </span>
          </label>

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
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "Save changes" : "Create testimonial"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
