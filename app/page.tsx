import type { Metadata } from "next";
import Link from "next/link";
import { Leaf, Heart, Truck, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryGrid } from "@/features/categories";
import { ProductGrid } from "@/features/products";
import { fetchCategories } from "@/features/categories/actions/category-actions";
import { fetchProducts } from "@/features/products/actions/product-actions";
import { fetchTestimonials } from "@/features/testimonials/actions/testimonial-actions";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Mandala } from "@/components/ui/mandala";
import { TestimonialsCarousel } from "@/components/ui/testimonials-carousel";
import { HeroBackgroundCarousel } from "@/components/ui/hero-background-carousel";
import { API_URL, SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Madhur Sweet (Madhur Sweets) — Authentic Namkeen & Indian Sweets Online`,
  description:
    "Madhur Sweet (also known as Madhur Sweets / Madhursweet) — order authentic namkeen, bhujia, chakli, sev, mathri, ladoo, kaju katli and traditional Indian mithai online. Handcrafted in Old Delhi since 1965 with pure desi ghee. Fresh delivery across India.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `Madhur Sweet (Madhur Sweets) — Authentic Namkeen & Indian Sweets Online`,
    description:
      "Madhur Sweet — premium namkeen and Indian sweets handcrafted in Old Delhi since 1965. Order bhujia, chakli, sev, ladoo, barfi and more online with fast delivery across India.",
    url: SITE_URL,
    type: "website",
  },
};

async function fetchHeroImages(): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}/api/settings`, {
      next: { revalidate: 60, tags: ["site-settings"] },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const images = json?.data?.heroImages;
    return Array.isArray(images) ? images.filter((u) => typeof u === "string") : [];
  } catch {
    return [];
  }
}


