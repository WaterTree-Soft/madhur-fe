"use client";

import { WHATSAPP_NUMBER } from "@/lib/constants";
import { useSiteSettings } from "./site-settings-provider";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M16.003 0C7.165 0 0 7.165 0 16c0 2.823.737 5.475 2.029 7.776L0 32l8.422-2.014A15.93 15.93 0 0 0 16.003 32C24.842 32 32 24.835 32 16S24.842 0 16.003 0Zm0 29.27c-2.45 0-4.834-.66-6.917-1.91l-.496-.296-5.001 1.196 1.213-4.879-.323-.512A13.227 13.227 0 0 1 2.733 16C2.733 8.683 8.683 2.733 16.003 2.733 23.32 2.733 29.27 8.683 29.27 16c0 7.317-5.95 13.27-13.267 13.27Zm7.282-9.94c-.4-.2-2.362-1.166-2.728-1.3-.366-.133-.633-.2-.9.2-.266.4-1.032 1.3-1.265 1.566-.233.267-.466.3-.866.1-.4-.2-1.687-.62-3.213-1.978-1.188-1.06-1.989-2.369-2.222-2.769-.233-.4-.025-.616.175-.815.18-.18.4-.466.6-.7.2-.233.266-.4.4-.666.133-.267.066-.5-.034-.7-.1-.2-.9-2.166-1.232-2.966-.325-.78-.654-.673-.9-.687-.233-.012-.5-.014-.766-.014a1.47 1.47 0 0 0-1.066.5c-.366.4-1.4 1.366-1.4 3.333 0 1.966 1.433 3.866 1.633 4.133.2.266 2.82 4.306 6.832 6.04.954.412 1.7.657 2.281.842.958.305 1.83.262 2.52.159.769-.114 2.362-.966 2.694-1.9.333-.933.333-1.733.233-1.9-.1-.166-.366-.266-.766-.466Z" />
    </svg>
  );
}

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
      <WhatsAppIcon className="h-7 w-7 text-white" />
    </a>
  );
}
