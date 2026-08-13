import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

const credentials = z.object({
  email: z.string().trim().email("Enter a valid email address").max(255),
  password: z.string().min(8, "Passwords must be at least 8 characters").max(72),
});

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Staff Sign In | Sharif Realty" },
      {
        name: "description",
        content: "Sign in to the Sharif Realty staff dashboard to manage listings, leads and content.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Staff Sign In | Sharif Realty" },
      { property: "og:description", content: "Sharif Realty staff dashboard access." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = credentials.safeParse({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check your details");
      return;
    }
    setError(null);
    setPending(true);
    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: `${window.location.origin}/admin/dashboard` },
        });
        if (signUpError) throw signUpError;
        toast.success("Account created. An administrator must grant you access.");
        await navigate({ to: "/admin/dashboard" });
        return;
      }
      const { error: signInError } = await supabase.auth.signInWithPassword(parsed.data);
      if (signInError) throw signInError;
      await navigate({ to: "/admin/dashboard" });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Sign in failed");
    } finally {
      setPending(false);
    }
  }

  async function signInWithGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    await navigate({ to: "/admin/dashboard" });
  }

  return (
    <>
      <Breadcrumbs items={[{ label: "Staff Sign In" }]} />
      <div className="mx-auto w-full max-w-md px-4 py-16 sm:px-6">
        <span className="flex size-11 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <KeyRound className="size-5" aria-hidden="true" />
        </span>
        <h1 className="mt-6 font-display text-3xl">
          {mode === "signin" ? "Staff sign in" : "Create staff account"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Access is limited to Sharif Realty administrators and agents.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="auth-email">Email</Label>
            <Input id="auth-email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="auth-password">Password</Label>
            <Input
              id="auth-password"
              name="password"
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            type="submit"
            disabled={pending}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            {mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <Button variant="secondary" className="mt-3 w-full" onClick={() => void signInWithGoogle()}>
          Continue with Google
        </Button>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 text-sm font-semibold text-accent hover:underline"
        >
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </>
  );
}
