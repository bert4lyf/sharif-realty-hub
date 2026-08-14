import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminPageHeader } from "@/components/admin/wp-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/crm")({
  component: CrmPage,
});

type LeadStatus = "New" | "Contacted" | "In Contract" | "Closed";

type CrmLead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  property: string;
  message: string;
  status: LeadStatus;
  agent: string;
  date: string;
};

const SEED_LEADS: CrmLead[] = [
  {
    id: "l-1",
    name: "Dana Whitfield",
    email: "dana.whitfield@example.com",
    phone: "(203) 555-0148",
    property: "102 Madera Dr, Waterbury, CT 06704",
    message: "Is this still available off market? I can close cash in 14 days.",
    status: "New",
    agent: "Unassigned",
    date: "2026-08-11",
  },
  {
    id: "l-2",
    name: "Marcus Reed",
    email: "marcus.reed@example.com",
    phone: "(860) 555-0122",
    property: "18 Harbor View Ln, Stamford, CT 06902",
    message: "Requesting a private showing this weekend.",
    status: "Contacted",
    agent: "Majeed",
    date: "2026-08-08",
  },
  {
    id: "l-3",
    name: "Priya Nandan",
    email: "priya.nandan@example.com",
    phone: "(475) 555-0190",
    property: "740 Main St, Hartford, CT 06103",
    message: "Looking for NNN retail with 8%+ cap. Send the rent roll.",
    status: "In Contract",
    agent: "Majeed",
    date: "2026-07-30",
  },
  {
    id: "l-4",
    name: "Tom Alvarez",
    email: "tom.alvarez@example.com",
    phone: "(203) 555-0177",
    property: "300 Bank St #4B, Waterbury, CT 06702",
    message: "Rental application submitted, waiting on lease.",
    status: "Closed",
    agent: "Majeed",
    date: "2026-07-15",
  },
];

const STATUSES: (LeadStatus | "All")[] = ["All", "New", "Contacted", "In Contract", "Closed"];
const AGENTS = ["Unassigned", "Majeed", "Sara K.", "Andre B."];

function CrmPage() {
  const [leads, setLeads] = useState(SEED_LEADS);
  const [filter, setFilter] = useState<(typeof STATUSES)[number]>("All");
  const rows = leads.filter((lead) => filter === "All" || lead.status === filter);

  function cycle(id: string) {
    const order: LeadStatus[] = ["New", "Contacted", "In Contract", "Closed"];
    setLeads((current) =>
      current.map((lead) =>
        lead.id === id
          ? { ...lead, status: order[(order.indexOf(lead.status) + 1) % order.length]! }
          : lead,
      ),
    );
  }

  return (
    <>
      <AdminPageHeader title="WpEstate CRM" description="Inquiries captured from the public website." />

      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
        {STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(status)}
            className={`rounded-sm px-2 py-1 transition-colors ${
              filter === status ? "font-semibold text-accent" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {status} ({status === "All" ? leads.length : leads.filter((l) => l.status === status).length})
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-sm border border-border bg-card">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-semibold">Lead</th>
              <th className="px-4 py-3 font-semibold">Property</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Assigned agent</th>
              <th className="px-4 py-3 font-semibold">Received</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((lead) => (
              <tr key={lead.id} className="border-t border-border align-top">
                <td className="px-4 py-3">
                  <p className="font-semibold text-foreground">{lead.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {lead.email} · {lead.phone}
                  </p>
                  <p className="mt-1 max-w-sm text-xs text-muted-foreground">{lead.message}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{lead.property}</td>
                <td className="px-4 py-3">
                  <Button variant="secondary" size="sm" onClick={() => cycle(lead.id)}>
                    {lead.status}
                  </Button>
                </td>
                <td className="px-4 py-3">
                  <select
                    aria-label={`Assign agent for ${lead.name}`}
                    value={lead.agent}
                    onChange={(event) =>
                      setLeads((current) =>
                        current.map((item) =>
                          item.id === lead.id ? { ...item, agent: event.target.value } : item,
                        ),
                      )
                    }
                    className="rounded-sm border border-input bg-background px-2 py-1 text-sm"
                  >
                    {AGENTS.map((agent) => (
                      <option key={agent} value={agent}>
                        {agent}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{lead.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
