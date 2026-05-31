"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Briefcase,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDeleteDialog } from "@/features/admin/components/confirm-delete-dialog";

export type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  active: boolean;
  order: number;
};

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];

const emptyForm = {
  title: "",
  department: "",
  location: "",
  type: "Full-time",
  description: "",
  active: true,
  order: 0,
};

function JobFormDialog({
  open,
  onOpenChange,
  job,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  job: Job | null;
  onSaved: () => void;
}) {
  const isEdit = Boolean(job);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    if (job) {
      setForm({
        title: job.title,
        department: job.department,
        location: job.location,
        type: job.type,
        description: job.description,
        active: job.active,
        order: job.order,
      });
    } else {
      setForm(emptyForm);
    }
  }, [open, job]);

  const setField = <K extends keyof typeof emptyForm>(k: K, v: (typeof emptyForm)[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.title.trim()) return setError("Title is required");
    if (!form.department.trim()) return setError("Department is required");
    if (!form.location.trim()) return setError("Location is required");
    if (!form.description.trim()) return setError("Description is required");

    setSubmitting(true);
    try {
      const url = isEdit ? `/api/admin/jobs/${job!.id}` : "/api/admin/jobs";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          department: form.department.trim(),
          location: form.location.trim(),
          type: form.type,
          description: form.description.trim(),
          active: form.active,
          order: form.order,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? `Failed to ${isEdit ? "update" : "create"} job`);
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
          <DialogTitle>{isEdit ? "Edit Job Listing" : "Add Job Listing"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the job details and save."
              : "Add a new job opening to the careers page."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <label className="space-y-1.5 block">
            <span className="text-sm font-medium">Job title *</span>
            <Input
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="Store Manager"
              required
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-1.5 block">
              <span className="text-sm font-medium">Department *</span>
              <Input
                value={form.department}
                onChange={(e) => setField("department", e.target.value)}
                placeholder="Operations"
                required
              />
            </label>
            <label className="space-y-1.5 block">
              <span className="text-sm font-medium">Location *</span>
              <Input
                value={form.location}
                onChange={(e) => setField("location", e.target.value)}
                placeholder="New Delhi"
                required
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <span className="text-sm font-medium block">Job type *</span>
              <div className="flex flex-wrap gap-2">
                {JOB_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setField("type", t)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      form.type === t
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <label className="space-y-1.5 block">
              <span className="text-sm font-medium">Display order</span>
              <Input
                type="number"
                value={form.order}
                onChange={(e) => setField("order", Number(e.target.value))}
                placeholder="0"
              />
              <span className="text-xs text-muted-foreground">Lower numbers appear first</span>
            </label>
          </div>

          <label className="space-y-1.5 block">
            <span className="text-sm font-medium">Description *</span>
            <Textarea
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              rows={4}
              placeholder="Describe the role, responsibilities, and requirements…"
              required
            />
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setField("active", e.target.checked)}
              className="h-4 w-4 rounded border-input accent-primary"
            />
            <span className="text-sm font-medium">
              Active{" "}
              <span className="font-normal text-muted-foreground">(visible on careers page)</span>
            </span>
          </label>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "Save changes" : "Create listing"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminCareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Job | null>(null);
  const [toDelete, setToDelete] = useState<Job | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/jobs?pageSize=100");
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
      setJobs(json?.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  async function confirmDelete() {
    if (!toDelete) return;
    setDeletingId(toDelete.id);
    try {
      const res = await fetch(`/api/admin/jobs/${toDelete.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setJobs((prev) => prev.filter((j) => j.id !== toDelete.id));
      setToDelete(null);
    } catch {
      alert("Failed to delete job listing. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold">Careers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage job listings shown on the careers page.
          </p>
        </div>
        <Button
          onClick={() => { setEditing(null); setDialogOpen(true); }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add listing</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {error && (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 py-12 text-center mb-6">
          <p className="text-sm text-destructive">{error}</p>
          <Button size="sm" onClick={fetchJobs}>Retry</Button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-border py-20 text-center">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <p className="mt-4 font-semibold text-muted-foreground">No job listings yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your first opening to populate the careers page.
          </p>
          <Button
            onClick={() => { setEditing(null); setDialogOpen(true); }}
            className="mt-5 gap-2"
          >
            <Plus className="h-4 w-4" />
            Add your first listing
          </Button>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className={job.active ? "" : "opacity-60"}>
              <CardHeader className="pb-2 sm:pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-base sm:text-lg leading-snug">{job.title}</CardTitle>
                      {!job.active && (
                        <Badge variant="secondary" className="text-[10px] uppercase tracking-wide shrink-0">
                          Hidden
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="secondary" className="text-xs">{job.department}</Badge>
                      <Badge variant="outline" className="text-xs">{job.type}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0 mt-0.5">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => { setEditing(job); setDialogOpen(true); }}
                      aria-label={`Edit ${job.title}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setToDelete(job)}
                      disabled={deletingId === job.id}
                      aria-label={`Delete ${job.title}`}
                    >
                      {deletingId === job.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground mb-2">
                  <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                  {job.location}
                </div>
                <p className="text-foreground/90 text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3">
                  {job.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <JobFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        job={editing}
        onSaved={fetchJobs}
      />

      <ConfirmDeleteDialog
        open={toDelete !== null}
        onOpenChange={(open) => { if (!open) setToDelete(null); }}
        itemName={toDelete?.title}
        title="Delete job listing?"
        loading={deletingId !== null}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
