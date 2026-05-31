"use client";

import { useEffect, useState } from "react";
import { MapPin, Plus, Pencil, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { useAddressStore, type SavedAddress } from "../store/address-store";
import { AddressForm, type AddressFormValue } from "./address-form";

export function AddressManager() {
  const user         = useAuthStore((s) => s.user);
  const addresses    = useAddressStore((s) => s.addresses);
  const addAddress   = useAddressStore((s) => s.addAddress);
  const updateAddress = useAddressStore((s) => s.updateAddress);
  const removeAddress = useAddressStore((s) => s.removeAddress);
  const setDefault   = useAddressStore((s) => s.setDefault);

  const [mounted, setMounted]     = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const [isAdding, setIsAdding]   = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  if (!user) return null;
  const list: SavedAddress[] = mounted
    ? addresses.filter((a) => a.userId === user.id)
    : [];

  async function handleAdd(value: AddressFormValue) {
    if (!user) return;
    const { label, ...address } = value;
    await addAddress(user.id, address, label);
    setIsAdding(false);
  }

  function handleUpdate(id: string, value: AddressFormValue) {
    updateAddress(id, value);
    setEditingId(null);
  }

  function handleDelete(id: string) {
    if (confirm("Delete this address?")) removeAddress(id);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <h2 className="text-base font-semibold sm:text-lg">Saved Addresses</h2>
        </div>
        {!isAdding && (
          <Button variant="outline" size="sm" onClick={() => { setEditingId(null); setIsAdding(true); }}>
            <Plus className="h-3.5 w-3.5 sm:mr-1.5" />
            <span className="hidden sm:inline">Add new</span>
          </Button>
        )}
      </div>

      {/* Add form */}
      {isAdding && (
        <Card className="border-primary/20 shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <h3 className="mb-4 text-sm font-semibold sm:text-base">New Address</h3>
            <AddressForm
              initial={{ name: user.name }}
              submitLabel="Save address"
              onCancel={() => setIsAdding(false)}
              onSubmit={handleAdd}
            />
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {mounted && list.length === 0 && !isAdding && (
        <div className="flex flex-col items-center gap-2 rounded-xl border bg-muted/30 p-8 text-center">
          <MapPin className="h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm font-medium text-foreground">No saved addresses</p>
          <p className="text-xs text-muted-foreground">Add an address to speed up checkout.</p>
        </div>
      )}

      {/* Address list */}
      <ul className="space-y-3">
        {list.map((a) =>
          editingId === a.id ? (
            <li key={a.id}>
              <Card className="border-primary/20 shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="mb-4 text-sm font-semibold sm:text-base">Edit Address</h3>
                  <AddressForm
                    initial={a}
                    submitLabel="Update address"
                    onCancel={() => setEditingId(null)}
                    onSubmit={(v) => handleUpdate(a.id, v)}
                  />
                </CardContent>
              </Card>
            </li>
          ) : (
            <li key={a.id}>
              <Card className={a.isDefault ? "border-primary/30 bg-primary/2" : ""}>
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    {/* Address info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-sm sm:text-base">{a.label ?? a.name}</p>
                        {a.isDefault && (
                          <Badge variant="secondary" className="text-xs h-5">Default</Badge>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                        {a.name} · +91 {a.phone}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed sm:text-sm">
                        {a.line1}{a.line2 ? `, ${a.line2}` : ""},{" "}
                        {a.city}, {a.state} – {a.pincode}
                      </p>
                    </div>

                    {/* Actions — icon-only on mobile, icon+text on sm+ */}
                    <div className="flex shrink-0 items-center gap-1">
                      {!a.isDefault && (
                        <button
                          type="button"
                          title="Set as default"
                          onClick={() => setDefault(user.id, a.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-input bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary sm:h-auto sm:w-auto sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs sm:font-medium"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Default</span>
                        </button>
                      )}
                      <button
                        type="button"
                        title="Edit"
                        onClick={() => { setIsAdding(false); setEditingId(a.id); }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-input bg-background text-muted-foreground transition-colors hover:border-foreground hover:text-foreground sm:h-auto sm:w-auto sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs sm:font-medium"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        type="button"
                        title="Delete"
                        onClick={() => handleDelete(a.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-input bg-background text-destructive transition-colors hover:border-destructive hover:bg-destructive/5 sm:h-auto sm:w-auto sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs sm:font-medium"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
