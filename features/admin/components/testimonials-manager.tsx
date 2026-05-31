"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Loader2,
  MessageCircle,
  Pencil,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TestimonialFormDialog,
  type StrapiTestimonialFull,
} from "@/features/admin/components/testimonial-form-dialog";
import { ConfirmDeleteDialog } from "@/features/admin/components/confirm-delete-dialog";

export function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<StrapiTestimonialFull[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<StrapiTestimonialFull | null>(null);
  const [toDelete, setToDelete] = useState<StrapiTestimonialFull | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/testimonials?pageSize=100");
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(json?.error ?? `HTTP ${res.status}`);
      }
      setTestimonials(json?.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  async function confirmDelete() {
    if (!toDelete) return;
    setDeletingId(toDelete.id);
    try {
      const res = await fetch(
        `/api/admin/testimonials/${toDelete.id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Delete failed");
      setTestimonials((prev) =>
        prev.filter((t) => t.id !== toDelete.id)
      );
      setToDelete(null);
    } catch {
      alert("Failed to delete testimonial. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  function openAdd() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(t: StrapiTestimonialFull) {
    setEditing(t);
    setDialogOpen(true);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-secondary" />
          <CardTitle className="text-lg">Homepage Testimonials</CardTitle>
        </div>
        <Button onClick={openAdd} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add testimonial
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-5">
          Customer quotes shown in the homepage carousel. Lower display-order
          numbers appear first. Inactive testimonials are hidden from the public
          site.
        </p>

        {error && (
          <p className="text-sm text-destructive mb-4">Error: {error}</p>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : testimonials.length === 0 ? (
          <div className="rounded-sm border-2 border-dashed border-border py-12 text-center">
            <MessageCircle className="mx-auto h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm text-muted-foreground">
              No testimonials yet. Add your first one to populate the homepage
              carousel.
            </p>
            <Button onClick={openAdd} className="mt-4 gap-2" size="sm">
              <Plus className="h-4 w-4" />
              Add your first testimonial
            </Button>
          </div>
        ) : (
          <ul className="space-y-3">
            {testimonials.map((t) => (
              <li
                key={t.id}
                className="flex items-start gap-4 rounded-sm border bg-card p-4 transition-colors hover:bg-muted/30"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary to-secondary text-sm font-bold text-white">
                  {(t.initial?.trim() || t.name.charAt(0)).toUpperCase()}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{t.name}</p>
                    {t.location && (
                      <span className="text-xs text-muted-foreground">
                        · {t.location}
                      </span>
                    )}
                    {!t.active && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] uppercase tracking-wide"
                      >
                        Hidden
                      </Badge>
                    )}
                    <span className="ml-auto flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={
                            i < t.rating
                              ? "h-3.5 w-3.5 fill-amber-400 text-amber-400"
                              : "h-3.5 w-3.5 text-muted-foreground/25"
                          }
                        />
                      ))}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-foreground/85 line-clamp-2">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Display order: {t.order ?? 0}
                  </p>
                </div>

                <div className="flex shrink-0 gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(t)}
                    aria-label={`Edit testimonial from ${t.name}`}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setToDelete(t)}
                    disabled={deletingId === t.id}
                    aria-label={`Delete testimonial from ${t.name}`}
                  >
                    {deletingId === t.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    )}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <TestimonialFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        testimonial={editing}
        onSaved={fetchTestimonials}
      />

      <ConfirmDeleteDialog
        open={toDelete !== null}
        onOpenChange={(open) => {
          if (!open) setToDelete(null);
        }}
        itemName={toDelete?.name}
        title="Delete testimonial?"
        loading={deletingId !== null}
        onConfirm={confirmDelete}
      />
    </Card>
  );
}
