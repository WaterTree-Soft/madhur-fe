"use client";

import { useEffect, useState } from "react";
import { Loader2, X, ShieldAlert, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const PRESET_REASONS = [
  { label: "Changed my mind",            emoji: "🤔" },
  { label: "Ordered by mistake",          emoji: "😅" },
  { label: "Found a better price",        emoji: "💰" },
  { label: "Delivery is taking too long", emoji: "⏳" },
  { label: "Wrong item or quantity",      emoji: "📦" },
  { label: "Other",                       emoji: "✏️" },
] as const;

interface CancelOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderRef: string;
  onConfirm: (reason: string) => Promise<void>;
}

export function CancelOrderDialog({
  open,
  onOpenChange,
  orderRef,
  onConfirm,
}: CancelOrderDialogProps) {
  const [selected, setSelected] = useState<string>("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setSelected("");
      setDetails("");
      setSubmitting(false);
      setError(null);
    }
  }, [open]);

  const isOther = selected === "Other";
  const trimmedDetails = details.trim();
  const canSubmit = Boolean(selected && (!isOther || trimmedDetails.length >= 4));

  async function handleSubmit() {
    if (!canSubmit || submitting) return;
    const reason = isOther ? trimmedDetails : selected;
    const finalReason =
      !isOther && trimmedDetails ? `${selected} — ${trimmedDetails}` : reason;
    setSubmitting(true);
    setError(null);
    try {
      await onConfirm(finalReason);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  const shortRef = orderRef.slice(0, 10) + (orderRef.length > 10 ? "…" : "");

  return (
    <Dialog open={open} onOpenChange={submitting ? () => {} : onOpenChange}>
      <DialogContent
        showClose={false}
        className="flex max-h-[88svh] flex-col gap-0 overflow-hidden p-0 sm:max-w-sm"
      >
        {/* Single close button — absolute to the panel, above everything */}
        <DialogClose
          disabled={submitting}
          className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-white opacity-70 transition hover:opacity-100 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>

        {/* Header — fixed, never scrolls */}
        <div className="relative shrink-0 bg-linear-to-br from-rose-500 via-rose-600 to-red-700 px-4 pb-6 pt-4 text-white sm:px-5 sm:pb-7 sm:pt-5">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />

          <div className="relative flex items-center gap-3 sm:gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 shadow-inner backdrop-blur-sm">
              <ShieldAlert className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-white sm:text-lg">
                Cancel Order?
              </DialogTitle>
              <p className="mt-0.5 text-xs text-rose-100">
                Order{" "}
                <span className="rounded bg-white/20 px-1.5 py-0.5 font-mono text-xs font-semibold">
                  {shortRef}
                </span>
              </p>
            </div>
          </div>

          <p className="relative mt-2.5 text-xs leading-relaxed text-rose-100">
            This action <span className="font-semibold text-white">cannot be undone</span>.
            Tell us why you&apos;re cancelling — it helps us get better.
          </p>

          {/* Decorative bottom wave */}
          <div className="pointer-events-none absolute -bottom-px left-0 right-0 h-4 overflow-hidden">
            <svg viewBox="0 0 400 16" preserveAspectRatio="none" className="h-full w-full fill-background">
              <path d="M0,16 C100,0 300,0 400,16 L400,16 L0,16 Z" />
            </svg>
          </div>
        </div>

        {/* Body — scrollable on small screens */}
        <div className="flex-1 space-y-3 overflow-y-auto px-4 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-4">

          {/* Reason grid */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Select a reason
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {PRESET_REASONS.map(({ label, emoji }) => {
                const active = selected === label;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setSelected(label)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-xs font-medium transition-all duration-150",
                      active
                        ? "border-rose-400 bg-rose-50 text-rose-900 shadow-sm ring-1 ring-rose-300 dark:border-rose-700 dark:bg-rose-950/40 dark:text-rose-100 dark:ring-rose-800"
                        : "border-border bg-card text-foreground hover:border-rose-200 hover:bg-rose-50/40 dark:hover:border-rose-900/50 dark:hover:bg-rose-950/20"
                    )}
                  >
                    <span className="text-sm leading-none">{emoji}</span>
                    <span className="leading-snug">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details textarea */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {isOther ? "Tell us what happened" : "Anything else? (optional)"}
            </label>
            <Textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder={isOther ? "Please share a brief reason…" : "Optional extra details…"}
              maxLength={300}
              rows={2}
              className="resize-none text-sm"
            />
            <p className="mt-1 text-right text-[11px] text-muted-foreground">
              {details.length}/300
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Keep Order
            </Button>
            <Button
              type="button"
              className="flex-1 bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600"
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
            >
              {submitting
                ? <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" />Cancelling…</>
                : "Yes, Cancel"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
