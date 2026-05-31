import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Address } from "@/types";

export interface SavedAddress extends Address {
  id: string;
  userId: string;
  label?: string;
  isDefault?: boolean;
}

interface AddressState {
  addresses: SavedAddress[];
  hydrateFromServer: (userId: string) => Promise<void>;
  addAddress: (userId: string, address: Address, label?: string) => Promise<SavedAddress>;
  updateAddress: (id: string, patch: Partial<Address> & { label?: string }) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
  setDefault: (userId: string, id: string) => Promise<void>;
  getForUser: (userId: string) => SavedAddress[];
  getDefault: (userId: string) => SavedAddress | undefined;
  clearForUser: (userId: string) => void;
}

function authHeader(): HeadersInit {
  if (typeof window === "undefined") return {};
  const jwt = localStorage.getItem("ms-auth");
  return jwt ? { Authorization: `Bearer ${jwt}` } : {};
}

function tempId() {
  return `tmp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

interface ServerAddress {
  id?: string;
  documentId?: string;
  user?: string;
  userId?: string;
  label?: string | null;
  isDefault?: boolean;
  address: Address;
}

function flatten(row: ServerAddress): SavedAddress {
  return {
    id: row.id ?? row.documentId ?? "",
    userId: String(row.user ?? row.userId ?? ""),
    label: row.label ?? undefined,
    isDefault: !!row.isDefault,
    ...row.address,
  };
}

function extractAddressBody(
  src: Partial<Address> & { label?: string; isDefault?: boolean },
): Partial<Address> {
  const { name, phone, line1, line2, city, state, pincode } = src;
  const body: Partial<Address> = {};
  if (name !== undefined) body.name = name;
  if (phone !== undefined) body.phone = phone;
  if (line1 !== undefined) body.line1 = line1;
  if (line2 !== undefined) body.line2 = line2;
  if (city !== undefined) body.city = city;
  if (state !== undefined) body.state = state;
  if (pincode !== undefined) body.pincode = pincode;
  return body;
}

export const useAddressStore = create<AddressState>()(
  persist(
    (set, get) => ({
      addresses: [],

      hydrateFromServer: async (userId) => {
        try {
          const res = await fetch("/api/addresses", { headers: authHeader() });
          if (!res.ok) return;
          const { data } = await res.json();
          const fresh: SavedAddress[] = (data ?? []).map((r: ServerAddress) =>
            flatten(r),
          );
          set((state) => ({
            addresses: [
              ...state.addresses.filter((a) => a.userId !== userId),
              ...fresh,
            ],
          }));
        } catch {
          // Offline / unreachable — keep local copy as fallback.
        }
      },

      addAddress: async (userId, address, label) => {
        const existingForUser = get().addresses.filter(
          (a) => a.userId === userId,
        );
        const optimistic: SavedAddress = {
          ...address,
          id: tempId(),
          userId,
          label,
          isDefault: existingForUser.length === 0,
        };
        set((state) => ({ addresses: [...state.addresses, optimistic] }));

        try {
          const res = await fetch("/api/addresses", {
            method: "POST",
            headers: { "Content-Type": "application/json", ...authHeader() },
            body: JSON.stringify({ label, address }),
          });
          if (!res.ok) return optimistic;
          const { data } = await res.json();
          const saved = flatten(data as ServerAddress);
          set((state) => ({
            addresses: state.addresses.map((a) =>
              a.id === optimistic.id ? saved : a,
            ),
          }));
          return saved;
        } catch {
          return optimistic;
        }
      },

      updateAddress: async (id, patch) => {
        set((state) => ({
          addresses: state.addresses.map((a) =>
            a.id === id ? { ...a, ...patch } : a,
          ),
        }));

        const addressBody = extractAddressBody(patch);
        const body: Record<string, unknown> = {};
        if (Object.keys(addressBody).length > 0) body.address = addressBody;
        if (patch.label !== undefined) body.label = patch.label;

        try {
          await fetch(`/api/addresses/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", ...authHeader() },
            body: JSON.stringify(body),
          });
        } catch {
          // Optimistic update already applied.
        }
      },

      removeAddress: async (id) => {
        let removed: SavedAddress | undefined;
        set((state) => {
          removed = state.addresses.find((a) => a.id === id);
          const remaining = state.addresses.filter((a) => a.id !== id);
          if (removed?.isDefault) {
            const firstForUser = remaining.find(
              (a) => a.userId === removed!.userId,
            );
            if (firstForUser) firstForUser.isDefault = true;
          }
          return { addresses: remaining };
        });

        try {
          await fetch(`/api/addresses/${id}`, {
            method: "DELETE",
            headers: authHeader(),
          });
        } catch {
          // Optimistic removal already applied.
        }
      },

      setDefault: async (userId, id) => {
        set((state) => ({
          addresses: state.addresses.map((a) =>
            a.userId === userId ? { ...a, isDefault: a.id === id } : a,
          ),
        }));

        try {
          await fetch(`/api/addresses/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", ...authHeader() },
            body: JSON.stringify({ isDefault: true }),
          });
        } catch {
          // Optimistic default switch already applied.
        }
      },

      getForUser: (userId) =>
        get().addresses.filter((a) => a.userId === userId),

      getDefault: (userId) =>
        get().addresses.find((a) => a.userId === userId && a.isDefault),

      clearForUser: (userId) => {
        set((state) => ({
          addresses: state.addresses.filter((a) => a.userId !== userId),
        }));
      },
    }),
    {
      name: "ms-addresses",
      partialize: (state) => ({ addresses: state.addresses }),
    },
  ),
);
