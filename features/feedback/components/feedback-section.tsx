"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import type { Feedback } from "@/types";
import { FeedbackForm } from "./feedback-form";
import { FeedbackList } from "./feedback-list";

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

interface FeedbackSectionProps {
  productId: string;
}

export function FeedbackSection({ productId }: FeedbackSectionProps) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = useCallback(async () => {
    try {
      const res = await fetch(`/api/feedback?productId=${productId}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      const list: StrapiFeedback[] = (json.data ?? []).map(
        (o: StrapiFeedback & { attributes?: StrapiFeedback }) => ({
          ...(o.attributes ?? o),
          id: o.id,
          documentId: o.documentId,
        })
      );

      const mapped: Feedback[] = list.map((f) => ({
        id: String(f.id),
        productId: f.productId,
        rating: f.rating,
        comment: f.comment,
        createdAt: f.createdAt,
        user: {
          id: String(f.user?.id ?? ""),
          name: f.user?.username ?? "Anonymous",
          email: f.user?.email ?? "",
          role: "user",
          createdAt: f.createdAt,
        },
      }));

      setFeedbacks(mapped);
    } catch {
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  return (
    <section className="space-y-6">
      <FeedbackForm productId={productId} onSubmitted={fetchFeedbacks} />
      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <FeedbackList feedbacks={feedbacks} />
      )}
    </section>
  );
}
