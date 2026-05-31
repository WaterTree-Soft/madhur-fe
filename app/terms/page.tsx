import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import { API_URL } from "@/lib/proxy";

async function getContent(): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/api/settings`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.termsOfService || json?.termsOfService || null;
  } catch {
    return null;
  }
}

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read Madhur Sweet's Terms of Service governing the use of our website, placing orders, payments, shipping, and returns.",
  robots: { index: false, follow: false },
};

export default async function TermsPage() {
  const content = await getContent();
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

      {content ? (
        <div className="space-y-4 text-foreground/90 leading-relaxed whitespace-pre-wrap">{content}</div>
      ) : (
      <>
      <p className="text-muted-foreground mb-8">Last updated: April 1, 2026</p>
      <div className="space-y-8 text-foreground/90 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
          <p>
            By accessing or using the {SITE_NAME} website and services, you
            agree to be bound by these Terms of Service. If you do not agree to
            these terms, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Use of Service</h2>
          <p>
            You must be at least 18 years old to use our services. You agree to
            provide accurate and complete information when creating an account or
            placing an order. You are responsible for maintaining the security of
            your account credentials.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Orders & Payments</h2>
          <p>
            All orders are subject to acceptance and availability. Prices are
            listed in Indian Rupees (INR) and include applicable taxes. We
            accept payments via UPI, credit/debit cards, net banking, and cash on
            delivery for eligible orders.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Shipping</h2>
          <p>
            We offer delivery across India. Delivery times vary based on your
            location and are provided as estimates. {SITE_NAME} is not liable
            for delays caused by shipping carriers or force majeure events.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Returns & Refunds</h2>
          <p>
            Due to the perishable nature of our products, we accept returns only
            for damaged or incorrect items. Please contact us within 24 hours of
            delivery with photos of the issue. Approved refunds will be processed
            within 5-7 business days.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Limitation of Liability
          </h2>
          <p>
            {SITE_NAME} shall not be liable for any indirect, incidental,
            special, or consequential damages resulting from the use or inability
            to use our services, or from any products purchased through our
            platform.
          </p>
        </section>
      </div>
      </>
      )}
    </div>
  );
}
