import { API_URL } from "@/lib/constants";
import type { Product, Category, Feedback, Testimonial } from "@/types";

interface FetchAPIOptions extends RequestInit {
  next?: { revalidate?: number; tags?: string[] };
}

export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: StrapiResponse<T>["meta"];
}

const absoluteMediaUrl = (url?: string | null): string => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${API_URL}${url}`;
};

const normalizeImages = (images: unknown): string[] => {
  if (!Array.isArray(images)) return [];
  return images
    .map((img) => (typeof img === "string" ? absoluteMediaUrl(img) : ""))
    .filter(Boolean);
};

const normalizeCategory = (raw: unknown): Category => {
  const c = (raw ?? {}) as {
    id?: string;
    name?: string;
    slug?: string;
    description?: string;
    image?: string | null;
    productCount?: number;
  };
  return {
    id: String(c.id ?? ""),
    name: c.name ?? "",
    slug: c.slug ?? "",
    description: c.description ?? "",
    image: absoluteMediaUrl(c.image),
    productCount: c.productCount ?? 0,
  };
};

const normalizeProduct = (raw: unknown): Product => {
  const p = (raw ?? {}) as Partial<Product> & {
    images?: unknown;
    category?: unknown;
  };
  return {
    id: String(p.id ?? ""),
    name: p.name ?? "",
    slug: p.slug ?? "",
    description: p.description ?? "",
    shortDescription: p.shortDescription ?? "",
    price: Number(p.price ?? 0),
    discountPrice:
      p.discountPrice == null ? undefined : Number(p.discountPrice),
    images: normalizeImages(p.images),
    category: normalizeCategory(p.category),
    inStock: Boolean(p.inStock),
    weight: p.weight ?? "",
    ingredients: p.ingredients ?? undefined,
    shelfLife: p.shelfLife ?? undefined,
    rating: Number(p.rating ?? 0),
    reviewCount: Number(p.reviewCount ?? 0),
    createdAt: p.createdAt ?? "",
  };
};

/**
 * Base fetch wrapper for Express API calls (server-side, no user auth).
 */
export async function fetchAPI<T>(
  endpoint: string,
  options: FetchAPIOptions = {}
): Promise<T> {
  const url = `${API_URL}/api${endpoint}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `API error [${response.status}]: ${response.statusText} — ${errorBody}`
    );
  }
  return response.json();
}

/**
 * Authenticated fetch for client-side calls that need the user's JWT.
 */
export async function authFetch<T>(
  endpoint: string,
  options: FetchAPIOptions = {}
): Promise<T> {
  const jwt =
    typeof window !== "undefined" ? localStorage.getItem("ms-auth") : null;
  const url = `${API_URL}/api${endpoint}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(jwt && { Authorization: `Bearer ${jwt}` }),
    ...options.headers,
  };
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `API error [${response.status}]: ${response.statusText} — ${errorBody}`
    );
  }
  return response.json();
}

interface ProductFilters {
  category?: string;
  search?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}

export async function getProducts(
  params?: ProductFilters
): Promise<StrapiResponse<Product[]>> {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set("categorySlug", params.category);
  if (params?.search) searchParams.set("search", params.search);
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.pageSize) searchParams.set("pageSize", String(params.pageSize));

  const query = searchParams.toString();
  const raw = await fetchAPI<ApiResponse<unknown[]>>(
    `/products${query ? `?${query}` : ""}`,
    { next: { revalidate: 60, tags: ["products"] } }
  );
  return { data: (raw.data ?? []).map(normalizeProduct), meta: raw.meta };
}

export async function getProduct(
  slug: string
): Promise<StrapiResponse<Product[]>> {
  const raw = await fetchAPI<ApiResponse<unknown>>(
    `/products/${encodeURIComponent(slug)}`,
    { next: { revalidate: 60, tags: ["products", `product-${slug}`] } }
  );
  const product = raw.data ? normalizeProduct(raw.data) : null;
  return { data: product ? [product] : [], meta: raw.meta };
}

export async function getCategories(): Promise<StrapiResponse<Category[]>> {
  const raw = await fetchAPI<ApiResponse<unknown[]>>(
    "/categories",
    { next: { revalidate: 120, tags: ["categories"] } }
  );
  return { data: (raw.data ?? []).map(normalizeCategory), meta: raw.meta };
}

export async function getCategory(
  slug: string
): Promise<StrapiResponse<Category[]>> {
  const [catRaw, productsRaw] = await Promise.all([
    fetchAPI<ApiResponse<unknown>>(
      `/categories/${encodeURIComponent(slug)}`,
      { next: { revalidate: 120, tags: ["categories", `category-${slug}`] } }
    ),
    fetchAPI<ApiResponse<unknown[]>>(
      `/products?categorySlug=${encodeURIComponent(slug)}&pageSize=100`,
      { next: { revalidate: 60, tags: ["products", `category-${slug}`] } }
    ),
  ]);

  if (!catRaw.data) return { data: [] };
  const category = normalizeCategory(catRaw.data);
  const products = (productsRaw.data ?? []).map(normalizeProduct);
  return {
    data: [{ ...category, products } as Category],
    meta: catRaw.meta,
  };
}

export async function createFeedback(
  data: Omit<Feedback, "id" | "createdAt" | "user">
): Promise<StrapiResponse<Feedback>> {
  const raw = await authFetch<ApiResponse<Feedback>>("/feedback", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return { data: raw.data, meta: raw.meta };
}

export async function getFeedback(
  productId: string
): Promise<StrapiResponse<Feedback[]>> {
  const raw = await fetchAPI<ApiResponse<Feedback[]>>(
    `/feedback?product=${encodeURIComponent(productId)}`,
    { next: { revalidate: 30, tags: ["feedbacks", `feedback-${productId}`] } }
  );
  return { data: raw.data ?? [], meta: raw.meta };
}

/**
 * With Express, ratings are stored directly on the Product document
 * (updated whenever feedback is submitted). No separate aggregation needed.
 */
export async function getFeedbackAggregates(
  _productIds: string[]
): Promise<Record<string, { rating: number; reviewCount: number }>> {
  return {};
}

const normalizeTestimonial = (raw: unknown): Testimonial => {
  const t = (raw ?? {}) as Partial<Testimonial>;
  const name = t.name ?? "";
  return {
    id: String(t.id ?? ""),
    name,
    location: t.location ?? "",
    rating: Number(t.rating ?? 5),
    quote: t.quote ?? "",
    initial: t.initial?.trim() || name.trim().charAt(0).toUpperCase() || "?",
    active: t.active ?? true,
    order: Number(t.order ?? 0),
  };
};

export async function getTestimonials(): Promise<StrapiResponse<Testimonial[]>> {
  const raw = await fetchAPI<ApiResponse<unknown[]>>(
    "/testimonials",
    { next: { revalidate: 120, tags: ["testimonials"] } }
  );
  return { data: (raw.data ?? []).map(normalizeTestimonial), meta: raw.meta };
}
