import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/types";

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  hydrateFromServer: () => Promise<void>;
}

function authHeader(): HeadersInit {
  if (typeof window === "undefined") return {};
  const jwt = localStorage.getItem("ms-auth");
  return jwt ? { Authorization: `Bearer ${jwt}` } : {};
}

function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("ms-auth");
}

let pushTimer: ReturnType<typeof setTimeout> | null = null;

function schedulePush(getItems: () => CartItem[]) {
  if (!isLoggedIn()) return;
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(async () => {
    pushTimer = null;
    try {
      await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({
          items: getItems().map((i) => ({ product: i.product.id, quantity: i.quantity })),
        }),
      });
    } catch {
      // Offline — local state is still correct.
    }
  }, 500);
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      hydrateFromServer: async () => {
        try {
          const res = await fetch("/api/cart", { headers: authHeader() });
          if (!res.ok) return;
          const data = await res.json();
          const serverItems = Array.isArray(data.items) ? data.items : [];
          // Filter out items whose product was deleted (backend may return null product)
          const validItems = serverItems.filter(
            (item: CartItem) => item.product != null && item.product.id != null
          );
          if (validItems.length > 0) {
            set({ items: validItems });
            // If any items were pruned, sync the cleaned cart back
            if (validItems.length !== serverItems.length) {
              schedulePush(() => validItems);
            }
          } else if (serverItems.length > 0) {
            // All server items were invalid — clear cart
            set({ items: [] });
            schedulePush(() => []);
          } else if (get().items.length > 0) {
            schedulePush(() => get().items);
          }
        } catch {
          // Offline — keep local copy.
        }
      },

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id,
          );

          if (existingIndex !== -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: updatedItems[existingIndex].quantity + quantity,
            };
            return { items: updatedItems };
          }

          return { items: [...state.items, { product, quantity }] };
        });
        schedulePush(() => get().items);
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
        schedulePush(() => get().items);
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item,
          ),
        }));
        schedulePush(() => get().items);
      },

      clearCart: () => {
        set({ items: [] });
        schedulePush(() => []);
      },

      getTotal: () => {
        return get().items.reduce(
          (total, item) =>
            total +
            (item.product.discountPrice ?? item.product.price) * item.quantity,
          0,
        );
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "ms-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
