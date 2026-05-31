"use client";

import type React from "react";
import Link from "next/link";
import { Globe, Share2, MessageCircle } from "lucide-react";
import { FOOTER_LINKS, SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";

export function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(to bottom right, hsl(var(--footer-bg-from)), hsl(var(--footer-bg-to)))",
        color: "hsl(var(--footer-text))",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-5">
            <Link
              href="/"
              className="text-xl font-bold transition-colors duration-200"
              style={{ color: "hsl(var(--footer-accent))" }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.2)")}
              onMouseLeave={(e) => (e.currentTarget.style.filter = "")}
            >
              {SITE_NAME}
            </Link>
            <p className="text-sm leading-relaxed opacity-80">
              {SITE_DESCRIPTION}
            </p>
            <div className="flex items-center gap-3 pt-1">
              {[
                { icon: Globe, label: "Website" },
                { icon: Share2, label: "Share" },
                { icon: MessageCircle, label: "Chat" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 opacity-80 transition-all duration-200 hover:scale-105 hover:opacity-100"
                  style={
                    {
                      "--hover-bg": "hsl(var(--footer-accent))",
                    } as React.CSSProperties
                  }
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "hsl(var(--footer-accent))";
                    (e.currentTarget as HTMLElement).style.color = "hsl(var(--footer-bg-from))";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "";
                    (e.currentTarget as HTMLElement).style.color = "";
                  }}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {[
            { title: "Company", links: FOOTER_LINKS.company },
            { title: "Legal", links: FOOTER_LINKS.legal },
            { title: "Support", links: FOOTER_LINKS.support },
          ].map(({ title, links }) => (
            <div key={title}>
              <h3
                className="mb-5 text-xs font-semibold uppercase tracking-widest"
                style={{ color: "hsl(var(--footer-accent))" }}
              >
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm opacity-80 transition-colors duration-200"
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color = "hsl(var(--footer-accent))";
                        (e.currentTarget as HTMLElement).style.opacity = "1";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color = "";
                        (e.currentTarget as HTMLElement).style.opacity = "";
                      }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-16 border-t pt-8"
          style={{ borderColor: "hsl(var(--footer-accent) / 0.2)" }}
        >
          <div className="flex flex-col items-center justify-between gap-3 text-xs opacity-60 sm:flex-row">
            <p>&copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
            <p>Made with love in India</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
