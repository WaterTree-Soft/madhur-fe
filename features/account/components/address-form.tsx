"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Address } from "@/types";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Chandigarh", "Puducherry",
];

export interface AddressFormValue extends Address {
  label?: string;
}

interface AddressFormProps {
  initial?: Partial<AddressFormValue>;
  submitLabel?: string;
  onCancel?: () => void;
  onSubmit: (value: AddressFormValue) => void;
}

interface FieldErrors {
  name?: string;
  phone?: string;
  line1?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

function validate(a: AddressFormValue): FieldErrors {
  const errors: FieldErrors = {};
  if (!a.name.trim()) errors.name = "Full name is required";
  if (!a.phone.trim()) errors.phone = "Phone number is required";
  else if (!/^[6-9]\d{9}$/.test(a.phone.trim()))
    errors.phone = "Enter a valid 10-digit Indian phone number";
  if (!a.line1.trim()) errors.line1 = "Address line 1 is required";
  if (!a.city.trim()) errors.city = "City is required";
  if (!a.state.trim()) errors.state = "State is required";
  if (!a.pincode.trim()) errors.pincode = "Pincode is required";
  else if (!/^\d{6}$/.test(a.pincode.trim()))
    errors.pincode = "Enter a valid 6-digit pincode";
  return errors;
}

export function AddressForm({
  initial,
  submitLabel = "Save address",
  onCancel,
  onSubmit,
}: AddressFormProps) {
  const [value, setValue] = useState<AddressFormValue>({
    name: initial?.name ?? "",
    phone: initial?.phone ?? "",
    line1: initial?.line1 ?? "",
    line2: initial?.line2 ?? "",
    city: initial?.city ?? "",
    state: initial?.state ?? "",
    pincode: initial?.pincode ?? "",
    label: initial?.label ?? "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});

  function update<K extends keyof AddressFormValue>(
    key: K,
    next: AddressFormValue[K]
  ) {
    setValue((prev) => ({ ...prev, [key]: next }));
    if (errors[key as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate(value);
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }
    onSubmit({
      ...value,
      label: value.label?.trim() ? value.label.trim() : undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="mb-2 block text-sm font-medium">
          Label (e.g. Home, Office)
        </label>
        <Input
          placeholder="Home"
          value={value.label ?? ""}
          onChange={(e) => update("label", e.target.value)}
        />
      </div>

      <div className="sm:col-span-2">
        <label className="mb-2 block text-sm font-medium">Full Name *</label>
        <Input
          value={value.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="e.g. Rahul Sharma"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-destructive">{errors.name}</p>
        )}
      </div>

      <div className="sm:col-span-2">
        <label className="mb-2 block text-sm font-medium">Phone *</label>
        <div className="flex">
          <span className="flex items-center rounded-l-lg border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
            +91
          </span>
          <Input
            className="rounded-l-none"
            value={value.phone}
            onChange={(e) =>
              update(
                "phone",
                e.target.value.replace(/\D/g, "").slice(0, 10)
              )
            }
            placeholder="9876543210"
          />
        </div>
        {errors.phone && (
          <p className="mt-1 text-xs text-destructive">{errors.phone}</p>
        )}
      </div>

      <div className="sm:col-span-2">
        <label className="mb-2 block text-sm font-medium">
          Address Line 1 *
        </label>
        <Input
          value={value.line1}
          onChange={(e) => update("line1", e.target.value)}
          placeholder="House/Flat no., Building, Street"
        />
        {errors.line1 && (
          <p className="mt-1 text-xs text-destructive">{errors.line1}</p>
        )}
      </div>

      <div className="sm:col-span-2">
        <label className="mb-2 block text-sm font-medium">
          Address Line 2
        </label>
        <Input
          value={value.line2 ?? ""}
          onChange={(e) => update("line2", e.target.value)}
          placeholder="Area, Landmark (optional)"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">City *</label>
        <Input
          value={value.city}
          onChange={(e) => update("city", e.target.value)}
          placeholder="e.g. Mumbai"
        />
        {errors.city && (
          <p className="mt-1 text-xs text-destructive">{errors.city}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">State *</label>
        <select
          value={value.state}
          onChange={(e) => update("state", e.target.value)}
          className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Select state</option>
          {INDIAN_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {errors.state && (
          <p className="mt-1 text-xs text-destructive">{errors.state}</p>
        )}
      </div>

      <div className="sm:col-span-2">
        <label className="mb-2 block text-sm font-medium">Pincode *</label>
        <Input
          value={value.pincode}
          onChange={(e) =>
            update(
              "pincode",
              e.target.value.replace(/\D/g, "").slice(0, 6)
            )
          }
          placeholder="400001"
        />
        {errors.pincode && (
          <p className="mt-1 text-xs text-destructive">{errors.pincode}</p>
        )}
      </div>

      <div className="sm:col-span-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
