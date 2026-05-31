"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Grid3x3,
  ShoppingBag,
  Users,
  MessageSquare,
  FileText,
  Briefcase,
  Settings,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, useIsAdmin } from "@/features/auth";

const navSections = [
  {
    label: null,
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Categories", href: "/admin/categories", icon: Grid3x3 },
      { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Feedback", href: "/admin/feedback", icon: MessageSquare },
    ],
  },
  {
    label: "Footer",
    items: [
      { label: "Careers", href: "/admin/careers", icon: Briefcase },
      { label: "Content", href: "/admin/content", icon: FileText },
    ],
  },
  {
    label: null,
    items: [
      { label: "Utility", href: "/admin/utility", icon: Settings },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const isAdmin = useIsAdmin();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  if (isLoading || (!isAuthenticated || !isAdmin)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  function isActive(href: string) {
    return pathname === href || (href !== "/admin" && pathname.startsWith(href));
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-card border-r p-4 shrink-0">
        <h2 className="text-lg font-semibold px-3 py-2 mb-2">Admin Panel</h2>

        <div className="flex flex-col gap-4">
          {navSections.map((section, si) => (
            <div key={si} className="flex flex-col gap-1">
              {section.label && (
                <p className="px-3 pt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {section.label}
                </p>
              )}
              {section.items.map((item) => (
                <Button
                  key={item.href}
                  asChild
                  variant={isActive(item.href) ? "secondary" : "ghost"}
                  className="justify-start gap-3 w-full"
                >
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              ))}
              {si < navSections.length - 1 && section.label && (
                <div className="mt-1 border-t border-border" />
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="md:hidden bg-card border-b overflow-x-auto">
        <nav className="flex items-center gap-1 p-2 min-w-max">
          {navSections.map((section, si) => (
            <div key={si} className="flex items-center gap-1">
              {section.label && si > 0 && (
                <div className="h-5 w-px bg-border mx-1 shrink-0" />
              )}
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-sm text-xs font-medium whitespace-nowrap transition-colors ${
                    isActive(item.href)
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </div>

      <div className="flex-1 p-6 overflow-auto">{children}</div>
    </div>
  );
}