const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness", "FoodEstablishment"],
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: [
    "Madhur Sweets",
    "Madhursweet",
    "Madhursweets",
    "Madhur Namkeen",
    "Madhur",
  ],
  legalName: "Madhur Sweet",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.ico`,
  image: `${SITE_URL}/og-image.jpg`,
  telephone: "+91-99999-99999",
  email: "hello@madhursweet.com",
  foundingDate: "1965",
  address: {
    "@type": "PostalAddress",
    streetAddress: "42, Sweet Lane, Chandni Chowk",
    addressLocality: "New Delhi",
    addressRegion: "Delhi",
    postalCode: "110006",
    addressCountry: "IN",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "08:00",
      closes: "21:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Sunday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  sameAs: [],
  servesCuisine: "Indian",
  priceRange: "₹₹",
  areaServed: {
    "@type": "Country",
    name: "India",
  },
  knowsAbout: [
    "Indian Sweets",
    "Namkeen",
    "Mithai",
    "Traditional Indian Snacks",
    "Bhujia",
    "Ladoo",
    "Barfi",
    "Chakli",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  alternateName: ["Madhur Sweets", "Madhursweet", "Madhursweets"],
  url: SITE_URL,
  publisher: { "@id": `${SITE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/products?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default async function HomePage() {
  const [categories, products, heroImages, testimonials] = await Promise.all([
    fetchCategories(),
    fetchProducts(),
    fetchHeroImages(),
    fetchTestimonials(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      {/* Hero */}
      <section className="relative flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden">
        {/* Background */}
        {heroImages.length > 0 ? (
          <HeroBackgroundCarousel images={heroImages} />
        ) : (
          <>
            <div className="absolute inset-0 bg-linear-to-br from-[#1c0400] via-[#4a0d00] to-[#8b3000]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(212,175,55,0.08),transparent_55%),radial-gradient(circle_at_20%_80%,rgba(255,100,0,0.07),transparent_50%)]" />
            <Mandala size={320} className="top-0 left-0" />
          </>
        )}

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-medium text-white/90 mb-6 sm:mb-8">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Premium Namkeen &amp; Snacks
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.12] tracking-tight text-white [font-family:var(--font-fraunces)]">
              Authentic Namkeen,
              <br />
              <span className="bg-linear-to-r from-[#f5c518] via-[#ffaa00] to-[#f5c518] bg-clip-text text-transparent">
                Bold Every Bite.
              </span>
            </h1>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="mt-5 sm:mt-7 text-sm sm:text-base md:text-xl text-white/70 max-w-xl mx-auto leading-relaxed">
              From aloo bhujia to chakli — every crunch carries the warmth of
              generations-old recipes, made with handpicked spices daily.
            </p>
          </FadeUp>

          <FadeUp delay={0.3}>
            <div className="mt-7 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="h-12 px-8 text-base bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all duration-300"
              >
                <Link href="/products">
                  Shop Namkeen <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base border-white/30 text-white bg-white/5 hover:bg-white/15 backdrop-blur-sm transition-all duration-300"
              >
                <Link href="/categories">Explore Categories</Link>
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="text-center mb-10 md:mb-16">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-secondary mb-3">
                Categories
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-primary tracking-tight">
                Explore Our Collection
              </h2>
              <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Bhujia, mixture, chakli and more — find your favourite crunch
              </p>
            </div>
          </FadeUp>
          <CategoryGrid categories={categories.slice(0, 6)} />
          <FadeUp delay={0.2}>
            <div className="text-center mt-10 md:mt-14">
              <Button asChild variant="outline" size="lg" className="h-11 sm:h-12 px-6 sm:px-8 border-primary/30 text-primary hover:bg-primary hover:text-white">
                <Link href="/categories">View All Categories</Link>
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Featured Products — cream background */}
      <section className="py-16 md:py-32 bg-linear-to-b from-white to-[#faf6f0]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="text-center mb-10 md:mb-16">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-secondary mb-3">
                Bestsellers
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-primary tracking-tight">
                Most Loved Namkeen
              </h2>
              <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Our bestselling snacks — handpicked and fresh every day
              </p>
            </div>
          </FadeUp>
          <ProductGrid products={products.slice(0, 8)} />
          <FadeUp delay={0.2}>
            <div className="text-center mt-10 md:mt-14">
              <Button asChild variant="outline" size="lg" className="h-11 sm:h-12 px-6 sm:px-8 border-primary/30 text-primary hover:bg-primary hover:text-white">
                <Link href="/products">View All Products</Link>
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Why Choose Us — cream card backgrounds like madhurhtml b2b-card */}
      <section className="py-16 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="text-center mb-10 md:mb-16">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-secondary mb-3">
                Why Us
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-primary tracking-tight">
                Why Choose Madhur Sweet?
              </h2>
            </div>
          </FadeUp>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
            {[
              {
                icon: Leaf,
                title: "Fresh Daily",
                description:
                  "Every batch of namkeen is prepared fresh daily with handpicked spices. No preservatives, no compromises.",
              },
              {
                icon: Heart,
                title: "Traditional Recipes",
                description:
                  "Recipes passed down through generations, preserving the authentic crunch and spice of Indian namkeen.",
              },
              {
                icon: Truck,
                title: "Fast Delivery",
                description:
                  "Quick and careful delivery to your doorstep. Freshness guaranteed with our special packaging.",
              },
            ].map((item) => (
              <StaggerItem key={item.title}>
                <Card className="group text-center bg-linear-to-br from-[#faf6f0] to-[#f5e6d3] border-2 border-transparent shadow-sm hover:shadow-xl hover:-translate-y-2 hover:border-accent transition-all duration-400">
                  <CardContent className="flex flex-row md:flex-col items-center md:items-center gap-5 md:gap-0 p-6 md:pt-12 md:pb-10 md:px-8">
                    <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-secondary/15 flex items-center justify-center md:mb-7 group-hover:bg-secondary/25 group-hover:scale-110 transition-all duration-300">
                      <item.icon className="h-5 w-5 md:h-6 md:w-6 text-secondary" />
                    </div>
                    <div className="text-left md:text-center">
                      <h3 className="text-base md:text-xl font-semibold md:mb-3 text-primary">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-1 md:mt-0">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Banner — warm cream gradient */}
      <section className="relative py-16 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-[#f5e6d3] via-[#f4e4c1] to-[#faf6f0]" />
        <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-secondary/8 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="text-center">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-secondary mb-3">
                Loved by thousands
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-primary tracking-tight">
                Ready for the perfect crunch?
              </h2>
              <p className="mt-4 sm:mt-6 text-sm sm:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
                Order your favourite namkeen today and taste the magic of Madhur — fresh, bold, and delivered to your door.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <TestimonialsCarousel testimonials={testimonials} />
          </FadeUp>

          <FadeUp delay={0.25}>
            <div className="mt-12 text-center">
              <Button
                asChild
                size="lg"
                className="text-base px-10 h-12 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 transition-all duration-300"
              >
                <Link href="/products">
                  Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
