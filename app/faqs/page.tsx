import type { Metadata } from "next";
import { API_URL } from "@/lib/proxy";

export const metadata: Metadata = {
  title: "FAQs | Madhur Sweet",
  description: "Frequently asked questions about Madhur Sweet — orders, delivery, ingredients, and more.",
  alternates: { canonical: "/faqs" },
};

async function getContent(): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/api/settings`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.faqs || json?.faqs || null;
  } catch {
    return null;
  }
}

export default async function FaqsPage() {
  const content = await getContent();
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>

      {content ? (
        <div className="space-y-4 text-foreground/90 leading-relaxed whitespace-pre-wrap">{content}</div>
      ) : (
        <div className="space-y-8 text-foreground/90 leading-relaxed">
          {[
            {
              q: "How fresh are your sweets?",
              a: "All our sweets are made fresh daily using traditional recipes and pure ingredients. We do not use any artificial preservatives.",
            },
            {
              q: "Do you offer custom orders?",
              a: "Yes! We accept custom orders for weddings, festivals, and corporate gifting. Please contact us at least 3 days in advance.",
            },
            {
              q: "What is the shelf life of your products?",
              a: "Shelf life varies by product — typically 3–15 days for fresh sweets and up to 30 days for dry items. Each product page lists the shelf life.",
            },
            {
              q: "Do you deliver pan India?",
              a: "Yes, we deliver across India. Delivery times depend on your location. Metro cities typically receive orders within 2–3 business days.",
            },
            {
              q: "What if my order arrives damaged?",
              a: "Please contact us within 24 hours of delivery with photos. We will arrange a replacement or refund for damaged items.",
            },
            {
              q: "Are your products suitable for people with allergies?",
              a: "Our sweets contain dairy, nuts, and gluten. Please check the ingredients listed on each product page or contact us for more information.",
            },
          ].map(({ q, a }) => (
            <section key={q}>
              <h2 className="text-xl font-semibold mb-2 text-primary">{q}</h2>
              <p>{a}</p>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
