import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Shield,
  Briefcase,
  UserCheck,
  Edit,
  Trash2,
  X,
  CheckCircle,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { useAdmin, type AppUser, type UserRole } from "@/lib/admin-store";
import { AdminPageHeader } from "@/components/admin/wp-shell";

export const Route = createFileRoute("/admin/users")({
  head: () => ({
    meta: [
      { title: "User & Team Management | Sharif Realty Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminUsersPage,
});

export function AdminUsersPage() {
  const { users, createUser, updateUser, deleteUser, user: currentUser } = useAdmin();

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formRole, setFormRole] = useState<UserRole>("Client");
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");
  const [formPassword, setFormPassword] = useState("");

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== "all" && u.role.toLowerCase() !== roleFilter.toLowerCase()) {
      return false;
    }
    if (statusFilter !== "all" && u.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchPhone = u.phone ? u.phone.toLowerCase().includes(q) : false;
      return matchName || matchEmail || matchPhone;
    }
    return true;
  });

  const totalClients = users.filter((u) => u.role === "Client").length;
  const totalAgents = users.filter((u) => u.role === "Agent").length;
  const totalAdmins = users.filter((u) => u.role === "Admin" || u.role === "Administrator").length;

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormRole("Client");
    setFormStatus("Active");
    setFormPassword("");
    setShowAddModal(true);
  };

  const handleOpenEdit = (u: AppUser) => {
    setEditingUser(u);
    setFormName(u.name);
    setFormEmail(u.email);
    setFormPhone(u.phone || "");
    setFormRole(u.role);
    setFormStatus(u.status);
    setFormPassword("");
    setShowAddModal(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) {
      toast.error("Name and Email are required.");
      return;
    }

    if (editingUser) {
      updateUser(editingUser.id, {
        name: formName.trim(),
        email: formEmail.trim().toLowerCase(),
        phone: formPhone.trim() || undefined,
        role: formRole,
        status: formStatus,
        ...(formPassword ? { password: formPassword } : {}),
      });
      toast.success(`User "${formName}" updated successfully.`);
    } else {
      createUser({
        name: formName.trim(),
        email: formEmail.trim().toLowerCase(),
        phone: formPhone.trim() || undefined,
        role: formRole,
        status: formStatus,
        password: formPassword || "password123",
      });
      toast.success(`New ${formRole} user "${formName}" created.`);
    }

    setShowAddModal(false);
  };

  const handleDelete = (u: AppUser) => {
    if (u.id === currentUser?.id) {
      toast.error("You cannot delete your own active administrator account.");
      return;
    }
    if (confirm(`Are you sure you want to delete user account "${u.name}" (${u.email})?`)) {
      deleteUser(u.id);
      toast.success(`User account "${u.name}" deleted.`);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="User & Team Management"
        description="Manage client accounts, licensed real estate agents, and administrator access roles."
        action={
          <button
            type="button"
            onClick={handleOpenAdd}
            className="bg-[#0F172A] hover:bg-[#1E293B] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <UserPlus className="size-4" />
            <span>Add New User / Agent</span>
          </button>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total Accounts
          </div>
          <div className="text-2xl font-bold font-serif text-slate-900 dark:text-white mt-1">
            {users.length}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Clients / Buyers
          </div>
          <div className="text-2xl font-bold font-serif text-emerald-700 dark:text-emerald-300 mt-1">
            {totalClients}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Licensed Agents
          </div>
          <div className="text-2xl font-bold font-serif text-blue-700 dark:text-blue-300 mt-1">
            {totalAgents}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#B38B59]">
            Administrators
          </div>
          <div className="text-2xl font-bold font-serif text-[#B38B59] mt-1">
            {totalAdmins}
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {/* Filters Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto text-xs">
            <div className="relative min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by name, email, phone..."
                className="w-full pl-9 pr-3 py-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white py-1.5 px-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#C5A880]"
            >
              <option value="all">All Roles</option>
              <option value="client">Clients</option>
              <option value="agent">Agents</option>
              <option value="admin">Administrators</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white py-1.5 px-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#C5A880]"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="text-xs text-slate-500 font-medium self-end sm:self-center">
            Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> accounts
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[850px]">
            <thead className="bg-slate-100/70 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              <tr>
                <th className="p-3.5">User / Member</th>
                <th className="p-3.5">Contact Information</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Date Joined</th>
                <th className="p-3.5">Activity</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No users found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isAdmin = u.role === "Admin" || u.role === "Administrator";
                  const isAgent = u.role === "Agent";
                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Name & Avatar */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          {u.avatar ? (
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="size-8 rounded-full object-cover border border-slate-300 shrink-0"
                            />
                          ) : (
                            <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 text-xs shrink-0">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">
                              {u.name}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              ID: {u.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="p-3.5">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                            <Mail className="size-3 text-slate-400" />
                            <span>{u.email}</span>
                          </div>
                          {u.phone && (
                            <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
                              <Phone className="size-3 text-slate-400" />
                              <span>{u.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="p-3.5">
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-red-100 text-[#B38B59] dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-900/50">
                            <Shield className="size-3" /> Admin
                          </span>
                        ) : isAgent ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50">
                            <Briefcase className="size-3" /> Agent
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50">
                            <UserCheck className="size-3" /> Client
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            u.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-600 border border-slate-300"
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>

                      {/* Date Joined */}
                      <td className="p-3.5 font-mono text-[11px] text-slate-500">
                        {u.dateJoined || "2026-01-15"}
                      </td>

                      {/* Activity */}
                      <td className="p-3.5 text-[11px] text-slate-500">
                        <div>
                          {u.favorites ? u.favorites.length : 0} Favorites · {u.inquiries ? u.inquiries.length : 0} Inquiries
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(u)}
                            title="Edit Role / Details"
                            className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Edit className="size-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(u)}
                            title="Delete User"
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 max-w-lg w-full p-6 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                {editingUser ? `Edit Account: ${editingUser.name}` : "Create New User / Agent"}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="(203) 555-0199"
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Account Role *
                  </label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as UserRole)}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-semibold focus:outline-none focus:border-[#C5A880]"
                  >
                    <option value="Client">Client (Buyer / Seller)</option>
                    <option value="Agent">Agent (Licensed Team Member)</option>
                    <option value="Admin">Administrator (Full Access)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as "Active" | "Inactive")}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-semibold focus:outline-none focus:border-[#C5A880]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  {editingUser ? "Reset Password (Leave blank to keep current)" : "Initial Password"}
                </label>
                <input
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold rounded-xl shadow-md transition-all"
                >
                  {editingUser ? "Save Changes" : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
