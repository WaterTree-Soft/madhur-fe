"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  LogOut,
  Mail,
  MapPin,
  Package,
  Settings,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { AddressManager } from "@/features/account/components/address-manager";
import { OrderHistory } from "@/features/account/components/order-history";
import { getAvatarGradient, getInitials } from "@/lib/avatar";

type Tab = "profile" | "addresses" | "orders";

const TABS: { id: Tab; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "profile",   label: "Profile",   Icon: UserIcon },
  { id: "addresses", label: "Addresses", Icon: MapPin },
  { id: "orders",    label: "Orders",    Icon: Package },
];

export default function ProfilePage() {
  const router        = useRouter();
  const user          = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout        = useAuthStore((s) => s.logout);
  const [tab, setTab] = useState<Tab>("profile");

  useEffect(() => {
    if (!isAuthenticated) router.replace("/");
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) return null;

  const initials       = getInitials(user.name);
  const avatarGradient = getAvatarGradient(user.name);
  const isAdmin        = user.role === "admin" || user.role === "super_admin";

  const handleLogout = () => { logout(); router.push("/"); };

  return (
    <div className="min-h-screen bg-linear-to-b from-rose-50/40 to-background">

      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden bg-linear-to-br from-rose-950 via-red-900 to-rose-700">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_60%)]" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 overflow-hidden">
          <svg viewBox="0 0 1200 24" preserveAspectRatio="none" className="h-full w-full fill-background">
            <path d="M0,24 C300,0 900,0 1200,24 Z" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-4xl px-4 pb-14 pt-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:gap-7 sm:text-left">

            {/* Avatar */}
            <div className="relative shrink-0">
              <Avatar className="h-24 w-24 shadow-2xl ring-4 ring-white/25 sm:h-28 sm:w-28">
                {user.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
                <AvatarFallback className="text-2xl font-bold text-white" style={{ background: avatarGradient }}>
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400 shadow-sm" />
            </div>

            {/* Name / meta */}
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-2xl font-bold text-white sm:text-3xl">{user.name}</h1>
              <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-rose-200 sm:justify-start">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{user.email}</span>
              </p>
              <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <Badge
                  variant="outline"
                  className={
                    user.role === "super_admin"
                      ? "border-amber-400/40 bg-amber-400/15 text-amber-200"
                      : user.role === "admin"
                      ? "border-sky-400/40 bg-sky-400/15 text-sky-200"
                      : "border-white/20 bg-white/10 text-rose-100"
                  }
                >
                  <ShieldCheck className="mr-1 h-3 w-3" />
                  {user.role.replace("_", " ")}
                </Badge>
                <span className="text-xs text-rose-300">
                  Member since {new Date(user.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
              {isAdmin && (
                <Button size="sm" variant="outline" className="border-white/25 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm" asChild>
                  <Link href="/admin">
                    <Settings className="mr-1.5 h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Admin panel</span>
                    <span className="sm:hidden">Admin</span>
                  </Link>
                </Button>
              )}
              <Button size="sm" className="border border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm shadow-none" onClick={handleLogout}>
                <LogOut className="mr-1.5 h-3.5 w-3.5" />
                Log out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main card ── */}
      <div className="mx-auto max-w-4xl px-4 pb-12 -mt-3 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-0 shadow-xl ring-1 ring-border/40">

          {/* Tab bar */}
          <div className="grid grid-cols-3 border-b bg-muted/20">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`relative flex flex-col items-center gap-1 py-3.5 text-xs font-medium transition-colors sm:flex-row sm:justify-center sm:gap-2 sm:py-4 sm:text-sm ${
                  tab === id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
                {tab === id && (
                  <span className="absolute bottom-0 left-[20%] right-[20%] h-0.5 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>

          <CardContent className="p-4 sm:p-6">
            {tab === "profile" && (
              <div className="space-y-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Personal Information
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoCard Icon={UserIcon}    label="Full Name"      value={user.name}      accent="from-violet-500 to-purple-600" />
                  <InfoCard Icon={Mail}        label="Email Address"  value={user.email}     accent="from-sky-500 to-blue-600" />
                  <InfoCard Icon={ShieldCheck} label="Account Role"   value={user.role.replace("_", " ")} accent="from-emerald-500 to-teal-600" />
                  <InfoCard Icon={Calendar}    label="Member Since"   value={new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} accent="from-amber-500 to-orange-500" />
                </div>
              </div>
            )}

            {tab === "addresses" && <AddressManager />}
            {tab === "orders"    && <OrderHistory />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoCard({
  Icon,
  label,
  value,
  accent,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${accent} shadow-sm`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-0.5 truncate text-sm font-semibold text-foreground capitalize">{value}</p>
      </div>
    </div>
  );
}
