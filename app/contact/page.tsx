import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/ui/motion";
import { API_URL } from "@/lib/proxy";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Madhur Sweet. Visit our store in Chandni Chowk, Old Delhi, or send us a message for custom orders, bulk inquiries, and feedback.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Us | Madhur Sweet",
    description:
      "Get in touch with Madhur Sweet. Visit our store in Chandni Chowk, Old Delhi, or send us a message for custom orders, bulk inquiries, and feedback.",
    url: "/contact",
  },
};

interface BusinessAddress {
  name?: string;
  phone?: string;
  phone2?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  email?: string;
  email2?: string;
  hoursWeekdays?: string;
  hoursSunday?: string;
}

async function getBusinessAddress(): Promise<BusinessAddress | null> {
  try {
    const res = await fetch(`${API_URL}/api/settings`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.businessAddress ?? json?.businessAddress ?? null;
  } catch {
    return null;
  }
}

export default async function ContactPage() {
  const addr = await getBusinessAddress();

  const visitDetails: string[] = [];
  if (addr?.line1) visitDetails.push(addr.line1);
  const cityLine = [addr?.line2, [addr?.city, addr?.state].filter(Boolean).join(", "), addr?.pincode]
    .filter(Boolean)
    .join(" - ");
  if (cityLine) visitDetails.push(cityLine);

  const phoneDetails = [addr?.phone, addr?.phone2].filter(Boolean) as string[];
  const emailDetails = [addr?.email, addr?.email2].filter(Boolean) as string[];
  const hoursDetails = [addr?.hoursWeekdays, addr?.hoursSunday].filter(Boolean) as string[];

  const contactItems = [
    {
      icon: MapPin,
      title: "Visit Us",
      details: visitDetails.length
        ? visitDetails
        : ["42, Sweet Lane, Chandni Chowk", "Old Delhi, New Delhi - 110006"],
    },
    {
      icon: Phone,
      title: "Call Us",
      details: phoneDetails.length ? phoneDetails : ["+91 99999 99999", "+91 11 2345 6789"],
    },
    {
      icon: Mail,
      title: "Email Us",
      details: emailDetails.length
        ? emailDetails
        : ["hello@madhursweet.com", "orders@madhursweet.com"],
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: hoursDetails.length
        ? hoursDetails
        : ["Mon - Sat: 8:00 AM - 9:00 PM", "Sunday: 9:00 AM - 6:00 PM"],
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 md:py-24">
      <FadeUp>
        <div className="text-center mb-8 md:mb-14">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-secondary mb-3">
            Get in Touch
          </p>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-primary">Contact Us</h1>
          <p className="text-muted-foreground mt-3 sm:mt-5 max-w-2xl mx-auto text-sm sm:text-lg leading-relaxed">
            Have a question, custom order request, or feedback? We would love to hear
            from you. Reach out using the form below or visit us at our store.
          </p>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-14">
        {/* Contact Form */}
        <FadeUp delay={0.1}>
          <Card className="border-0 shadow-[0_10px_40px_rgba(139,0,0,0.1)] hover:shadow-[0_15px_50px_rgba(139,0,0,0.15)] transition-shadow duration-300">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl text-primary">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Name</label>
                    <Input placeholder="Your name" className="h-10 sm:h-11 bg-[#faf6f0] border-[#faf6f0] focus:border-secondary focus:bg-white" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input type="email" placeholder="your@email.com" className="h-10 sm:h-11 bg-[#faf6f0] border-[#faf6f0] focus:border-secondary focus:bg-white" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Input placeholder="How can we help?" className="h-10 sm:h-11 bg-[#faf6f0] border-[#faf6f0] focus:border-secondary focus:bg-white" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea
                    placeholder="Tell us more about your inquiry..."
                    className="min-h-30 sm:min-h-37.5 resize-none bg-[#faf6f0] border-[#faf6f0] focus:border-secondary focus:bg-white"
                  />
                </div>
                <Button type="submit" className="w-full h-10 sm:h-11 shadow-sm shadow-primary/15">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </FadeUp>

        {/* Contact Info */}
        <FadeUp delay={0.2}>
          <div className="space-y-4 sm:space-y-6">
            <Card className="border-0 shadow-[0_5px_20px_rgba(0,0,0,0.08)]">
              <CardContent className="p-5 sm:p-6 md:p-8">
                <div className="space-y-5 sm:space-y-7">
                  {contactItems.map((item) => (
                    <div key={item.title} className="flex gap-4 group">
                      <div className="w-11 h-11 rounded-xl bg-secondary/15 flex items-center justify-center shrink-0 group-hover:bg-secondary/25 transition-colors duration-200">
                        <item.icon className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-0.5 text-primary">{item.title}</h3>
                        {item.details.map((d, i) => (
                          <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                            {d}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Map — Google Maps embed (free, no API key) */}
            <Card className="overflow-hidden border-0 shadow-[0_5px_20px_rgba(0,0,0,0.08)]">
              <iframe
                title="Madhur Sweet location — Chandni Chowk, Old Delhi"
                src="https://maps.google.com/maps?q=Chandni+Chowk,+Old+Delhi,+New+Delhi&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-72 border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </Card>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
