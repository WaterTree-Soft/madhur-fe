import { NextRequest } from "next/server";
import { proxyToExpress } from "@/lib/proxy";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { items, total, address, razorpayOrderId, razorpayPaymentId, paid } =
    body ?? {};

  if (!items?.length || !total || !address) {
    return Response.json(
      { error: "Missing required fields: items, total, address" },
      { status: 400 }
    );
  }

  return proxyToExpress(request, "/api/orders", {
    body: {
      items,
      total,
      address,
      paid: paid ?? false,
      ...(razorpayOrderId && { razorpayOrderId }),
      ...(razorpayPaymentId && { razorpayPaymentId }),
    },
  });
}
