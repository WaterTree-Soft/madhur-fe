import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { Banner, Header, Footer, WhatsAppButton, SiteSettingsProvider } from "@/components/layout";
import { AuthInitializer } from "@/features/auth/components/auth-initializer";
import { Providers } from "./providers";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Biscuits, Cakes, Pastries, Rusk & Namkeen`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    // Brand name variations (critical for branded search ranking)
    "Madhur Sweet",
    "Madhur Sweets",
    "Madhursweet",
    "Madhursweets",
    "madhur sweet",
    "madhur sweets",
    "madhursweet",
    "madhursweets",
    "Madhur Namkeen",
    "Madhur Bakery",
    "Madhur Sweet online",
    "Madhur Sweet Pali",
    "Madhur Sweet Rajasthan",
    // Bakery
    "biscuits",
    "biscuits online",
    "buy biscuits online",
    "homemade biscuits",
    "cookies",
    "butter cookies",
    "cakes",
    "cakes online",
    "buy cake online",
    "fresh cakes",
    "birthday cake",
    "plum cake",
    "tea cake",
    "fruit cake",
    "pastries",
    "fresh pastries",
    "pastry shop",
    "rusk",
    "rusk online",
    "elaichi rusk",
    "milk rusk",
    "atta rusk",
    "khari biscuit",
    "khari",
    "toast",
    // Namkeen types
    "namkeen",
    "namkeen online",
    "buy namkeen online",
    "aloo bhujia",
    "bhujia",
    "bikaneri bhujia",
    "moong dal namkeen",
    "moong dal",
    "chana dal namkeen",
    "chana dal",
    "masala chana",
    "kaju namkeen",
    "khatta meetha",
    "navratan mix",
    "all in one mixture",
    "mixture",
    "bombay mix",
    "chivda",
    "poha chivda",
    "cornflakes mixture",
    "chakli",
    "murukku",
    "mathri",
    "shakkarpara",
    "namak para",
    "sev",
    "ratlami sev",
    "nylon sev",
    "papdi",
    "fafda",
    "gathia",
    "khakhra",
    "dalmoth",
    "salted peanuts",
    "masala peanuts",
    "spicy peanuts",
    "roasted chana",
    "makhana",
    "phool makhana",
    "soya sticks",
    "banana chips",
    "potato chips",
    "tikha mitha",
    "punjabi tadka",
    // Sweets / mithai
    "Indian sweets",
    "mithai",
    "ladoo",
    "besan ladoo",
    "motichoor ladoo",
    "boondi ladoo",
    "barfi",
    "kaju katli",
    "milk barfi",
    "dry fruit barfi",
    "soan papdi",
    "gulab jamun",
    "rasgulla",
    "rasmalai",
    "peda",
    "halwa",
    "moong dal halwa",
    "gajar halwa",
    "jalebi",
    "imarti",
    "kalakand",
    "chum chum",
    "balushahi",
    "ghevar",
    "milk cake",
    "anjeer barfi",
    "kaju roll",
    "diwali sweets",
    "rakhi sweets",
    "holi sweets",
    "festive sweets",
    // Generic / commerce
    "traditional Indian snacks",
    "online sweets delivery",
    "buy sweets online",
    "Indian snacks online",
    "namkeen and sweets",
    "premium namkeen",
    "homemade namkeen",
    "fresh namkeen",
    "desi ghee sweets",
    "pure ghee mithai",
    "Pali Rajasthan sweets",
    "Pali namkeen",
    "Pali bakery",
    "Rajasthan namkeen",
    "Rajasthan bakery",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Biscuits, Cakes, Pastries, Rusk & Namkeen`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Biscuits, Cakes, Pastries, Rusk & Namkeen`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Biscuits, Cakes, Pastries, Rusk & Namkeen`,
    description: SITE_DESCRIPTION,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <AuthInitializer />
          <SiteSettingsProvider>
            <Banner
              message="Diwali Special! Get 20% off on all sweets. Order now!"
              link="/products"
            />
            <Header />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
            <WhatsAppButton />
          </SiteSettingsProvider>
        </Providers>
      </body>
    </html>
  );
}
