import { create } from "zustand";
import type {
  AuthState,
  LoginFormData,
  RegisterFormData,
} from "../types/auth-types";
import type { User, Role } from "@/types";
import { API_URL } from "@/lib/constants";
import { useCartStore } from "@/features/cart/store/cart-store";
import { useAddressStore } from "@/features/account/store/address-store";

const STORAGE_KEY = "ms-auth";

function persistJwt(jwt: string | null) {
  if (typeof window === "undefined") return;
  if (jwt) {
    localStorage.setItem(STORAGE_KEY, jwt);
    document.cookie = `${STORAGE_KEY}=${jwt}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  } else {
    localStorage.removeItem(STORAGE_KEY);
    document.cookie = `${STORAGE_KEY}=; path=/; max-age=0`;
  }
}

function readJwt(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

function mapRole(role: string): Role {
  if (role === "super_admin") return "super_admin";
  if (role === "admin") return "admin";
  return "user";
}

/** Fetch current user profile via our Next.js proxy (which calls Express). */
async function fetchMe(jwt: string): Promise<User> {
  const res = await fetch("/api/auth/me", {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  if (!res.ok) throw new Error("Session expired");
  const json = await res.json();
  const data = json.data ?? json;
  return {
    id: String(data.id),
    email: data.email,
    name: data.name ?? data.email.split("@")[0],
    role: mapRole(data.role ?? "user"),
    createdAt: data.createdAt,
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  jwt: null,
  isAuthenticated: false,
  isLoading: true,
  loginDialogOpen: false,
  openLoginDialog: () => set({ loginDialogOpen: true }),
  closeLoginDialog: () => set({ loginDialogOpen: false }),

  login: async (data: LoginFormData) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error ?? "Invalid email or password");
      }

      const { data: responseData } = await res.json();
      const jwt: string = responseData.jwt;
      persistJwt(jwt);

      const user = await fetchMe(jwt);
      set({ user, jwt, isAuthenticated: true, isLoading: false });
      useCartStore.getState().hydrateFromServer();
      useAddressStore.getState().hydrateFromServer(user.id);
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  register: async (data: RegisterFormData) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        const fieldErrors: Record<string, string[]> = err?.details ?? {};
        const firstField = Object.values(fieldErrors)[0];
        throw new Error(firstField?.[0] ?? err?.error ?? "Registration failed");
      }

      const { data: responseData } = await res.json();
      const jwt: string = responseData.jwt;
      persistJwt(jwt);

      const user = await fetchMe(jwt);
      set({ user, jwt, isAuthenticated: true, isLoading: false });
      useCartStore.getState().hydrateFromServer();
      useAddressStore.getState().hydrateFromServer(user.id);
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  logout: () => {
    persistJwt(null);
    try {
      useCartStore.getState().clearCart();
    } catch {
      // Cart store unavailable — logout still succeeds.
    }
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("ms-addresses");
        localStorage.removeItem("ms-cart");
      } catch {
        // Storage might be unavailable — logout still succeeds.
      }
    }
    set({ user: null, jwt: null, isAuthenticated: false });
  },

  setUser: (user: User | null) => {
    set({ user, isAuthenticated: user !== null });
  },

  /** Rehydrate session from localStorage JWT on app load. */
  rehydrate: async () => {
    const jwt = readJwt();
    if (!jwt) {
      set({ isLoading: false });
      return;
    }

    set({ isLoading: true });
    try {
      const user = await fetchMe(jwt);
      set({ user, jwt, isAuthenticated: true, isLoading: false });
      useCartStore.getState().hydrateFromServer();
      useAddressStore.getState().hydrateFromServer(user.id);
    } catch {
      persistJwt(null);
      set({ user: null, jwt: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
