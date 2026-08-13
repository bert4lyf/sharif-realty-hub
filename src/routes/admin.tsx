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
    if (ready && !user) void navigate({ to: "/login", replace: true });
  }, [ready, user, navigate]);

  if (!ready || !user) {
    return <div className="px-6 py-16 text-sm text-muted-foreground">Checking your session…</div>;
  }

  return (
    <WpShell>
      <Outlet />
    </WpShell>
  );
}
