import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BadgeDollarSign,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Pin,
  PlusCircle,
  Settings,
  Tags,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { useAdmin } from "@/lib/admin-store";

type NavItem = { label: string; to: string; icon?: LucideIcon };
type NavGroup = { label: string; icon: LucideIcon; items: NavItem[] };

const NAV: NavGroup[] = [
  {
    label: "Posts / Properties",
    icon: Pin,
    items: [
      { label: "All Posts", to: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Add New Property", to: "/admin/posts/new", icon: PlusCircle },
      { label: "Categories", to: "/admin/categories", icon: FileText },
      { label: "Tags", to: "/admin/tags", icon: Tags },
    ],
  },
  { label: "Media", icon: ImageIcon, items: [{ label: "Library", to: "/admin/media" }] },
  { label: "WpEstate CRM", icon: Users, items: [{ label: "Leads & Inquiries", to: "/admin/crm" }] },
  {
    label: "Pages & Comments",
    icon: MessageSquare,
    items: [
      { label: "Pages", to: "/admin/pages" },
      { label: "Comments", to: "/admin/comments" },
    ],
  },
  {
    label: "Invoices & Settings",
    icon: BadgeDollarSign,
    items: [
      { label: "Invoices", to: "/admin/invoices" },
      { label: "Settings", to: "/admin/settings", icon: Settings },
    ],
  },
];

export function WpShell({ children }: { children: ReactNode }) {
  const { user, signOut } = useAdmin();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="flex items-center justify-between gap-3 bg-[#1d2327] px-4 py-2 text-sm text-white/80">
        <div className="flex items-center gap-3">
          <span className="font-display text-base text-white">Sharif Realty</span>
          <a
            href="/"
            className="inline-flex items-center gap-1 text-white/70 transition-colors hover:text-accent"
          >
            <ExternalLink className="size-3.5" aria-hidden="true" /> View Site
          </a>
        </div>
        <div className="flex items-center gap-3">
          <span>Howdy, {user?.name ?? "Admin"}</span>
          <button
            type="button"
            onClick={() => {
              signOut();
              void navigate({ to: "/login", replace: true });
            }}
            className="inline-flex items-center gap-1 rounded-sm border border-white/20 px-2 py-1 text-xs text-white/80 transition-colors hover:border-accent hover:text-accent"
          >
            <LogOut className="size-3.5" aria-hidden="true" /> Logout
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row">
        <nav
          aria-label="Admin"
          className="w-full shrink-0 bg-[#1d2327] pb-6 text-sm text-white/75 md:w-60 md:min-h-[calc(100vh-40px)]"
        >
          {NAV.map((group) => (
            <div key={group.label} className="border-t border-white/10 py-2 first:border-t-0">
              <p className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">
                <group.icon className="size-4" aria-hidden="true" />
                {group.label}
              </p>
              <ul>
                {group.items.map((item) => {
                  const active = pathname === item.to;
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className={`flex items-center gap-2 py-1.5 pl-10 pr-4 transition-colors ${
                          active
                            ? "bg-[#0f172a] font-semibold text-accent"
                            : "hover:bg-white/5 hover:text-accent"
                        }`}
                      >
                        {item.icon && <item.icon className="size-3.5" aria-hidden="true" />}
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl text-foreground">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}
