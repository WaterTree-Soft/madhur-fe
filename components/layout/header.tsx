"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartButton } from "@/features/cart";
import { UserMenu } from "@/features/auth";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      setMobileOpen(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    if (mobileOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mobileOpen]);

  // Close on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-linear-to-r from-rose-950 via-red-800 to-rose-700 shadow-[0_4px_24px_rgba(139,0,0,0.28)]"
          : "bg-linear-to-r from-white via-white to-rose-50/70 backdrop-blur-xl border-b border-border/40 shadow-[0_2px_10px_rgba(139,0,0,0.06)]"
      )}
    >
      {/* Main row */}
      <div
        className={cn(
          "mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center px-4 sm:px-6 lg:px-8 transition-all duration-300",
          scrolled ? "h-14" : "h-16"
        )}
      >
        {/* Brand */}
        <Link href="/" className="flex flex-col gap-0 group shrink-0">
          <span
            className={cn(
              "font-bold tracking-tight transition-all duration-300 leading-none",
              scrolled
                ? "text-xl text-primary-foreground group-hover:text-accent"
                : "text-2xl text-primary group-hover:text-secondary"
            )}
          >
            Madhur Sweet
          </span>
          <span
            className={cn(
              "transition-all duration-300 font-medium tracking-[0.2em] uppercase",
              scrolled ? "text-[9px] text-primary-foreground/60 opacity-0 max-h-0" : "text-[9px] text-accent opacity-100 max-h-4"
            )}
          >
            est. since generations
          </span>
        </Link>

        {/* Desktop nav — truly centered */}
        <nav className="hidden items-center justify-center gap-0.5 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <NavLink key={href} href={href} active={pathname === href} scrolled={scrolled}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className={cn("hidden items-center gap-3 pl-3 border-l md:flex", scrolled ? "border-primary-foreground/20" : "border-border/50")}>
          <CartButton />
          <UserMenu />
        </div>

        {/* Mobile: hamburger only */}
        <div className="flex justify-end md:hidden" ref={dropdownRef}>
          <Button
            variant="ghost"
            size="icon"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
            className={cn(
              "transition-colors",
              scrolled
                ? "text-primary-foreground hover:bg-primary-foreground/10"
                : "text-primary hover:bg-muted/60"
            )}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Dropdown panel */}
          <div
            style={{
              clipPath: mobileOpen
                ? "inset(0 0 0 0)"
                : "inset(0 0 100% 0)",
              transition: "clip-path 320ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            className={cn(
              "absolute left-0 right-0 top-full",
              !mobileOpen && "pointer-events-none"
            )}
          >
            <div className="bg-white border-b border-border/40 shadow-[0_8px_24px_rgba(139,0,0,0.1)]">
              {/* Gold top stripe */}
              <div className="h-0.5 bg-accent w-full" />

              <nav className="flex flex-col px-4 pt-3 pb-2">
                {NAV_LINKS.map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                      pathname === href
                        ? "text-primary bg-primary/8 font-semibold"
                        : "text-foreground hover:text-primary hover:bg-muted/60"
                    )}
                  >
                    {label}
                    {pathname === href && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                  </Link>
                ))}
              </nav>

              {/* Divider */}
              <div className="mx-4 h-px bg-border/60" />

              {/* Cart + User */}
              <div className="flex items-center justify-between px-6 py-3">
                <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
                  Account
                </span>
                <div className="flex items-center gap-2">
                  <CartButton />
                  <UserMenu />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  scrolled,
  children,
}: {
  href: string;
  active: boolean;
  scrolled: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative px-3.5 py-2 text-sm font-medium transition-all duration-200 group",
        scrolled
          ? active ? "text-accent" : "text-primary-foreground/80 hover:text-accent"
          : active ? "text-primary" : "text-foreground/70 hover:text-primary"
      )}
    >
      {children}
      <span
        className={cn(
          "absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-accent transition-all duration-200",
          active ? "w-4" : "w-0 group-hover:w-3"
        )}
      />
    </Link>
  );
}
