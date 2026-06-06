import type { Metadata } from "next";
import { API_URL } from "@/lib/proxy";

export const metadata: Metadata = {
  title: "Returns & Refunds | Madhur Sweet",
  description: "Understand Madhur Sweet's returns and refunds policy for damaged or incorrect orders.",
  alternates: { canonical: "/returns" },
};

async function getContent(): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/api/settings`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.returnsPolicy || json?.returnsPolicy || null;
  } catch {
    return null;
  }
}

export default async function ReturnsPage() {
  const content = await getContent();
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12 md:py-16">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8">Returns &amp; Refunds</h1>

      {content ? (
        <div className="space-y-4 text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{content}</div>
      ) : (
        <div className="space-y-6 sm:space-y-8 text-sm text-foreground/90 leading-relaxed">
          <section>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3">Our Returns Policy</h2>
            <p>
              Due to the perishable nature of our products, we accept return or
              replacement requests only for items that arrive damaged, spoiled, or
              are incorrect. We do not accept returns for change of mind.
            </p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3">How to Raise a Request</h2>
            <ol className="list-decimal pl-5 space-y-1.5">
              <li>Contact us within 24 hours of receiving your order.</li>
              <li>Email us at orders@madhursweet.com with your order number and clear photos of the issue.</li>
              <li>Our team will review your request within 1 business day.</li>
              <li>Approved requests will be processed as a replacement or refund.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3">Refund Timeline</h2>
            <p>
              Approved refunds are credited back to the original payment method within
              5–7 business days. UPI and wallet refunds may be processed faster.
            </p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3">Non-Returnable Items</h2>
            <p>
              Items that have been consumed, tampered with, or returned after 24 hours
              of delivery are not eligible for a refund or replacement.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
