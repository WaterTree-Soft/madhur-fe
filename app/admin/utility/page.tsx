"use client";

import { useEffect, useState, useCallback } from "react";
import {
  MessageSquareText,
  Phone,
  Palette,
  ScrollText,
  ShieldCheck,
  MapPin,
  Loader2,
  Save,
  Check,
  Truck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TestimonialsManager } from "@/features/admin/components/testimonials-manager";

interface SiteSettings {
  whatsappNumber: string;
  bannerMessage: string;
  bannerLink: string;
  bannerActive: boolean;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  cookiesPolicy: string;
  privacyPolicy: string;
  freeShippingThreshold: number;
  shippingFee: number;
  taxRate: number;
  businessAddress: {
    name: string;
    phone: string;
    phone2: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
    email: string;
    email2: string;
    hoursWeekdays: string;
    hoursSunday: string;
  } | null;
}

const defaults: SiteSettings = {
  whatsappNumber: "",
  bannerMessage: "",
  bannerLink: "",
  bannerActive: true,
  primaryColor: "#c75518",
  secondaryColor: "#e8a317",
  accentColor: "#2d8a4e",
  cookiesPolicy: "",
  privacyPolicy: "",
  freeShippingThreshold: 0,
  shippingFee: 0,
  taxRate: 0,
  businessAddress: {
    name: "",
    phone: "",
    phone2: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    email: "",
    email2: "",
    hoursWeekdays: "",
    hoursSunday: "",
  },
};

