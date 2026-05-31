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
    "Learn about Madhur Sweet — a legacy of authentic Indian namkeen and sweets since 1965. Crafted with pure desi ghee, handpicked spices, and generations-old recipes.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Us | Madhur Sweet",
    description:
      "Learn about Madhur Sweet — a legacy of authentic Indian namkeen and sweets since 1965. Crafted with pure desi ghee, handpicked spices, and generations-old recipes.",
    url: "/about",
  },
};

export default async function AboutPage() {
  const content = await getContent();
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      {content ? (
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-8">About {SITE_NAME}</h1>
          <div className="space-y-4 text-foreground/90 leading-relaxed whitespace-pre-wrap">{content}</div>
        </div>
      ) : (
      <>
      <FadeUp>
        <div className="text-center mb-16 md:mb-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-secondary mb-3">
            Our Story
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
            About {SITE_NAME}
          </h1>
          <p className="text-muted-foreground mt-5 max-w-2xl mx-auto text-lg leading-relaxed">
            A legacy of sweetness, crafted with love since 1965.
          </p>
        </div>
      </FadeUp>

      {/* Our Story */}
      <FadeUp>
        <section className="mb-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-primary">Our Story</h2>
          <div className="space-y-5 text-foreground/85 leading-relaxed text-[0.95rem]">
            <p>
              {SITE_NAME} began as a small sweet shop in the heart of Old Delhi
              in 1965. Founded by Shri Madhur Lal Ji, our journey started with a
              simple mission: to bring the authentic taste of traditional Indian
              sweets to every household.
            </p>
            <p>
              Over six decades, we have grown from a single shop to a beloved
              brand serving customers across India. Our recipes have been passed
              down through three generations, each adding their own touch while
              preserving the essence of tradition.
            </p>
            <p>
              Today, {SITE_NAME} is synonymous with quality, purity, and taste.
              We continue to use pure desi ghee, hand-selected dry fruits, and
              time-honored techniques that make our sweets truly special.
            </p>
          </div>
        </section>
      </FadeUp>

      {/* Values */}
      <section className="mb-20">
        <FadeUp>
          <h2 className="text-2xl font-semibold mb-10 text-center text-primary">Our Values</h2>
        </FadeUp>
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                <CardContent className="pt-10 pb-8 px-8">
                  <div className="mx-auto w-14 h-14 rounded-full bg-secondary/15 flex items-center justify-center mb-6 group-hover:bg-secondary/25 group-hover:scale-110 transition-all duration-300">
                    <value.icon className="h-7 w-7 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-primary">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Team */}
      <section>
        <FadeUp>
          <h2 className="text-2xl font-semibold mb-10 text-center text-primary">Our Team</h2>
        </FadeUp>
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {["Founder & CEO", "Head Chef", "Operations Lead", "Marketing Head"].map(
            (role) => (
              <StaggerItem key={role}>
                <Card className="group text-center bg-linear-to-br from-[#faf6f0] to-[#f5e6d3] border-2 border-transparent hover:shadow-lg hover:-translate-y-1 hover:border-accent transition-all duration-300">
                  <CardContent className="p-6 pt-8">
                    <div className="w-20 h-20 rounded-full bg-[#f5e6d3] mx-auto mb-4 group-hover:bg-[#f4e4c1] transition-colors duration-300" />
                    <p className="font-semibold text-primary">Team Member</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{role}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            )
          )}
        </StaggerContainer>
      </section>
      </>
      )}
    </div>
  );
}
