"use client";

import { useEffect, useState } from "react";
import { Package, ShoppingBag, Users, IndianRupee } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Stats = {
  products: number;
  orders: number;
  users: number;
  revenue: number;
};

const formatInr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const formatInt = (n: number) => new Intl.NumberFormat("en-IN").format(n);

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/stats", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return (await res.json()) as Stats;
      })
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = [
    {
      title: "Total Products",
      value: stats ? formatInt(stats.products) : null,
      icon: Package,
      color: "text-primary",
    },
    {
      title: "Total Orders",
      value: stats ? formatInt(stats.orders) : null,
      icon: ShoppingBag,
      color: "text-accent",
    },
    {
      title: "Total Users",
      value: stats ? formatInt(stats.users) : null,
      icon: Users,
      color: "text-secondary",
    },
    {
      title: "Total Revenue",
      value: stats ? formatInr(stats.revenue) : null,
      icon: IndianRupee,
      color: "text-success",
    },
  ];

  return (
    <div>
      <h1 className="text-xl sm:text-3xl font-bold mb-6">Dashboard</h1>
      {error && (
        <p className="text-sm text-destructive mb-4">
          Failed to load stats: {error}
        </p>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {cards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between p-3 pb-1 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground leading-tight">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 shrink-0 ${stat.color}`} />
            </CardHeader>
            <CardContent className="p-3 pt-1 sm:p-6 sm:pt-0">
              {stat.value === null ? (
                <div className="h-6 w-16 sm:h-8 sm:w-24 bg-muted animate-pulse rounded" />
              ) : (
                <p className="text-lg sm:text-2xl font-bold tabular-nums">{stat.value}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
