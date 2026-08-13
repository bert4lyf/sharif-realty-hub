import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Building2, LogOut, ShieldCheck, Star, Users } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyEditor } from "@/components/admin/property-editor";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { supabase } from "@/integrations/supabase/client";
import {
  getAdminOverview,
  getMyAccess,
  saveCaseStudy,
  saveFaq,
  saveProperty,
  saveSettings,
  setPropertyFlags,
  setReviewApproval,
  setUserRole,
  updateLead,
} from "@/lib/admin.functions";
import { LEAD_STATUS_LABELS, STATUS_LABELS, formatDate, formatPrice } from "@/lib/format";
import { caseStudyInputSchema, faqInputSchema, settingsInputSchema } from "@/lib/schemas";
import type { Property } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard | Sharif Realty" },
      { name: "description", content: "Manage Sharif Realty listings, leads, reviews and settings." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Dashboard | Sharif Realty" },
      { property: "og:description", content: "Internal Sharif Realty management console." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const access = useServerFn(getMyAccess);
  const overview = useServerFn(getAdminOverview);

  const accessQuery = useQuery({ queryKey: ["admin", "access"], queryFn: () => access() });
  const dataQuery = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: () => overview(),
    enabled: accessQuery.data?.isStaff === true,
  });

  const refresh = () => void queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });

  if (accessQuery.isLoading) {
    return <div className="px-4 py-24 text-center text-sm text-muted-foreground">Loading dashboard…</div>;
  }

  if (!accessQuery.data?.isStaff) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <ShieldCheck className="mx-auto size-8 text-accent" aria-hidden="true" />
        <h1 className="mt-4 font-display text-2xl">Access pending</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account ({accessQuery.data?.email}) has no staff role yet. Ask a Sharif Realty
          administrator to grant you Admin or Agent access.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button variant="secondary" asChild>
            <Link to="/">Back to site</Link>
          </Button>
          <Button
            onClick={async () => {
              await supabase.auth.signOut();
              await navigate({ to: "/auth" });
            }}
          >
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  const me = accessQuery.data;
  const data = dataQuery.data;

  return (
    <>
      <Breadcrumbs items={[{ label: "Admin" }, { label: "Dashboard" }]} />
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-accent">
              {me.isSuperAdmin ? "Super Admin" : me.isAdmin ? "Administrator" : "Agent"}
            </p>
            <h1 className="mt-2 font-display text-3xl">Sharif Realty control room</h1>
            <p className="mt-1 text-sm text-muted-foreground">Signed in as {me.email}</p>
          </div>
          <Button
            variant="secondary"
            onClick={async () => {
              await supabase.auth.signOut();
              queryClient.clear();
              await navigate({ to: "/auth" });
            }}
          >
            <LogOut className="size-4" aria-hidden="true" />
            Sign out
          </Button>
        </div>

        {!data ? (
          <p className="mt-10 text-sm text-muted-foreground">Loading data…</p>
        ) : (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-4">
              <StatCard icon={Building2} label="Active listings" value={data.properties.filter((p) => !p.is_archived).length} />
              <StatCard icon={Users} label="New leads" value={data.leads.filter((l) => l.status === "new").length} />
              <StatCard icon={Star} label="Pending reviews" value={data.reviews.filter((r) => !r.is_approved).length} />
              <StatCard icon={ShieldCheck} label="Staff accounts" value={data.roles.length} />
            </div>

            <Tabs defaultValue="properties" className="mt-10">
              <TabsList className="flex-wrap">
                <TabsTrigger value="properties">Properties</TabsTrigger>
                <TabsTrigger value="leads">CRM & Leads</TabsTrigger>
                <TabsTrigger value="content">Content & Reviews</TabsTrigger>
                {me.isSuperAdmin && <TabsTrigger value="platform">Platform & RBAC</TabsTrigger>}
              </TabsList>

              <TabsContent value="properties" className="mt-6">
                <PropertiesTab properties={data.properties} onChanged={refresh} />
              </TabsContent>

              <TabsContent value="leads" className="mt-6">
                <LeadsTab
                  leads={data.leads}
                  staff={data.staff}
                  properties={data.properties}
                  onChanged={refresh}
                />
              </TabsContent>

              <TabsContent value="content" className="mt-6">
                <ContentTab
                  reviews={data.reviews}
                  faqs={data.faqs}
                  caseStudies={data.caseStudies}
                  onChanged={refresh}
                />
              </TabsContent>

              {me.isSuperAdmin && (
                <TabsContent value="platform" className="mt-6">
                  <PlatformTab
                    settings={data.settings}
                    staff={data.staff}
                    roles={data.roles}
                    onChanged={refresh}
                  />
                </TabsContent>
              )}
            </Tabs>
          </>
        )}
      </div>
    </>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <Icon className="size-5 text-accent" aria-hidden="true" />
      <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="font-display text-3xl">{value}</p>
    </div>
  );
}

