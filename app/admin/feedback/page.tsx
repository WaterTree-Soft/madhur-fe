"use client";

import { useCallback, useEffect, useState } from "react";
import { Star, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface StrapiFeedback {
  id: number;
  documentId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    id: number;
    username: string;
    email: string;
  };
}

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<StrapiFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<StrapiFeedback | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchFeedbacks = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/feedback");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      const list: StrapiFeedback[] = (json.data ?? []).map(
        (o: StrapiFeedback & { attributes?: StrapiFeedback }) => ({
          ...(o.attributes ?? o),
          id: o.id,
          documentId: o.documentId,
        })
      );
      setFeedbacks(list);
    } catch {
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `/api/admin/feedback/${deleteTarget.documentId}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        alert("Failed to delete feedback");
        return;
      }
      await fetchFeedbacks();
    } catch {
      alert("Something went wrong");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
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
      <div className="flex items-center justify-between mb-6 gap-3">
        <h1 className="text-xl sm:text-3xl font-bold">Manage Feedback</h1>
        <Badge variant="secondary" className="shrink-0">{feedbacks.length} reviews</Badge>
      </div>

      {feedbacks.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No feedback found.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((fb) => {
            const userName = fb.user?.username ?? "Anonymous";
            const initials = userName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            return (
              <Card key={fb.documentId ?? String(fb.id)}>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 sm:gap-4 min-w-0">
                      <Avatar className="h-8 w-8 sm:h-10 sm:w-10 shrink-0">
                        <AvatarFallback className="text-xs sm:text-sm">{initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                          <span className="text-sm sm:text-base font-medium">{userName}</span>
                          <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 truncate max-w-24 sm:max-w-none">{fb.productId}</Badge>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${i < fb.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">{fb.comment}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                          {new Date(fb.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 shrink-0" onClick={() => setDeleteTarget(fb)}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Confirm delete dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteTarget(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Feedback?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this review by{" "}
              <strong>{deleteTarget?.user?.username ?? "Anonymous"}</strong>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
