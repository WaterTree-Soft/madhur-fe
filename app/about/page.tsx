import type { Metadata } from "next";
import { Award, Heart, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_NAME } from "@/lib/constants";
import { API_URL } from "@/lib/proxy";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/motion";

async function getContent(): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/api/settings`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.aboutUs || json?.aboutUs || null;
  } catch {
    return null;
  }
}

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Madhur Sweet — a legacy of authentic Indian biscuits, cakes, pastries, rusk and namkeen since 1965. Baked fresh in Pali, Rajasthan with handpicked ingredients and generations-old recipes.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Us | Madhur Sweet",
    description:
      "Learn about Madhur Sweet — a legacy of authentic Indian biscuits, cakes, pastries, rusk and namkeen since 1965. Baked fresh in Pali, Rajasthan with handpicked ingredients and generations-old recipes.",
    url: "/about",
  },
};

export default async function AboutPage() {
  const content = await getContent();
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-20">
      {content ? (
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-primary mb-4 sm:mb-6 md:mb-8">About {SITE_NAME}</h1>
          <div className="space-y-4 text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{content}</div>
        </div>
      ) : (
      <>
      <FadeUp>
        <div className="text-center mb-10 sm:mb-14 md:mb-20">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-secondary mb-2 sm:mb-3">
            Our Story
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-primary">
            About {SITE_NAME}
          </h1>
          <p className="text-muted-foreground mt-3 sm:mt-5 max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed">
            A legacy of sweetness, crafted with love since 1965.
          </p>
        </div>
      </FadeUp>

      {/* Our Story */}
      <FadeUp>
        <section className="mb-12 sm:mb-16 md:mb-20 max-w-3xl mx-auto">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6 text-primary">Our Story</h2>
          <div className="space-y-4 sm:space-y-5 text-sm text-foreground/85 leading-relaxed">
            <p>
              {SITE_NAME} began as a small bakery and sweet shop in Pali,
              Rajasthan in 1965. Founded by Shri Gangavishan Agarwal, our journey
              started with a simple mission: to bring the authentic taste of
              freshly baked biscuits, cakes, pastries, rusk and traditional
              namkeen to every household.
            </p>
            <p>
              Over six decades, we have grown from a single shop to a beloved
              brand serving customers across India. Our recipes have been passed
              down through three generations, each adding their own touch while
              preserving the essence of tradition.
            </p>
            <p>
              Today, {SITE_NAME} is synonymous with quality, freshness, and
              taste. We continue to use hand-selected ingredients and
              time-honored techniques that make every bite — from our flaky
              biscuits and soft cakes to our crunchy namkeen — truly special.
            </p>
          </div>
        </section>
      </FadeUp>

      {/* Values */}
      <section className="mb-12 sm:mb-16 md:mb-20">
        <FadeUp>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-6 sm:mb-8 md:mb-10 text-center text-primary">Our Values</h2>
        </FadeUp>
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
          {[
            {
              icon: Award,
              title: "Uncompromising Quality",
              description:
                "Every ingredient is carefully sourced and every sweet is quality-tested before it reaches you. We never compromise on purity.",
            },
            {
              icon: Heart,
              title: "Rooted in Tradition",
              description:
                "Our recipes are treasures from generations past. We honor the art of Indian sweet making while embracing modern food safety standards.",
            },
            {
              icon: Users,
              title: "Customer First",
              description:
                "Your satisfaction drives everything we do. From customizable orders to doorstep delivery, we go the extra mile for our customers.",
            },
          ].map((value) => (
            <StaggerItem key={value.title}>
              <Card className="group text-center bg-linear-to-br from-[#faf6f0] to-[#f5e6d3] border-2 border-transparent shadow-sm hover:shadow-xl hover:-translate-y-2 hover:border-accent transition-all duration-400">
                <CardContent className="pt-6 sm:pt-8 md:pt-10 pb-5 sm:pb-6 md:pb-8 px-5 sm:px-6 md:px-8">
                  <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-secondary/15 flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:bg-secondary/25 group-hover:scale-110 transition-all duration-300">
                    <value.icon className="h-6 w-6 sm:h-7 sm:w-7 text-secondary" />
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 text-primary">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Team */}
      {/* <section>
        <FadeUp>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-6 sm:mb-8 md:mb-10 text-center text-primary">Our Team</h2>
        </FadeUp>
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {["Founder & CEO", "Head Chef", "Operations Lead", "Marketing Head"].map(
            (role) => (
              <StaggerItem key={role}>
                <Card className="group text-center bg-linear-to-br from-[#faf6f0] to-[#f5e6d3] border-2 border-transparent hover:shadow-lg hover:-translate-y-1 hover:border-accent transition-all duration-300">
                  <CardContent className="p-4 sm:p-5 md:p-6 pt-5 sm:pt-6 md:pt-8">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-[#f5e6d3] mx-auto mb-3 sm:mb-4 group-hover:bg-[#f4e4c1] transition-colors duration-300" />
                    <p className="text-sm sm:text-base font-semibold text-primary">Team Member</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{role}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            )
          )}
        </StaggerContainer>
      </section> */}
      </>
      )}
    </div>
  );
}
