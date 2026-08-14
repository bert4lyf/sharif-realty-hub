import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/components/admin/wp-shell";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/admin/invoices")({
  component: InvoicesPage,
});

const INVOICES = [
  { id: "INV-1042", client: "Dana Whitfield", amount: 8670, status: "Paid", date: "2026-08-01" },
  { id: "INV-1041", client: "Priya Nandan", amount: 26250, status: "Sent", date: "2026-07-24" },
  { id: "INV-1040", client: "Tom Alvarez", amount: 2150, status: "Paid", date: "2026-07-16" },
];

function InvoicesPage() {
  return (
    <>
      <AdminPageHeader title="Invoices" description="Commission and rental invoices." />
      <div className="overflow-x-auto rounded-sm border border-border bg-card">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-semibold">Invoice</th>
              <th className="px-4 py-3 font-semibold">Client</th>
              <th className="px-4 py-3 font-semibold">Amount</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {INVOICES.map((invoice) => (
              <tr key={invoice.id} className="border-t border-border">
                <td className="px-4 py-3 font-semibold text-foreground">{invoice.id}</td>
                <td className="px-4 py-3">{invoice.client}</td>
                <td className="px-4 py-3">{formatPrice(invoice.amount)}</td>
                <td className="px-4 py-3">{invoice.status}</td>
                <td className="px-4 py-3 text-muted-foreground">{invoice.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
