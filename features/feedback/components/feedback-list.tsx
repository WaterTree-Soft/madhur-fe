import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Feedback } from "@/types";

interface FeedbackListProps {
  feedbacks: Feedback[];
}

export function FeedbackList({ feedbacks }: FeedbackListProps) {
  if (feedbacks.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No reviews yet. Be the first to share your experience!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {feedbacks.map((feedback) => {
        const initials = feedback.user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);

        return (
          <div key={feedback.id} className="flex gap-3 border-b pb-4 last:border-0">
            <Avatar className="h-8 w-8 shrink-0">
              {feedback.user.avatar ? (
                <AvatarImage
                  src={feedback.user.avatar}
                  alt={feedback.user.name}
                />
              ) : null}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {feedback.user.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(feedback.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Star
                    key={value}
                    className={`h-4 w-4 ${
                      value <= feedback.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>

              {feedback.comment && (
                <p className="text-sm text-muted-foreground">
                  {feedback.comment}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
