import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchCategory, fetchCategoryProducts } from "@/features/categories";
import { ProductGrid } from "@/features/products";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await fetchCategory(slug);

  if (!category) {
    return { title: "Category Not Found | Madhur Sweets" };
  }

  const canonicalUrl = `${SITE_URL}/categories/${category.slug}`;
  const description =
    category.description ||
    `Shop ${category.name} from ${SITE_NAME}. Freshly made traditional Indian snacks delivered to your door.`;

  return {
    title: `${category.name} | ${SITE_NAME}`,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${category.name} | ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      type: "website",
      images: category.image
        ? [{ url: category.image, alt: category.name }]
        : undefined,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [category, products] = await Promise.all([
    fetchCategory(slug),
    fetchCategoryProducts(slug),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="mb-14 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-secondary mb-3">
          Category
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {category.description}
          </p>
        )}
      </div>
      <ProductGrid products={products} />
    </main>
  );
}
