import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { WpShell } from "@/components/admin/wp-shell";
import { useAdmin } from "@/lib/admin-store";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const { user, ready } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready) {
      if (!user) {
        void navigate({ to: "/login", replace: true });
      } else if (user.role === "Client") {
        void navigate({ to: "/dashboard", replace: true });
      }
    }
  }, [ready, user, navigate]);

  if (!ready || !user || user.role === "Client") {
    return <div className="px-6 py-16 text-sm text-slate-500">Checking permissions &amp; authenticating session…</div>;
  }

  return (
    <WpShell>
      <Outlet />
    </WpShell>
  );
}
