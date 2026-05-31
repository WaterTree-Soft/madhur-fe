"use client";

import { MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { useSiteSettings } from "./site-settings-provider";

export function WhatsAppButton() {
  const settings = useSiteSettings();
  const number = settings?.whatsappNumber || WHATSAPP_NUMBER;

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-13 w-13 items-center justify-center rounded-full shadow-lg shadow-green-500/25 transition-all duration-200 hover:scale-110 hover:shadow-xl hover:shadow-green-500/30"
      style={{ backgroundColor: "#25D366" }}
    >
      <MessageCircle className="h-6 w-6 text-white" />
    </a>
  );
}
