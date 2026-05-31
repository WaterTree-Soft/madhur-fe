"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export interface SiteSettings {
  whatsappNumber: string;
  bannerMessage: string;
  bannerLink: string;
  bannerActive: boolean;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

const SiteSettingsContext = createContext<SiteSettings | null>(null);

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

function hexToHsl(hex: string): string | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return null;
  let r = parseInt(m[1], 16) / 255;
  let g = parseInt(m[2], 16) / 255;
  let b = parseInt(m[3], 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return `0 0% ${Math.round(l * 100)}%`;
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then(async (res) => {
        if (!res.ok) return;
        const json = await res.json();
        const d = json?.data;
        if (!d) return;
        setSettings({
          whatsappNumber: d.whatsappNumber ?? "",
          bannerMessage: d.bannerMessage ?? "",
          bannerLink: d.bannerLink ?? "",
          bannerActive: d.bannerActive ?? true,
          primaryColor: d.primaryColor ?? "",
          secondaryColor: d.secondaryColor ?? "",
          accentColor: d.accentColor ?? "",
        });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!settings) return;
    const root = document.documentElement;

    const primaryHsl = settings.primaryColor ? hexToHsl(settings.primaryColor) : null;
    const secondaryHsl = settings.secondaryColor ? hexToHsl(settings.secondaryColor) : null;
    const accentHsl = settings.accentColor ? hexToHsl(settings.accentColor) : null;

    // Derive footer and banner colours from the primary hue/saturation
    function withLightness(hsl: string, l: number) {
      const [h, s] = hsl.split(" ");
      return `${h} ${s} ${l}%`;
    }

    const vars: [string, string | null][] = [
      ["--brand-primary", primaryHsl],
      ["--brand-secondary", secondaryHsl],
      ["--brand-accent", accentHsl],
      ["--ring", primaryHsl],
      // Banner inherits primary hue
      ...(primaryHsl ? [
        ["--banner-bg-from", withLightness(primaryHsl, 27)] as [string, string],
        ["--banner-bg-via",  withLightness(primaryHsl, 38)] as [string, string],
        ["--banner-bg-to",   withLightness(primaryHsl, 27)] as [string, string],
        // Footer: very dark shade of primary hue
        ["--footer-bg-from", withLightness(primaryHsl, 18)] as [string, string],
        ["--footer-bg-to",   withLightness(primaryHsl, 13)] as [string, string],
      ] : []),
      // Footer accent tracks the brand accent
      ["--footer-accent", accentHsl],
    ];

    for (const [prop, val] of vars) {
      if (val) root.style.setProperty(prop, val);
    }

    return () => {
      for (const [prop] of vars) {
        root.style.removeProperty(prop);
      }
    };
  }, [settings]);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}
