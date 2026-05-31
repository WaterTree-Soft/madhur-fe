"use server";

import { getProducts, getProduct, getFeedbackAggregates } from "@/lib/strapi";
import { mockProducts } from "@/lib/mock-data";
import type { Product } from "@/types";

async function enrichWithFeedback(products: Product[]): Promise<Product[]> {
  if (products.length === 0) return products;
  try {
    const aggregates = await getFeedbackAggregates(products.map((p) => p.id));
    return products.map((p) => {
      const agg = aggregates[p.id];
      return agg ? { ...p, rating: agg.rating, reviewCount: agg.reviewCount } : p;
    });
  } catch {
    return products;
  }
}

interface FetchProductsParams {
  category?: string;
  search?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}

export async function fetchProducts(
  params?: FetchProductsParams
): Promise<Product[]> {
  try {
    const response = await getProducts(params);
    return await enrichWithFeedback(response.data);
  } catch {
    // Fall back to mock data
    let products = [...mockProducts];

    if (params?.category) {
      products = products.filter(
        (p) => p.category.slug === params.category
      );
    }

    if (params?.search) {
      const query = params.search.toLowerCase();
      products = products.filter((p) =>
        p.name.toLowerCase().includes(query)
      );
    }

    return products;
  }
}

export async function fetchProduct(
  slug: string
): Promise<Product | null> {
  try {
    const response = await getProduct(slug);
    const product = response.data[0];
    if (!product) return null;
    const [enriched] = await enrichWithFeedback([product]);
    return enriched ?? null;
  } catch {
    // Fall back to mock data
    return mockProducts.find((p) => p.slug === slug) ?? null;
  }
}

export async function fetchProductsByCategory(
  categorySlug: string
): Promise<Product[]> {
  return fetchProducts({ category: categorySlug });
}
