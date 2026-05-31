"use client";

import { useEffect, useState } from "react";

export interface SiteSettings {
  freeShippingThreshold: number;
  shippingFee: number;
  taxRate: number;
}

const DEFAULTS: SiteSettings = {
  freeShippingThreshold: 0,
  shippingFee: 0,
  taxRate: 0,
};

// Module-level cache so multiple components share one fetch per page load.
let cache: SiteSettings | null = null;
let promise: Promise<SiteSettings> | null = null;

function fetchSettings(): Promise<SiteSettings> {
  if (!promise) {
    promise = fetch("/api/settings")
      .then((r) => r.json())
      .then((json: { data?: SiteSettings }) => {
        const d = json?.data ?? (json as unknown as SiteSettings);
        cache = { ...DEFAULTS, ...d };
        return cache;
      })
      .catch(() => DEFAULTS);
  }
  return promise;
}

export function useSiteSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(cache ?? DEFAULTS);

  useEffect(() => {
    if (cache) {
      setSettings(cache);
      return;
    }
    fetchSettings().then(setSettings);
  }, []);

  return settings;
}
