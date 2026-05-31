import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchProduct } from "@/features/products/actions/product-actions";
import { ProductDetail } from "@/features/products";
import { FeedbackSection } from "@/features/feedback";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
    return { title: "Product Not Found | Madhur Sweets" };
  }

  const image = product.images[0];
  const canonicalUrl = `${SITE_URL}/products/${product.slug}`;

  return {
    title: `${product.name} | ${SITE_NAME}`,
    description: product.shortDescription,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${product.name} | ${SITE_NAME}`,
      description: product.shortDescription,
      url: canonicalUrl,
      type: "website",
      images: image ? [{ url: image, alt: product.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | ${SITE_NAME}`,
      description: product.shortDescription,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
    notFound();
  }

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.id,
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/products/${product.slug}`,
      priceCurrency: "INR",
      price: product.discountPrice ?? product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: SITE_NAME },
    },
    ...(product.reviewCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetail product={product} />

      {/* Customer Reviews */}
      <section className="mt-10 md:mt-20">
        <h2 className="mb-5 md:mb-8 text-xl sm:text-2xl font-bold tracking-tight text-primary">Customer Reviews</h2>
        <div className="rounded-xl sm:rounded-2xl border-0 bg-[#faf6f0] shadow-[0_5px_20px_rgba(0,0,0,0.05)] p-5 sm:p-8 md:p-10">
          <FeedbackSection productId={product.id} />
        </div>
      </section>
    </main>
  );
}
