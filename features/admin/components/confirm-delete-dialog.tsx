"use client";

import { Loader2, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName?: string;
  title?: string;
  description?: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  itemName,
  title = "Delete item?",
  description,
  confirmLabel = "Delete",
  loading = false,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  const body =
    description ??
    (itemName
      ? `"${itemName}" will be permanently deleted. This action cannot be undone.`
      : "This action cannot be undone.");

  return (
    <Dialog open={open} onOpenChange={loading ? () => {} : onOpenChange}>
      <DialogContent
        showClose={false}
        className="flex max-w-sm flex-col gap-0 overflow-hidden p-0"
      >
        {/* Close button */}
        <DialogClose
          disabled={loading}
          className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-white/70 transition hover:text-white disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>

        {/* Header */}
        <div className="relative bg-linear-to-br from-red-600 via-rose-600 to-pink-600 px-5 pb-6 pt-5 text-white">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_60%)]" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-white/20 shadow-inner backdrop-blur-sm">
              <Trash2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-white">
                {title}
              </DialogTitle>
              {itemName && (
                <p className="mt-0.5 text-xs text-rose-100">
                  <span className="rounded bg-white/20 px-1.5 py-0.5 font-medium">
                    {itemName}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 pb-5 pt-4">
          <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>

          <div className="mt-5 flex gap-2.5">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1 rounded-sm border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-linear-to-br from-red-600 to-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-red-700 hover:to-rose-700 hover:shadow-md disabled:pointer-events-none disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              {confirmLabel}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
