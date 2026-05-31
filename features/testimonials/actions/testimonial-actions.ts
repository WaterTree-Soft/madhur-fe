"use server";

import { API_URL } from "@/lib/constants";
import type { Testimonial } from "@/types";

export async function fetchTestimonials(): Promise<Testimonial[]> {
  try {
    const res = await fetch(`${API_URL}/api/testimonials`, {
      next: { revalidate: 3600, tags: ["testimonials"] },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data ?? []) as Testimonial[];
  } catch {
    return [];
  }
}
