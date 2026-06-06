import type { Metadata } from "next";
import { API_URL } from "@/lib/proxy";

export const metadata: Metadata = {
  title: "Shipping Policy | Madhur Sweet",
  description: "Learn about Madhur Sweet's shipping policy — delivery times, charges, and coverage across India.",
  alternates: { canonical: "/shipping" },
};

async function getContent(): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/api/settings`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.shippingPolicy || json?.shippingPolicy || null;
  } catch {
    return null;
  }
}

export default async function ShippingPage() {
  const content = await getContent();
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12 md:py-16">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8">Shipping Policy</h1>

      {content ? (
        <div className="space-y-4 text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{content}</div>
      ) : (
        <div className="space-y-6 sm:space-y-8 text-sm text-foreground/90 leading-relaxed">
          <section>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3">Delivery Coverage</h2>
            <p>
              We deliver pan India. Orders are shipped through trusted courier partners
              to ensure your sweets arrive fresh and on time.
            </p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3">Delivery Time</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Delhi NCR: 1–2 business days</li>
              <li>Metro cities: 2–3 business days</li>
              <li>Other cities: 3–5 business days</li>
              <li>Remote areas: 5–7 business days</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3">Shipping Charges</h2>
            <p>
              Free shipping is available on orders above a certain value. For orders
              below that threshold, a flat shipping fee applies. The exact amounts
              are shown at checkout.
            </p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3">Order Tracking</h2>
            <p>
              Once your order is dispatched, you will receive a tracking link via
              email and SMS so you can monitor your delivery in real time.
            </p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3">Packaging</h2>
            <p>
              All orders are packed in food-safe, tamper-evident packaging designed
              to keep your sweets fresh and intact during transit.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
