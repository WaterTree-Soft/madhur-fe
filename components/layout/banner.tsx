"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useSiteSettings } from "./site-settings-provider";

const STORAGE_KEY = "banner-dismissed";

interface BannerProps {
  message: string;
  link?: string;
}

export function Banner({ message: fallbackMessage, link: fallbackLink }: BannerProps) {
  const settings = useSiteSettings();
  const [visible, setVisible] = useState(false);

  const message = settings?.bannerMessage || fallbackMessage;
  const link = settings?.bannerLink || fallbackLink;
  const active = settings ? settings.bannerActive : true;

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  function handleDismiss() {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "true");
  }

  if (!visible || !active || !message) return null;

  return (
    <div
      className="text-white animate-in slide-in-from-top duration-300"
      style={{
        background: "linear-gradient(to right, hsl(var(--banner-bg-from)), hsl(var(--banner-bg-via)), hsl(var(--banner-bg-to)))",
      }}
    >
      <div className="flex min-h-9 items-center justify-between gap-3 px-3 py-1.5 sm:px-4 sm:py-0 sm:h-(--banner-height,40px)">
        {/* Spacer to balance the close button */}
        <div className="w-6 shrink-0" />

        <p className="flex-1 text-center text-[10px] sm:text-xs font-medium leading-snug tracking-wide">
          {link ? (
            <Link href={link} className="underline underline-offset-4 hover:opacity-90 transition-opacity">
              {message}
            </Link>
          ) : (
            message
          )}
        </p>

        <button
          onClick={handleDismiss}
          className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-white/20 hover:bg-white/35 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Dismiss banner"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
