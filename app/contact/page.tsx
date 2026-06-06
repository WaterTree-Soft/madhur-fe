import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FadeUp } from "@/components/ui/motion";
import { ContactForm } from "@/features/contact/components/contact-form";
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
        : [
            "Building 4, Phtehpuriya Market",
            "Village Pali, near Sarafa Market",
            "Rajasthan - 306401",
          ],
    },
    {
      icon: Phone,
      title: "Call Us",
      details: phoneDetails.length ? phoneDetails : ["+91 73406 11001"],
    },
    {
      icon: Mail,
      title: "Email Us",
      details: emailDetails.length
        ? emailDetails
        : ["madhursweets@zohomail.in", "rahulagarwal591@gmail.com"],
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: hoursDetails.length
        ? hoursDetails
        : ["Mon - Sat: 8:00 AM - 9:00 PM", "Sunday: 9:00 AM - 6:00 PM"],
    },
  ];

  // Exact pin for MADHUR SWEETS, Pali (from Google Maps)
  const mapSrc =
    "https://maps.google.com/maps?q=25.7770034,73.3237165&z=18&hl=en&output=embed";

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 md:py-24">
      <FadeUp>
        <div className="text-center mb-8 md:mb-14">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-secondary mb-3">
            Get in Touch
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-primary">
            Contact Us
          </h1>
          <p className="text-muted-foreground mt-3 sm:mt-4 max-w-2xl mx-auto text-sm leading-relaxed">
            Have a question, custom order request, or feedback? We would love to
            hear from you. Reach out using the form below or visit us at our
            store.
          </p>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-14">
        {/* Contact Form */}
        <FadeUp delay={0.1}>
          <ContactForm />
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
                        <h3 className="text-sm sm:text-base font-semibold mb-0.5 text-primary">
                          {item.title}
                        </h3>
                        {item.details.map((d, i) => (
                          <p
                            key={i}
                            className="text-xs sm:text-sm text-muted-foreground leading-relaxed"
                          >
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
                title="Madhur Sweets location"
                src={mapSrc}
                className="w-full h-56 sm:h-72 border-0"
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
