"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { SITE_URL } from "@/lib/constants";

interface ShareButtonProps {
  slug: string;
  name: string;
}

export function ShareButton({ slug, name }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const url = `${SITE_URL}/products/${slug}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: name, url });
      } catch {
        // user cancelled — do nothing
      }
      return;
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={`Share ${name}`}
      className="absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white hover:shadow-lg"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-600" />
      ) : (
        <Share2 className="h-3.5 w-3.5 text-primary" />
      )}
    </button>
  );
}
