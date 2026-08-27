import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Heart,
  Calendar,
  User,
  Phone,
  Mail,
  Building,
  Bed,
  Bath,
  Maximize2,
  Trash2,
  ExternalLink,
  MessageSquare,
  Shield,
  KeyRound,
  LogOut,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { useAdmin, type AdminPropertyPost } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Client Portal & Dashboard | Sharif Realty Group" },
      {
        name: "description",
        content:
          "Manage your saved luxury properties, tour schedules, active inquiries, and client profile with Sharif Realty.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ClientDashboardPage,
});

export function ClientDashboardPage() {
  const { user, ready, signOut, posts, favorites, toggleFavorite, updateUserProfile } = useAdmin();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"favorites" | "inquiries" | "profile">("favorites");

  // Profile form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (ready && !user) {
      void navigate({ to: "/login", replace: true });
    }
  }, [ready, user, navigate]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  if (!ready || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8 text-sm text-slate-500">
        Authenticating Client Portal session...
      </div>
    );
  }

  // Filter saved property objects
  const savedProperties: AdminPropertyPost[] = posts.filter((p) =>
    favorites.includes(p.id)
  );

  const userInquiries = user.inquiries || [];

  const handleLogout = () => {
    signOut();
    toast.success("You have been logged out.");
    void navigate({ to: "/login", replace: true });
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (newPassword && newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      setIsSaving(false);
      return;
    }

    if (newPassword && newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      setIsSaving(false);
      return;
    }

    updateUserProfile({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      ...(newPassword ? { password: newPassword } : {}),
    });

    setIsSaving(false);
    toast.success("Profile information updated successfully.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E293B] font-sans pb-20">
      {/* Top Breadcrumbs */}
      <div className="bg-white border-b border-[#EAE6DF] py-3 px-4 sm:px-8">
        <Breadcrumbs items={[{ label: "Client Portal" }]} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Welcome Header Card */}
        <div className="bg-gradient-to-r from-[#0B1120] via-[#0F172A] to-[#1E293B] rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          {/* Subtle Background Accent */}
          <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-[#C5A880]/15 to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-2xl bg-gradient-to-tr from-[#C5A880] to-[#B38B59] p-0.5 shadow-lg flex items-center justify-center shrink-0">
                <div className="size-full bg-[#0F172A] rounded-[14px] flex items-center justify-center font-serif text-2xl font-black text-[#C5A880]">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                    Welcome, {user.name}
                  </h1>
                  <span className="px-3 py-0.5 rounded-full bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/30 text-[10px] font-semibold uppercase tracking-wider">
                    {user.role} Member
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {user.email} {user.phone ? `· ${user.phone}` : ""} · Member since {user.dateJoined || "2026"}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              {(user.role === "Admin" || user.role === "Agent" || user.role === "Administrator") && (
                <Link
                  to="/admin/dashboard"
                  className="px-4 py-2 bg-[#C5A880] hover:bg-[#B39369] text-[#0F172A] rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Shield className="size-4" />
                  <span>Open Admin Console</span>
                </Link>
              )}

              <Link
                to="/properties"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5"
              >
                <Building className="size-4" />
                <span>Browse Listings</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 bg-black/40 hover:bg-red-600/80 text-white rounded-xl text-xs font-bold transition-all border border-white/10 flex items-center gap-1.5"
              >
                <LogOut className="size-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-2 sm:space-x-8">
          <button
            type="button"
            onClick={() => setActiveTab("favorites")}
            className={`pb-4 px-2 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors relative flex items-center gap-2 ${
              activeTab === "favorites"
                ? "text-[#B38B59] border-b-2 border-[#C5A880]"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Heart className="size-4" />
            <span>Saved Properties ({savedProperties.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("inquiries")}
            className={`pb-4 px-2 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors relative flex items-center gap-2 ${
              activeTab === "inquiries"
                ? "text-[#B38B59] border-b-2 border-[#C5A880]"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <MessageSquare className="size-4" />
            <span>Inquiries &amp; Showings ({userInquiries.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`pb-4 px-2 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors relative flex items-center gap-2 ${
              activeTab === "profile"
                ? "text-[#B38B59] border-b-2 border-[#C5A880]"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <User className="size-4" />
            <span>Profile &amp; Security</span>
          </button>
        </div>

        {/* TAB 1: SAVED PROPERTIES */}
        {activeTab === "favorites" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
                  Your Saved Favorites
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Properties you have bookmarked for showing appointments or purchase inquiries.
                </p>
              </div>
              <Link
                to="/properties"
                className="text-xs font-bold text-[#B38B59] hover:underline flex items-center gap-1"
              >
                + Add More Listings <ArrowRight className="size-3" />
              </Link>
            </div>

            {savedProperties.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="size-14 rounded-full bg-red-50 dark:bg-red-950/50 text-[#B38B59] flex items-center justify-center mx-auto">
                  <Heart className="size-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                    No Saved Properties Yet
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    Explore our premier Connecticut &amp; Massachusetts portfolio and click the heart icon on any listing to save it here.
                  </p>
                </div>
                <Link
                  to="/properties"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  <Building className="size-4" />
                  <span>Explore Available Properties</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedProperties.map((prop) => (
                  <div
                    key={prop.id}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img
                          src={prop.image || "/wp-content/uploads/image-16.png"}
                          alt={prop.title}
                          className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            toggleFavorite(prop.id);
                            toast.success(`Removed ${prop.title} from favorites.`);
                          }}
                          title="Remove from favorites"
                          className="absolute top-3 right-3 size-9 rounded-full bg-white/90 dark:bg-slate-900/90 text-red-500 flex items-center justify-center shadow hover:bg-white transition-colors"
                        >
                          <Trash2 className="size-4" />
                        </button>
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#0F172A]/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                          {prop.category || prop.propertyType}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <div className="text-lg font-serif font-bold text-[#B38B59]">
                          ${prop.price ? prop.price.toLocaleString() : "Price on Request"}
                        </div>

                        <div>
                          <h3 className="font-display text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#B38B59] transition-colors">
                            {prop.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {prop.address}, {prop.city} {prop.state}
                          </p>
                        </div>

                        {/* Specs Ribbon */}
                        <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                          {prop.beds > 0 && (
                            <span className="flex items-center gap-1 font-semibold">
                              <Bed className="size-3.5 text-[#B38B59]" /> {prop.beds} Beds
                            </span>
                          )}
                          {prop.baths > 0 && (
                            <span className="flex items-center gap-1 font-semibold">
                              <Bath className="size-3.5 text-[#B38B59]" /> {prop.baths} Baths
                            </span>
                          )}
                          {prop.sqft > 0 && (
                            <span className="flex items-center gap-1 font-semibold">
                              <Maximize2 className="size-3.5 text-[#B38B59]" /> {prop.sqft.toLocaleString()} sqft
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-5 pt-0 flex items-center gap-2">
                      <Link
                        to={`/properties/${prop.slug}` as any}
                        className="flex-1 py-2 text-center bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                      >
                        <ExternalLink className="size-3.5" />
                        <span>View Listing</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          toggleFavorite(prop.id);
                          toast.success("Removed from saved favorites.");
                        }}
                        className="px-3 py-2 border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-500 hover:text-red-600 rounded-xl text-xs transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INQUIRIES & TOUR REQUESTS */}
        {activeTab === "inquiries" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
                  Your Inquiry &amp; Tour Request History
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Track communication status and scheduled showings with broker Majeed Sharif.
                </p>
              </div>
              <Link
                to="/contact"
                className="text-xs font-bold text-[#B38B59] hover:underline"
              >
                + New Showing Inquiry
              </Link>
            </div>

            {userInquiries.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="size-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <MessageSquare className="size-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                    No Inquiries Submitted Yet
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    When you request a private showing or submit an inquiry on a listing, your request history will display here.
                  </p>
                </div>
                <Link
                  to="/properties"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-xs rounded-xl shadow-md"
                >
                  <Calendar className="size-4" />
                  <span>Request a Showing</span>
                </Link>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                      <tr>
                        <th className="p-4">Property / Reference</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Date Submitted</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Message Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {userInquiries.map((inq) => (
                        <tr key={inq.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-4 font-bold text-slate-900 dark:text-white">
                            {inq.propertyTitle}
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold uppercase">
                              {inq.type === "tour" ? "Tour Request" : "Property Inquiry"}
                            </span>
                          </td>
                          <td className="p-4 text-slate-500 dark:text-slate-400 font-mono">
                            {inq.date}
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle2 className="size-3" />
                              {inq.status || "Received"}
                            </span>
                          </td>
                          <td className="p-4 text-slate-600 dark:text-slate-300 max-w-[280px] truncate">
                            "{inq.message}"
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PROFILE & SECURITY */}
        {activeTab === "profile" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 max-w-2xl">
            <div>
              <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
                Client Profile Settings
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Update your contact details and account security preferences.
              </p>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-5 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="prof-name" className="font-bold text-slate-700 dark:text-slate-300">
                  Full Name
                </Label>
                <Input
                  id="prof-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="prof-email" className="font-bold text-slate-700 dark:text-slate-300">
                    Email Address
                  </Label>
                  <Input
                    id="prof-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="prof-phone" className="font-bold text-slate-700 dark:text-slate-300">
                    Phone Number
                  </Label>
                  <Input
                    id="prof-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(203) 555-0199"
                    className="h-10 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Password update section */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Change Password (Optional)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="prof-new-pass" className="font-bold text-slate-700 dark:text-slate-300">
                      New Password
                    </Label>
                    <Input
                      id="prof-new-pass"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-10 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="prof-confirm-pass" className="font-bold text-slate-700 dark:text-slate-300">
                      Confirm New Password
                    </Label>
                    <Input
                      id="prof-confirm-pass"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-10 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {isSaving ? "Saving Changes..." : "Save Profile Updates"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
