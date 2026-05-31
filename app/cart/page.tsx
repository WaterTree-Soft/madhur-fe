import type { Metadata } from "next";
import { CartPage } from "@/features/cart";

export const metadata: Metadata = {
  title: "Shopping Cart | Madhur Sweets",
  description:
    "Review the sweets in your cart, update quantities, and proceed to checkout.",
};

export default function Page() {
  return <CartPage />;
}
