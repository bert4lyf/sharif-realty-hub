import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Building2,
  FileText,
  Mail,
  Image as ImageIcon,
  Settings,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Plus,
  Search,
  Bell,
  Menu,
  X,
  User,
  Users,
  Sparkles,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect, type ReactNode } from "react";
import { useAdmin } from "@/lib/admin-store";
import { PropertyEditor } from "@/components/admin/property-editor";
import { OFFICIAL_MEDIA } from "@/lib/media";

export function WpShell({ children }: { children: ReactNode }) {
  const { user, signOut, posts, leads, blogPosts, mediaAssets, users } = useAdmin();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  const [showAddListingModal, setShowAddListingModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  // Notification state: unread leads
  const [hasViewedCrm, setHasViewedCrm] = useState(false);

  // Close mobile sidebar on route change & clear badge if visiting CRM
  useEffect(() => {
    setMobileMenuOpen(false);
    if (pathname === "/admin/crm") {
      setHasViewedCrm(true);
    }
  }, [pathname]);

  const unreadLeadsCount = hasViewedCrm
    ? 0
    : leads.filter((l) => l.status === "New").length;

  const NAV_ITEMS = [
    {
      label: "Dashboard",
      to: "/admin/dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Manage Listings",
      to: "/admin/listings",
      icon: Building2,
    },
    {
      label: "Manage Blog Posts",
      to: "/admin/posts",
      icon: FileText,
    },
    {
      label: "Inquiries & Leads",
      to: "/admin/crm",
      icon: Mail,
      badge: unreadLeadsCount > 0 ? unreadLeadsCount : undefined,
      badgeColor: "bg-[#C5A880] text-[#0B1120] font-bold animate-pulse",
    },
    {
      label: "Media Library",
      to: "/admin/media",
      icon: ImageIcon,
    },
    {
      label: "User Management",
      to: "/admin/users",
      icon: Users,
    },
    {
      label: "Settings",
      to: "/admin/settings",
      icon: Settings,
    },
  ];

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    signOut();
    void navigate({ to: "/login", replace: true });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E293B] font-sans flex flex-col antialiased">
      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-40 bg-[#0B1120] border-b border-white/10 text-white px-4 py-2.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="p-2 -ml-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="size-6 text-[#C5A880]" /> : <Menu className="size-6" />}
          </button>

          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="bg-white px-2.5 py-1 rounded-lg shadow-sm">
              <img
                src={OFFICIAL_MEDIA.logo}
                alt="Sharif Realty Group"
                className="h-7 w-auto object-contain"
              />
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1"
          >
            <ExternalLink className="size-3.5 text-[#C5A880]" />
            <span className="text-[11px]">Site</span>
          </a>
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            title="Log Out"
            className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg cursor-pointer"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </header>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 z-45 bg-black/60 backdrop-blur-sm transition-opacity"
        />
      )}

      <div className="flex-1 flex">
        {/* Desktop & Mobile Sidebar Drawer */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-[260px] bg-[#0B1120] border-r border-white/10 text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
            md:translate-x-0 md:fixed
            ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {/* Brand Header with Main Site Official Logo */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#080D18]">
            <Link to="/admin/dashboard" className="flex items-center group flex-1">
              <div className="bg-white p-2 rounded-xl shadow-md w-full flex items-center justify-center transition-transform group-hover:scale-[1.02]">
                <img
                  src={OFFICIAL_MEDIA.logo}
                  alt="Sharif Realty Group"
                  className="h-10 sm:h-11 w-auto object-contain"
                />
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden ml-2 p-1.5 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Navigation Links - Clean without scrollbar / progress bars */}
          <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-[#B38B59]">
              Management
            </div>

            {NAV_ITEMS.map((item) => {
              const isActive =
                item.exact
                  ? pathname === item.to
                  : pathname === item.to || (item.to !== "/admin/dashboard" && pathname.startsWith(item.to));
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#C5A880] text-[#0B1120] shadow-sm font-bold"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`size-4 ${isActive ? "text-[#0B1120]" : "text-[#C5A880]"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm ${
                        item.badgeColor || "bg-[#C5A880] text-[#0B1120]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-4 pb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-[#B38B59]">
              Public Shortcuts
            </div>

            {/* Direct Link to Live Site */}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ExternalLink className="size-4 text-[#C5A880]" />
                <span>Visit Live Site</span>
              </div>
              <ChevronRight className="size-3 text-slate-500" />
            </a>

            {/* Direct Link to Public Blogs */}
            <a
              href="/blogs"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="size-4 text-[#C5A880]" />
                <span>View Public Blogs</span>
              </div>
              <ChevronRight className="size-3 text-slate-500" />
            </a>

            {/* Direct Link to Public Properties */}
            <a
              href="/properties"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Building2 className="size-4 text-[#C5A880]" />
                <span>View Properties Page</span>
              </div>
              <ChevronRight className="size-3 text-slate-500" />
            </a>
          </nav>

          {/* User Account / Footer */}
          <div className="p-4 border-t border-white/10 bg-[#080D18] pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src="/wp-content/uploads/Sharif-Photo.jpg"
                  alt="Majeed Sharif"
                  className="size-9 rounded-full object-cover border-2 border-[#C5A880] flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white truncate">
                    {user?.name || "Majeed Sharif"}
                  </div>
                  <div className="text-[10px] text-[#C5A880] font-semibold truncate">
                    {user?.email || "sharifrealty19@gmail.com"}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowLogoutModal(true)}
                title="Sign Out"
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 md:ml-[260px] flex flex-col min-w-0 max-w-full">
          {/* Desktop Top Bar */}
          <header className="hidden md:flex sticky top-0 z-30 bg-white border-b border-[#EAE6DF] items-center justify-between px-6 py-3 shadow-sm">
            <div className="flex items-center gap-4 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                <input
                  type="text"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  placeholder="Quick search listings, articles, inquiries..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#EAE6DF] bg-[#FAF8F5] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Direct Link to Live Site */}
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl border border-[#EAE6DF] hover:bg-[#FAF8F5] text-slate-700 hover:text-[#0F172A] text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <ExternalLink className="size-3.5 text-[#C5A880]" />
                <span>Visit Live Site</span>
              </a>

              {/* Direct Logout Button */}
              <button
                type="button"
                onClick={() => setShowLogoutModal(true)}
                className="px-3 py-1.5 rounded-xl border border-[#EAE6DF] hover:border-red-300 hover:bg-red-50 text-slate-700 hover:text-red-600 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="size-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </header>

          {/* Page Content Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden bg-[#FAF8F5]">
            {children}
          </main>
        </div>
      </div>

      {/* Global Add Listing Modal */}
      {showAddListingModal && (
        <PropertyEditor
          open={showAddListingModal}
          onClose={() => setShowAddListingModal(false)}
          onCancel={() => setShowAddListingModal(false)}
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white max-w-sm w-full p-6 rounded-2xl shadow-2xl border border-[#EAE6DF] space-y-4 text-center">
            <div className="size-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="size-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-[#0F172A]">
                Confirm Sign Out
              </h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to end your current administrator session at Sharif Realty?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="py-2.5 px-4 border border-[#EAE6DF] text-slate-700 hover:bg-[#F3F0EA] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="py-2.5 px-4 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE6DF]">
      <div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-[#0F172A]">
          {title}
        </h1>
        {description && (
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex items-center gap-3 shrink-0">{action}</div>}
    </div>
  );
}
