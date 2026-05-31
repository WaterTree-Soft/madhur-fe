"use server";

import type { Category, Product } from "@/types";
import { getCategories, getCategory, getFeedbackAggregates } from "@/lib/strapi";

export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await getCategories();
    return response.data;
  } catch {
    return [];
  }
}

export async function fetchCategory(
  slug: string
): Promise<Category | undefined> {
  try {
    const response = await getCategory(slug);
    return response.data[0];
  } catch {
    return undefined;
  }
}

export async function fetchCategoryProducts(
  slug: string
): Promise<Product[]> {
  try {
    const { getProducts } = await import("@/lib/strapi");
    const response = await getProducts({ category: slug });
    const products = response.data;
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
  } catch {
    return [];
  }
}
