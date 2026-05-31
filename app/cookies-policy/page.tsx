import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import { API_URL } from "@/lib/proxy";

export const metadata: Metadata = {
  title: "Cookies Policy",
  description:
    "Learn how Madhur Sweet uses cookies to improve your browsing experience, and how you can manage your cookie preferences.",
  robots: { index: false, follow: false },
};

async function getPolicy(): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/api/settings`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.cookiesPolicy || json?.cookiesPolicy || null;
  } catch {
    return null;
  }
}

export default async function CookiesPolicyPage() {
  const content = await getPolicy();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Cookies Policy</h1>

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
              <h2 className="text-2xl font-semibold mb-4">What Are Cookies</h2>
              <p>
                Cookies are small text files placed on your device when you visit
                {" "}{SITE_NAME}. They help us provide you with a better experience by
                remembering your preferences, keeping you signed in, and
                understanding how you use our site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
              <ul className="space-y-4">
                <li>
                  <strong>Essential Cookies:</strong> Required for basic site
                  functionality, such as shopping cart and checkout processes.
                </li>
                <li>
                  <strong>Analytics Cookies:</strong> Help us understand how visitors
                  interact with our website by collecting anonymous usage data.
                </li>
                <li>
                  <strong>Preference Cookies:</strong> Remember your settings and
                  choices, such as language and region preferences.
                </li>
                <li>
                  <strong>Marketing Cookies:</strong> Used to deliver relevant
                  advertisements and track the effectiveness of our campaigns.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Managing Cookies</h2>
              <p>
                You can control and manage cookies through your browser settings.
                Most browsers allow you to block or delete cookies. However,
                blocking essential cookies may affect the functionality of our
                website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact</h2>
              <p>
                If you have questions about our use of cookies, please email us at{" "}
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
