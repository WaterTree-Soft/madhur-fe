import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import { API_URL } from "@/lib/proxy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read Madhur Sweet's Privacy Policy to understand how we collect, use, and protect your personal information when you shop with us.",
  robots: { index: false, follow: false },
};

async function getPolicy(): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/api/settings`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.privacyPolicy || json?.privacyPolicy || null;
  } catch {
    return null;
  }
}

export default async function PrivacyPolicyPage() {
  const content = await getPolicy();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

      {content ? (
        <div className="space-y-4 text-foreground/90 leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      ) : (
        <>
          <p className="text-muted-foreground mb-8">
            Last updated: April 1, 2026
          </p>
          <div className="space-y-8 text-foreground/90 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Information We Collect
              </h2>
              <p>
                At {SITE_NAME}, we collect information you provide directly, such as
                your name, email address, phone number, shipping address, and
                payment details when you place an order. We also automatically
                collect certain information about your device and browsing behavior
                when you visit our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                How We Use Your Information
              </h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Process and fulfill your orders</li>
                <li>Communicate with you about your orders and account</li>
                <li>Send promotional offers and updates (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Prevent fraud and ensure security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Data Sharing</h2>
              <p>
                We do not sell your personal information. We may share your data with
                trusted third-party service providers who assist us in operating our
                website, conducting our business, or servicing you, including payment
                processors, shipping partners, and analytics providers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your
                browsing experience, analyze site traffic, and personalize content.
                You can manage your cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
              <p>
                You have the right to access, correct, or delete your personal
                information. You may also opt out of marketing communications at any
                time by clicking the unsubscribe link in our emails or contacting us
                directly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at{" "}
                <a
                  href="mailto:privacy@madhursweet.com"
                  className="text-primary underline"
                >
                  privacy@madhursweet.com
                </a>
                .
              </p>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