export default function UtilityPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaults);
  const [useDefaultTheme, setUseDefaultTheme] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const d = json?.data;
        if (d) {
          setSettings({
            whatsappNumber: d.whatsappNumber ?? "",
            bannerMessage: d.bannerMessage ?? "",
            bannerLink: d.bannerLink ?? "",
            bannerActive: d.bannerActive ?? true,
            primaryColor: d.primaryColor || defaults.primaryColor,
            secondaryColor: d.secondaryColor || defaults.secondaryColor,
            accentColor: d.accentColor || defaults.accentColor,
            cookiesPolicy: d.cookiesPolicy ?? "",
            privacyPolicy: d.privacyPolicy ?? "",
            freeShippingThreshold: d.freeShippingThreshold ?? 0,
            shippingFee: d.shippingFee ?? 0,
            taxRate: d.taxRate ?? 0,
            businessAddress: d.businessAddress
              ? {
                  name: d.businessAddress.name ?? "",
                  phone: d.businessAddress.phone ?? "",
                  phone2: d.businessAddress.phone2 ?? "",
                  line1: d.businessAddress.line1 ?? "",
                  line2: d.businessAddress.line2 ?? "",
                  city: d.businessAddress.city ?? "",
                  state: d.businessAddress.state ?? "",
                  pincode: d.businessAddress.pincode ?? "",
                  email: d.businessAddress.email ?? "",
                  email2: d.businessAddress.email2 ?? "",
                  hoursWeekdays: d.businessAddress.hoursWeekdays ?? "",
                  hoursSunday: d.businessAddress.hoursSunday ?? "",
                }
              : defaults.businessAddress,
          });
        }
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const saveSection = useCallback(
    async (section: string, data: Partial<SiteSettings>) => {
      setSaving(section);
      setSaved(null);
      setError(null);
      try {
        const res = await fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err?.error?.message ?? `HTTP ${res.status}`);
        }
        setSaved(section);
        setTimeout(() => setSaved(null), 2000);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Save failed");
      } finally {
        setSaving(null);
      }
    },
    [],
  );

  const updateField = <K extends keyof SiteSettings>(
    key: K,
    value: SiteSettings[K],
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const updateAddress = (
    key: keyof NonNullable<SiteSettings["businessAddress"]>,
    value: string,
  ) => {
    setSettings((prev) => ({
      ...prev,
      businessAddress: { ...(prev.businessAddress ?? defaults.businessAddress!), [key]: value },
    }));
  };

  function SaveBtn({ section, onClick }: { section: string; onClick: () => void }) {
    const isSaving = saving === section;
    const isSaved = saved === section;
    return (
      <Button size="sm" onClick={onClick} disabled={isSaving} className="h-8 gap-1.5 px-3 text-xs sm:h-9 sm:px-4 sm:text-sm shrink-0">
        {isSaving ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : isSaved ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <Save className="h-3.5 w-3.5" />
        )}
        {isSaving ? "Saving…" : isSaved ? "Saved" : "Save"}
      </Button>
    );
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-xl sm:text-3xl font-bold mb-6">Utility</h1>
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-sm bg-muted"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl sm:text-3xl font-bold mb-6">Utility</h1>

      {error && (
        <p className="text-sm text-destructive mb-6">Error: {error}</p>
      )}

      <div className="space-y-8">
        {/* ── WhatsApp Number ── */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-green-600" />
              <CardTitle className="text-lg">WhatsApp Number</CardTitle>
            </div>
            <SaveBtn
              section="whatsapp"
              onClick={() =>
                saveSection("whatsapp", {
                  whatsappNumber: settings.whatsappNumber,
                })
              }
            />
          </CardHeader>
          <CardContent>
            <label className="text-sm font-medium mb-2 block">
              Phone number (with country code, e.g. 919999999999)
            </label>
            <Input
              value={settings.whatsappNumber}
              onChange={(e) => updateField("whatsappNumber", e.target.value)}
              placeholder="919999999999"
            />
          </CardContent>
        </Card>

        {/* ── Banner ── */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquareText className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Site Banner</CardTitle>
            </div>
            <SaveBtn
              section="banner"
              onClick={() =>
                saveSection("banner", {
                  bannerMessage: settings.bannerMessage,
                  bannerLink: settings.bannerLink,
                  bannerActive: settings.bannerActive,
                })
              }
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Banner message
              </label>
              <Input
                value={settings.bannerMessage}
                onChange={(e) => updateField("bannerMessage", e.target.value)}
                placeholder="Diwali Special! Get 20% off on all sweets."
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Link (optional)
              </label>
              <Input
                value={settings.bannerLink}
                onChange={(e) => updateField("bannerLink", e.target.value)}
                placeholder="/products"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.bannerActive}
                onChange={(e) => updateField("bannerActive", e.target.checked)}
                className="h-4 w-4 rounded border-input accent-primary"
              />
              <span className="text-sm font-medium">Banner active</span>
            </label>
          </CardContent>
        </Card>

        {/* ── Pricing & Shipping ── */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg">Pricing &amp; Shipping</CardTitle>
            </div>
            <SaveBtn
              section="pricing"
              onClick={() =>
                saveSection("pricing", {
                  freeShippingThreshold: settings.freeShippingThreshold,
                  shippingFee: settings.shippingFee,
                  taxRate: settings.taxRate,
                })
              }
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Free shipping threshold (₹)
                </label>
                <Input
                  type="number"
                  min={0}
                  value={settings.freeShippingThreshold}
                  onChange={(e) =>
                    updateField("freeShippingThreshold", Number(e.target.value))
                  }
                  placeholder="e.g. 500"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Orders above this amount get free shipping. Set 0 to always charge.
                </p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Shipping fee (₹)
                </label>
                <Input
                  type="number"
                  min={0}
                  value={settings.shippingFee}
                  onChange={(e) =>
                    updateField("shippingFee", Number(e.target.value))
                  }
                  placeholder="e.g. 50"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Charged when order total is below the threshold.
                </p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Tax rate (%)
                </label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  value={(settings.taxRate * 100).toFixed(1)}
                  onChange={(e) =>
                    updateField("taxRate", Number(e.target.value) / 100)
                  }
                  placeholder="e.g. 5"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Applied on the subtotal. Enter as percentage (e.g. 5 for 5%).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Theme Colors ── */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-purple-500" />
              <CardTitle className="text-lg">Theme Colors</CardTitle>
            </div>
            <SaveBtn
              section="theme"
              onClick={() =>
                saveSection("theme", {
                  primaryColor: settings.primaryColor,
                  secondaryColor: settings.secondaryColor,
                  accentColor: settings.accentColor,
                })
              }
            />
          </CardHeader>
          <CardContent className="space-y-5">
            <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
              <input
                type="checkbox"
                checked={useDefaultTheme}
                onChange={(e) => {
                  setUseDefaultTheme(e.target.checked);
                  if (e.target.checked) {
                    setSettings((prev) => ({
                      ...prev,
                      primaryColor: "#c75518",
                      secondaryColor: "#e8a317",
                      accentColor: "#2d8a4e",
                    }));
                  }
                }}
                className="h-4 w-4 rounded border-input accent-primary"
              />
              <span className="text-sm font-medium">Use default theme</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {(
                [
                  { key: "primaryColor", label: "Primary" },
                  { key: "secondaryColor", label: "Secondary" },
                  { key: "accentColor", label: "Accent" },
                ] as const
              ).map(({ key, label }) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-medium mb-2 block">{label}</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings[key]}
                      onChange={(e) => updateField(key, e.target.value)}
                      className="h-10 w-14 cursor-pointer rounded border border-input bg-transparent p-0.5"
                    />
                    <Input
                      value={settings[key]}
                      onChange={(e) => updateField(key, e.target.value)}
                      className="font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3">
              {(["primaryColor", "secondaryColor", "accentColor"] as const).map((key) => (
                <div
                  key={key}
                  className="h-10 w-10 rounded-full border"
                  style={{ backgroundColor: settings[key] }}
                  title={settings[key]}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── Cookies Policy ── */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <ScrollText className="h-5 w-5 text-amber-500" />
              <CardTitle className="text-lg">Cookies Policy</CardTitle>
            </div>
            <SaveBtn
              section="cookies"
              onClick={() =>
                saveSection("cookies", {
                  cookiesPolicy: settings.cookiesPolicy,
                })
              }
            />
          </CardHeader>
          <CardContent>
            <Textarea
              value={settings.cookiesPolicy}
              onChange={(e) => updateField("cookiesPolicy", e.target.value)}
              placeholder="Enter your cookies policy content here…"
              rows={10}
            />
          </CardContent>
        </Card>

        {/* ── Privacy Policy ── */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg">Privacy Policy</CardTitle>
            </div>
            <SaveBtn
              section="privacy"
              onClick={() =>
                saveSection("privacy", {
                  privacyPolicy: settings.privacyPolicy,
                })
              }
            />
          </CardHeader>
          <CardContent>
            <Textarea
              value={settings.privacyPolicy}
              onChange={(e) => updateField("privacyPolicy", e.target.value)}
              placeholder="Enter your privacy policy content here…"
              rows={10}
            />
          </CardContent>
        </Card>

        {/* ── Homepage Testimonials (full CRUD) ── */}
        <TestimonialsManager />

        {/* ── Business Address ── */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-500" />
              <CardTitle className="text-lg">Business Address</CardTitle>
            </div>
            <SaveBtn
              section="address"
              onClick={() =>
                saveSection("address", {
                  businessAddress: settings.businessAddress,
                })
              }
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Business / Store name</label>
              <Input
                value={settings.businessAddress?.name ?? ""}
                onChange={(e) => updateAddress("name", e.target.value)}
                placeholder="Madhur Sweet"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Address line 1</label>
              <Input
                value={settings.businessAddress?.line1 ?? ""}
                onChange={(e) => updateAddress("line1", e.target.value)}
                placeholder="42, Sweet Lane, Chandni Chowk"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Address line 2</label>
              <Input
                value={settings.businessAddress?.line2 ?? ""}
                onChange={(e) => updateAddress("line2", e.target.value)}
                placeholder="Old Delhi"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">City</label>
                <Input
                  value={settings.businessAddress?.city ?? ""}
                  onChange={(e) => updateAddress("city", e.target.value)}
                  placeholder="New Delhi"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">State</label>
                <Input
                  value={settings.businessAddress?.state ?? ""}
                  onChange={(e) => updateAddress("state", e.target.value)}
                  placeholder="Delhi"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Pincode</label>
                <Input
                  value={settings.businessAddress?.pincode ?? ""}
                  onChange={(e) => updateAddress("pincode", e.target.value)}
                  placeholder="110006"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Phone 1</label>
                <Input
                  value={settings.businessAddress?.phone ?? ""}
                  onChange={(e) => updateAddress("phone", e.target.value)}
                  placeholder="+91 99999 99999"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Phone 2 (optional)</label>
                <Input
                  value={settings.businessAddress?.phone2 ?? ""}
                  onChange={(e) => updateAddress("phone2", e.target.value)}
                  placeholder="+91 11 2345 6789"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Email 1</label>
                <Input
                  type="email"
                  value={settings.businessAddress?.email ?? ""}
                  onChange={(e) => updateAddress("email", e.target.value)}
                  placeholder="hello@madhursweet.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email 2 (optional)</label>
                <Input
                  type="email"
                  value={settings.businessAddress?.email2 ?? ""}
                  onChange={(e) => updateAddress("email2", e.target.value)}
                  placeholder="orders@madhursweet.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Weekday hours</label>
                <Input
                  value={settings.businessAddress?.hoursWeekdays ?? ""}
                  onChange={(e) => updateAddress("hoursWeekdays", e.target.value)}
                  placeholder="Mon - Sat: 8:00 AM - 9:00 PM"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Sunday hours</label>
                <Input
                  value={settings.businessAddress?.hoursSunday ?? ""}
                  onChange={(e) => updateAddress("hoursSunday", e.target.value)}
                  placeholder="Sunday: 9:00 AM - 6:00 PM"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
