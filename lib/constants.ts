export const SITE_NAME = "Madhur Sweet";
export const SITE_DESCRIPTION =
  "Premium Indian sweets and snacks, crafted with love and tradition.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://madhursweet.com";
export const WHATSAPP_NUMBER = "919999999999";
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/categories" },
  { label: "Products", href: "/products" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_LINKS = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookies Policy", href: "/cookies-policy" },
  ],
  support: [
    { label: "FAQs", href: "/faqs" },
    { label: "Shipping", href: "/shipping" },
    { label: "Returns", href: "/returns" },
  ],
} as const;

export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  USER: "user",
} as const;

export const PLACEHOLDER_IMAGE = "/images/placeholder.svg";
