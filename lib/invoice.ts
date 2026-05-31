import type { Address } from "@/types";

interface InvoiceItem {
  name: string;
  price: number;
  quantity: number;
}

interface InvoiceData {
  orderRef: string;
  createdAt: string;
  items: InvoiceItem[];
  total: number;
  paid: boolean;
  address: Address;
  razorpayPaymentId?: string | null;
}

function formatRupee(amount: number) {
  return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function downloadInvoice(data: InvoiceData) {
  const subtotal = data.items.reduce((s, i) => s + i.price * i.quantity, 0);

  const itemRows = data.items
    .map(
      (item, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${item.name}</td>
        <td class="center">${item.quantity}</td>
        <td class="right">${formatRupee(item.price)}</td>
        <td class="right">${formatRupee(item.price * item.quantity)}</td>
      </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invoice – ${data.orderRef}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 13px;
      color: #1a1a1a;
      background: #fff;
      padding: 40px;
      max-width: 780px;
      margin: 0 auto;
    }

    /* ── Header ── */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 24px;
      border-bottom: 2px solid #8b3000;
      margin-bottom: 28px;
    }
    .brand-name {
      font-size: 26px;
      font-weight: 700;
      color: #8b3000;
      letter-spacing: -0.5px;
    }
    .brand-tag {
      font-size: 11px;
      color: #888;
      margin-top: 3px;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .invoice-label {
      text-align: right;
    }
    .invoice-label h2 {
      font-size: 22px;
      font-weight: 700;
      color: #8b3000;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .invoice-label p {
      font-size: 12px;
      color: #555;
      margin-top: 4px;
    }

    /* ── Meta grid ── */
    .meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 28px;
    }
    .meta-box h4 {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #888;
      margin-bottom: 6px;
    }
    .meta-box p {
      font-size: 13px;
      line-height: 1.6;
      color: #1a1a1a;
    }

    /* ── Items table ── */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    thead tr {
      background: #8b3000;
      color: #fff;
    }
    thead th {
      padding: 10px 12px;
      text-align: left;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    thead th.center { text-align: center; }
    thead th.right  { text-align: right; }
    tbody tr:nth-child(even) { background: #fdf6f0; }
    tbody td {
      padding: 10px 12px;
      font-size: 13px;
      border-bottom: 1px solid #f0e0d6;
    }
    tbody td.center { text-align: center; }
    tbody td.right  { text-align: right; }

    /* ── Totals ── */
    .totals {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 28px;
    }
    .totals-box {
      width: 260px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      font-size: 13px;
      color: #444;
      border-bottom: 1px solid #f0e0d6;
    }
    .totals-row.grand {
      font-size: 15px;
      font-weight: 700;
      color: #8b3000;
      border-bottom: 2px solid #8b3000;
      padding: 8px 0;
    }

    /* ── Payment badge ── */
    .payment-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 28px;
    }
    .badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge-paid    { background: #d1fae5; color: #065f46; }
    .badge-pending { background: #fef3c7; color: #92400e; }
    .payment-id    { font-size: 11px; color: #888; font-family: monospace; }

    /* ── Footer ── */
    footer {
      border-top: 1px solid #e5e5e5;
      padding-top: 16px;
      text-align: center;
      font-size: 11px;
      color: #aaa;
    }

    @media print {
      body { padding: 20px; }
      @page { margin: 10mm; size: A4; }
    }
  </style>
</head>
<body>

  <div class="header">
    <div>
      <div class="brand-name">Madhur Sweets</div>
      <div class="brand-tag">Authentic Indian Sweets &amp; Namkeen</div>
    </div>
    <div class="invoice-label">
      <h2>Invoice</h2>
      <p><strong>#${data.orderRef.slice(-8).toUpperCase()}</strong></p>
      <p>${formatDate(data.createdAt)}</p>
    </div>
  </div>

  <div class="meta">
    <div class="meta-box">
      <h4>Bill To</h4>
      <p>
        <strong>${data.address.name}</strong><br/>
        ${data.address.line1}${data.address.line2 ? "<br/>" + data.address.line2 : ""}<br/>
        ${data.address.city}, ${data.address.state} – ${data.address.pincode}<br/>
        📞 ${data.address.phone}
      </p>
    </div>
    <div class="meta-box">
      <h4>Order Details</h4>
      <p>
        <strong>Order ID:</strong> ${data.orderRef}<br/>
        <strong>Date:</strong> ${formatDate(data.createdAt)}<br/>
        <strong>Items:</strong> ${data.items.reduce((s, i) => s + i.quantity, 0)}
      </p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Item</th>
        <th class="center">Qty</th>
        <th class="right">Unit Price</th>
        <th class="right">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${itemRows}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-box">
      <div class="totals-row grand">
        <span>Total</span>
        <span>${formatRupee(data.total)}</span>
      </div>
    </div>
  </div>

  <div class="payment-row">
    <span class="${data.paid ? "badge badge-paid" : "badge badge-pending"}">
      ${data.paid ? "Paid" : "Payment on Delivery"}
    </span>
    ${data.razorpayPaymentId ? `<span class="payment-id">Ref: ${data.razorpayPaymentId}</span>` : ""}
  </div>

  <footer>
    Thank you for shopping with Madhur Sweets! &nbsp;·&nbsp;
    This is a computer-generated invoice and does not require a signature.
  </footer>

  <script>
    window.onload = function () {
      window.print();
      setTimeout(function () { window.close(); }, 500);
    };
  </script>
</body>
</html>`;

  const win = window.open("", "_blank", "width=850,height=950");
  if (!win) return;
  win.document.write(html);
  win.document.close();
}
