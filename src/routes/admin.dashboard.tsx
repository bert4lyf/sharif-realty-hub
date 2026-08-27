import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  TrendingUp,
  Building2,
  FileText,
  Mail,
  Users,
  Image as ImageIcon,
  Plus,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Clock,
  DollarSign,
  Shield,
  Eye,
  Calendar,
  Sparkles,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "@/lib/admin-store";
import { formatPrice } from "@/lib/format";
import { AdminPageHeader } from "@/components/admin/wp-shell";
import { PropertyEditor } from "@/components/admin/property-editor";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard Overview | Sharif Realty Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminDashboardOverviewPage,
});

export default function AdminDashboardOverviewPage() {
  const { posts, blogPosts, leads, users, mediaAssets, user, updateLeadStatus } = useAdmin();
  const [showAddListing, setShowAddListing] = useState(false);

  // Computed Portfolio Metrics
  const totalPortfolioValue = useMemo(() => {
    return posts.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
  }, [posts]);

  const activePropertiesCount = posts.filter(
    (p) => p.propertyStatus === "for_sale" || p.status === "Published"
  ).length;

  const newLeadsCount = leads.filter((l) => l.status === "New").length;
  const totalClientsCount = users.filter((u) => u.role === "Client").length;
  const totalAgentsCount = users.filter((u) => u.role === "Agent" || u.role === "Admin" || u.role === "Administrator").length;

  const recentLeads = leads.slice(0, 5);
  const recentProperties = posts.slice(0, 5);
  const recentArticles = blogPosts.slice(0, 4);

  return (
    <div className="space-y-6 max-w-full">
      {/* Top Header */}
      <AdminPageHeader
        title={`Welcome back, ${user?.name || "Majeed Sharif"}`}
        description="Executive real estate overview, active portfolio performance, and client communication channels."
        action={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowAddListing(true)}
              className="bg-[#C5A880] hover:bg-[#B39369] text-[#0B1120] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Plus className="size-4 text-[#0B1120]" />
              <span>Add Property</span>
            </button>
            <Link
              to="/admin/posts"
              className="bg-[#0F172A] hover:bg-[#1E293B] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <FileText className="size-3.5 text-[#C5A880]" />
              <span>Add Article</span>
            </Link>
          </div>
        }
      />

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Card 1: Total Portfolio Value */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Portfolio Value
            </span>
            <div className="size-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="size-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold font-serif text-slate-900 dark:text-white truncate">
            {formatPrice(totalPortfolioValue)}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="size-3" />
            <span>Active Portfolio</span>
          </div>
        </div>

        {/* Card 2: Active Listings */}
        <Link
          to="/admin/listings"
          className="group bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 hover:border-[#C5A880] transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Listings
            </span>
            <div className="size-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-[#B38B59] flex items-center justify-center group-hover:bg-[#0F172A] group-hover:text-white transition-colors">
              <Building2 className="size-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold font-serif text-slate-900 dark:text-white">
            {posts.length}
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            {activePropertiesCount} For Sale · Manage &rarr;
          </div>
        </Link>

        {/* Card 3: Inquiries & Leads */}
        <Link
          to="/admin/crm"
          className="group bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 hover:border-[#C5A880] transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Inquiries
            </span>
            <div className="size-7 rounded-lg bg-red-50 dark:bg-red-950/50 text-[#B38B59] flex items-center justify-center group-hover:bg-[#0F172A] group-hover:text-white transition-colors">
              <Mail className="size-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold font-serif text-[#B38B59]">
            {leads.length}
          </div>
          <div className="text-[10px] font-semibold text-red-600">
            {newLeadsCount} New Inquiries · CRM &rarr;
          </div>
        </Link>

        {/* Card 4: Blog Articles */}
        <Link
          to="/admin/posts"
          className="group bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 hover:border-[#C5A880] transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Articles
            </span>
            <div className="size-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <FileText className="size-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold font-serif text-slate-900 dark:text-white">
            {blogPosts.length}
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            Published Posts &rarr;
          </div>
        </Link>

        {/* Card 5: Registered Users */}
        <Link
          to="/admin/users"
          className="group bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 hover:border-[#C5A880] transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Users &amp; Team
            </span>
            <div className="size-7 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Users className="size-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold font-serif text-slate-900 dark:text-white">
            {users.length}
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            {totalClientsCount} Clients · {totalAgentsCount} Team
          </div>
        </Link>

        {/* Card 6: Media Library */}
        <Link
          to="/admin/media"
          className="group bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 hover:border-[#C5A880] transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Media Assets
            </span>
            <div className="size-7 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <ImageIcon className="size-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold font-serif text-slate-900 dark:text-white">
            {mediaAssets.length}
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            Images &amp; Assets &rarr;
          </div>
        </Link>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Recent Inquiries (CRM) & Recent Listings (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Recent Inquiries Feed */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-[#B38B59]" />
                <h2 className="font-serif text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Recent Inquiries &amp; Showing Requests
                </h2>
              </div>
              <Link
                to="/admin/crm"
                className="text-xs font-bold text-[#B38B59] hover:underline flex items-center gap-1"
              >
                View Full CRM ({leads.length}) <ArrowRight className="size-3" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[600px]">
                <thead className="bg-slate-100/70 dark:bg-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="p-3.5">Client</th>
                    <th className="p-3.5">Property Reference</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recentLeads.map((l) => (
                    <tr
                      key={l.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 dark:text-white">{l.name}</div>
                        <div className="text-[11px] text-slate-500">{l.email}</div>
                      </td>
                      <td className="p-3.5 font-medium text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                        {l.property || "General Inquiry"}
                      </td>
                      <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                        {l.date}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            l.status === "New"
                              ? "bg-red-100 text-[#B38B59] border border-red-200"
                              : l.status === "Contacted"
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          }`}
                        >
                          {l.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <select
                          value={l.status}
                          onChange={(e) => {
                            updateLeadStatus(l.id, e.target.value as any);
                            toast.success(`Updated status for ${l.name}`);
                          }}
                          className="border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-[11px] font-bold py-1 px-2 rounded-lg"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Showing Scheduled">Showing Scheduled</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Property Portfolio Snapshot */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="size-4 text-[#B38B59]" />
                <h2 className="font-serif text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Active Property Portfolio
                </h2>
              </div>
              <Link
                to="/admin/listings"
                className="text-xs font-bold text-[#B38B59] hover:underline flex items-center gap-1"
              >
                Manage All Listings ({posts.length}) <ArrowRight className="size-3" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentProperties.map((prop) => (
                <div
                  key={prop.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={prop.image || "/wp-content/uploads/image-16.png"}
                      alt={prop.title}
                      className="size-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-serif font-bold text-sm text-slate-900 dark:text-white truncate">
                        {prop.title}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <MapPin className="size-3 text-[#B38B59]" />
                        <span className="truncate">{prop.address}, {prop.city}</span>
                      </div>
                      <div className="text-[11px] font-bold text-[#B38B59] mt-1 font-mono">
                        ${prop.price.toLocaleString()} · {prop.beds}b/{prop.baths}ba · {prop.sqft.toLocaleString()} sqft
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <span className="px-2 py-1 rounded bg-[#0F172A] text-white text-[10px] font-bold uppercase">
                      {prop.category || prop.propertyType}
                    </span>
                    <a
                      href={`/properties/${prop.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1"
                    >
                      <Eye className="size-3.5" />
                      <span>View</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Quick Action Hub & Recent Articles (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Action Hub */}
          <div className="bg-gradient-to-br from-[#0F172A] to-[#00264D] text-white rounded-2xl p-5 shadow-md space-y-4">
            <div className="flex items-center gap-2 border-b border-white/15 pb-3">
              <Sparkles className="size-4 text-[#C5A880]" />
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-white">
                Admin Action Hub
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <button
                type="button"
                onClick={() => setShowAddListing(true)}
                className="p-3 bg-white/10 hover:bg-[#0F172A] text-white rounded-xl font-bold flex flex-col items-center justify-center gap-1.5 transition-all text-center border border-white/10"
              >
                <Building2 className="size-4 text-[#C5A880]" />
                <span>+ Add Listing</span>
              </button>

              <Link
                to="/admin/posts"
                className="p-3 bg-white/10 hover:bg-[#0F172A] text-white rounded-xl font-bold flex flex-col items-center justify-center gap-1.5 transition-all text-center border border-white/10"
              >
                <FileText className="size-4 text-[#C5A880]" />
                <span>+ Write Blog</span>
              </Link>

              <Link
                to="/admin/media"
                className="p-3 bg-white/10 hover:bg-[#0F172A] text-white rounded-xl font-bold flex flex-col items-center justify-center gap-1.5 transition-all text-center border border-white/10"
              >
                <ImageIcon className="size-4 text-[#C5A880]" />
                <span>Media Library</span>
              </Link>

              <Link
                to="/admin/users"
                className="p-3 bg-white/10 hover:bg-[#0F172A] text-white rounded-xl font-bold flex flex-col items-center justify-center gap-1.5 transition-all text-center border border-white/10"
              >
                <Users className="size-4 text-[#C5A880]" />
                <span>Manage Users</span>
              </Link>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-300">Public Portal:</span>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#C5A880] hover:underline flex items-center gap-1"
              >
                Launch Main Site <ExternalLink className="size-3" />
              </a>
            </div>
          </div>

          {/* Recent Blog Posts Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-[#B38B59]" />
                <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Market Articles
                </h3>
              </div>
              <Link
                to="/admin/posts"
                className="text-xs font-bold text-[#B38B59] hover:underline"
              >
                All ({blogPosts.length})
              </Link>
            </div>

            <div className="space-y-3">
              {recentArticles.map((art) => (
                <div
                  key={art.id}
                  className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                    <span className="text-[#B38B59] uppercase">{art.category}</span>
                    <span>{art.date}</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                    {art.title}
                  </h4>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                    <span>{art.views || "1.2k"} views</span>
                    <a
                      href={`/${art.slug}/index.html`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-[#0F172A] dark:text-slate-300 hover:text-[#B38B59] flex items-center gap-1"
                    >
                      View Live <ArrowRight className="size-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System & MLS Health */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 text-[11px]">
                Platform Status
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="size-3" /> Operational
              </span>
            </div>

            <div className="space-y-2 text-slate-500">
              <div className="flex items-center justify-between">
                <span>Brokerage:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Sharif Realty Group</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Principal:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Majeed Sharif</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Licenses:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">CT REB.0792811 / MA 952104</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Database Sync:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Real-Time Local Storage</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Editor Modal */}
      {showAddListing && (
        <PropertyEditor
          open={showAddListing}
          onClose={() => setShowAddListing(false)}
          onCancel={() => setShowAddListing(false)}
        />
      )}
    </div>
  );
}