function PropertiesTab({
  properties,
  onChanged,
}: {
  properties: Property[];
  onChanged: () => void;
}) {
  const save = useServerFn(saveProperty);
  const flags = useServerFn(setPropertyFlags);
  const [editing, setEditing] = useState<Property | null | undefined>(undefined);

  const flagMutation = useMutation({
    mutationFn: (input: { id: string; is_featured?: boolean; is_archived?: boolean }) =>
      flags({ data: input }),
    onSuccess: () => {
      toast.success("Listing updated");
      onChanged();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (editing !== undefined) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-2xl">{editing ? "Edit listing" : "New listing"}</h2>
        <div className="mt-6">
          <PropertyEditor
            property={editing}
            onCancel={() => setEditing(undefined)}
            onSave={async (values) => {
              await save({ data: values });
              toast.success("Listing saved");
              setEditing(undefined);
              onChanged();
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => setEditing(null)}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          Add property
        </Button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="p-3">Listing</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              <th className="p-3">Flags</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id} className="border-t border-border">
                <td className="p-3">
                  <p className="font-semibold">{property.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {property.address}, {property.city}
                  </p>
                </td>
                <td className="p-3">{formatPrice(Number(property.price))}</td>
                <td className="p-3">{STATUS_LABELS[property.status]}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {property.is_featured && <Badge variant="secondary">Featured</Badge>}
                    {property.is_archived && <Badge variant="outline">Archived</Badge>}
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setEditing(property)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        flagMutation.mutate({ id: property.id, is_featured: !property.is_featured })
                      }
                    >
                      {property.is_featured ? "Unfeature" : "Feature"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        flagMutation.mutate({ id: property.id, is_archived: !property.is_archived })
                      }
                    >
                      {property.is_archived ? "Restore" : "Archive"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: string;
  source: string;
  property_id: string | null;
  assigned_to: string | null;
  created_at: string;
};

function LeadsTab({
  leads,
  staff,
  properties,
  onChanged,
}: {
  leads: Lead[];
  staff: { id: string; full_name: string | null }[];
  properties: Property[];
  onChanged: () => void;
}) {
  const update = useServerFn(updateLead);
  const [filter, setFilter] = useState<string>("all");

  const mutation = useMutation({
    mutationFn: (input: { id: string; status?: Lead["status"]; assigned_to?: string | null }) =>
      update({ data: input as never }),
    onSuccess: () => {
      toast.success("Lead updated");
      onChanged();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const visible = filter === "all" ? leads : leads.filter((lead) => lead.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {["all", "new", "contacted", "in_contract", "closed"].map((status) => (
          <button
            key={status}
            type="button"
            aria-pressed={filter === status}
            onClick={() => setFilter(status)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              filter === status
                ? "bg-accent text-accent-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
          >
            {status === "all" ? "All leads" : LEAD_STATUS_LABELS[status]}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No leads in this stage yet.
        </p>
      ) : (
        <div className="space-y-3">
          {visible.map((lead) => {
            const property = properties.find((item) => item.id === lead.property_id);
            return (
              <article key={lead.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{lead.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {lead.email}
                      {lead.phone ? ` · ${lead.phone}` : ""} · {formatDate(lead.created_at)} ·{" "}
                      {lead.source}
                    </p>
                  </div>
                  <Badge variant="secondary">{LEAD_STATUS_LABELS[lead.status]}</Badge>
                </div>
                {property && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Interested in: {property.address}, {property.city}
                  </p>
                )}
                {lead.message && <p className="mt-3 text-sm text-muted-foreground">{lead.message}</p>}
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Status</Label>
                    <Select
                      value={lead.status}
                      onValueChange={(value) => mutation.mutate({ id: lead.id, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="in_contract">In Contract</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Assigned agent</Label>
                    <Select
                      value={lead.assigned_to ?? "unassigned"}
                      onValueChange={(value) =>
                        mutation.mutate({
                          id: lead.id,
                          assigned_to: value === "unassigned" ? null : value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Unassigned" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {staff.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.full_name ?? member.id.slice(0, 8)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ContentTab({
  reviews,
  faqs,
  caseStudies,
  onChanged,
}: {
  reviews: { id: string; author_name: string; quote: string; rating: number; is_approved: boolean }[];
  faqs: { id: string; question: string; answer: string; category: string; is_published: boolean }[];
  caseStudies: { id: string; title: string; address: string; is_published: boolean }[];
  onChanged: () => void;
}) {
  const approve = useServerFn(setReviewApproval);
  const addFaq = useServerFn(saveFaq);
  const addCase = useServerFn(saveCaseStudy);

  const approveMutation = useMutation({
    mutationFn: (input: { id: string; is_approved: boolean }) => approve({ data: input }),
    onSuccess: () => {
      toast.success("Review updated");
      onChanged();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  async function submitFaq(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = faqInputSchema.safeParse({
      question: String(form.get("question") ?? ""),
      answer: String(form.get("answer") ?? ""),
      category: String(form.get("category") ?? "General"),
      sort_order: Number(form.get("sort_order") ?? 0),
      is_published: true,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check the FAQ fields");
      return;
    }
    try {
      await addFaq({ data: parsed.data });
      toast.success("FAQ published");
      event.currentTarget.reset();
      onChanged();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save FAQ");
    }
  }

  async function submitCase(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const num = (key: string) => {
      const raw = String(form.get(key) ?? "").trim();
      return raw === "" ? null : Number(raw);
    };
    const parsed = caseStudyInputSchema.safeParse({
      slug: String(form.get("slug") ?? ""),
      title: String(form.get("title") ?? ""),
      address: String(form.get("address") ?? ""),
      summary: String(form.get("summary") ?? ""),
      story: String(form.get("story") ?? ""),
      client_name: String(form.get("client_name") ?? "") || null,
      days_on_market: num("days_on_market"),
      percent_of_asking: num("percent_of_asking"),
      sale_price: num("sale_price"),
      image_url: null,
      is_published: true,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check the case study fields");
      return;
    }
    try {
      await addCase({ data: parsed.data });
      toast.success("Case study published");
      event.currentTarget.reset();
      onChanged();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save case study");
    }
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-display text-2xl">Reviews</h2>
        <div className="mt-4 space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border bg-card p-5"
            >
              <div className="max-w-2xl">
                <p className="font-semibold">
                  {review.author_name} · {review.rating}/5
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{review.quote}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={review.is_approved ? "secondary" : "outline"}>
                  {review.is_approved ? "Approved" : "Pending"}
                </Badge>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    approveMutation.mutate({ id: review.id, is_approved: !review.is_approved })
                  }
                >
                  {review.is_approved ? "Unpublish" : "Approve"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-xl">Add an FAQ</h2>
          <form onSubmit={submitFaq} className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="faq-question">Question</Label>
              <Input id="faq-question" name="question" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="faq-answer">Answer</Label>
              <Textarea id="faq-answer" name="answer" rows={4} required />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="faq-category">Category</Label>
                <Input id="faq-category" name="category" defaultValue="General" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="faq-order">Sort order</Label>
                <Input id="faq-order" name="sort_order" type="number" min={0} defaultValue={0} />
              </div>
            </div>
            <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Publish FAQ
            </Button>
          </form>
          <p className="mt-4 text-xs text-muted-foreground">
            {faqs.length} FAQ{faqs.length === 1 ? "" : "s"} live on the site.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-xl">Add a case study</h2>
          <form onSubmit={submitCase} className="mt-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="cs-title">Title</Label>
                <Input id="cs-title" name="title" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cs-slug">Slug</Label>
                <Input id="cs-slug" name="slug" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cs-address">Address</Label>
              <Input id="cs-address" name="address" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cs-summary">Summary</Label>
              <Textarea id="cs-summary" name="summary" rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cs-story">Client quote / story</Label>
              <Textarea id="cs-story" name="story" rows={3} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="cs-client">Client name</Label>
                <Input id="cs-client" name="client_name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cs-price">Sale price</Label>
                <Input id="cs-price" name="sale_price" type="number" min={0} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cs-dom">Days on market</Label>
                <Input id="cs-dom" name="days_on_market" type="number" min={0} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cs-pct">% of asking</Label>
                <Input id="cs-pct" name="percent_of_asking" type="number" min={0} step="0.1" />
              </div>
            </div>
            <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Publish case study
            </Button>
          </form>
          <p className="mt-4 text-xs text-muted-foreground">
            {caseStudies.length} case stud{caseStudies.length === 1 ? "y" : "ies"} published.
          </p>
        </div>
      </section>
    </div>
  );
}

function PlatformTab({
  settings,
  staff,
  roles,
  onChanged,
}: {
  settings:
    | {
        ga4_measurement_id: string | null;
        maps_api_key: string | null;
        phone: string;
        whatsapp: string;
        email: string;
        office_address: string;
        office_hours: string;
        latitude: number;
        longitude: number;
      }
    | null;
  staff: { id: string; full_name: string | null }[];
  roles: { user_id: string; role: string }[];
  onChanged: () => void;
}) {
  const save = useServerFn(saveSettings);
  const setRole = useServerFn(setUserRole);

  async function submitSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = settingsInputSchema.safeParse({
      ga4_measurement_id: String(form.get("ga4_measurement_id") ?? "") || null,
      maps_api_key: String(form.get("maps_api_key") ?? "") || null,
      phone: String(form.get("phone") ?? ""),
      whatsapp: String(form.get("whatsapp") ?? ""),
      email: String(form.get("email") ?? ""),
      office_address: String(form.get("office_address") ?? ""),
      office_hours: String(form.get("office_hours") ?? ""),
      latitude: Number(form.get("latitude") ?? 0),
      longitude: Number(form.get("longitude") ?? 0),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check the settings values");
      return;
    }
    try {
      await save({ data: parsed.data });
      toast.success("Settings saved");
      onChanged();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save settings");
    }
  }

  async function toggleRole(userId: string, role: "admin" | "agent" | "super_admin", grant: boolean) {
    try {
      await setRole({ data: { userId, role, grant } });
      toast.success(grant ? "Role granted" : "Role revoked");
      onChanged();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update role");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-xl">Platform settings</h2>
        <form onSubmit={submitSettings} className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="s-ga4">GA4 measurement ID</Label>
              <Input
                id="s-ga4"
                name="ga4_measurement_id"
                placeholder="G-XXXXXXX"
                defaultValue={settings?.ga4_measurement_id ?? ""}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-maps">Google Maps API key</Label>
              <Input id="s-maps" name="maps_api_key" defaultValue={settings?.maps_api_key ?? ""} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-phone">Phone</Label>
              <Input id="s-phone" name="phone" defaultValue={settings?.phone ?? ""} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-whatsapp">WhatsApp number</Label>
              <Input id="s-whatsapp" name="whatsapp" defaultValue={settings?.whatsapp ?? ""} required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="s-email">Email</Label>
            <Input id="s-email" name="email" type="email" defaultValue={settings?.email ?? ""} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="s-address">Office address</Label>
            <Input id="s-address" name="office_address" defaultValue={settings?.office_address ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="s-hours">Office hours</Label>
            <Input id="s-hours" name="office_hours" defaultValue={settings?.office_hours ?? ""} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="s-lat">Latitude</Label>
              <Input
                id="s-lat"
                name="latitude"
                type="number"
                step="any"
                defaultValue={settings?.latitude ?? 25.7617}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-lng">Longitude</Label>
              <Input
                id="s-lng"
                name="longitude"
                type="number"
                step="any"
                defaultValue={settings?.longitude ?? -80.1918}
              />
            </div>
          </div>
          <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
            Save settings
          </Button>
        </form>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-xl">Roles & access</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Grant or revoke Admin and Agent access for staff accounts.
        </p>
        <div className="mt-4 space-y-3">
          {staff.map((member) => {
            const memberRoles = roles.filter((role) => role.user_id === member.id).map((r) => r.role);
            return (
              <div key={member.id} className="rounded-lg border border-border p-4">
                <p className="font-semibold">{member.full_name ?? member.id.slice(0, 8)}</p>
                <p className="text-xs text-muted-foreground">
                  {memberRoles.length ? memberRoles.join(", ") : "No roles"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(["admin", "agent"] as const).map((role) => {
                    const has = memberRoles.includes(role);
                    return (
                      <Button
                        key={role}
                        size="sm"
                        variant={has ? "ghost" : "secondary"}
                        onClick={() => void toggleRole(member.id, role, !has)}
                      >
                        {has ? `Revoke ${role}` : `Grant ${role}`}
                      </Button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
