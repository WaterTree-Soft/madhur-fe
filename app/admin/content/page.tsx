"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Loader2, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type PageKey =
  | "privacyPolicy"
  | "cookiesPolicy"
  | "termsOfService"
  | "aboutUs"
  | "careers"
  | "faqs"
  | "shippingPolicy"
  | "returnsPolicy";

const PAGE_CONFIG: { key: PageKey; label: string; href: string; section: string }[] = [
  { key: "aboutUs",        label: "About Us",        href: "/about",          section: "Company" },
  { key: "careers",        label: "Careers",          href: "/careers",        section: "Company" },
  { key: "privacyPolicy",  label: "Privacy Policy",   href: "/privacy-policy", section: "Legal" },
  { key: "termsOfService", label: "Terms of Service", href: "/terms",          section: "Legal" },
  { key: "cookiesPolicy",  label: "Cookies Policy",   href: "/cookies-policy", section: "Legal" },
  { key: "faqs",           label: "FAQs",             href: "/faqs",           section: "Support" },
  { key: "shippingPolicy", label: "Shipping Policy",  href: "/shipping",       section: "Support" },
  { key: "returnsPolicy",  label: "Returns & Refunds",href: "/returns",        section: "Support" },
];

const SECTION_ORDER = ["Company", "Legal", "Support"];

type Settings = Partial<Record<PageKey, string>>;

export default function AdminContentPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const [editingKey, setEditingKey]   = useState<PageKey | null>(null);
  const [editValue, setEditValue]     = useState("");
  const [saving, setSaving]           = useState(false);
  const [saveError, setSaveError]     = useState<string | null>(null);

  const [clearingKey, setClearingKey] = useState<PageKey | null>(null);

  async function fetchSettings() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/settings");
      if (!res.ok) throw new Error(`Failed to fetch settings (${res.status})`);
      const json = await res.json();
      const data: Settings = json.data ?? json;
      const picked: Settings = {};
      for (const { key } of PAGE_CONFIG) {
        picked[key] = data[key] ?? "";
      }
      setSettings(picked);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchSettings(); }, []);

  async function saveEdit() {
    if (!editingKey) return;
    setSaveError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [editingKey]: editValue }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "Failed to save");
      }
      setSettings((prev) => ({ ...prev, [editingKey]: editValue }));
      setEditingKey(null);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function clearPage(key: PageKey) {
    setClearingKey(key);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: "" }),
      });
      if (!res.ok) throw new Error("Failed to clear");
      setSettings((prev) => ({ ...prev, [key]: "" }));
    } catch {
      // silent — page still shows fallback
    } finally {
      setClearingKey(null);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
        <Loader2 className="h-7 w-7 animate-spin" />
        <p className="text-sm">Loading content pages…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-destructive/30 bg-destructive/5 py-16 text-center">
        <p className="text-sm text-destructive">{error}</p>
        <Button size="sm" onClick={fetchSettings}>Retry</Button>
      </div>
    );
  }

  const grouped = SECTION_ORDER.map((section) => ({
    section,
    pages: PAGE_CONFIG.filter((p) => p.section === section),
  }));

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-3xl font-bold">Content Pages</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Edit the text shown on footer pages. Leave a page empty to show the default built-in content.
        </p>
      </div>

      <div className="space-y-8">
        {grouped.map(({ section, pages }) => (
          <div key={section}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{section}</h2>
            <Card className="overflow-hidden">
              {/* Mobile card list */}
              <ul className="divide-y divide-border sm:hidden">
                {pages.map(({ key, label, href }) => {
                  const hasContent = Boolean(settings[key]);
                  return (
                    <li key={key} className="px-4 py-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-sm">{label}</p>
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mt-0.5"
                          >
                            {href} <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                        <Badge variant={hasContent ? "success" : "secondary"} className="text-xs shrink-0 mt-0.5">
                          {hasContent ? "Custom" : "Default"}
                        </Badge>
                      </div>
                      {hasContent && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{settings[key]}</p>
                      )}
                      <div className="flex gap-1">
                        <Button
                          variant="ghost" size="sm"
                          className="h-8 gap-1.5 text-xs"
                          onClick={() => { setEditingKey(key); setEditValue(settings[key] ?? ""); setSaveError(null); }}
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </Button>
                        {hasContent && (
                          <Button
                            variant="ghost" size="sm"
                            className="h-8 gap-1.5 text-xs text-destructive hover:text-destructive"
                            onClick={() => clearPage(key)}
                            disabled={clearingKey === key}
                          >
                            {clearingKey === key
                              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              : <Trash2 className="h-3.5 w-3.5" />}
                            Reset
                          </Button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-4 font-medium">Page</th>
                      <th className="text-left p-4 font-medium">URL</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Preview</th>
                      <th className="text-right p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {pages.map(({ key, label, href }) => {
                      const hasContent = Boolean(settings[key]);
                      return (
                        <tr key={key} className="hover:bg-muted/50">
                          <td className="p-4 font-medium">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                              {label}
                            </div>
                          </td>
                          <td className="p-4">
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary"
                            >
                              {href} <ExternalLink className="h-3 w-3" />
                            </a>
                          </td>
                          <td className="p-4">
                            <Badge variant={hasContent ? "success" : "secondary"} className="text-xs">
                              {hasContent ? "Custom" : "Default"}
                            </Badge>
                          </td>
                          <td className="p-4 max-w-xs">
                            {hasContent ? (
                              <p className="text-xs text-muted-foreground line-clamp-2">{settings[key]}</p>
                            ) : (
                              <span className="text-xs text-muted-foreground italic">Using built-in content</span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost" size="icon" className="h-8 w-8"
                                aria-label={`Edit ${label}`}
                                onClick={() => { setEditingKey(key); setEditValue(settings[key] ?? ""); setSaveError(null); }}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              {hasContent && (
                                <Button
                                  variant="ghost" size="icon" className="h-8 w-8"
                                  aria-label={`Reset ${label} to default`}
                                  onClick={() => clearPage(key)}
                                  disabled={clearingKey === key}
                                >
                                  {clearingKey === key
                                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    : <Trash2 className="h-3.5 w-3.5 text-destructive" />}
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Edit dialog */}
      <Dialog open={editingKey !== null} onOpenChange={(open) => { if (!open) setEditingKey(null); }}>
        <DialogContent className="max-w-2xl max-h-[85svh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Edit — {PAGE_CONFIG.find((p) => p.key === editingKey)?.label}
            </DialogTitle>
            <DialogDescription>
              Write the page content below. Leave empty to show the default built-in layout.
            </DialogDescription>
          </DialogHeader>

          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder="Enter page content… (plain text, line breaks preserved)"
            className="flex-1 min-h-64 resize-none font-mono text-sm"
          />

          {saveError && <p className="text-sm text-destructive">{saveError}</p>}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingKey(null)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={saveEdit} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
