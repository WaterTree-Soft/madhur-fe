import { NextRequest } from "next/server";
import { API_URL, getAuthHeader } from "@/lib/proxy";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let body: { amount?: number; currency?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { amount, currency = "INR" } = body;
  // Checkout sends amount in paise; Express route expects rupees
  const amountRupees = Number(amount) / 100;

  if (!Number.isFinite(amountRupees) || amountRupees < 1) {
    return Response.json({ error: "Amount must be at least ₹1" }, { status: 400 });
  }

  try {
    const auth = getAuthHeader(request);
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (auth) headers["Authorization"] = auth;

    const res = await fetch(`${API_URL}/api/razorpay/create-order`, {
      method: "POST",
      headers,
      body: JSON.stringify({ amount: amountRupees, currency }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return Response.json(
        { error: json.error ?? "Failed to create Razorpay order" },
        { status: res.status }
      );
    }

    // Express returns { success: true, data: { orderId, amount, currency } }
    const data = json.data ?? json;
    return Response.json({
      order_id: data.orderId,
      amount: data.amount,
      currency: data.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Razorpay create-order proxy error:", err);
    return Response.json({ error: "Backend unreachable" }, { status: 502 });
  }
}
