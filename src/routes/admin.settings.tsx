import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import {
  Save,
  User,
  Mail,
  Phone,
  LockKeyhole,
  CheckCircle2,
  Shield,
  UploadCloud,
  Image as ImageIcon,
  Bell,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "@/lib/admin-store";
import { AdminPageHeader } from "@/components/admin/wp-shell";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Settings | Sharif Realty Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminAccountSettingsPage,
});

export default function AdminAccountSettingsPage() {
  const { user, updateUserProfile } = useAdmin();
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Account Profile States
  const [adminName, setAdminName] = useState(user?.name || "Majeed Sharif");
  const [adminEmail, setAdminEmail] = useState(user?.email || "sharifrealty19@gmail.com");
  const [adminPhone, setAdminPhone] = useState(user?.phone || "(203) 802-8099");
  const [adminAvatar, setAdminAvatar] = useState(user?.avatar || "/wp-content/uploads/Sharif-Photo.jpg");

  // Password States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notification Preferences
  const [notifyNewLeads, setNotifyNewLeads] = useState(true);
  const [notifyShowingRequests, setNotifyShowingRequests] = useState(true);
  const [notifyWeeklyDigest, setNotifyWeeklyDigest] = useState(false);

  // Handle Avatar Upload from Device
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setAdminAvatar(result);
        toast.success(`Profile photo "${file.name}" uploaded.`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (newPassword) {
      if (newPassword !== confirmPassword) {
        toast.error("New passwords do not match.");
        setIsSaving(false);
        return;
      }
      if (newPassword.length < 6) {
        toast.error("New password must be at least 6 characters.");
        setIsSaving(false);
        return;
      }
    }

    updateUserProfile({
      name: adminName.trim(),
      email: adminEmail.trim().toLowerCase(),
      phone: adminPhone.trim(),
      avatar: adminAvatar,
      ...(newPassword ? { password: newPassword } : {}),
    });

    setIsSaving(false);
    toast.success("Your administrator account settings have been saved.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <AdminPageHeader
        title="Settings"
        description="Manage your administrator profile, contact credentials, security password, and notifications."
      />

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Card 1: Administrator Profile Details */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <User className="size-4 text-[#B38B59]" />
            <h2 className="font-serif text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Administrator Profile &amp; Identity
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 pb-2">
            {/* Avatar with Upload Trigger */}
            <div className="relative group shrink-0">
              <img
                src={adminAvatar || "/wp-content/uploads/Sharif-Photo.jpg"}
                alt="Admin Avatar"
                className="size-20 rounded-2xl object-cover border-2 border-[#C5A880] shadow-md group-hover:opacity-90 transition-opacity"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold"
              >
                Change Photo
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">{adminName}</span>
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-[#B38B59] text-[10px] font-bold uppercase">
                  {user?.role || "Principal Broker"}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Sharif Realty Principal Administrator Account · Direct public contact broker
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-bold text-[#B38B59] hover:underline inline-flex items-center gap-1 mt-1"
              >
                <UploadCloud className="size-3.5" />
                Upload New Photo from Device
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="Majeed Sharif"
                className="w-full p-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="sharifrealty19@gmail.com"
                className="w-full p-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Direct Contact Phone
              </label>
              <input
                type="tel"
                value={adminPhone}
                onChange={(e) => setAdminPhone(e.target.value)}
                placeholder="(203) 802-8099"
                className="w-full p-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Security & Password */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <LockKeyhole className="size-4 text-[#B38B59]" />
            <h2 className="font-serif text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Security &amp; Password
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                New Password (Optional)
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Notification Alerts */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 text-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Bell className="size-4 text-[#B38B59]" />
            <h2 className="font-serif text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Notification Preferences
            </h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyNewLeads}
                onChange={(e) => setNotifyNewLeads(e.target.checked)}
                className="size-4 rounded text-[#B38B59] focus:ring-[#C5A880]"
              />
              <span className="text-slate-700 dark:text-slate-300 font-semibold">
                Instant email notification on new client inquiry submissions
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyShowingRequests}
                onChange={(e) => setNotifyShowingRequests(e.target.checked)}
                className="size-4 rounded text-[#B38B59] focus:ring-[#C5A880]"
              />
              <span className="text-slate-700 dark:text-slate-300 font-semibold">
                Instant notification when a buyer requests a private showing / tour
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyWeeklyDigest}
                onChange={(e) => setNotifyWeeklyDigest(e.target.checked)}
                className="size-4 rounded text-[#B38B59] focus:ring-[#C5A880]"
              />
              <span className="text-slate-700 dark:text-slate-300 font-semibold">
                Weekly traffic summary and property views digest
              </span>
            </label>
          </div>
        </div>

        {/* Submit Save Button */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="size-4 text-emerald-600" />
            <span>Account updates apply immediately across your administrative session.</span>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="size-4" />
            <span>{isSaving ? "Saving..." : "Save Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
