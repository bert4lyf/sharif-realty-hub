import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ADMIN_EMAIL, ADMIN_PASSWORD, useAdmin } from "@/lib/admin-store";

export const Route = createFileRoute("/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Login | Sharif Realty Dashboard" },
      {
        name: "description",
        content: "Sign in to the Sharif Realty property management dashboard to manage listings and leads.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Login | Sharif Realty Dashboard" },
      { property: "og:description", content: "Sharif Realty back-end dashboard login." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn, user, ready } = useAdmin();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ready && user) void navigate({ to: "/admin/dashboard", replace: true });
  }, [ready, user, navigate]);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = signIn(String(form.get("email") ?? ""), String(form.get("password") ?? ""));
    if (!result.ok) {
      setError(result.message ?? "Sign in failed");
      return;
    }
    setError(null);
    void navigate({ to: "/admin/dashboard", replace: true });
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-16 sm:px-6">
      <span className="flex size-11 items-center justify-center rounded-sm bg-accent text-accent-foreground">
        <LockKeyhole className="size-5" aria-hidden="true" />
      </span>
      <h1 className="mt-6 font-display text-3xl">Dashboard login</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Sharif Realty property management back-end.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="login-email">Email</Label>
          <Input id="login-email" name="email" type="email" autoComplete="email" defaultValue={ADMIN_EMAIL} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="login-password">Password</Label>
          <Input id="login-password" name="password" type="password" autoComplete="current-password" />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          Log in
        </Button>
      </form>

      <p className="mt-6 rounded-sm border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
        Demo credentials — {ADMIN_EMAIL} / {ADMIN_PASSWORD}
      </p>
    </div>
  );
}
